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
        <q-tab name="newHealthForms" :label="$t('NewHealthForms')" />
        <q-tab name="ongoingChats" :label="$t('OngoingChats')" />
        <q-tab name="emergency" :label="$t('Emergency')">
          <q-badge floating rounded color="red" :label="ambulanceFormCount" />
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
                debounce="1000"
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
                    v-for="info in healthForms" 
                    :key="info"  
                    :cardInfo="info"
                    firstIcon="mdi-file-document"
                    firstIconColor="indigo-6"
                    :firstIconTooltip="$t('SeeHealthForm')"
                    class="text-black"
                    @firstClicked="showForm"
                  />
                </div>
              </q-scroll-area>
            </div>
          </q-tab-panel>

          <q-tab-panel name="ongoingChats" class="row justify-center text-black">
            <div class="row justify-center full-width">
              <q-input
                v-model="searchChat"
                debounce="1000"
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
                    v-for="info in cardInfos" 
                    :key="info"  
                    :cardInfo="info"
                    firstIcon="mdi-forum-outline"
                    :firstIconTooltip="$t('SeeChat')"
                    firstIconColor="positive"
                    :hasSecondIcon="true"
                    secondIcon="mdi-file-document"
                    secondIconColor="indigo-6"
                    :secondIconTooltip="$t('SeeHealthForm')"
                    class="text-black"
                    @secondClicked="showForm"
                  />
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
                    firstIcon="mdi-close-circle-outline"
                    firstIconColor="negative"
                    :firstIconTooltip="$t('Dismiss')"
                    @firstClicked="dismiss"
                  />
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
        />
      </q-card-section>
    </q-card>
  </q-dialog>

</div>
</template>

<script>
import { ref } from 'vue'
import GenericUserCard from '../generic/GenericUserCard.vue'
import HealthFormStaffView from '../health/HealthFormStaffView.vue'

export default {
  name: 'HealthCenterStaffTabs',
  components: {
    GenericUserCard,
    HealthFormStaffView
  },
  props: ['cardInfos', 'emergencyInfos', 'ambulanceFormCount', 'healthForms'],

  setup(props, ctx) {
    const tab = ref('newHealthForms');
    const searchForm = ref(null);
    const searchChat = ref(null);

    const showHealthForm = ref(false);
    const clickedPerson = ref(null);
    const clickedSymptoms = ref(null);

    const dismiss = (data) => {
      ctx.emit('dismiss', data.uniqueID);
    }

    const showForm = (data) => {
      showHealthForm.value = true;

      clickedPerson.value = {
        name: data.data[0],
        ID: data.data[1],
        profilePic: data.url
      };
      clickedSymptoms.value = data.symptoms;
    }

    return {
      tab,
      searchForm,
      searchChat,
      showHealthForm,
      showForm,
      dismiss,
      clickedPerson,
      clickedSymptoms
    } 
  },
}
</script>

<style lang="sass" scoped>
.q-badge
  top: 3px
  right: -20px
</style>