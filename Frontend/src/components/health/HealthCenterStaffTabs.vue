<template>
<div class="text-white">
  <q-layout view="lHh lpr lFf" container style="height: 100vh" class="shadow-2 rounded-borders">
    <q-header>
      <q-tabs
        v-model="tab"
        dense
        class="bg-grey-3 text-secondary"
        active-color="secondary"
        indicator-color="secondary"
        align="justify"
      >
        <q-tab name="newHealthForms" :label="$t('NewHealthForms')">
          <q-badge 
            v-if="healthForms?.length !== 0" 
            floating 
            rounded 
            color="red" 
            :label="newFormsCount" 
          />
        </q-tab>
        <q-tab name="ongoingChats" :label="$t('OngoingChats')">
          <q-badge 
            v-if="ongoingHealthForms?.length !== 0" 
            floating 
            rounded 
            color="red" 
            :label="ongoingChatsCount" 
          />
        </q-tab>
        <q-tab name="emergency" :label="$t('Emergency')">
          <q-badge 
            v-if="emergencyInfos?.length !== 0"
            floating 
            rounded 
            color="red" 
            :label="emergencyCount" 
          />
        </q-tab>
      </q-tabs>
    </q-header>

    <q-page-container>
      <q-page class="row">
        <q-tab-panels v-model="tab" swipeable animated style="width: 100%">
          <q-tab-panel name="newHealthForms" class="row justify-center text-black">
            <div class="full-width">
              <q-input
                v-model="searchForm"
                debounce="700"
                filled
                :placeholder="$t('Search')"
                color="secondary"
                class="full-width"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>

              <q-scroll-area class="full-width q-mt-md" style="height: 500px" >
                <div class="column q-gutter-y-md full-width items-center">
                  <generic-user-card 
                    v-for="info in filteredHealthForms" 
                    :key="info"  
                    :cardInfo="info"
                    :hasFirstIcon="true"
                    firstIcon="mdi-file-document"
                    firstIconColor="indigo-6"
                    :firstIconTooltip="$t('SeeHealthForm')"
                    class="text-black"
                    @firstClicked="showFormForNew"
                  />
                </div>
                <div v-if="noNewHealthForm" class="row justify-center q-mt-lg">
                  <q-card outlined style="width: 50%;" class="q-pa-lg">
                      <div class="text-secondary text-weight-bold">
                        {{ $t("NoNewHealthForm") }}
                      </div>
                  </q-card>
                </div>
              </q-scroll-area>
            </div>
          </q-tab-panel>

          <q-tab-panel name="ongoingChats" class="row justify-center text-black">
            <div class="row justify-center full-width">
              <q-input
                v-model="searchChat"
                debounce="700"
                filled
                :placeholder="$t('Search')"
                color="secondary"
                class="full-width"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>

              <q-scroll-area class="full-width q-mt-md" style="height: 500px" >
                <div class="column q-gutter-y-md full-width items-center">
                  <generic-user-card 
                    v-for="info in filteredChats" 
                    :key="info"  
                    :cardInfo="info"
                    :hasFirstIcon="true"
                    firstIcon="mdi-forum-outline"
                    :firstIconTooltip="$t('SeeChat')"
                    firstIconColor="positive"
                    :hasSecondIcon="true"
                    secondIcon="mdi-file-document"
                    secondIconColor="indigo-6"
                    :secondIconTooltip="$t('SeeHealthForm')"
                    class="text-black"
                    @firstClicked="goToChat"
                    @secondClicked="showFormForOngoing"
                  />
                </div>
                <div v-if="noOngoingChats" class="row justify-center q-mt-lg">
                  <q-card outlined style="width: 50%;" class="q-pa-lg">
                      <div class="text-secondary text-weight-bold">
                        {{ $t("NoNewHealthForm") }}
                      </div>
                  </q-card>
                </div>
              </q-scroll-area>
            </div>
          </q-tab-panel>

          <q-tab-panel name="emergency" class="row justify-center text-black">
            <div class="full-width">
              <q-scroll-area class="full-width q-mt-md" style="height: 550px" >
                <div class="column q-gutter-y-md full-width items-center">
                  <generic-user-card 
                    v-for="info in emergencyInfos" 
                    :key="info"  
                    :cardInfo="info"
                    :hasDismiss="true"
                    @dismiss="dismiss"
                  />
                </div>
                <div v-if="noEmergency" class="row justify-center q-mt-lg">
                  <q-card outlined style="width: 50%;" class="q-pa-lg">
                      <div class="text-secondary text-weight-bold">
                        {{ $t("NoEmergency") }}
                      </div>
                  </q-card>
                </div>
              </q-scroll-area>
            </div>
          </q-tab-panel>

        </q-tab-panels>
      </q-page>
    </q-page-container>
  </q-layout>

  <!-- Popup for the HealthFormStaffView -->
  <q-dialog v-model="showHealthForm">
    <q-card>
      <q-card-section class="col items-center">
        <health-form-staff-view 
          :person="clickedPerson" 
          :symptoms="clickedSymptoms"
          @startChat="startChat"
          :hasButton="haveStartChatButton"
        />
      </q-card-section>
    </q-card>
  </q-dialog>

