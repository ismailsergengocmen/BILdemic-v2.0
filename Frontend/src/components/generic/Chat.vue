<template>
<div>
  <q-banner inline-actions class="text-white bg-secondary" style="height: 50px">
    <q-icon v-if="isMobile" size="sm" name="menu" @click="toggleDrawer"/>
    <b> {{ $t('HealthCenterChat') }} </b> 
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
    />
    <q-btn 
      icon="mdi-send"
      round
      color="secondary"
      unelevated
      @click="sendMessage" 
    />
  </div>
</div>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue'
import { Store } from '../../store/index'
import { useQuasar } from 'quasar'
import { getDatabase, ref as databaseRef, onValue } from 'firebase/database'
import moment from 'moment'
import ChatManager from '../../classes/ChatManager'
import UserManager from '../../classes/UserManager'

export default {
  name: 'Chat',
  props: ['locationUID'],
  setup(props, ctx) {
    const cm = ChatManager.getInstance();
    const um = UserManager.getInstance();
    const $q = useQuasar();

    const newMessage = ref(null);
    const messages = ref(null);
    const UID = Store.state.settings.currentUserUID;

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
      const currentUser = (await um.getUserInfo(UID)).val();

      if (newMessage.value) {
        cm.sendMessage(props.locationUID, UID, currentUser._name, newMessage.value).then(() => {
          newMessage.value = null;
        })
      }
    }

    const getMessages = () => {
      const db = getDatabase();

      const reference = databaseRef(db, `Messages/${props.locationUID}`);
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
    
    return {
      isMobile,
      toggleDrawer,
      messages,
      newMessage,
      sendMessage,
      formattedTime,
      UID
    }
  },
}
</script>
