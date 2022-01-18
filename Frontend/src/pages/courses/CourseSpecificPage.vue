<template>
  <div> 
    <q-banner inline-actions class="text-white bg-secondary">
      <q-icon  v-if="isMobile" size="sm" name="menu" @click="toggleDrawer"/>
      <div class="column">
        <span class="text-h5"> {{ lectureInfo?._lectureName }} </span>
        <span class="text-subtitle1"> {{ $t('Section') }} - {{ lectureInfo?._section }} </span> 
        <span class="text-subtitle1">  </span>
      </div>
    </q-banner>

    <div class="row items-center">
      <q-input v-model="lectureCode" outlined class="col-9 q-mt-md q-ml-md" dense :label="$t('EnterLectureCode')" color="secondary" />
      <q-btn outline unelevated :label="$t('Send')" class="text-secondary q-mx-md q-mt-md col" @click="checkLectureCode" />
    </div>

    <seating-plan 
      class="q-mt-lg"
      :studentView="true"
      :active="lectureCodeIsCorrect"
      :firstTime="firstTime"
      :row="5"
      :col="5"
      :personalRow="personalRow"
      :personalCol="personalCol"
      :hasLeft="personalCol != 0"
      :hasRight="personalCol != 4"
      @selected="selectSeat"
    />

  </div> 
</template>

<script> 
import { ref, computed, watch, onBeforeMount } from 'vue'
import { useQuasar } from 'quasar'
import SeatingPlan from '../../components/courses/SeatingPlan.vue'
import LectureManager from '../../classes/LectureManager'

export default {
  name: "CourseSpecificPage",
  components: {
    SeatingPlan
  },
  props: ['id'],
  setup(props, ctx) {
    const $q = useQuasar();

    const isMobile = computed(() => {
      return $q.screen.width < 800;
    });

    const open = ref(!isMobile.value);

    const lm = LectureManager.getInstance();

    const lectureInfo = ref(null);
    const lectureCode = ref(null);
    const lectureCodeIsCorrect = ref(false);
    const firstTime = ref(null);
    const personalCol = ref(null);
    const personalRow = ref(null);

    watch(isMobile, () => {
      open.value = !isMobile.value;
    })

    onBeforeMount(async () => {
      lm.getLecture(props.id).then((val) => {
        lectureInfo.value = val.val();
      });

      lm.getSelectedStatus(props.id).then((val) => {
        firstTime.value = !val.val();
      });

      lm.getMySeat(props.id).then((val) => {
        personalCol.value = val.val()?.col;
        personalRow.value = val.val()?.row;
      });
    });

    const toggleDrawer = () => {
      open.value = !open.value
      ctx.emit('toggleDrawer');
    }

    const checkLectureCode = async () => {
      lectureCodeIsCorrect.value = await lm.controlLectureCode(props.id, lectureCode.value)
    }

    const selectSeat = async (val) => {
      await lm.setSeatOwner(props.id, val.row - 1, val.col - 1);

      personalCol.value = val.col - 1;
      personalRow.value = val.row - 1;
      firstTime.value = false;
    }

    return {
      toggleDrawer,
      isMobile,
      lectureCode,
      checkLectureCode,
      lectureCodeIsCorrect,
      firstTime,
      selectSeat,
      personalCol,
      personalRow,
      lectureInfo
    }
  },
}
</script>

<style lang="sass" scoped>
.my-card
  width: 100%
  max-width: 200px

a
  text-decoration: none
</style>