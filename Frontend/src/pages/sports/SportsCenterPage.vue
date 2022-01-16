<template>
  <div> 
    <q-banner inline-actions class="text-white bg-secondary">
      <q-icon v-if="isMobile" size="sm" name="menu" @click="toggleDrawer"/>
      <b> {{ $t('SportsCenterPageDesc') }} </b> 
    </q-banner>

    <make-reservation 
      :hasPlace="true"
      :hasActivity="true" 
      :hasDate="true" 
      :hasTime="true" 
      :title="$t('MakeSportsApp')" 
      type="sports"
      class="q-mt-lg" 
      @makeReservation="makeRes"
    />  

    <div class="column items-center q-mt-md">
      <q-btn :label="$t('SeeSportsReservations')" color="secondary" style="width: 50%" to="/~/sports/reservations"/>
    </div>

    <q-dialog v-model="reservationMade" seamless position="top">
      <q-card style="width: 300px" class="bg-positive">
        <q-card-section>
          <q-banner dense inline-actions class="text-white bg-positive" >
            <div class="row justify-center">
            {{ $t("SportsReservationSuccessful") }}
            </div>
          </q-banner>
        </q-card-section>
      </q-card>
    </q-dialog>  

    <q-dialog v-model="reservationNotMade" seamless position="top">
      <q-card style="width: 300px" class="bg-negative">
        <q-card-section>
          <q-banner dense inline-actions class="text-white bg-negative" >
            <div class="row justify-center">
            {{ $t("SportsReservationNotSuccessful") }}
            </div>
          </q-banner>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="emptySlotsError" seamless position="top">
      <q-card style="width: 300px" class="bg-negative">
        <q-card-section>
          <q-banner dense inline-actions class="text-white bg-negative" >
            <div class="row justify-center">
            {{ $t("EmptySlotsError") }}
            </div>
          </q-banner>
        </q-card-section>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import MakeReservation from '../../components/reservation/MakeReservation.vue'
import SportManager from "../../classes/SportManager"

export default {
  name: "SportsCenterPage",
  components: {
    MakeReservation
  },

  setup(props, ctx) {
    const $q = useQuasar();

    const isMobile = computed(() => {
      return $q.screen.width < 800;
    });

    const open = ref(!isMobile.value);
    const reservationMade = ref(false);
    const reservationNotMade = ref(false);
    const emptySlotsError = ref(false);

    watch(isMobile, () => {
      open.value = !isMobile.value;
    })

    const sm = SportManager.getInstance();

    const makeRes = async (data) => {
      if (data == null) {
        emptySlotsError.value = true;
        setTimeout(() => {
          emptySlotsError.value = false;
        }, 3000);
      }
      else {
        sm.createSportRes(data.place, data.activity, data.date, data.time).then(() => {
        reservationMade.value = true;
        setTimeout(() => {
          reservationMade.value = false;
        }, 3000);
      })
      .catch(() => {
        reservationNotMade.value = true;
        setTimeout(() => {
          reservationNotMade.value = false;
        }, 3000);
      });
      }
    }

    const toggleDrawer = () => {
      open.value = !open.value
      ctx.emit('toggleDrawer');
    }

    return {
      toggleDrawer,
      isMobile,
      makeRes,
      reservationMade,
      reservationNotMade,
      emptySlotsError
    }
  },
}
</script>

<style lang="sass" scoped>
a
  text-decoration: none
</style>
