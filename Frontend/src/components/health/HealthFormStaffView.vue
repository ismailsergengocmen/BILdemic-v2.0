<template>
  <div class="column q-pa-sm" style="width: 400px;">
    <div class="column items-center">
      <q-img :src="person?.profilePic" style="width: 120px"/>
      <div class="q-ma-md">
        <div> {{ person?.name }} </div>
        <div> {{ person?.ID }} </div>
      </div>
    </div>

    <q-list dense>
      <q-item clickable>
        <q-item-section>
          <b> {{ $t('Symptoms') }} </b>
        </q-item-section>
      </q-item>
      <q-item clickable v-for="symptom in symptoms" :key="symptom">
        <q-item-section side>
          <q-icon name="mdi-circle-small"/>
        </q-item-section>
        
        <q-item-section>
          {{ $t(capitalizedSymptom(symptom)) }}
        </q-item-section>
      </q-item>
    </q-list>

    <q-btn 
      v-if="hasButton"
      color="secondary" 
      class="q-ma-md"
      style="width: 50%"
      :label="$t('StartChat')" 
      @click="startChat" />
  </div>
</template>

<script>
export default {
  name: "HealthFormStaffView",
  props: ['person', 'symptoms', 'hasButton'],

  setup(props, ctx) {
    const capitalizedSymptom = (symptom) => {
      return symptom.charAt(0).toUpperCase() + symptom.slice(1); 
    }

    const startChat = () => {
      ctx.emit('startChat', {
        UID: props.person.UID,
        OID: props.person.OID
      });
    }

    return {
      capitalizedSymptom,
      startChat
    }
  },
}
</script>
