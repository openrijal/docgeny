<template>
  <div>
    <NuxtLink
      to="/admin/"
      class="flex items-center h-10 hover:bg-gray-200 rounded-lg text-gray-600 text-lg"
    >
      <UIcon name="i-mdi-home" class="mx-2" /><span
        >Dashboard</span
      >
    </NuxtLink>
    <div v-for="(asideItem, index) in asideItems" :key="`asideItem-${index}`">
      <div class="mt-4">
        <p class="text-sm font-semibold mb-2">{{ asideItem.category }}</p>
        <NuxtLink
          v-for="(item, i) in asideItem.items"
          :key="`item-${i}`"
          :to="item.link"
          class="flex items-center h-10 hover:bg-gray-200 rounded-lg px-2 my-1 text-gray-600"
        >
          <UIcon :name="item.icon" class="text-inherit mr-2" /><span>{{
            item.name
          }}</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
const asideItems = [
  {
    category: 'Articles',
    items: [
      {
        name: 'All Articles',
        icon: 'i-mdi-note-text',
        link: '/admin/article/',
      },
    ],
  },
]
</script>

<style scoped>
.router-link-active {
  color: #1e40af;
  font-weight: 600;
  background: #ddd;
}
</style>
