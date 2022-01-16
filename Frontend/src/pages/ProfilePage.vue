<template>
  <div>
    <q-banner inline-actions class="text-white bg-secondary">
      <q-icon v-if="isMobile" size="sm" name="menu" @click="toggleDrawer"/>
      <b> {{ $t('ProfilePage') }} </b> 
    </q-banner>

    <div class="q-pa-md column">
      <div class="row justify-center q-mb-md">
        <q-img src="https://placeimg.com/500/300/nature" style="height: 140px; max-width: 150px"/>
      </div>
      
      <profile-page-form />
    </div>
  </div>
</template>

<script>
import ProfilePageForm from "../components/ProfilePageForm.vue"
import { useQuasar } from "quasar"
import { watch, computed, ref } from "vue"

export default {
  name: "ProfilePage",
  components: {
    ProfilePageForm
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

    return {
      isMobile,
      toggleDrawer,
    }
  },
}
</script>