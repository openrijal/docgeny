<template>
  <div class="flex flex-no-wrap">
    <DashboardSidebar :org="{}" class="min-h-screen" />
    <div class="w-full bg-[#f0f7fd]">
      <DashboardNav :org="{}" />
      <!-- Remove class [ h-64 ] when adding a card block -->
      <div class="container mx-auto py-6 px-6 bg-transparent">
        <div class="w-full h-full">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import 'vue-select/dist/vue-select.css'

export default {
  // middleware: 'auth',
  async setup() {
    const router = useRouter()
    
  },
}
</script>

<style scoped>
.ck-file-dialog-button {
  display: none;
}
.router-link-active {
  background-color: #ddd;
  font-weight: bold;
}
</style>
