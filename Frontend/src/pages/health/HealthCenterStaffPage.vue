<template>
  <div>
    <health-center-staff-tabs 
      :cardInfos="cardInfos"
      :emergencyInfos="emergencies"
      :ambulanceFormCount="ambulanceFormCount"
      @dismiss="dismiss"
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

export default {
  name: "HealthCenterPage",
  components: {
    HealthCenterStaffTabs
  },
  setup(props, ctx) {
    const $q = useQuasar();
    const hm = HealthManager.getInstance();
    const um = UserManager.getInstance();

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

    const cardInfos = [
      {
        url: "https://placeimg.com/500/300/nature",
        data: [
          "Ahmed Salih Cezayir",
          21802918,
        ]
      },
      {
        url: "https://placeimg.com/500/300/nature",
        data: [
          "Asude Cezayir",
          21802918,
        ]
      },
      {
        url: "https://placeimg.com/500/300/nature",
        data: [
          "İsmail Sergen Göçmen",
          21802918,
        ]
      },
      {
        url: "https://placeimg.com/500/300/nature",
        data: [
          "Ahmed Salih Cezayir",
          21802918,
        ]
      },
      {
        url: "https://placeimg.com/500/300/nature",
        data: [
          "Asude Cezayir",
          21802918,
        ]
      },
      {
        url: "https://placeimg.com/500/300/nature",
        data: [
          "İsmail Sergen Göçmen",
          21802918,
        ]
      }
    ];

    const fabPos = ref([ 18, 18 ]);

    const ambulanceForms = ref(null);
    const ambulanceFormCount = computed(() => {
      if (!ambulanceForms.value) {
        return 0;
      }
      return Object.keys(ambulanceForms.value)?.length;
    });

    const emergencies = ref([]);

    const fetchAmbulanceForms = async () => {
      hm.getAllAmbulanceForms().then((val) => {
        emergencies.value = [];
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

            emergencies.value.push(emergency);
          }
        }

        forLoop();
      })
    }

    onBeforeMount(async () => {
      await fetchAmbulanceForms();
    })

    const formatPhoneNumber = (phone) => {
      return '(' + phone.substring(0, 3) + ') ' + phone.substring(3, 6) + " - " + phone.substring(6);
    }

    const formatTime = (time, date) => {
      return date + " - " + time.substring(0, 5);
    }

    const dismiss = async (OID) => {
      await hm.dismissAmbulanceForm(OID);
      await fetchAmbulanceForms();
    }

    return {
      toggleDrawer,
      isMobile,
      cardInfos,
      fabPos,
      ambulanceFormCount,
      emergencies,
      dismiss
    }
  },
}
</script>

<style lang="sass" scoped>
a
  text-decoration: none
</style>
