<template>
  <div> 
    <q-banner inline-actions class="text-white bg-secondary">
      <q-icon v-if="isMobile" size="sm" name="menu" @click="toggleDrawer"/>
      <b> {{ $t('HealthCenterPageDesc') }} </b> 
    </q-banner>

    <div class="column items-center q-mt-md">
      <q-btn 
        :label="$t('CallAnAmbulance')" 
        color="red" 
        style="width: 50%" 
        icon="mdi-ambulance" 
        @click="call"
      />
    </div>  

    <my-reservations 
      v-if="hasReservation" 
      :slots="slots" 
      :title="$t('HealthCenterAppInfo')"
      class="q-mt-md" />

    <div v-else class="row justify-center q-mt-md">
      <q-card outlined style="width: 50%;" class="q-pa-lg">
          <div class="text-secondary text-weight-bold">
            {{ $t("NoHealthCenterReservation") }}
          </div>
      </q-card>
    </div>

    <div class="column items-center q-mt-md">
      <q-btn :label="contactButtonTitle" color="secondary" style="width: 50%" @click="goToContact"/>
    </div>

    <q-dialog v-model="show" persistent>
      <q-card style="width: 500px">
        <q-card-section class="col items-center">
            {{ $t("CallAnAmbulanceDesc") }}
        </q-card-section>

        <q-card-actions class="justify-between">
          <q-btn flat :label="$t('Cancel')" color="secondary" v-close-popup />
          <q-btn flat :label="$t('Confirm')" color="secondary" v-close-popup @click="callAmbulance"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import MyReservations from '../../components/reservation/MyReservations.vue'
import HealthForm from '../../components/health/HealthForm.vue'
import HealthManager from '../../classes/HealthManager'
import ChatManager from '../../classes/ChatManager'
import { Store } from '../../store/index'
import { useI18n } from 'vue-i18n'
import UserManager from '../../classes/UserManager'
import { useRouter } from 'vue-router'

export default {
  name: "HealthCenterPage",
  components: {
    MyReservations
  },
  computed: {
    slots() {
      return [
        {
          label: this.$t('ReservationDate'), 
          data:  '11/12/2021'
        },
        {
          label: this.$t('ReservationTime'), 
          data:  '08.30'
        },
        {
          label: this.$t('ReservationPlace'), 
          data:  'Health Center'
        }
      ]
    }
  },

  setup(props, ctx) {
    const $q = useQuasar();
    const hm = HealthManager.getInstance();
    const cm = ChatManager.getInstance();
    const um = UserManager.getInstance();
    const router = useRouter();
    const { t } = useI18n({});

    const hasActiveChat = ref(null);
    const hasReservation = ref(false);

    const UID = Store.state.settings.currentUserUID;

    const isMobile = computed(() => {
      return $q.screen.width < 800;
    });

    const open = ref(!isMobile.value);
    const show = ref(false);

    watch(isMobile, () => {
      open.value = !isMobile.value;
    })

    const toggleDrawer = () => {
      open.value = !open.value
      ctx.emit('toggleDrawer');
    }

    const call = async () => {
      const user = (await um.getUserInfo(UID)).val();
      if (!user._orders?.AmbulanceForm) {
        show.value = true;
      }
      else {
        $q.notify({
          position: 'top',
          message: t('AlreadyMadeAmbulanceCall'),
          color: 'negative',
        })
      }
    }

    const callAmbulance = () => {
      hm.makeAmbulanceCall(UID).then(() => {
        $q.notify({
          position: 'top',
          message: t('AmbulaneCallDone'),
          color: 'positive',
        })
      });
    }

    onBeforeMount(async () => {
      hasActiveChat.value = await cm.hasActiveChat(UID);
    })

    const goToContact = async () => {
      const user = (await um.getUserInfo(UID)).val();
      if (!user._orders?.HealthForm) {
        router.push('/~/health/form');
      }
      else if (hasActiveChat.value){
        router.push(`/~/health/chat/${UID}`);
      }
      else {
        $q.notify({
          position: 'top',
          color: 'negative',
          message: t('AlreadyFilledHealthForm')
        });
      }
    }

    const contactButtonTitle = computed(() => {
      if (hasActiveChat.value){
        return t('GoToHealthCenterChat');
      }
      else {
        return t('GoToHealthForm');
      }
    });

    return {
      toggleDrawer,
      isMobile,
      hasReservation,
      show,
      callAmbulance,
      hasActiveChat,
      call,
      goToContact,
      contactButtonTitle
    }
  },
}
</script>

<style lang="sass" scoped>
a
  text-decoration: none
</style>
