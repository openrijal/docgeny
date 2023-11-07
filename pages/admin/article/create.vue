<script setup lang="ts">
import { ref } from 'vue'
import type { FormSubmitEvent } from '@nuxt/ui/dist/runtime/types'

definePageMeta({ layout: 'admin' })

const state = ref({
  title: '',
  content: '',
})

async function submit(event: FormSubmitEvent<typeof state.value>) {
  const s = useServerFunctions({ cache: false })
  s.createArticle(event.data)
}
</script>

<template>
  <h1 class="heading mb-4">Create Post</h1>

  <UForm :state="state" @submit="submit">
    <UFormGroup label="Title" name="title">
      <UInput v-model="state.title" autofocus required />
    </UFormGroup>

    <!-- <UFormGroup label="Content" name="content">
      <UTextarea v-model="state.content" autoresize :rows="20" required />
    </UFormGroup> -->

    <Editor v-model="state.content"></Editor>

    <UButton type="submit"> Submit </UButton>
  </UForm>
</template>
