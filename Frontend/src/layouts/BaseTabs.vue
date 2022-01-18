<template>
<div>
  <div class="absolute-top column items-center" active-class="bg-teal-2">
    <router-link to="/home">
      <q-img 
        width="170px"
        src="../assets/logo_bildemic.png" 
        class="q-mt-md" 
      /> 
    </router-link> 
  </div>

  <div style="height: calc(100% - 100px); margin-top: 100px">

  <q-list class="q-py-none">
    <div>
      <q-item v-if="roleCheck('courses')" clickable v-ripple active-class="bg-teal-2" :active="listItemActiveStatus('course')">
        <q-item-section class="q-ml-sm">
          <router-link :to="calculateRoute('courses')">
            {{ $t('Courses') }}
          </router-link>
        </q-item-section>
      </q-item>
  
      <q-item v-if="roleCheck('diagnovir')" clickable v-ripple active-class="bg-teal-2" :active="listItemActiveStatus('diagnovir')">
        <q-item-section class="q-ml-sm">
          <router-link :to="calculateRoute('diagnovir')">
            {{ $t('DiagnovirCenter') }}
          </router-link>
        </q-item-section>
      </q-item>
  
      <q-item v-if="roleCheck('health')" clickable v-ripple active-class="bg-teal-2" :active="listItemActiveStatus('health')">
        <q-item-section class="q-ml-sm">
          <router-link :to="calculateRoute('health')">
            {{ $t('HealthCenter') }}
          </router-link>
        </q-item-section>
      </q-item>
  
      <q-item v-if="roleCheck('sports')" clickable v-ripple active-class="bg-teal-2" :active="listItemActiveStatus('sport')">
        <q-item-section class="q-ml-sm">
          <router-link :to="calculateRoute('sports')">
            {{ $t('SportsCenter') }}
          </router-link>
        </q-item-section>
      </q-item>
  
      <q-item v-if="roleCheck('cafeteria')" clickable v-ripple active-class="bg-teal-2" :active="listItemActiveStatus('cafeteria')">
        <q-item-section class="q-ml-sm">
          <router-link  :to="calculateRoute('cafeteria')">
            {{ $t('Cafeteria') }}
          </router-link>
        </q-item-section>
      </q-item>
  
      <q-item clickable v-ripple to="/~/weekly" active-class="bg-teal-2">
        <q-item-section class="q-ml-sm">
          {{ $t('WeeklyReport') }}
        </q-item-section>
      </q-item>
    </div>

    <div class="fixed-bottom q-mb-sm">
      <q-item clickable v-ripple style="min-height: 35px;" to="/~/profile" active-class="bg-teal-2">
        <q-item-section class="q-ml-sm">
          {{ $t('ProfileSettings') }}
        </q-item-section>
      </q-item>

      <q-item clickable v-ripple style="min-height: 35px;" @click="logout">
        <q-item-section class="q-ml-sm">
          {{ $t('LogOut') }}
        </q-item-section>
      </q-item>
    </div>
  </q-list>
  </div>
</div>
</template>

<script>
import { useRouter } from "vue-router"

export default {
  name: 'BaseTabs',
  props: ['role'],
  setup(props, ctx) {

    const router = useRouter();

    const roleCheck = (where) => {
      if (where === 'courses') {
        return props.role === 'Student' || props.role === 'Instructor'; 
      }
      else if (where === 'diagnovir') {
        return props.role === 'Student' || props.role === 'Instructor' || props.role === 'SportsCenterStaff' || props.role === 'CafeteriaStaff' || props.role === 'DiagnovirTester';
      }
      else if (where === 'health') {
        return props.role === 'Student' || props.role === 'Instructor' || props.role === 'SportsCenterStaff' || props.role === 'CafeteriaStaff' || props.role === 'HealthCenterStaff';
      }
      else if (where === 'sports') {
        return props.role === 'Student' || props.role == 'SportsCenterStaff';
      }
      else if (where === 'cafeteria') {
        return props.role === 'Student' || props.role === 'Instructor'|| props.role === 'CafeteriaStaff' ;
      }
    }

    const calculateRoute = (where) => {
      if (where === 'courses') {
        return props.role === 'Student' ? '/~/courses' : '/staff/courses'; 
      }
      else if (where === 'diagnovir') {
        return props.role === 'DiagnovirTester' ? '/staff/diagnovir' : '/~/diagnovir';
      }
      else if (where === 'health') {
        return props.role === 'HealthCenterStaff' ? '/staff/health' : '/~/health';
      }
      else if (where === 'sports') {
        return props.role == 'SportsCenterStaff' ? '/staff/sports' : '/~/sports';
      }
      else if (where === 'cafeteria') {
        return props.role === 'CafeteriaStaff' ? '/staff/cafeteria' : '/~/cafeteria';
      }
    }

    const listItemActiveStatus = (where) => {
      const routeName = router.currentRoute.value.name.toString().toLowerCase();
      return routeName.includes(where);
    }

    const logout = () => {
      ctx.emit('logout');
    }

    return {
      logout,
      roleCheck,
      calculateRoute,
      listItemActiveStatus
    }
  },
}
</script>

<style scoped>
a {
  text-decoration: none;
  color: black;
}
</style>