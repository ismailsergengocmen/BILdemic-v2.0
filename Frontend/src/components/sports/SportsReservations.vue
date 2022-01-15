<template>
  <div class="q-mt-lg q-gutter-y-md">
    <my-reservations
      v-for="slot in slots" 
      :key="slot"
      :slots="slot"
      @cancelReservations="cancelReservations"
    />

    <div v-if="noReservation" class="row justify-center">
      <q-card outlined style="width: 50%;" class="q-pa-lg">
          <div class="text-secondary text-weight-bold">
            {{ $t("NoSportsReservation") }}
          </div>
      </q-card>
    </div>
  </div>
</template>

<script>
import MyReservations from "../reservation/MyReservations.vue"

export default {
  name: "SportReservations",
  props: ["slots", "noReservation"],
  components: {
    MyReservations
  },

  setup(props, ctx) {
    const cancelReservations = (OID) => {
      ctx.emit('cancelReservations', OID);
    };

    return {
      cancelReservations
    }
  },
}
</script>
