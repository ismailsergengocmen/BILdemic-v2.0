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
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import MakeReservation from '../../components/reservation/MakeReservation.vue'
import SportManager from '../../classes/SportManager'
import { useI18n } from 'vue-i18n'

export default {
  name: "SportsCenterPage",
  components: {
    MakeReservation
  },

  setup(props, ctx) {
    const $q = useQuasar();
    const { t } = useI18n({});
    const sm = SportManager.getInstance();
    
    const isMobile = computed(() => {
      return $q.screen.width < 800;
    });

    const open = ref(!isMobile.value);

    watch(isMobile, () => {
      open.value = !isMobile.value;
    })

    const makeRes = async (data) => {
      if (data == null) {
        $q.notify({
          position: 'top',
          color: 'negative',
          message: t('EmptySlotsError')
        });
      }
      else {
        sm.createSportRes(data.place, data.activity, data.date, data.time).then(() => {
          $q.notify({
            position: 'top',
            color: 'positive',
            message: t('SportsReservationSuccessful')
          });
        })
        .catch(() => {
          $q.notify({
            position: 'top',
            color: 'negative',
            message: t('SportsReservationNotSuccessful')
          });
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
      makeRes
    }
  },
}
</script>

<style lang="sass" scoped>
a
  text-decoration: none
</style>
