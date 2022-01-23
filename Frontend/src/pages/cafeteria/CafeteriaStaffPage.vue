<template>
  <div>
    <food-distribution 
      :cardInfos="individualInfo"
      :regionInfo="regionalInfo"
      :menuInfo="menuBasedInfo"
    />

    <q-page-sticky position="bottom-left" :offset="fabPos" v-if="isMobile">
      <q-fab
        icon="mdi-chevron-right"
        active-icon="mdi-chevron-left"
        color="secondary"
        padding="10px"
        @click="toggleDrawer"
      >
      </q-fab>
    </q-page-sticky>
  </div>
</template>

<script>
import { computed, ref, watch, onBeforeMount } from 'vue'
import { useQuasar } from 'quasar'
import FoodDistribution from '../../components/cafeteria/FoodDistribution.vue'
import { useI18n } from 'vue-i18n' 
import CafeteriaManager from '../../classes/CafeteriaManager'
import UserManager from '../../classes/UserManager'

export default {
  name: "CafeteriaStaffPage",
  components: {
    FoodDistribution
  },
  setup(props, ctx) {
    const $q = useQuasar();
    const { t } = useI18n({});
    const cm = CafeteriaManager.getInstance();
    const um = UserManager.getInstance();

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

    const fabPos = ref([ 18, 18 ]);
    const menuBasedInfo = ref(null);
    const regionalInfo = ref(null);
    const individualInfo = ref(null);

    const initializeMealDistributionInfos = async () => {
      cm.calculateTotalOrder().then((data) => {
        initializeMenuBased(data);
        initializeRegional(data);
      });

      const reservations = await cm.getAllMealOrders();
      individualInfo.value = [];

      if (reservations) {
        for (let key of Object.keys(reservations)) {
          const UID = reservations[key]._ownerUID;
          const user = (await um.getUserInfo(UID)).val();
          const reserv = {
            url: user._profilePic,
            data: [
              user._name,
              user?._ID,
              reservations[key]._place + " - " + reservations[key]._type,
              reservations[key]._date + " - " + reservations[key]._time
            ],
            uniqueId: reservations[key]._OID,
            owner: reservations[key]._ownerUID 
          }

          individualInfo.value.push(reserv);
        }
      }
    }

    const initializeMenuBased = (data) => {
      const normal = data.normal.type90 + data.normal.type78 + data.normal.type51;
      const vegetarian = data.vegetarian.type90 + data.vegetarian.type78 + data.vegetarian.type51;
      const vegan = data.vegan.type90 + data.vegan.type78 + data.vegan.type51;

      menuBasedInfo.value = [
        {
          label: t('Normal'),
          data: normal
        },
        {
          label: t('Vegetarian'),
          data: vegetarian
        },
        {
          label: t('Vegan'),
          data: vegan
        }
      ];
    }

    const initializeRegional = (data) => {
      regionalInfo.value = [
        {
          name: t('DORM51'),
          data: [
            {
              label: t('Normal'),
              data: data.normal.type51
            },
            {
              label: t('Vegetarian'),
              data: data.vegetarian.type51
            },
            {
              label: t('Vegan'),
              data: data.vegan.type51
            }
          ]
        },
        {
          name: t('DORM78'),
          data: [
            {
              label: t('Normal'),
              data: data.normal.type78
            },
            {
              label: t('Vegetarian'),
              data: data.vegetarian.type78
            },
            {
              label: t('Vegan'),
              data: data.vegan.type78
            }
          ]
        },
        {
          name: t('DORM90'),
          data: [
            {
              label: t('Normal'),
              data: data.normal.type90
            },
            {
              label: t('Vegetarian'),
              data: data.vegetarian.type90
            },
            {
              label: t('Vegan'),
              data: data.vegan.type90
            }
          ]
        }
      ]
    }

    onBeforeMount(async () => {
      await initializeMealDistributionInfos();
    })

    return {
      toggleDrawer,
      isMobile,
      fabPos,
      menuBasedInfo,
      regionalInfo,
      individualInfo
    }
  },
}
</script>
