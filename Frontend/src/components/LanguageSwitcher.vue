<template>
<div>
  <q-select
    v-model="locale"
    :options="options"
    dense
    outlined
    emit-value
    map-options
    options-dense
    color="secondary"
    style="width:90px"
  > 
    <template v-slot:option="scope">
      <q-item v-bind="scope.itemProps">
        <q-item-section>
          <q-img v-if="scope.opt.label == 'EN'" 
            src="~assets/flag_en.png" 
            style="width: 32px" 
            class="q-mr-xl"/>

            <q-img v-else 
            src="~assets/flag_tr.png" 
            style="width: 32px" 
            class="q-mr-md"/>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>

    <template v-slot:selected>
      <q-img v-if="locale == 'tr'" src="~assets/flag_tr.png" />
      <q-img v-else src="~assets/flag_en.png" />
    </template>
  </q-select>

</div>
</template>

<script>
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'
import { computed, watch } from 'vue'

export default {
  name: "LanguageSwitcher",

  setup () {
    const { locale } = useI18n({ useScope: 'global' });
    const $store = useStore();

    watch(locale, (newLang) => {
      $store.commit('settings/setLanguage',newLang);
      localStorage.setItem('language', newLang);
    })

    const flag = computed(() => {
      return locale.value === 'tr' ? '~assets/flag_tr.png' : '~assets/flag_en.png';
    })

    return {
      locale,
      options: [
        { value: 'en-US', label: 'EN'},
        { value: 'tr', label: 'TR'}
      ],
      flag
    }
  }
}
</script>