</div>
</template>

<script>
import { ref, computed } from 'vue'
import GenericUserCard from '../generic/GenericUserCard.vue'
import HealthFormStaffView from '../health/HealthFormStaffView.vue'

export default {
  name: 'HealthCenterStaffTabs',
  components: {
    GenericUserCard,
    HealthFormStaffView
  },
  props: ['emergencyInfos', 'healthForms', 'ongoingHealthForms'],

  setup(props, ctx) {
    const tab = ref('newHealthForms');
    const searchForm = ref(null);
    const searchChat = ref(null);

    const showHealthForm = ref(false);
    const haveStartChatButton = ref(true);
    const clickedPerson = ref(null);
    const clickedSymptoms = ref(null);
    
    const noNewHealthForm = computed(() => {
      return props.healthForms?.length === 0;
    })

    const noOngoingChats = computed(() => {
      return props.ongoingHealthForms?.length === 0;
    })

    const noEmergency = computed(() => {
      return props.emergencyInfos?.length === 0;
    })

    const newFormsCount = computed(() => {
      return props.healthForms?.length;
    })

    const ongoingChatsCount = computed(() => {
      return props.ongoingHealthForms?.length;
    })

    const emergencyCount = computed(() => {
      return props.emergencyInfos?.length;
    })

    const dismiss = (data) => {
      ctx.emit('dismiss', data.uniqueID);
    }

    const showFormForNew = (data) => {
      haveStartChatButton.value = true;
      showHealthForm.value = true;

      clickedPerson.value = {
        name: data.data[0],
        ID: data.data[1],
        profilePic: data.url,
        UID: data.UID,
        OID: data.uniqueID
      };
      clickedSymptoms.value = data.symptoms;
    }

    const showFormForOngoing = (data) => {
      haveStartChatButton.value = false;
      showHealthForm.value = true;

      clickedPerson.value = {
        name: data.data[0],
        ID: data.data[1],
        profilePic: data.url,
        UID: data.UID,
        OID: data.uniqueID
      };
      clickedSymptoms.value = data.symptoms;
    }

    const startChat = (data) => {
      ctx.emit('startChat', data);
    }

    const goToChat = (data) => {
      ctx.emit('goToChat', data);
    }

    const filteredHealthForms = computed(() => {
      const filtered = props.healthForms;
      if (searchForm.value) {
        return filtered?.filter((element) => {
          return element.data[0].toLowerCase().includes(searchForm.value.toLowerCase());
        });
      }
      return filtered;
    });

    const filteredChats = computed(() => {
      const filtered = props.ongoingHealthForms;

      if (searchChat.value) {
        return filtered?.filter((element) => {
          return element.data[0].toLowerCase().includes(searchChat.value.toLowerCase());
        });
      }
      return filtered;
    })

    return {
      tab,
      searchForm,
      searchChat,
      showHealthForm,
      showFormForNew,
      showFormForOngoing,
      dismiss,
      clickedPerson,
      clickedSymptoms,
      startChat,
      goToChat,
      haveStartChatButton,
      filteredHealthForms,
      filteredChats,
      noNewHealthForm,
      noOngoingChats,
      noEmergency,
      emergencyCount,
      ongoingChatsCount,
      newFormsCount
    } 
  },
}
</script>

<style lang="sass" scoped>
.q-badge
  top: 3px
  right: -20px
</style>