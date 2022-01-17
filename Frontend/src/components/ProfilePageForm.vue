<template>
  <div>
    <div class="column q-gutter-y-md">
      <q-field 
        outlined 
        :label="$t('FullName')" 
        stack-label 
        class="col" 
        dense 
        color="secondary"
      >
        <template v-slot:control>
          <div class="self-center full-width no-outline"> 
            {{ name }} 
          </div>
        </template>
      </q-field>

      <q-field 
        outlined 
        :label="$t('Email')" 
        stack-label 
        class="col" 
        dense 
        color="secondary"
      >
        <template v-slot:control>
          <div class="self-center full-width no-outline"> 
            {{ mail }} 
          </div>
        </template>
      </q-field>

      <q-field 
        v-if="role === 'Student' || role === 'Instructor'"
        outlined 
        :label="$t('ID')" 
        stack-label 
        class="col" 
        dense 
        color="secondary"
      >
        <template v-slot:control>
          <div class="self-center full-width no-outline"> 
            {{ id }} 
          </div>
        </template>
      </q-field>

      <q-input 
        class="col" 
        outlined 
        dense 
        :label="$t('Phone')"
        v-model="phone"
        color="secondary"
      />

      <q-input 
        v-if="role === 'Student'"
        class="col" 
        outlined 
        dense 
        :label="$t('Address')"
        v-model="address"
        color="secondary"
      />

      <q-input 
        class="col q-pb-sm" 
        outlined 
        dense 
        :label="$t('HESCode')"
        v-model="hesCode"
        color="secondary"
        :rules="[ val => val && val.length == 10 || $t('HesCodeDigitError')]"
      />
    </div>

    <q-btn 
      class="q-mt-sm"
      :label="`${$t('ChangePasswordClick')}`" 
      color="secondary" 
      flat
      dense
      align="left"
      no-caps
      @click="showPopup = true"
    />
  
  
    <div class="row justify-end">
      <q-btn 
        :label="`${$t('Save')}`" 
        color="secondary" 
        unelevated
        @click="save"
      />
    </div>

    <q-dialog v-model="showPopup" persistent>
      <q-card>
        <q-card-section class="row items-center q-pb-sm">
          <div class="text-h6"> {{$t('ChangePassword')}} </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section style="width: 500px" class="q-gutter-y-md">
          <q-input 
            class="col" 
            outlined 
            dense 
            :label="$t('CurrentPassword')"
            v-model="currentPassword"
            color="secondary"
            type="password"
          />
          <q-input 
            class="col" 
            outlined 
            dense 
            :label="$t('NewPassword')"
            v-model="newPassword"
            color="secondary"
            type="password"
          />
          <q-input 
            class="col" 
            outlined 
            dense 
            :label="$t('NewPasswordAgain')"
            v-model="newPasswordAgain"
            color="secondary"
            :hint="$t('ShortPasswordError')"
            type="password"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn 
            :label="$t('Save')" 
            color="secondary" 
            unelevated 
            @click="changePassword" 
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showMessage" seamless position="top">
      <q-card style="width: 300px" :class="dialogColor">
        <q-card-section>
          <q-banner dense inline-actions :class="`text-white ${dialogColor}`" >
            <div class="row justify-center">
            {{ dialogMessage }}
            </div>
          </q-banner>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import UserManager from "../classes/UserManager"
import SettingsManager from "../classes/SettingsManager"
import { Store } from "../store/index.js"
import { onBeforeMount, ref, computed } from "vue"
import { useI18n } from 'vue-i18n'

export default {
  name: "ProfilePageForm",
  setup() {
    const um = UserManager.getInstance();
    const sm = SettingsManager.getInstance();
    const { t } = useI18n({});

    const currentUser = ref(null);
    const name = ref(null);
    const id = ref(null);
    const mail = ref(null);
    const phone = ref(null);
    const address = ref(null);
    const hesCode = ref(null);
    const role = ref(null);

    const showPopup = ref(false);
    const currentPassword = ref(null);
    const newPassword = ref(null);
    const newPasswordAgain = ref(null); 

    const message = ref(null);
    const showMessage = ref(false);

    onBeforeMount(async () => {
      const currentUserUID = Store.state.settings.currentUserUID;
      um.getUserInfo(currentUserUID).then((val) => {
        currentUser.value = val.val();
        name.value = currentUser.value?._name;
        id.value = currentUser.value?._ID;
        mail.value = currentUser.value?._mail;
        phone.value = currentUser.value?._phoneNum;
        address.value = currentUser.value?._address;
        hesCode.value = currentUser.value?._hesObject._hesCode;
        role.value = currentUser.value?._role;
      })
    })

    const changePassword = async () => {
      sm.checkPassword(currentPassword.value).then(() => {
        if (newPassword.value == null || newPassword.value?.length < 8) {
          message.value = 0;
          showMessage.value = true;
          setTimeout(() => {
            showMessage.value = false;
          }, 3000);
        }
        else if (newPassword.value != newPasswordAgain.value) {
          message.value = 1;
          showMessage.value = true;
          setTimeout(() => {
            showMessage.value = false;
          }, 3000);          
        }
        else {
          sm.updatePassword(newPassword.value).then(() => {
            message.value = 2;
            showMessage.value = true;
            setTimeout(() => {
              showMessage.value = false;
            }, 3000);

            showPopup.value = false;
            currentPassword.value = null;
            newPassword.value = null;
            newPasswordAgain.value = null;
          })
          .catch(() => {
            message.value = 3;
            showMessage.value = true;
            setTimeout(() => {
              showMessage.value = false;
            }, 3000);
          });
        }
      })
      .catch((val) => {
        message.value = 4;
        showMessage.value = true;
        setTimeout(() => {
          showMessage.value = false;
        }, 2000);
      })
    }

    const dialogMessage = computed(() => {
      if (message.value == 0) {
        return t('ShortPasswordError');
      }
      else if (message.value == 1) {
        return t('PasswordNotMatching');
      }
      else if (message.value == 2) {
        return t('PasswordChangeSuccessful');
      }
      else if (message.value == 3) {
        return t('UnexpectedError');
      }
      else if (message.value == 4) {
        return t('WrongPassword');
      }
      else if (message.value == 5) {
        return t('ProfileUpdateSuccessful');
      }
      else {
        return t('HesCodeNotUpdated');
      }
    });

    const dialogColor = computed(() => {
      if (message.value == 2 || message.value == 5) {
        return "bg-positive";
      }
      else if (message.value == 6) {
        return "bg-indigo-6";
      }
      else {
        return "bg-negative";
      }
    })

    const save = async () => {  
      const currentPhoneNum = currentUser.value?._phoneNum;
      const currentAddress = currentUser.value?._address;
      const currentHESCode = currentUser.value?._hesObject._hesCode;

      message.value = 5;

      if (phone.value !== currentPhoneNum) {
        await sm.changePhone(phone.value);
      }
      if (address.value !== currentAddress) {
        await sm.changeAddress(address.value);
      }
      if (hesCode.value !== currentHESCode) {
        if (hesCode.value.length !== 10) {
          message.value = 6;
        }
        else {
          await sm.changeHES(hesCode.value);
        }
      }

      showMessage.value = true;
      setTimeout(() => {
        showMessage.value = false;
      }, 3000);
    }

    return {
      currentUser,
      name,
      id,
      phone,
      address,
      hesCode,
      mail,
      role,
      showPopup,
      currentPassword, 
      newPassword,
      newPasswordAgain,
      changePassword,
      showMessage,
      dialogMessage,
      dialogColor,
      save
    }
  },
}
</script>
