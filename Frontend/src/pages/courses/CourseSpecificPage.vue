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
      :seatCode="seatCode"
      :neighbourCheckIsDone="neighbourCheckIsDone"
      @submitNeighInfo="submitNeighInfo"
    />

  </div> 
</template>

<script> 
import { ref, computed, watch, onBeforeMount } from 'vue'
import { useQuasar } from 'quasar'
import SeatingPlan from '../../components/courses/SeatingPlan.vue'
import LectureManager from '../../classes/LectureManager'
import { useI18n } from 'vue-i18n'
import { Store } from '../../store/index'

export default {
  name: "CourseSpecificPage",
  components: {
    SeatingPlan
  },
  props: ['id'],
  setup(props, ctx) {
    const $q = useQuasar();
    const { t } = useI18n({});
    const lm = LectureManager.getInstance();

    const isMobile = computed(() => {
      return $q.screen.width < 800;
    });

    const open = ref(!isMobile.value);

    const lectureInfo = ref(null);
    const lectureCode = ref(null);
    const lectureCodeIsCorrect = ref(false);
    const firstTime = ref(null);
    const personalCol = ref(null);
    const personalRow = ref(null);
    const seatCode = ref(null);
    const neighbourCheckIsDone = ref(false);

    const UID = Store.state.settings.currentUserUID;

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
      lm.controlLectureCode(props.id, lectureCode.value).then(async (val) => {
        lectureCodeIsCorrect.value = val;
        if (!val) {
          $q.notify({
            position: 'top',
            color: 'negative',
            message: t('LectureCodeNotCorrect')
          });
        }
        else {
          $q.notify({
            position: 'top',
            color: 'positive',
            message: t('LectureCodeCorrect')
          });

          await lm.changeColor(props.id, UID, 2);
          await lm.updateSeatCode(props.id, UID);
          seatCode.value = await lm.getSeatCode(props.id, UID);
        }
      })
    }

    const selectSeat = async (val) => {
      await lm.setSeatOwner(props.id, val.row - 1, val.col - 1);

      personalCol.value = val.col - 1;
      personalRow.value = val.row - 1;
      firstTime.value = false;
    }

    const submitNeighInfo = async (data) => {
      lm.checkNeighbourSeatCode(props.id, UID, data.right, data.left).then((val) => {
        if (val === 0) {
          $q.notify({
            position: 'top',
            color: 'positive',
            message: t('NeighInfoCorrect')
          });
          neighbourCheckIsDone.value = true;
        }
        else if (val === 1) {
          $q.notify({
            position: 'top',
            color: 'negative',
            message: t('NeighLeftWrong')
          });
        }
        else if (val === 2) {
          $q.notify({
            position: 'top',
            color: 'negative',
            message: t('NeighRightWrong')
          });
        }
        else {
          $q.notify({
            position: 'top',
            color: 'negative',
            message: t('NeightAllWrong')
          });
        }
      })
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
      lectureInfo,
      seatCode,
      submitNeighInfo,
      neighbourCheckIsDone
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