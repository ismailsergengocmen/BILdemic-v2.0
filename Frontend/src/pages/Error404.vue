<template>
  <div class="fullscreen bg-secondary text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">
        404
      </div>

      <div class="text-h3" style="opacity:.4">
        {{ $t('Oops') }}
      </div>

      <router-link to="/home" class="text-h4 text-white"> {{ $t('GoHome') }} </router-link>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Error404'
})
</script>

