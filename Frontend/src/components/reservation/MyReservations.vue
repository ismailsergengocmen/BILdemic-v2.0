<template>
  <div class="row justify-center">
    <q-field outlined style="width: 50%;" color="secondary">
      <q-form class="q-gutter-y-md q-px-md q-py-md full-width" >
        <div>
          <b>{{ title }}</b>
        </div>
  
        <q-field 
          v-for="slot in filteredSlots" 
          :key="slot.label" 
          outlined 
          stack-label
          :label="slot.label"
          color="secondary"
          >
          <template v-slot:control>
            <div class="self-center"> {{ slot.data }} </div>
          </template>
        </q-field>
  
        <q-btn 
          :label="$t('CancelReservation')" 
          type="submit" 
          color="secondary" 
          @click.prevent="cancelReservations" 
        />
      </q-form>
    </q-field>
  </div>
</template>

<script>
import { computed } from "vue"

export default {
  name: "MyReservations",
  props: {
    slots: Array,
    title: String
  },
  setup(props, ctx) {
    const cancelReservations = () => {
      const OID = props.slots[4].data;
      ctx.emit('cancelReservations', OID);
    }

    const filteredSlots = computed(() => {
      return props.slots.filter(item => item.label != 'OID');
    });

    return {
      filteredSlots,
      cancelReservations
    }
  },
}
</script>