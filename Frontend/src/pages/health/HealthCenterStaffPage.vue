<template>
  <div>
    <health-center-staff-tabs
      :emergencyInfos="emergencies"
      :healthForms="healthForms"
      :ongoingHealthForms="ongoingHealthForms"
      @dismiss="dismiss"
      @startChat="startChat"
      @goToChat="goToChat"
    />

    <q-page-sticky position="bottom-left" :offset="[18, 18]" v-if="isMobile">
      <q-fab
        icon="mdi-chevron-right"
        active-icon="mdi-chevron-left"
        color="secondary"
        padding="10px"
        @click="toggleDrawer"
        />
    </q-page-sticky>
  </div>
</template>

<script>
import { computed, ref, watch, onBeforeMount } from 'vue'
import { useQuasar } from 'quasar'
import HealthCenterStaffTabs from '../../components/health/HealthCenterStaffTabs.vue'
import HealthManager from '../../classes/HealthManager'
import UserManager from '../../classes/UserManager'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

export default {
  name: "HealthCenterPage",
  components: {
    HealthCenterStaffTabs
  },
  setup(props, ctx) {
    const $q = useQuasar();
    const hm = HealthManager.getInstance();
    const um = UserManager.getInstance();
    const router = useRouter();
    const { t } = useI18n();

    const isMobile = computed(() => {
      return $q.screen.width < 800;
    });

    const open = ref(!isMobile.value);

    watch(isMobile, () => {
      open.value = !isMobile.value;
    })

    const toggleDrawer = () => {
      open.value = !open.value
      ctx.emit('toggleDrawer');
    }

    const fabPos = ref([ 18, 18 ]);

    const ambulanceForms = ref(null);
    const emergencies = ref([]);

    const fetchAmbulanceForms = async () => {
      hm.getAllAmbulanceForms().then((val) => {
        const tmp = [];
        ambulanceForms.value = val.val();
        
        const forLoop = async _ => {
          for (let key in ambulanceForms.value) {
            const UID = ambulanceForms.value[key]?._ownerUID;
            const owner = (await um.getUserInfo(UID)).val();

            const emergency = {
              url: owner._profilePic,
              data: [
                owner._name, 
                formatPhoneNumber(ambulanceForms.value[key]._phoneNum),
                formatTime(ambulanceForms.value[key]._time, ambulanceForms.value[key]._date)
              ],
              uniqueID: ambulanceForms.value[key]._OID
            }

            tmp.push(emergency);
          }
          emergencies.value = tmp;
        }
        forLoop();
      })
    }

    const healthForms = ref(null);

    const fetchHealthForms = async () => {
      hm.getAllHealthForms().then((val) => {
        const tmp = [];
        const forms = val.val();

        const forLoop = async _ => {
          for (let key in forms) {
            const UID = forms[key]?._ownerUID;
            const owner = (await um.getUserInfo(UID)).val();

            const form = {
              url: owner._profilePic,
              data: [
                owner._name, 
                owner._ID,
                formatTime(forms[key]._time, forms[key]._date)
              ],
              uniqueID: forms[key]._OID,
              symptoms: forms[key]._symptomsList,
              UID: UID
            }

            tmp.push(form);
          }
          healthForms.value = tmp;
        }
        forLoop();
      }).catch((err) => {
        console.log('err: ', err);
      })
    }

    const ongoingHealthForms = ref(null);

    const fetchOngoingHealthForms = async () => {
      hm.getAllOngoingHealthForms().then((val) => {
        const tmp = [];
        const forms = val.val();

        const forLoop = async _ => {
          for (let key in forms) {
            const UID = forms[key]?._ownerUID;
            const owner = (await um.getUserInfo(UID)).val();

            const form = {
              url: owner._profilePic,
              data: [
                owner._name, 
                owner._ID,
                formatTime(forms[key]._time, forms[key]._date)
              ],
              uniqueID: forms[key]._OID,
              symptoms: forms[key]._symptomsList,
              UID: UID
            }

            tmp.push(form);
          }
          ongoingHealthForms.value = tmp;
        }
        forLoop();
      }).catch((err) => {
        console.log('err: ', err);
      })
    }

    onBeforeMount(async () => {
      await fetchAmbulanceForms();
      await fetchHealthForms();
      await fetchOngoingHealthForms();
    })

    const formatPhoneNumber = (phone) => {
      return '(' + phone.substring(0, 3) + ') ' + phone.substring(3, 6) + " - " + phone.substring(6);
    }

    const formatTime = (time, date) => {
      return date + " - " + time.substring(0, 5);
    }

    const dismiss = async (OID) => {
      const ambulanceForm = (await hm.getAmbulanceForm(OID)).val();

      await hm.dismissAmbulanceForm(OID);
      await fetchAmbulanceForms();

      $q.notify({
        position: 'top',
        message: t('EmergencyDismissed'),
        color: 'positive',
        actions: [
          { label: t('Undo'), color: 'white', handler: async () => {
            await hm.setAmbulanceForm(OID, ambulanceForm);
            await fetchAmbulanceForms();

            $q.notify({
              position: 'top',
              message: t('UndoSuccessful'),
              color: 'positive',
            });
          }}
        ],
        progress: true,
      });
    }

    const startChat = async (data) => {
      router.push(`/~/health/chat/${data.UID}`);
      await hm.healthFormChatStarted(data.UID);
    }

    const goToChat = (data) => {
      router.push(`/~/health/chat/${data.UID}`);
    }

    return {
      toggleDrawer,
      isMobile,
      fabPos,
      emergencies,
      dismiss,
      healthForms,
      startChat,
      ongoingHealthForms,
      goToChat
    }
  },
}
</script>

<style lang="sass" scoped>
a
  text-decoration: none
</style>
