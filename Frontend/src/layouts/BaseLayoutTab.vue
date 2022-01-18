<template>
  <q-layout view="hHh Lpr lff" class="shadow-2 rounded-borders">
      <q-drawer
        v-model="drawer"
        :width="200"
        bordered
        behavior="desktop"
      >
        <base-tabs :role="currentUserRole" @logout="logout"/>
      </q-drawer>

      <q-page-container>
        <router-view @toggleDrawer="toggleDrawer"/>
      </q-page-container>
  </q-layout>
</template>

<script>
import { ref, computed, watch, onBeforeMount } from 'vue'
import { useQuasar } from 'quasar'
import LoginManager from '../classes/LoginManager'
import UserManager from '../classes/UserManager'
import { useRouter } from 'vue-router'
import { Store } from '../store/index'
import BaseTabs from './BaseTabs.vue'

export default {
  components: { 
    BaseTabs 
  },
  name: 'BaseLayoutTab',

  setup() {
    const $q = useQuasar();
    const isMobile = computed(() => {
      return $q.screen.width < 800;
    });

    const drawer = ref(!isMobile.value);

    watch(isMobile, () => {
      drawer.value = !isMobile.value;
    })

    const toggleDrawer = () => {
      drawer.value = !drawer.value;
    }

    const um = UserManager.getInstance();
    const lm = LoginManager.getInstance();
    const router = useRouter();

    const currentUserRole = ref(false);

    onBeforeMount(async () => {
      currentUserRole.value = (await um.getUserInfo(Store.state.settings.currentUserUID)).val()._role;
    })

    const logout = () => {
      lm.logout();
      router.push('/auth/login');
    }

    return {
      drawer,
      toggleDrawer,
      logout,
      currentUserRole
    }
  },
}
</script>

<style scoped>
.q-item {
  min-height: 40px;
}
</style>