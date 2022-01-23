<template>
<div class="row justify-center bordered">
  <div class="column q-py-md">
    <div class="text-secondary q-ml-sm">
      <b> {{ $t('SelectTheSymptoms') }} </b>
    </div>
    <q-option-group 
      :options="symptoms"
      type="checkbox"
      v-model="selection"
      color="secondary"
    />

    <q-btn 
      color="secondary" 
      :label="$t('Submit')" 
      style="width: 50%" 
      class="q-mt-md q-ml-sm"
      @click="submit"
    />
  </div>
</div>
</template>

<script>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export default {
  name: "HealtForm",
  setup(props, ctx) {
    const { t } = useI18n({});   

    const selection = ref([]);
    const symptoms = [
      {
        label: t('Fever'),
        value: 'fever'
      }, 
      {
        label: t('Cough'),
        value: 'cough'
      }, 
      {
        label: t('Tiredness'),
        value: 'tiredness'
      }, 
      {
        label: t('LossOfTaste'),
        value: 'lossOfTaste'
      }, 
      {
        label: t('SoreThroat'),
        value: 'soreThroat'
      }, 
      {
        label: t('Headache'),
        value: 'headache'
      }, 
      {
        label: t('Diarrhea'),
        value: 'diarrhea'
      },
      {
        label: t('DifficultyBreathing'),
        value: 'difficultyBreathing'
      },
      {
        label: t('LossOfSpeech'),
        value: 'lossOfSpeech'
      },
      {
        label: t('ChestPain'),
        value: 'chestPain'
      },
    ];

    const submit = async () => {
      ctx.emit('submit', selection.value);
    }

    return {
      selection,
      symptoms,
      submit
    }
  },
}
</script>

<style scoped>
.bordered { 
  border: 1px solid rgb(192, 192, 192);
  width: 420px;
  border-radius: 5px;
}
</style>