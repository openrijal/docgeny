<template>
  <div class="flex items-center gap-2 pt-4 font-semibold" v-if="totalPages != 0">
    <button
      @click="changePage(thisPage - 1)"
      class="rounded px-3 h-8 flex items-center"
      :class="thisPage !== 1 ? 'bg-white border border-gray-20' : 'bg-gray-200'"
      :disabled="thisPage === 1"
    >
      <UIcon name="material-symbols:i-mdi-chevron-left" class="text-gray-400" />
    </button>
    <button
      @click="changePage(1)"
      class="border rounded p-3 h-8 flex items-center"
      :class="
        thisPage === 1 ? 'bg-dibo-blue-600 text-white' : ' border-gray-200'
      "
    >
      1
    </button>
    <button
      v-if="totalPages >= 2"
      :disabled="(totalPages <= 7 ? 2 : thisPage > 4 ? '...' : 2) == '...'"
      @click="changePage(totalPages <= 7 ? 2 : thisPage > 4 ? '' : 2)"
      class="border rounded p-3 h-8 flex items-center"
      :class="
        thisPage === 2 ? 'bg-dibo-blue-600 text-white' : ' border-gray-200'
      "
    >
      {{ totalPages <= 7 ? 2 : thisPage > 4 ? '...' : 2 }}
    </button>
    <button
      v-if="totalPages >= 3"
      @click="
        changePage(
          totalPages <= 7
            ? 3
            : thisPage < 4
            ? 3
            : thisPage > totalPages - 4
            ? totalPages - 4
            : thisPage - 1
        )
      "
      class="border rounded p-3 h-8 flex items-center"
      :class="
        thisPage ===
        (totalPages <= 7
          ? 3
          : thisPage < 4
          ? 3
          : thisPage > totalPages - 4
          ? totalPages - 4
          : thisPage - 1)
          ? 'bg-dibo-blue-600 text-white'
          : ' border-gray-200'
      "
    >
      {{
        totalPages <= 7
          ? 3
          : thisPage < 4
          ? 3
          : thisPage > totalPages - 4
          ? totalPages - 4
          : thisPage - 1
      }}
    </button>
    <button
      v-if="totalPages >= 4"
      @click="
        changePage(
          totalPages <= 7
            ? 4
            : thisPage < 5
            ? 4
            : thisPage > 4 && thisPage < totalPages - 3
            ? thisPage
            : totalPages - 3
        )
      "
      class="border rounded p-3 h-8 flex items-center"
      :class="
        thisPage ===
        (totalPages <= 7
          ? 4
          : thisPage < 5
          ? 4
          : thisPage > 4 && thisPage < totalPages - 3
          ? thisPage
          : totalPages - 3)
          ? 'bg-dibo-blue-600 text-white'
          : ' border-gray-200'
      "
    >
      {{
        totalPages <= 7
          ? 4
          : thisPage < 5
          ? 4
          : thisPage > 4 && thisPage < totalPages - 3
          ? thisPage
          : totalPages - 3
      }}
    </button>
    <button
      v-if="totalPages >= 5"
      @click="
        changePage(
          totalPages <= 7
            ? 5
            : thisPage < 5
            ? 5
            : thisPage > 4 && thisPage < totalPages - 3
            ? thisPage + 1
            : totalPages - 2
        )
      "
      class="border 0 rounded p-3 h-8 flex items-center"
      :class="
        thisPage ===
        (totalPages <= 7
          ? 5
          : thisPage < 5
          ? 5
          : thisPage > 4 && thisPage < totalPages - 3
          ? thisPage + 1
          : totalPages - 2)
          ? 'bg-dibo-blue-600 text-white'
          : ' border-gray-200'
      "
    >
      {{
        totalPages <= 7
          ? 5
          : thisPage < 5
          ? 5
          : thisPage > 4 && thisPage < totalPages - 3
          ? thisPage + 1
          : totalPages - 2
      }}
    </button>

    <button
      :disabled="
        (totalPages <= 7
          ? 6
          : thisPage < totalPages - 3
          ? '...'
          : totalPages - 1) == '...'
      "
      v-if="totalPages >= 6"
      @click="
        changePage(
          totalPages <= 7 ? 6 : thisPage < totalPages - 3 ? '...' : totalPages - 1
        )
      "
      class="border rounded p-3 h-8 flex items-center"
      :class="
        thisPage ===
        (totalPages <= 7 ? 6 : thisPage < totalPages - 3 ? '...' : totalPages - 1)
          ? 'bg-dibo-blue-600 text-white'
          : ' border-gray-200'
      "
    >
      {{
        totalPages <= 7 ? 6 : thisPage < totalPages - 3 ? '...' : totalPages - 1
      }}
    </button>

    <button
      v-if="totalPages >= 7"
      @click="changePage(totalPages)"
      :class="
        thisPage === totalPages
          ? 'bg-dibo-blue-600 text-white'
          : ' border-gray-200'
      "
      class="border border-gray-200 rounded p-3 h-8 flex items-center"
    >
      {{ totalPages }}
    </button>

    <button
      @click="changePage(thisPage + 1)"
      class="bg-white rounded px-3 h-8 flex items-center"
      :class="
        thisPage !== totalPages
          ? 'bg-white border border-gray-200'
          : 'bg-gray-200 '
      "
      :disabled="thisPage === totalPages"
    >
      <UIcon name="i-mdi-chevron-right" class="text-gray-400" />
    </button>
  </div>
</template>

<script setup>
const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  totalPages: {
    type: Number,
    required: true,
  },
  modelValue: {
    type: Number,
    required: true,
  },
})

const thisPage = ref(props.modelValue)

watch(
  () => props.modelValue,
  () => {
    thisPage.value = props.modelValue
  }
)

const changePage = (p) => {
  thisPage.value = p
  emit('update:modelValue', thisPage.value)
}
</script>
