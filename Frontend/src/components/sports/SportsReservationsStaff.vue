<template>
  <div class="column items-center">
    <div style="width: 50%" class="q-gutter-y-md col-4">
      <div class="row q-gutter-x-md">
        <q-select 
          class="col" 
          v-model="place" 
          color="secondary" 
          outlined 
          :label="$t ('Place')" 
          dense
          :options="placesArr"
          clearable
        />
        <q-select 
          class="col" 
          v-model="activity" 
          color="secondary" 
          outlined 
          :label="$t('Activity')" 
          dense
          :options="activitiesArr"
          clearable
        />
      </div>

      <div class="row q-gutter-x-md">
        <q-select
          class="col"
          v-model="date" 
          color="secondary" 
          outlined 
          :label="$t('Date')" 
          dense
          :options="datesArr"
          clearable
        />
        <q-select 
          class="col" 
          v-model="time" 
          color="secondary" 
          outlined 
          :label="$t('Time')" 
          dense
          :options="timesArr"
          clearable
        />
      </div>
      <q-input
        v-model="search"
        outlined
        dense
        debounce="700"
        :placeholder="$t('Search')"
        color="secondary"
        clearable
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>
    </div>

    <q-scroll-area class="full-width q-mt-md" style="height: 370px">
      <div class="column q-gutter-y-md full-width items-center">
        <generic-user-card 
          v-for="info in filteredCardInfos" 
          :key="info"  
          :cardInfo="info"
          :buttonText="$t('PersonIsHere')"
          class="text-black"
          @button1Clicked="dismiss"
        />
      </div>

      <div v-if="noReservation" class="row justify-center q-mt-lg">
          <q-card outlined style="width: 50%;" class="q-pa-lg">
              <div class="text-secondary text-weight-bold">
                {{ $t("NoSportsReservationsMade") }}
              </div>
          </q-card>
        </div>
    </q-scroll-area>
    
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import GenericUserCard from '../generic/GenericUserCard.vue'
import SportManager from '../../classes/SportManager'

export default {
  name: "SportsReservationsStaff",
  props: ["cardInfos"],
  components: {
    GenericUserCard
  },
  setup(props, ctx) {
    const search = ref(null);
    const place = ref(null);
    const activity = ref(null);
    const date = ref(null);
    const time = ref(null); 

    const activitiesArr = [
      "Tennis", "Football", "Basketball"
    ];
    
    const placesArr = [
      "Main Campus Sports Hall", "East Campus Sports Hall", "Dormitories Sports Hall"
    ];

    const datesArr = [
      "11.12.2021", "12.12.2021", "13.12.2021", "14.12.2021", "15.12.2021", "16.12.2021"
    ];

    const timesArr = [
      "08.30", "09.00", "09.30", "10.00", "10.30", "11.00"
    ];

    const sm = SportManager.getInstance();

    const filteredCardInfos = computed(() => {
      let filtered = props.cardInfos;

      if (place.value) {
        filtered = filtered.filter(({ data }) => {
          return data[2].includes(place.value);
        })
      }

      if (activity.value) {
        filtered = filtered.filter(({ data }) => {
          return data[2].includes(activity.value);
        })
      }

      if (date.value) {
        filtered = filtered.filter(({ data }) => {
          return data[3].includes(date.value);
        })
      }

      if (time.value) {
        filtered = filtered.filter(({ data }) => {
          return data[3].includes(time.value);
        })
      }

      if (search.value) {
        filtered = filtered.filter(({ data }) => {
          return data[0].includes(search.value);
        })
      }

      return filtered;
    });

    const dismiss = async (emitValue) => {
      await sm.cancelOrder(emitValue.owner, emitValue.uniqueId);
      ctx.emit('dismiss');
    }

    const noReservation = computed(() => {
      return filteredCardInfos.value?.length == 0;
    })

    return {
      search,
      place,
      activity,
      date,
      time,
      activitiesArr,
      placesArr,
      datesArr,
      timesArr,
      filteredCardInfos,
      dismiss,
      noReservation
    }
  },
}
</script>
