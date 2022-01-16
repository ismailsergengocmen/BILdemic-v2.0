<template>
  <div> 
    <sports-reservations-staff 
      :cardInfos="reservationCardInfos"
      class="q-pt-md"
      @dismiss="dismiss"
    />

    <q-page-sticky position="bottom-left" :offset="fabPos" v-if="isMobile">
      <q-fab
        icon="mdi-chevron-right"
        active-icon="mdi-chevron-left"
        color="secondary"
        padding="10px"
        @click="toggleDrawer" />
    </q-page-sticky>
  </div>
</template>

<script>
import { computed, ref, watch, onBeforeMount } from 'vue'
import { useQuasar } from 'quasar'
import SportsReservationsStaff from '../../components/sports/SportsReservationsStaff.vue'
import UserManager from '../../classes/UserManager'
import SportManager from '../../classes/SportManager'

export default {
  name: "SportsStaffPage",
  components: {
    SportsReservationsStaff
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
    const um = UserManager.getInstance();
    const reservationCardInfos = ref(null);

    const getReservations = async () => {
      const reservations = (await sm.getAllSportsRes()).val(); 
      reservationCardInfos.value = [];

      if (reservations) {
        for (let key of Object.keys(reservations)) {
          const UID = reservations[key]._ownerUID;
          const user = (await um.getUserInfo(UID)).val();
          const reserv = {
            url: "https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg",
            data: [
              user._name,
              user?._ID,
              reservations[key]._activity + " - " + reservations[key]._place,
              reservations[key]._date + " - " + reservations[key]._time
            ],
            uniqueId: reservations[key]._OID,
            owner: reservations[key]._ownerUID 
          }

          reservationCardInfos.value.push(reserv);
        }
      }
    }

    onBeforeMount(async () => {
      await getReservations();
    })

    const dismiss = async () => {
      await getReservations();
    };

    const fabPos = ref([ 18, 18 ]);
  
    return {
      toggleDrawer,
      isMobile,
      reservationCardInfos,
      fabPos,
      dismiss
    }
  },
}
</script>
