<template>
  <div> 
    <q-banner inline-actions class="text-white bg-secondary">
      <q-icon v-if="isMobile" size="sm" name="menu" @click="toggleDrawer"/>
      <b> {{ $t('CafeteriaPageDesc') }} </b> 
    </q-banner>

    <daily-menu class="q-mt-lg"/>

    <my-reservations 
      v-if="hasReservation" 
      :slots="mealOrder" 
      :title="$t('MealOrderInfo')"
      class="q-mt-md" 
      @cancelReservations="cancelReservation"
    />
      
    <make-reservation 
      v-if="!hasReservation" 
      :hasMeal="true"
      :hasPlace="true" 
      :hasTime="true"
      :hasDate="true"
      :title="$t('MakeMealOrder')" 
      type="meal"
      class="q-mt-md" @makeReservation="makeRes" 
    />

  </div>
</template>

<script>
import { computed, ref, watch, onBeforeMount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'
import MakeReservation from '../../components/reservation/MakeReservation.vue'
import MyReservations from '../../components/reservation/MyReservations.vue'
import DailyMenu from '../../components/cafeteria/DailyMenu.vue'
import CafeteriaManager from '../../classes/CafeteriaManager'
import { Store } from '../../store/index'

export default {
  name: "CafeteriaPage",
  components: {
    MakeReservation,
    MyReservations,
    DailyMenu
  },

  setup(props, ctx) {
    const $q = useQuasar();
    const { t } = useI18n({});
    const cm = CafeteriaManager.getInstance();

    const hasReservation = ref(false);
    const mealOrder = ref(null);
    const UID = Store.state.settings.currentUserUID;

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

    const makeRes = async (val) => {
      if (val) {
        await cm.createMealOrder(val.place, val.date, val.time, val.meal).then(() => {
          $q.notify({
            position: 'top',
            color: 'positive',
            message: t('MealOrderSuccessful')
          });
        });
      }
      else {
        $q.notify({
            position: 'top',
            color: 'negative',
            message: t('EmptySlotsError')
          });
      }
      
      await fetchMealOrder();
    }

    const cancelReservation = async (OID) => {
      cm.deleteMealOrder(UID, OID).then(() => {
        $q.notify({
          position: 'top',
          color: 'positive',
          message: t('MealOrderCancelled')  
        });
        fetchMealOrder();
      });
    }

    const fetchMealOrder = async () => {
      cm.searchOrder(UID).then((orderData) => {
        if (orderData) {
          hasReservation.value = true;
          mealOrder.value = [
            {
              label: t('ReservationDate'), 
              data: orderData._date
            },
            {
              label: t('ReservationTime'), 
              data:  orderData._time
            },
            {
              label: t('ReservationPlace'), 
              data:  orderData._place
            },
            {
              label: t('MealType'), 
              data:  orderData._type
            },
            {
              label: "OID", 
              data:  orderData._OID
            }
          ];
        }
        else {
          hasReservation.value = false;
        }
      })
    }

    onBeforeMount(async () => {
      await fetchMealOrder();
    })

    return {
      toggleDrawer,
      isMobile,
      hasReservation,
      makeRes,
      mealOrder,
      cancelReservation
    }
  },
}
</script>
