<template>
  <div> 
    <div class="column">
    <q-banner inline-actions class="text-white bg-accent">
      <q-icon v-if="isMobile" size="sm" name="menu" @click="toggleDrawer"/>
      <b> {{ $t('CoursesPageDesc') }} </b> 
      <q-btn :label="$t('Register')" unelevated class="bg-secondary fixed-top-right q-mt-sm q-mr-sm" @click="register = true"/>
    </q-banner>
    
    </div>
    <div class="q-pa-md q-mx-xs row q-gutter-lg">
      <router-link :to="`courses/${JSON.stringify(lecture['_LID'])}`" v-for="lecture in lectures" :key="lecture['_LID']" class="my-card">
        <q-card class="bg-secondary text-white">
          <q-card-section align="center" style="height:120px">
            <div class="text-h6">{{ lecture["_lectureName"] }}</div>
            <div class="text-h6">Section-{{ lecture["_section"] }}</div>
            <div class="text-h6">{{ lecture["_place"] }}</div>
          </q-card-section>
        </q-card> 
      </router-link>
    </div>

    <!-- Register to course popup -->
    <q-dialog v-model="register" persistent>
      <q-card style="width: 300px">
        <q-card-section class="col items-center">
          <div class="row justify-center">
            <q-input v-model="enrollCode" class="col" color="secondary" :label="$t('EnterCourseRegisterCode')" dense outlined />
          </div>
        </q-card-section>

        <q-card-actions class="justify-between">
          <q-btn flat :label="$t('Cancel')" color="secondary" v-close-popup />
          <q-btn flat :label="$t('Enroll')" color="secondary" v-close-popup @click="enrollToCourse" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
import { ref, computed, watch, onBeforeMount } from 'vue'
import { useQuasar } from 'quasar'
import LectureManager from '../../classes/LectureManager'
import { Store } from '../../store/index'
import { useI18n } from 'vue-i18n'

export default {
  name: "CoursesPage", 
  setup(props, ctx) {
    const $q = useQuasar();
    const { t } = useI18n({});
    const lm = LectureManager.getInstance();

    const isMobile = computed(() => {
      return $q.screen.width < 800;
    });

    const open = ref(!isMobile.value);

    const register = ref(false);
    const enrollCode = ref(null);
    const lectures = ref(null);

    const getLectures = async () => {
      lm.getLectures(Store.state.settings.currentUserUID).then((val) => {
        lectures.value = val.val();
      })
    };

    onBeforeMount(async () => {
      await getLectures();
    });

    watch(isMobile, () => {
      open.value = !isMobile.value;
    })

    const toggleDrawer = () => {
      open.value = !open.value
      ctx.emit('toggleDrawer');
    }

    const calculateRoute = (course) => {
      return "/~/courses/" + course.name.toLowerCase();
    }; 

    const enrollToCourse = async () => {
      $q.notify({
        position: 'top',
        color: 'positive',
        message: t('CourseEnrollSuccessful')
      });

      await lm.enrollStudentToCourse(enrollCode.value);
      await getLectures();
    }

    return {
      toggleDrawer,
      isMobile,
      calculateRoute,
      register,
      enrollCode,
      enrollToCourse,
      lectures
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