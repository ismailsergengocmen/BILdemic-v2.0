<template>
  <div class="q-gutter-y-md">
    <q-banner inline-actions class="text-white bg-secondary">
      <q-icon v-if="isMobile" size="sm" name="menu" @click="toggleDrawer"/>
      <b> {{ $t('SportsReservationsPageDesc') }} </b> 
    </q-banner>

    <sports-reservations 
      :slots="slots" 
      :noReservation="noReservation"
      @cancelReservations="cancelReservations"
    />

    <q-dialog v-model="reservationCancelled" seamless position="top">
      <q-card style="width: 300px" class="bg-positive">
        <q-card-section>
          <q-banner dense inline-actions class="text-white bg-positive" >
            <div class="row justify-center">
            {{ $t("SportsReservationCancelled") }}
            </div>
          </q-banner>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import SportsReservations from '../../components/sports/SportsReservations.vue'
import SportManager from "../../classes/SportManager"
import { Store } from '../../store/index'
import { useI18n } from 'vue-i18n'

export default {
  name: "SportsReservationsPage",
  components: {
    SportsReservations
  },

  setup(props, ctx) {
    const $q = useQuasar();

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

    const sm = SportManager.getInstance();
    const slots = ref(null);
    const reservationCancelled = ref(false);
    const { t } = useI18n({})

    const getSportsReservations = async () => {
      const UID = Store.state.settings.currentUserUID;
      sm.getSportsRes(UID).then((val) => {
        const sportRes = val.val();
        slots.value = [];

        if (sportRes) {
          for (let key of Object.keys(sportRes)) {
            const reservationData = [
              {
                label: t('ReservationPlace'), 
                data:  sportRes[key]._place
              },
              {
                label: t('ReservationActivity'), 
                data:  sportRes[key]._activity
              },
              {
                label: t('ReservationDate'), 
                data:  sportRes[key]._date
              },
              {
                label: t('ReservationTime'), 
                data:  sportRes[key]._time
              },
              {
                label: "OID",
                data: sportRes[key]._OID
              }
            ];

            slots.value.push(reservationData);
          }
        }
      });
    }

    const cancelReservations = async (OID) => {
      const UID = Store.state.settings.currentUserUID;
      await sm.cancelOrder(UID, OID);
      await getSportsReservations();
      reservationCancelled.value = true;

      setTimeout(() => {
        reservationCancelled.value = false;
      }, 2000);
    }

    onBeforeMount(async () => {
      await getSportsReservations();
    })

    const noReservation = computed(() => {
      return slots.value?.length == 0;
    })

    return {
      toggleDrawer,
      isMobile,
      slots,
      cancelReservations,
      noReservation,
      reservationCancelled
    }
  },
}
</script>
