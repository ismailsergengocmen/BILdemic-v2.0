<template>
  <q-layout view="hHh Lpr lff" class="shadow-2 rounded-borders">
      <q-drawer
        v-model="drawer"
        :width="200"
        bordered
        behavior="desktop"
      >
        <div class="absolute-top column justify-center items-center" style="height: 240px">
          <router-link to="/home">
            <q-img 
              width="170px"
              src="../assets/logo_bildemic.png" 
              class="q-mt-md"
            />
          </router-link>

          <q-avatar size="90px" class="q-mb-sm bg-white">
            <img :src="currentUser?._profilePic" size="100px">
          </q-avatar>
          <div class="text-weight-bold text-black"> {{ currentUser?._name }} </div>
          <div class="text-weight-bold text-black"> {{ currentUser?._ID }} </div>
          <div class="text-weight-bold text-black">HES: {{ currentUser?._hesObject._hesCode }}</div>
        </div>

        <div style="height: calc(100% - 240px); margin-top: 240px;">
          <q-list class="fixed-bottom q-mb-sm">
            <q-item clickable v-ripple to="/~/profile">
              <q-item-section class="q-ml-sm">
                {{ $t('ProfileSettings') }}
              </q-item-section>
            </q-item>

            <q-item clickable v-ripple @click="logoutUser">
              <q-item-section class="q-ml-sm">
                {{ $t('LogOut') }}
              </q-item-section>
            </q-item>
          </q-list>
        </div>
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
import { useRouter } from 'vue-router'
import UserManager from '../classes/UserManager'
import { Store } from '../store/index'

export default {
  name: 'BaseLayoutPhoto',

  setup() {
    const $q = useQuasar();
    const isMobile = computed(() => {
      return $q.screen.width < 800;
    });

    const drawer = ref(!isMobile.value);
    const router = useRouter();
    const lm = LoginManager.getInstance();
    const um = UserManager.getInstance();

    const currentUser = ref(null);

    onBeforeMount(async () => {
      um.getUserInfo(Store.state.settings.currentUserUID).then((val) => {
        currentUser.value = val.val();
      })
    })

    watch(isMobile, () => {
      drawer.value = !isMobile.value;
    })

    const toggleDrawer = () => {
      drawer.value = !drawer.value
    }
    
    const logoutUser = () => {
      lm.logout();
      router.push('/auth/login');
    }

    return {
      drawer,
      toggleDrawer,
      logoutUser,
      currentUser
    }
  },
}
</script>

<style scoped>
.q-item {
  min-height: 40px;
}
</style>