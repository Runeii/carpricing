<script setup lang="ts">
import Step from './Step.vue'
import DocumentationIcon from './icons/IconDocumentation.vue'
import ToolingIcon from './icons/IconTooling.vue'
import { ref } from 'vue'

const props = defineProps<{
  from: string
  to: string
  isReturn: boolean
}>()

const activeStepIndex = ref(0)
const from = ref(props.from)
const to = ref(props.to)
const isReturn = ref(props.isReturn)
</script>

<template>
  <Step :isActive="activeStepIndex === 0">
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>From destination</template>
    <form @submit.prevent="activeStepIndex++">
      <input type="text" placeholder="Enter your start destination" v-model="from" />
    </form>
  </Step>
  <Step :isActive="activeStepIndex === 1">
    <template #icon>
      <DocumentationIcon />
    </template>
    <template #heading>Target destination</template>
    <form @submit.prevent="activeStepIndex++">
      <input type="text" placeholder="Enter your target destination" v-model="to" />
    </form>
  </Step>

  <Step :isActive="activeStepIndex === 2">
    <template #icon>
      <ToolingIcon />
    </template>
    <template #heading>Return journey?</template>
    <form
      @submit.prevent="
        $emit('complete', {
          from,
          to,
          isReturn
        })
      "
    >
      <input type="checkbox" v-model="isReturn" />
      <br />
      <button type="submit">Get results</button>
    </form>
  </Step>
</template>
