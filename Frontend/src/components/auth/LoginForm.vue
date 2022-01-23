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
    
    <q-input
      :type="show ? '' : 'password'"
      :label="$t('Password')" 
      v-model="password" 
      color="secondary"
      :rules="[val => !!val]"
      > 
      <template v-slot:prepend> 
        <q-icon name="mdi-lock"/>
      </template>

      <template v-slot:append>
        <q-icon
          v-if="password.length > 0"
          :name="show ? 'visibility' : 'visibility_off'"
          class="cursor-pointer"
          @click="show = !show"
          >
        </q-icon>
      </template>
    </q-input>

    <q-btn 
      :label="$t('SignInUpperCase')" 
      color="secondary" 
      unelevated 
      no-caps
      align="center"
      style="width: 80%;"
      @click.prevent="signIn(mail, password)"
    />

    <q-btn 
      :label="`${$t('ForgotPassword')}?`" 
      color="secondary" 
      flat 
      align="center"
      style="width: 20%;"
      no-caps
      @click="forgot"
    />

  </q-form>
</div>
</template>

<script>
import { ref } from "vue"
import { useRouter } from "vue-router"
import { useStore } from 'vuex'
import LoginManager from "../../classes/LoginManager"
import UserManager from "../../classes/UserManager"
import { useQuasar } from "quasar"
import { useI18n } from "vue-i18n"

export default {
  name: "LoginForm",

  setup(props, ctx) {
    const $q = useQuasar();
    const router = useRouter();
    const $store = useStore();
    const { t } = useI18n({});
    const lm = LoginManager.getInstance();
    const um = UserManager.getInstance();

    const mail = ref('');
    const password = ref('');
    const show = ref(false);

    const forgot = () => {
      ctx.emit('forgot');
    }

    const signIn = async (email, password) => { 
      lm.signIn(email, password).then(async (userCredential) => {
        if (!userCredential.user.emailVerified) {
          await lm.logout();
          
          $q.notify({
            position: 'top',
            message: t('NotVerifiedError'),
            color: 'negative'
          });
        }
        else {
          const UID = userCredential.user.uid;
          const role = (await um.getUserInfo(UID)).val()._role;
          $store.commit('settings/setCurrentUserRole', role);
          $store.commit('settings/setCurrentUserUID', UID);
          router.push('/home');
        }  
      }).catch((error) => {
        // mail.value = '';
        // password.value = '';

        $q.notify({
          position: 'top',
          message: t("IncorrectPassword"),
          color: 'negative'
        });
      });
    }

    return {
      mail,
      password,
      show,
      signIn,
      forgot
    }
  },
}
</script>