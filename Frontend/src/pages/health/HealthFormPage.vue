<template>
  <div> 
    <q-banner inline-actions class="text-white bg-secondary">
      <q-icon v-if="isMobile" size="sm" name="menu" @click="toggleDrawer"/>
      <b> {{ $t('PatientForm') }} </b> 
    </q-banner>
    
    <div class="row justify-center q-mt-lg">
      <health-form @submit="submit"/>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useQuasar } from 'quasar'
import HealthForm from '../../components/health/HealthForm.vue'
import HealthManager from '../../classes/HealthManager'
import { Store } from '../../store/index'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

export default {
  name: "HealthCenterPage",
  components: {
    HealthForm
  },
  setup(props, ctx) {
    const $q = useQuasar();
    const hm = HealthManager.getInstance();
    const router = useRouter();
    const { t } = useI18n({});

    const isMobile = computed(() => {
      return $q.screen.width < 800;
    });

    const open = ref(!isMobile.value);

    watch(isMobile, () => {
      open.value = !isMobile.value;
    })

    const hasReservation = ref(true);

    const toggleDrawer = () => {
      open.value = !open.value
      ctx.emit('toggleDrawer');
    }

    const submit = (selection) => {
      const UID = Store.state.settings.currentUserUID;
      hm.createHealthForm(UID, selection).then(() => {
        router.push('/~/health');
        $q.notify({
          position: 'top',
          message: t('HealthFormCreated'),
          color: 'positive',
        })
      });
    }

    return {
      toggleDrawer,
      isMobile,
      hasReservation,
      submit
    }
  },
}
</script>

<style lang="sass" scoped>
a
  text-decoration: none
</style>
