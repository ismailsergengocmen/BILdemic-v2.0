<template>
<div class="full-width column items-center">
  <q-form :class="`${formStyling} greedy`" :style="isMobile ? 'width: 90%' : 'width: 60%'">
    <div class="column q-gutter-y-sm">
      <div class="row q-gutter-x-md">
        <q-input 
          :label="$t('FullName')" 
          filled
          square
          v-model="name"
          class="col-8"
          color="secondary"
          :disable="loading"
          :rules="[ val => !!val]"
        />

        <q-select
          :label="$t('Role')" 
          filled
          square
          v-model="role"
          class="col"
          color="secondary"
          :options="roleOptions"
          :disable="loading"
          :rules="[ val => !!val]"
        />
      </div>

      <div class="row q-gutter-x-md">
        <q-input 
          :label="$t('Email')" 
          class="col"
          filled
          square
          type="email"
          v-model="mail"
          color="secondary"
          :disable="loading"
          lazy-rules
          :rules="[emailRuleValidity, emailRuleSchool]"
        />

        <q-input 
          v-if="role === 'Student' || role === 'Instructor'"
          :label="$t('ID')" 
          class="col-3"
          filled
          square
          v-model="id"
          color="secondary"
          :disable="loading"
          :rules="[ val => !!val]"
        />
      </div>

      <div class="row q-gutter-x-md">
        <q-input 
          :label="$t('Phone')" 
          class="col"
          filled
          square
          v-model="phone"
          color="secondary"
          :disable="loading"
          mask="(###) ### - ####"
          unmasked-value
          fill-mask
          lazy-rules
          :rules="[ val => !!val && val.length == 10]"
        />

        <q-input 
          :label="$t('HESCode')" 
          class="col"
          filled
          square
          v-model="hes"
          color="secondary"
          :disable="loading"
          mask="XXXX-XXXX-XX"
          unmasked-value
          fill-mask
          lazy-rules
          :rules="[ val => val && val.length == 10 || $t('HesCodeDigitError')]"
        />
      </div>

      <div class="row q-gutter-x-md" v-if="role == 'Student'">
        <q-checkbox
          class="bg-grey-2 text-grey-8 q-pa-sm q-mb-lg text-body2 col-5"
          :label="$t('ResideInDorm')"
          color="secondary"
          keep-color
          v-model="resideInDorm"
          :disable="loading"
        />

        <q-select
          :disable="!resideInDorm || loading"
          :label="$t('DormNumber')" 
          filled
          square
          v-model="dorm"
          class="col"
          color="secondary"
          :options="dormOptions" 
          :rules="[ val => !!val]"
        />

        <q-input 
          :disable="!resideInDorm || loading"
          :label="$t('DormRoomNo')" 
          filled
          square
          v-model="dormRoomNo"
          class="col"
          color="secondary"
          :rules="[ val => !!val]"
        />
      </div>
    
      <q-input
        :label="$t('Password')" 
        filled
        square
        :type="show ? 'text' : 'password'"
        color="secondary"
        v-model="password"
        :disable="loading"
        lazy-rules
        :rules="[ val => val && val.length >= 8 || $t('ShortPasswordError')]"
      >
        <template v-slot:append>
          <q-icon
            :name="show ? 'visibility' : 'visibility_off'"
            class="cursor-pointer"
            @click="show = !show"
            >
          </q-icon>
        </template>
      </q-input>
    </div>

    <q-btn 
      :label="$t('CreateAccount')" 
      color="secondary" 
      unelevated 
      align="center"
      class="q-mt-sm"
      :style="isMobile ? 'width: 50%' : 'width: 30%'"
      @click.prevent="register(name, mail, password, role, dorm, phone, hes, id, resideInDorm, dormRoomNo)"
      :disable="loading"
    />
  </q-form>
</div>
</template>

<script>
import { ref, computed } from "vue"
import LoginManager from "../../classes/LoginManager"
import { useRouter } from 'vue-router'
import { useI18n } from "vue-i18n"
import { useQuasar } from "quasar"

