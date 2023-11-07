<template>
  <div>
    <ckeditor v-model="local" :editor="ClassicEditor"></ckeditor>
  </div>
</template>

<script>
import CKEditor from '@ckeditor/ckeditor5-vue'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

export default {
  components: {
    ckeditor: CKEditor.component,
  },
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    // label: {
    //   type: String,
    //   default: 'nameEn',
    // },
    // placeholder: {
    //   type: String,
    //   default: 'Select ...',
    // },
    // options: {
    //   type: Array,
    //   default: null,
    // },
  },
  setup(props, { emit }) {
    const local = ref(props.modelValue)
    watch(
      () => props.modelValue,
      () => {
        local.value = props.modelValue
      }
    )
    watch(local, (value) => {
      emit('update:modelValue', value)
    })
    return { local, ClassicEditor }
  },
}
</script>
