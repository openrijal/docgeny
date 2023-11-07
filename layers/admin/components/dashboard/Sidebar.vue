<template>
  <div>
    <div
      class="w-64 absolute sm:relative bg-white shadow md:h-full flex-col justify-between hidden sm:flex pb-12"
    >
      <div class="px-2 pl-6">
        <div class="h-20">
          <NuxtLink to="/admin/">
            <img class="max-h-20" :src="org.logo" />
          </NuxtLink>
        </div>
        <div class="mt-12">
          <DashboardSidebarMenu />
        </div>
      </div>
    </div>
    <div
      id="mobile-nav"
      class="absolute z-20 bg-white shadow md:h-full flex-col justify-between sm:hidden pb-12 transition duration-150 ease-in-out"
    >
      <div>
        <div
          v-if="!isMenuShown"
          id="openSideBar"
          class="h-10 w-10 bg-blue-700 absolute right-0 mt-4 -mr-10 flex items-center shadow rounded-tr rounded-br justify-center cursor-pointer"
          @click="showMenu(true)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon icon-tabler icon-tabler-adjustments"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#FFFFFF"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" />
            <circle cx="6" cy="10" r="2" />
            <line x1="6" y1="4" x2="6" y2="8" />
            <line x1="6" y1="12" x2="6" y2="20" />
            <circle cx="12" cy="16" r="2" />
            <line x1="12" y1="4" x2="12" y2="14" />
            <line x1="12" y1="18" x2="12" y2="20" />
            <circle cx="18" cy="7" r="2" />
            <line x1="18" y1="4" x2="18" y2="5" />
            <line x1="18" y1="9" x2="18" y2="20" />
          </svg>
        </div>
      </div>
      <div
        v-if="isMenuShown"
        id="closeSideBar"
        class="h-10 w-10 bg-blue-700 absolute right-0 mt-4 -mr-10 items-center shadow rounded-tr rounded-br justify-center cursor-pointer text-white p-2"
        @click="showMenu(false)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon icon-tabler icon-tabler-x"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" />
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>
      <div v-if="isMenuShown" class="mt-8 px-8 w-64">
        <DashboardSidebarMenu />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    org: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const isMenuShown = ref(false)
    const showMenu = (show) => {
      isMenuShown.value = show
    }
    return { showMenu, isMenuShown }
  },
}
</script>
