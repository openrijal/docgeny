<template>
  <div class="flex flex-col gap-8">
    <div class="flex justify-between">
      <h1 class="heading">Posts Management</h1>
      <NuxtLink to="/admin/article/create">
        <UButton>Create</UButton>
      </NuxtLink>
    </div>
    <Table
      :columns="{
        title: 'Title',
        createdAt: {
          title: 'Created At',
          type: 'datetime',
        },
        content: {
          title: 'Content',
          type: 'html',
        },
      }"
      :actions="['delete', 'eye']"
      :data="response"
      @eye="handleEyeClick"
    >
    </Table>
  </div>
</template>
<script setup lang="ts">
definePageMeta({ layout: 'admin' })

const router = useRouter()

const handleEyeClick = (obj: Record<string, any>) => {
  router.push('/post/' + obj.id)
}

const { data: response } = await useFetch('/api/article')
</script>
