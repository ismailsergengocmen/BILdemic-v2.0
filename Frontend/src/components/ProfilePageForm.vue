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
        mask="(###) ### - ####"
        unmasked-value
        fill-mask
      />

      <div class="row q-gutter-x-md">
        <q-select
          v-if="role === 'Student'"
          class="col" 
          outlined 
          dense
          :options="dormOptions" 
          :label="$t('DormNumber')"
          v-model="dormNo"
          color="secondary"
        />

        <q-input 
          v-if="role === 'Student'"
          class="col" 
          outlined 
          dense 
          :label="$t('DormRoomNo')"
          v-model.number="dormRoomNo"
          type="number"
          color="secondary"
        />
      </div> 

      <q-input 
        class="col q-pb-sm" 
        outlined 
        dense 
        :label="$t('HESCode')"
        v-model="hesCode"
        color="secondary"
        mask="XXXX-XXXX-XX"
        unmasked-value
        fill-mask
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
  </div>
</template>

<script>
import UserManager from "../classes/UserManager"
import SettingsManager from "../classes/SettingsManager"
import { Store } from "../store/index.js"
import { onBeforeMount, ref } from "vue"
import { useI18n } from 'vue-i18n'
import { useQuasar } from 'quasar'

export default {
  name: "ProfilePageForm",
  setup() {
    const um = UserManager.getInstance();
    const sm = SettingsManager.getInstance();
    const $q = useQuasar();
    const { t } = useI18n({});

    const currentUser = ref(null);
    const name = ref(null);
    const id = ref(null);
    const mail = ref(null);
    const phone = ref(null);
    const dormNo = ref(null);
    const dormRoomNo = ref(null);
    const hesCode = ref(null);
    const role = ref(null);

    const showPopup = ref(false);
    const currentPassword = ref(null);
    const newPassword = ref(null);
    const newPasswordAgain = ref(null); 

    onBeforeMount(async () => {
      const currentUserUID = Store.state.settings.currentUserUID;
      um.getUserInfo(currentUserUID).then((val) => {
        currentUser.value = val.val();
        name.value = currentUser.value?._name;
        id.value = currentUser.value?._ID;
        mail.value = currentUser.value?._mail;
        phone.value = currentUser.value?._phoneNum;
        dormNo.value = currentUser.value?._dorm?._dormNo;
        dormRoomNo.value = currentUser.value?._dorm?._dormRoomNo;
        hesCode.value = currentUser.value?._hesObject._hesCode;
        role.value = currentUser.value?._role;
      })
    })

    const changePassword = async () => {
      sm.checkPassword(currentPassword.value).then(() => {
        if (newPassword.value == null || newPassword.value?.length < 8) {
          $q.notify({
            position: 'top',
            message: t('ShortPasswordError'),
            color: 'negative'
          });
        }
        else if (newPassword.value != newPasswordAgain.value) {
          $q.notify({
            position: 'top',
            message: t('PasswordNotMatching'),
            color: 'negative'
          });
        }
        else {
          sm.updatePassword(newPassword.value).then(() => {
            $q.notify({
              position: 'top',
              message: t('PasswordChangeSuccessful'),
              color: 'positive'
            });

            showPopup.value = false;
            currentPassword.value = null;
            newPassword.value = null;
            newPasswordAgain.value = null;
          })
          .catch(() => {
            $q.notify({
              position: 'top',
              message: t('UnexpectedError'),
              color: 'negative'
            });
          });
        }
      })
      .catch((val) => {
        $q.notify({
          position: 'top',
          message: t('WrongPassword'),
          color: 'negative'
        });
      })
    }

    const save = async () => {  
      const currentPhoneNum = currentUser.value?._phoneNum;
      const currentDormNo = currentUser.value?._dorm?._dormNo;
      const currentDormRoomNo = currentUser.value?._dorm?._dormRoomNo;
      const currentHESCode = currentUser.value?._hesObject._hesCode;

      if (phone.value !== currentPhoneNum) {
        await sm.changePhone(phone.value);
      }
      if (dormNo.value !== currentDormNo || dormRoomNo.value !== currentDormRoomNo) {
        await sm.changeAddress(dormNo.value, dormRoomNo.value);
      }
      if (hesCode.value !== currentHESCode) {
        if (hesCode.value.length !== 10) {
          $q.notify({
            position: 'top',
            message: t('HesCodeNotUpdated'),
            color: 'indigo-6'
          });
        }
        else {
          await sm.changeHES(hesCode.value);
          $q.notify({
            position: 'top',
            message: t('ProfileUpdateSuccessful'),
            color: 'positive'
          });
        }
      }
      else {
        $q.notify({
          position: 'top',
          message: t('ProfileUpdateSuccessful'),
          color: 'positive'
        });
      }
    }

    const dormOptions = [
      50, 51, 52, 54, 55, 60, 61, 62, 63, 64, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 81, 82, 90, 91, 92, 93
    ];

    return {
      currentUser,
      name,
      id,
      phone,
      dormNo,
      dormRoomNo,
      dormOptions,
      hesCode,
      mail,
      role,
      showPopup,
      currentPassword, 
      newPassword,
      newPasswordAgain,
      changePassword,
      save
    }
  },
}
</script>
