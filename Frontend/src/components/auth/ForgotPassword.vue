<template>
<div>
  <q-form style="width: 410px" class="q-py-md">
    <q-input 
      :label="$t('Email')" 
      v-model="mail"
      color="secondary"
      :rules="[val => !!val]"
    >
      <template v-slot:prepend> 
        <q-icon name="mdi-account" />
      </template>
    </q-input>  

    <q-btn 
      :label="$t('ResertPassword')" 
      color="secondary" 
      unelevated 
      no-caps
      align="center"
      style="width: 80%;"
      @click.prevent="reset(mail)"
    />

    <q-btn 
      :label="$t('Back')" 
      flat
      class="text-secondary"
      unelevated 
      no-caps
      align="center"
      style="width: 20%;"
      @click.prevent="goBack"
    />
  </q-form>
</div>
</template>

<script>
import { ref } from "vue"
import LoginManager from "../../classes/LoginManager"
import { useQuasar } from "quasar"
import { useI18n } from "vue-i18n"

export default {
  name: "ForgotPassword",

  setup(props, ctx) {
    const $q = useQuasar();
    const { t } = useI18n({});
    const lm = LoginManager.getInstance();

    const mail = ref('');
    
    const goBack = () => {
      ctx.emit('goBack');
    }

    const reset = async (email) => {
      lm.resetPassword(email).then((userCredential) => {
        $q.notify({
          position: 'top',
          message: t('PasswordResetSent'),
          color: 'positive'
        });
        goBack();

      }).catch((error) => {
        $q.notify({
          position: 'top',
          message: t("PasswordResetError"),
          color: 'negative'
        });
      });
    }

    return {
      mail,
      reset,
      goBack
    }
  },
}
</script>