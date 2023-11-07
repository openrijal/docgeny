<template>
  <div
    v-if="isModalShown"
    class="grid place-content-center bg-gray-700 bg-opacity-50 absolute top-0 left-0 w-screen h-screen z-50"
  >
    <div
      class="p-10 xl:p-16 relative bg-white rounded-md max-w-[95vw] max-h-[85vh] overflow-y-auto"
      :class="customClass"
    >
      <h1 class="text-black text-3xl font-bold text-center">{{ title }}</h1>
      <p v-if="description">{{ description }}</p>
      <div
        v-if="showCloseButton"
        class="absolute top-4 right-4 cursor-pointer"
        @click="close"
      >
        <UIcon name="i-mdi-alpha-x-circle-outline" class="h-6 xl:h-8 xl:w-8" />
      </div>
      <slot />
      <div
        v-if="showButtons"
        class="flex gap-x-8 mt-8 uppercase"
        :class="{
          'justify-center': buttonsCenterAlign,
        }"
      >
        <button class="btn-primary" @click="confirm">
          {{ confirmButtonText }}
        </button>
        <button class="btn-secondary" @click="close">
          {{ cancelButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const emit = defineEmits(['close', 'confirm'])
const props = defineProps({
  isOpen: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  showCloseButton: {
    type: Boolean,
    default: true,
  },
  showButtons: {
    type: Boolean,
    default: true,
  },
  customClass: {
    type: String,
    default: 'xl:w-fit h-fit',
  },
  confirmButtonText: {
    type: String,
    default: 'Confirm',
  },
  cancelButtonText: {
    type: String,
    default: 'Cancel',
  },
  buttonsCenterAlign: {
    type: Boolean,
    default: true,
  },
})

const isModalShown = ref(props.isOpen)

const close = () => {
  isModalShown.value = false
  emit('close')
}

const confirm = () => {
  isModalShown.value = false
  emit('confirm')
}

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      isModalShown.value = true
    } else {
      isModalShown.value = false
    }
  }
)
</script>
