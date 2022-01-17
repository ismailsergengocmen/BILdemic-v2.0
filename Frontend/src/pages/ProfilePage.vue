<template>
  <div>
    <q-banner inline-actions class="text-white bg-secondary">
      <q-icon v-if="isMobile" size="sm" name="menu" @click="toggleDrawer"/>
      <b> {{ $t('ProfilePage') }} </b> 
    </q-banner>

    <div class="q-pa-md column">
      <div class="row justify-center q-mb-md">
        <q-img 
          src="https://placeimg.com/500/300/nature" 
          style="height: 140px; max-width: 150px" 
          class="my-img"
          @click="showPopup = true"
        >
          <div class="absolute-full flex flex-center my-text">
            <q-icon size="md" name="mdi-camera" />
          </div>
        </q-img>
      </div>
      
      <profile-page-form />
    </div>

    <q-dialog v-model="showPopup" persistent>
      <q-card>
        <q-card-section class="row items-center q-pb-sm">
          <div class="text-h6"> {{$t('UpdateProfilePicture')}} </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-card-section style="width: 500px">
          <div>
            <q-file
              v-model="file"
              :label="$t('SelectNewProfilePhoto')"
              :clearable="!isUploading"
              outlined
              style="width: 450px"
              color="secondary"
              accept=".jpg, image/*"
            >
              <template v-slot:file="{ file }">
                <q-chip
                  class="full-width q-my-xs"
                  square
                >
                  <q-avatar>
                    <q-icon name="photo" />
                  </q-avatar>

                  <div class="ellipsis relative-position">
                    {{ file.name }}
                  </div>

                  <q-tooltip>
                    {{ file.name }}
                  </q-tooltip>
                </q-chip>
              </template>

              <template v-slot:after>
                <q-btn
                  color="secondary"
                  dense
                  icon="mdi-upload"
                  round
                  @click="upload"
                  :disable="!canUpload"
                  :loading="isUploading"
                />
              </template>
            </q-file>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showUploadSuccessPopup" seamless position="top">
      <q-card style="width: 300px" :class="dialogColor">
        <q-card-section>
          <q-banner dense inline-actions :class="`text-white ${dialogColor}`" >
            <div class="row justify-center">
            {{ photoUploadMessage }}
            </div>
          </q-banner>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import ProfilePageForm from "../components/ProfilePageForm.vue"
import { useQuasar } from "quasar"
import { watch, computed, ref, onBeforeUnmount } from "vue"
import SettingsManager from "../classes/SettingsManager"
import { Store } from "../store/index"
import { useI18n } from 'vue-i18n'

export default {
  name: "ProfilePage",
  components: {
    ProfilePageForm
  },
  setup(props, ctx) {
    const $q = useQuasar();
    const sm = SettingsManager.getInstance();
    const { t } = useI18n({});

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

    const showPopup = ref(false);
    const file = ref(null)
    const uploading = ref(null)

    const showUploadSuccessPopup = ref(false);
    const photoUploadMessage = ref(null);
    const dialogColor = ref(null);

    const isUploading =  computed(() => uploading.value !== null);
    const canUpload = computed(() => file.value !== null);

    const cleanUp = () => {
      clearTimeout(uploading.value);
    }

    const updateFile = (newFile) => {
      file.value = newFile;
    }

    const upload = async () => {
      console.log(file.value);
      sm.uploadProfilePictureToStorage(Store.state.settings.currentUserUID, file.value).then((snapshot) => {
        file.value = null;
        showPopup.value = false;
        dialogColor.value = "bg-positive";
        showUploadSuccessPopup.value = true;
        setTimeout(() => {
          showUploadSuccessPopup.value = false;
        }, 3000);
        photoUploadMessage.value = t('PhotoUploadSuccessful');
      })
      .catch((err) => {
        file.value = null;
        showPopup.value = false;
        dialogColor.value = "bg-negative";
        showUploadSuccessPopup.value = true;
        setTimeout(() => {
          showUploadSuccessPopup.value = false;
        }, 3000);
        photoUploadMessage.value = t('UnexpectedError');
      })

      cleanUp();
    }

    onBeforeUnmount(() => {
      cleanUp();
    })

    return {
      isMobile,
      toggleDrawer,
      showPopup,
      file,
      uploading,
      isUploading,
      canUpload,
      updateFile,
      upload,
      showUploadSuccessPopup,
      photoUploadMessage,
      dialogColor
    }
  },
}
</script>

<style scoped>
.my-img .my-text {
  visibility: hidden;
  opacity: 0;
  transition: .3s;
}

.my-img:hover .my-text {
  visibility: visible;
  opacity: 1;
  transition: .3s;
}
</style>
