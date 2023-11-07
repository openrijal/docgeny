<template>
  <div>
    <v-select
      :options="selectOptions"
      :label="label"
      :placeholder="placeholder"
      :reduce="(obj:Record<string, any>) => obj.id"
      v-model="local"
      :multiple="multiple"
      class="input-primary text-gray-500"
      :class="customDropDownWidth ? customDropDownWidth : 'w-64 xl:w-96'"
    ></v-select>
  </div>
</template>

<script setup lang="ts">
// @ts-ignore
import vSelect from 'vue-select'
const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: Number || String,
    default: null,
  },
  label: {
    type: String,
    default: 'nameEn',
  },
  placeholder: {
    type: String,
    default: 'Select ...',
  },
  options: {
    type: Array,
    default: null,
  },
  processOptions: {
    type: Function || undefined,
  },
  endpoint: {
    type: String,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  customDropDownWidth: {
    type: String,
  },
})

type OptionList = Ref<Array<Record<string, any>>>
const selectOptions: OptionList = ref([])

if (props.options) {
  // @ts-ignore
  selectOptions.value = props.options
} else if (props.endpoint) {
  const { data: fetchedData } = await useFetch(props.endpoint)
  let optionsList = (<OptionList>fetchedData).value
  if (props.processOptions) {
    optionsList = props.processOptions(optionsList)
  }
  selectOptions.value = optionsList
}

const getId = (v: { id: number }) => {
  return v.id
}

const processValue = (val: number | object[]) => {
  if (
    Array.isArray(val) &&
    val.length &&
    typeof val[0] === 'object' &&
    'id' in val[0]
  ) {
    // @ts-ignore
    const newVal = val.map(getId)
    emit('update:modelValue', newVal)
    return newVal
  }
  return val
}

const local = ref(processValue(props.modelValue))
watch(
  () => props.modelValue,
  () => {
    local.value = processValue(props.modelValue)
  }
)
watch(local, (value) => {
  emit('update:modelValue', value)
})
</script>

<style>
.vs__dropdown-toggle {
  border: 0px !important;
}
.vs__search {
  opacity: 0.34;
  font-size: 1.05em !important;
  font-weight: 400;
}
.v-select.input-primary {
  padding-top: 0.5em;
  padding-bottom: 0.5em;
}
</style>
