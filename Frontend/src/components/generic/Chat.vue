<template>
<div>
  <q-banner inline-actions class="text-white bg-secondary" style="height: 50px">
    <div class="row items-center justify-between">
      <div>
        <q-icon v-if="isMobile" size="sm" name="menu" @click="toggleDrawer"/>
        <b> {{ currentChatTitle }} </b> 
      </div>

      <q-icon
      class=""
        round
        name="mdi-dots-vertical"
        size="20px"
      >
        <q-menu>
          <q-list style="min-width: 120px">
            <q-item clickable v-close-popup @click="endChatSurePopup = true">
              <q-item-section> {{ $t('EndChat') }} </q-item-section>
            </q-item>
          </q-list>
        </q-menu>
      </q-icon>
    </div>
  </q-banner>

  <div class="q-pa-md row justify-center">
    <div style="width: 100%;" >
      <q-scroll-area style="height: 400px;" ref="scrollAreaRef">
        <div v-for="message in messages" :key="message.id" class="q-px-sm">
          <q-chat-message
            :sent="message.uid === UID"
            :bg-color="message.uid === UID ? 'light-green-7' : 'teal-5'"
            :name="message.uid === locationUID ? message?.name : $t('HealthCenterStaff')"
            :text="[message?.content]"
            :stamp="formattedTime(message?.timestamp)"
          />
        </div>
      </q-scroll-area>
    </div>
  </div>

  <div class="row justify-center q-gutter-x-md">
    <q-input 
      v-model="newMessage"
      outlined 
      dense 
      class="col-9"
      color="secondary" 
      style="width: 90%"
      @keydown.enter.prevent="sendMessage"
    />
    <q-btn 
      icon="mdi-send"
      round
      color="secondary"
      unelevated
      @click="sendMessage" 
    />
  </div>

  <q-dialog v-model="endChatSurePopup" persistent>
      <q-card style="min-width: 300px">
        <q-card-section class="row items-center">
          <span class="q-ml-sm">{{ $t('EndChatQuestion') }} </span>
        </q-card-section>

        <q-card-actions class="row justify-between">
          <q-btn flat :label="$t('Cancel')" color="secondary" v-close-popup />
          <q-btn flat :label="$t('End')" color="secondary" v-close-popup @click="endChat"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
</div>
</template>

<script>
import { ref, onMounted, watch, computed, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { Store } from '../../store/index'
import { useQuasar } from 'quasar'
import { getDatabase, ref as databaseRef, onValue } from 'firebase/database'
import moment from 'moment'
import ChatManager from '../../classes/ChatManager'
import UserManager from '../../classes/UserManager'
import { useI18n } from 'vue-i18n'

export default {
  name: 'Chat',
  props: ['locationUID'],
  setup(props, ctx) {
    const cm = ChatManager.getInstance();
    const um = UserManager.getInstance();
    const router = useRouter();
    const $q = useQuasar();
    const { t } = useI18n({});

    const newMessage = ref(null);
    const messages = ref(null);
    const UID = Store.state.settings.currentUserUID;
    const endChatSurePopup = ref(false);
    const currentUser = ref(null);
    const currentChatTitle = ref(null);

    const isMobile = computed(() => {
      return $q.screen.width < 800;
    });

    const open = ref(!isMobile.value);

    watch(isMobile, () => {
      open.value = !isMobile.value;
    })

    const toggleDrawer = () => {
      open.value = !open.value
      ctx.emit('toggleDrawer');
    }

    const sendMessage = async () => {
      if (newMessage.value) {
        cm.sendMessage(props.locationUID, UID, currentUser.value._name, newMessage.value).then(() => {
          newMessage.value = null;
        })
      }
    }

    const getMessages = () => {
      const db = getDatabase();

      const reference = databaseRef(db, `HealthCenterChats/${props.locationUID}`);
      onValue(reference, (snapshot) => {
          messages.value = [];
          const data = snapshot.val();
          for (const [key, value] of Object.entries(data)) {
            messages.value.push(value)
          }
      })
    }

    const formattedTime = (time) => {
      return moment(time).format('lll');
    }

    onMounted(() => {
      getMessages();
    })

    const endChat = async () => {
      cm.endChat(props.locationUID).then(() => {
        if (props.locationUID === UID) {
          router.push('/~/health');
        }
        else {
          router.push('/staff/health');
        }

        $q.notify({
          position: 'top',
          message: t('ChatEnded'),
          color: 'positive',
        })
      });
    }

    onBeforeMount(async () => {
      currentUser.value = (await um.getUserInfo(UID)).val();
      await title();
    })

    const title = (async() => {
      const patientName = (await um.getUserInfo(props.locationUID)).val()._name;
      if (UID === props.locationUID) {
        currentChatTitle.value = t('HealthCenterChat')
      }
      else {
        currentChatTitle.value = t('PatientName') + ': ' + patientName;
      }
    })

    return {
      isMobile,
      toggleDrawer,
      messages,
      newMessage,
      sendMessage,
      formattedTime,
      UID,
      endChatSurePopup,
      endChat,
      currentChatTitle
    }
  },
}
</script>