export default {
  name: "RegisterForm",
  props: {
    isMobile: Boolean
  },
  setup(props) {
    const router = useRouter();
    const { t } = useI18n({})
    const $q = useQuasar();
    const lm = LoginManager.getInstance();

    const name = ref(null);
    const role = ref(null);
    const id = ref(null);
    const mail = ref(null);
    const phone = ref(null);
    const hes = ref(null);
    const resideInDorm = ref(false);
    const dorm = ref(null);
    const dormRoomNo = ref(null);
    const password = ref(null);
    const show = ref(false);
    const loading = ref(false);
    
    const roleOptions = [
        'Student', 'Instructor', 'DiagnovirTester', 'CafeteriaStaff', 'SportsCenterStaff', 'HealthCenterStaff'
    ];

    const emailRuleSchool = (val) => {
      if (role.value == "Student") {
        return val.includes('\@ug.bilkent.edu.tr') || t('UseUniversityMailError1');
      }
      else if (role.value == "Instructor") {
        return val.includes('\@fen.bilkent.edu.tr') 
              || val.includes('\@cs.bilkent.edu.tr')
              || val.includes('\@bilkent.edu.tr') 
              || val.includes('\@ee.bilkent.edu.tr')
              || t('UseUniversityMailError2');
      }
      else {
        return val.includes('\@bilkent.edu.tr') || t('UseUniversityMailError2');
      } 
    }

    const emailRuleValidity = (val) => {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/;
      return emailPattern.test(val) || t('InvalidMail');
    }

    const dormOptions = [
      50, 51, 52, 54, 55, 60, 61, 62, 63, 64, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 81, 82, 90, 91, 92, 93
    ];

    const formStyling = computed(() => {
      return props.isMobile ? "q-gutter-md" : "q-pa-md q-gutter-md";
    })

    const register = async (name, mail, password, role, dormNo, phone, hes, id, resideInDorm, dormRoomNo) => {
      if (inputValidity(name, mail, password, role, dormNo, phone, hes, id, resideInDorm, dormRoomNo)) {
        lm.createUser(name, mail, password, role, dormNo, phone, hes, id, resideInDorm, dormRoomNo).then(() => {
          loading.value = true;
          $q.notify({
            position: 'top',
            color: 'positive',
            message: t('RegisterDone')
          });
          router.push('/auth/login');
        })
        .catch((error) => {
          console.log(error)
        })
      }
      else {
        $q.notify({
          position: 'top',
          color: 'negative',
          message: t('EmptySlotsError') 
        });
      }  
    }

    const inputValidity = (name, mail, password, role, dormNo, phone, hes, id, resideInDorm, dormRoomNo) => {
      if (!name || !mail || !password || !role || !phone || !hes) {
        return false;
      }
      else if ((role === "Student" && id === null) || (role === "Instructor" && id === null)) {
        return false;
      }
      else if (password.length < 8 || hes.length != 10 || phone.length != 10) {
        return false;
      }
      else if (resideInDorm && (dormNo === null || dormRoomNo === null || dormRoomNo === '')) {
        return false;
      }
      else if (role === "Student") {
        return mail.includes('\@ug.bilkent.edu.tr');
      }
      else if (role === "Instructor") {
        return (mail.includes('\@fen.bilkent.edu.tr') 
                || mail.includes('\@cs.bilkent.edu.tr')
                || mail.includes('\@bilkent.edu.tr') 
                || mail.includes('\@ee.bilkent.edu.tr'));
      }
      else {
        return mail.includes('\@bilkent.edu.tr');
      } 
    }
    
    return {
      formStyling,
      name,
      role,
      id,
      mail,
      hes,
      phone,
      password,
      show,
      resideInDorm,
      roleOptions,
      dorm,
      dormRoomNo,
      dormOptions,
      emailRuleSchool,
      emailRuleValidity,
      register,
      loading
    }
  },
}
</script>