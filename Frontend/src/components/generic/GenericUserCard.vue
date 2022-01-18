<template>
  <div class="row bordered items-center" style="height: 150px">
    <q-img :src="cardInfo.url" class="q-ml-md" style="height: 100px; max-width: 100px"/>
    <q-separator vertical class="q-mx-md" />
    <div class="col">
      <div v-for="i in cardInfo.data" :key="i" class="q-mt-xs">
        {{ i }}
      </div>
    </div>

    <q-btn 
      round
      class="q-mr-sm"
      :icon="firstIcon"
      :color="firstIconColor"
      size="lg"
      flat
      dense
      @click="firstClicked"
    >
      <q-tooltip self="center middle" :class="`bg-${firstIconColor}`">
        {{ firstIconTooltip }}
      </q-tooltip>
    </q-btn>

    <q-btn 
      v-if="hasSecondIcon" 
      round
      class="q-mr-sm" 
      :icon="secondIcon"
      :color="secondIconColor"
      size="lg"
      flat
      dense
      @click="secondClicked"
    >
      <q-tooltip self="center middle" :class="`bg-${secondIconColor}`">
        {{ secondIconTooltip }}
      </q-tooltip>
    </q-btn>
  </div>
</template>

<script>
export default {
  name: "GenericUserCard",
  props: {
    firstIcon: String,
    firstIconColor: String,
    firstIconTooltip: String,
    hasSecondIcon: Boolean,
    secondIcon: String,
    secondIconColor: String,
    secondIconTooltip: String,
    cardInfo: Object
  },
  setup(props, ctx) {
    const firstClicked = () => {
      ctx.emit('firstClicked', props.cardInfo)
    }

    const secondClicked = () => {
      ctx.emit('secondClicked', props.cardInfo)
    }

    return {
      firstClicked,
      secondClicked
    }
  },
}
</script>

<style scoped>
.bordered { 
  border: 1px solid rgb(192, 192, 192);
  width: 50%;
  border-radius: 5px;
}
</style>