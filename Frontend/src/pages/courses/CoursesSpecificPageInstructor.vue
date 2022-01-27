<template>
  <div> 
    <q-banner inline-actions class="text-white bg-secondary">
      <q-icon  v-if="isMobile" size="sm" name="menu" @click="toggleDrawer"/>
      
      <div class="column">
        <span class="text-h5"> {{ lectureInfo?._lectureName }} </span>
        <span class="text-subtitle1"> {{ $t('Section') }} - {{ lectureInfo?._section }} </span> 
      </div>
    </q-banner>
    <div class="row items-center">
      <q-btn outline unelevated :label="$t('GenerateLectureCode')" class="text-secondary q-mx-md q-mt-md col" @click="generate"/>
      <div class="col-9 q-mt-md q-pa-sm q-mr-md bordered" dense>
        <span class="text-weight-bold">
          {{ $t('LectureCodeIs') }} 
        </span>
        {{ lectureCode }}
      </div>
    </div>

    <div class="row q-ma-md">
      <seating-plan 
        :studentView="false"
        :active="active" 
        :row="5"
        :col="5"
        :seatingPlan="seatingPlanStatus"
        @changeColor="changeColor"
      />

      <div class="column q-mt-md q-ml-xl">
        <div>
          <b> {{ $t('SeatingPlanLegend') }} </b>
        </div>
        <div>
          <q-badge rounded color="yellow" />
          <span class="q-ml-sm">
            {{ $t('YellowDesc') }}
          </span>
        </div>
        <div>
          <q-badge rounded color="green" />
          <span class="q-ml-sm">
            {{ $t('GreenDesc') }}
          </span>
        </div>
        <div>
          <q-badge rounded color="red" />
          <span class="q-ml-sm">
            {{ $t('RedDesc') }}
          </span>
        </div> 
        <div>
          <q-badge rounded color="grey" />
          <span class="q-ml-sm">
            {{ $t('GreyDesc') }}
          </span>
        </div> 
        <div>
          <q-badge rounded color="black" />
          <span class="q-ml-sm">
            {{ $t('BlackDesc') }}
          </span>
        </div>  
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onBeforeMount } from 'vue'
import { useQuasar } from 'quasar'
import SeatingPlan from '../../components/courses/SeatingPlan.vue'
import LectureManager from '../../classes/LectureManager'
import { useI18n } from 'vue-i18n'

export default {
  name: "CourseSpecificPageInstructor",
  components: {
    SeatingPlan
  },
  props: ['id'],
  setup(props, ctx) {
    const $q = useQuasar();
    const lm = LectureManager.getInstance();
    const { t } = useI18n({});

    const isMobile = computed(() => {
      return $q.screen.width < 800;
    }); 

    const open = ref(!isMobile.value);

    const lectureInfo = ref(null);
    const lectureCode = ref(null);
    const seatingPlanStatus = ref();
    const active = ref(false);

    watch(isMobile, () => {
      open.value = !isMobile.value;
    })

    onBeforeMount(async () => {
      lm.getLecture(props.id).then((val) => {
        lectureInfo.value = val.val();
      });
      await lm.resetSeatPlanStatus(props.id);
      await initializeSeatingPlanStatus();
    });

    const toggleDrawer = () => {
      open.value = !open.value
      ctx.emit('toggleDrawer');
    }

    const generate = async () => { 
      active.value = true;
      await lm.generateLectureCode(props.id);
      await lm.getLectureCode(props.id).then((val) => {
        lectureCode.value = val.val();
      });
      await lm.resetSeatPlanStatus(props.id);

      setInterval(async () => {
        await initializeSeatingPlanStatus();
      }, 2000)
    }; 

    const initializeSeatingPlanStatus = async () => {
      const seatPlan = await lm.getSeatPlan(props.id);
      const rowCount = Object.keys(seatPlan).length;
      seatingPlanStatus.value = [];

      for (let i = 0; i < rowCount; i++) {
        const colCount = Object.keys(seatPlan[i]).length;
        const rowArray = [];

        for (let k = 0; k < colCount; k++) {
          if (seatPlan[i][k]._color === 0) {
            rowArray.push({
              status: "bg-black"
            });
          }  
          else if (seatPlan[i][k]._color === 1) {
            rowArray.push({
              status: "bg-red"
            });
          }
          else if (seatPlan[i][k]._color === 2) {
            rowArray.push({
              status: "bg-grey"
            });
          }
          else if (seatPlan[i][k]._color === 3) {
            rowArray.push({
              status: "bg-green"
            });
          }
          else {
            rowArray.push({
              status: "bg-yellow"
            });
          }
        }
        seatingPlanStatus.value.push(rowArray);
      }
    }

    const changeColor = async (data) => {
      // const UID = await lm.findOwnerUIDBySeat(props.id, data.row, data.col);
      // lm.changeColor(props.id, UID, data.color).then(async () => {
      //   $q.notify({
      //     position: 'top',
      //     color: 'positive',
      //     message: t('SeatStatusUpdated')
      //   });
      //   await initializeSeatingPlanStatus();
      // });
    }

    return {
      toggleDrawer,
      isMobile,
      lectureCode,
      lectureInfo,
      generate,
      seatingPlanStatus,
      active,
      changeColor
    }
  },
}
</script>

<style scoped>
.my-card {
  width: 100%;
  max-width: 200px;
}

.bordered { 
  border: 1px solid rgb(20, 168, 168);
  border-radius: 5px;
}

a {
  text-decoration: none;
}
</style>