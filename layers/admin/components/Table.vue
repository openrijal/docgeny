<template>
  <div>
    <div
      v-if="(slots.addForm || formComponent) && enableAdd"
      class="text-right mb-8 -mt-12"
    >
      <button class="btn-primary" @click="onCreateClick">+ Add New</button>
    </div>
    <form
      v-if="enableSearch"
      :class="
        customFilterStyling
          ? customFilterStyling
          : 'flex flex-wrap items-center'
      "
      class="mb-8 gap-x-8"
      @submit.prevent="performFilter"
      @reset="performReset"
    >
      <input
        :type="searchType"
        class="input-primary flex-1"
        :placeholder="searchLabel"
        v-model="searchQuery"
      />
      <slot name="filters"></slot>
      <slot v-if="filterData" name="computedFilters">
        <div v-for="(val, key) in filterData">
          <div class="h-full computed-filter">
            <ASelect
              :options="val.data"
              :label="val.optionLabel"
              v-model="filters[key]"
              :placeholder="val.label"
              class="bg-white h-full"
              :custom-drop-down-width="
                customDropDownWidth ? customDropDownWidth : 'w-64 xl:w-96'
              "
            />
          </div>
        </div>
      </slot>
      <div>
        <button type="submit" class="btn-primary">Search</button>
        <button type="reset" class="btn-secondary">Reset</button>
      </div>
    </form>
    <div class="rounded-md overflow-x-auto scrollbar-secondary shadow-sm">
      <table v-if="rows.length" class="w-full">
        <thead
          class="bg-slate-200 text-dibo-blue-650 text-lg xl:text-xl text-left whitespace-nowrap"
        >
          <tr>
            <th scope="col" class="p-2 xl:p-4" v-if="props.autoNumbering">
              SI No.
            </th>
            <th scope="col" class="p-2 xl:p-4" v-for="column in props.columns">
              <template v-if="typeof column === 'object'">
                <div v-if="column.titleIsHtml">
                  <div v-html="column.title"></div>
                </div>
                <div v-else>
                  {{ column.title }}
                </div>
              </template>
              <template v-else>
                {{ column }}
              </template>
            </th>
            <th scope="col" class="p-2 xl:p-4" v-if="props.actions.length"></th>
          </tr>
        </thead>
        <tbody class="bg-white text-lg cera-pro-light">
          <tr
            v-for="(datum, i) in rows || []"
            :class="{
              'border-b-2': i < data?.length - 1,
            }"
          >
            <td class="p-1 sm:p-2 md:p-4 lg:py-6" v-if="props.autoNumbering">
              <span v-if="pagination?.page && pagination.size"
                >{{ (pagination.page - 1) * pagination.size + i + 1 }}
              </span>
              <span v-else>
                {{ i + 1 }}
              </span>
            </td>
            <td
              class="p-1 sm:p-2 md:p-4 lg:py-6 break-words max-w-sm"
              v-for="(column, key) in props.columns"
            >
              <slot v-if="slots[key]" :name="key" :datum="datum"></slot>
              <div v-else-if="typeof column == 'object' && column.type">
                <div v-if="column.type === 'boolean'">
                  <span
                    :class="datum[key] ? 'text-green-500' : 'text-red-500'"
                    >{{ datum[key] ? 'Yes' : 'No' }}</span
                  >
                </div>
                <div v-else-if="column.type === 'datetime'">
                  {{ new Date(datum[key]).toLocaleString() }}
                </div>
                <div v-else-if="column.type === 'time'">
                  {{ new Date(datum[key]).toLocaleTimeString() }}
                </div>

                <div v-else-if="column.type === 'date'">
                  {{ new Date(datum[key]).toLocaleDateString() }}
                </div>
                <div v-else-if="column.type === 'image'">
                  <img
                    v-if="datum[key]"
                    :src="datum[key]"
                    :alt="key"
                    :class="
                      customStyling[key]
                        ? customStyling[key]
                        : 'w-16 h-16 object-contain'
                    "
                  />
                  <!-- else alternative image  -->
                </div>
                <div v-else-if="column.type === 'html'">
                  <div v-html="datum[key]"></div>
                </div>
                <NuxtLink
                  class="text-blue-700 underline"
                  v-else-if="column.type && column.type === 'link'"
                  :href="datum[key]"
                  target="_blank"
                  :class="customStyling[key]"
                  >{{ datum[key] }}</NuxtLink
                >
              </div>
              <div v-else-if="typeof column == 'object' && column.render">
                {{ column.render(datum[key]) }}
              </div>
              <span v-else-if="key.includes('.')" :class="customStyling[key]">{{
                getProperty(datum, key)
              }}</span>
              <span v-else :class="customStyling[key]">{{ datum[key] }}</span>
            </td>
            <td class="p-1 sm:p-2 md:p-4 lg:py-6" v-if="props.actions.length">
              <div class="flex gap-2 items-center">
                <div
                  v-if="props.actions.includes('report')"
                  class="relative"
                  @click="sendAction('report', datum, $event)"
                >
                  <div class="relative peer cursor-pointer">
                    <UIcon name="i-mdi-file-chart" class="h-6 w-6" />
                    <slot name="reportCount" :datum="datum"></slot>
                  </div>
                  <div
                    class="w-full p-2 hidden peer-hover:block hover:block absolute -top-10 text-xs -left-1/2 z-30"
                  >
                    <div class="relative">
                      <span
                        class="text-xs text-dibo-blue-600 bg-dibo-blue-50 border border-dibo-blue-400 rounded-md py-2 px-4 whitespace-nowrap z-10 hover:bg-dibo-blue-100 cursor-pointer"
                        >View Reports</span
                      >
                      <div
                        class="rotate-180 translate-y-3/4 translate-x-3 z-40"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 159.27 139.43"
                        >
                          <g>
                            <path
                              class="cls-1"
                              fill="#f0f7fd"
                              stroke="#74b6e4"
                              stroke-miterlimit="10"
                              stroke-width="20px"
                              d="M157.97,138.68C131.86,93.46,105.75,48.23,79.64,3L1.3,138.68"
                            />
                          </g>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-if="props.actions.includes('eye')"
                  class="cursor-pointer"
                  @click="emit('eye', datum)"
                >
                  <UIcon name="i-mdi-eye" class="h-6 w-6" />
                </div>
                <div
                  v-if="
                    tickKey
                      ? props.actions.includes('toggle') &&
                        datum[tickKey] === 'Approved'
                      : props.actions.includes('toggle')
                  "
                  class="translate-y-2"
                >
                  <label
                    class="inline-flex relative items-center cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      :checked="datum[props.toggleKey]"
                      class="sr-only peer"
                      @input="toggleChange(datum, $event)"
                    />
                    <div
                      class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
                    ></div>
                  </label>
                </div>
                <div
                  v-if="
                    tickKey
                      ? props.actions.includes('tick') &&
                        datum[tickKey] !== 'Approved'
                      : props.actions.includes('tick')
                  "
                >
                  <slot name="approve" :datum="datum" :sendAction="sendAction">
                    <div
                      class="text-green-500 cursor-pointer"
                      @click="
                        sendAction('Approve', datum, $event, {
                          status: 'Approved',
                        })
                      "
                    >
                      <UIcon name="i-mdi-check-bold" class="h-6 w-6" />
                    </div>
                  </slot>
                </div>
                <div
                  v-if="
                    tickKey
                      ? props.actions.includes('cross') &&
                        datum[tickKey] === 'Pending'
                      : props.actions.includes('cross')
                  "
                >
                  <slot name="reject" :datum="datum" :sendAction="sendAction">
                    <div
                      class="text-red-500 cursor-pointer"
                      @click="
                        ($event) => {
                          sendAction('Reject', datum, $event, {
                            status: 'Rejected',
                          })
                        }
                      "
                    >
                      <UIcon
                        name="i-mdi-alpha-x-circle-outline"
                        class="h-6 w-6"
                      />
                    </div>
                  </slot>
                </div>
                <div
                  v-if="props.actions.includes('edit')"
                  @click="onEditClick(datum.id)"
                  class="cursor-pointer"
                >
                  <UIcon name="i-mdi-circle-edit-outline" class="h-6 w-6" />
                </div>
                <div v-if="props.actions.includes('delete')">
                  <slot name="delete" :datum="datum">
                    <div
                      class="cursor-pointer text-red-600"
                      @click="deleteObj(datum, $event)"
                    >
                      <UIcon name="i-mdi-delete-outline" class="h-6 w-6" />
                    </div>
                  </slot>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else>Sorry, no records found!</div>
    </div>
    <Pagination
      v-if="pagination?.pages && enablePagination"
      v-model="page"
      :totalPages="pagination.pages"
      v-on:update:modelValue="pageChanged"
    />
    <Modal
      @close="modalClosed"
      @confirm="modalSaved"
      :isOpen="showCreateModal"
      title="Add New"
      :showButtons="false"
    >
      <slot name="addForm" @modalSaved="modalSaved"></slot>
      <component
        v-if="formComponent"
        :is="formComponent"
        :is-modal="true"
        @modalSaved="modalSaved"
        @modalClosed="modalClosed"
      ></component>
    </Modal>
    <Modal
      @close="modalClosed"
      @confirm="modalSaved"
      :isOpen="showEditModal"
      title="Edit"
      :showButtons="false"
    >
      <component
        v-if="formComponent"
        :is="formComponent"
        :is-modal="true"
        :editing-id="editingId"
        @modalSaved="modalSaved"
        @modalClosed="modalClosed"
      ></component>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { getProperty } from '~~/server/lib/helpers'
import { useSlots } from 'vue'
// import * as pkg from 'vue-toastification'
import { withQuery } from 'ufo'

interface ToggleEventData {
  value: boolean
  obj: Record<string, any>
  change: Record<string, boolean>
  el: HTMLInputElement
  callback: () => void
}

// TODO Import from useRest
interface Pagination {
  count: number
  page: number
  pages: number
  size: number
}

const showCreateModal = ref(false)
const onCreateClick = () => {
  showCreateModal.value = true
}

const editingId: Ref<null | number> = ref(null)
const showEditModal = ref(false)
const onEditClick = (id: number) => {
  editingId.value = id
  showEditModal.value = true
}

const slots = useSlots()
// const { useToast } = pkg
// const toast = useToast()

const emit = defineEmits([
  'report',
  'deleteObj',
  'edit',
  'toggle',
  'tick',
  'cross',
  'eye',
  'newAction',
  'pageChanged',
])

const props = defineProps({
  columns: {
    type: Object as PropType<
      Record<
        string,
        | string
        | {
            title: string
            type?: 'boolean' | 'datetime' | 'date' | 'time' | 'image' | 'link' | 'html'
            render?: (value: any) => string
            titleIsHtml?: boolean
          }
      >
    >,
  },
  data: {
    type: Array as PropType<Record<string, any>[]>,
    required: false,
  },
  endpoint: {
    type: String,
    required: false,
  },
  actions: {
    type: Array,
    default: [],
  },
  autoNumbering: {
    type: Boolean,
    default: false,
  },
  searchLabel: {
    type: String,
    default: 'Search ...',
  },
  searchType: {
    type: String,
    default: 'text',
  },
  customStyling: {
    type: Object,
    default: {},
  },
  customFilterStyling: {
    type: String,
  },
  customDropDownWidth: {
    type: String,
  },
  toggleKey: {
    type: String,
    default: null,
  },
  tickKey: {
    type: String,
    default: null,
  },
  formComponent: {
    type: Object,
    required: false,
  },
  enableAdd: {
    type: Boolean,
    default: true,
  },
  pagination: {
    type: Object as PropType<Pagination>,
    required: false,
  },
  enableSearch: {
    type: Boolean,
    default: true,
  },
  enablePagination: {
    type: Boolean,
    default: true,
  },
  propagateActions: {
    type: Array,
    default: [],
  },
})

const endpoint = props.endpoint

// TODO Use single type decalation on backend and frontend
type filterDataType = Record<
  string,
  { label: string; optionLabel: string; data: object[] }
>

// TODO Use single interface decalation on backend and frontend
interface ListResponse {
  results: Record<string, any>
  pagination: Pagination
  filterData?: filterDataType
}

const route = useRoute()
const router = useRouter()

const {
  page: pageQueryValue,
  q: qQueryValue,
  search: searchQueryValue,
  ...filterQueryValues
} = route.query

// Get page number from query
const pageParam: string = pageQueryValue?.toString() || '1'
let pageNum = +pageParam
if (isNaN(pageNum) || pageNum < 1) {
  pageNum = 1
}
const pagination: Ref<Pagination | {}> = ref(props.pagination || {})
const page: Ref<number> = ref(pageNum)

const searchQuery = ref(searchQueryValue || qQueryValue || '')
const loading = ref(false)
const initiallyLoaded = ref(false)
const filterData: Ref<filterDataType | null> = ref(null)

// const rows: Ref<Array<Record<string, any>>> = ref(props.data)
const rows: Ref = ref(props.data || [])

watch(
  () => props.data,
  (newData) => {
    rows.value = newData
  }
)

watch(
  () => props.pagination,
  (newPagination) => {
    if (newPagination) pagination.value = newPagination
  }
)

let cleanedFilterValues = Object.fromEntries(
  Object.entries(filterQueryValues).map(([k, v]) => {
    if (v === 'true') {
      return [k, true]
    } else if (v === 'false') {
      return [k, false]
    }
    return [k, v]
  })
)
const filters = ref(cleanedFilterValues)

const loadData = async () => {
  if (!endpoint || props.data) return
  loading.value = true
  let url = withQuery(endpoint, { page: page.value.toString() })
  if (searchQuery.value) {
    url = withQuery(url, { search: searchQuery.value })
  }
  if (filters.value) {
    url = withQuery(url, filters.value)
  }
  // TODO Handle errors
  const { data: data } = await useFetch(url)
  const response = <ListResponse>data.value
  rows.value = response.results
  pagination.value = response.pagination
  if (response.filterData) {
    filterData.value = response.filterData
  }
  initiallyLoaded.value = true
  loading.value = false
}

loadData()

// function updateUrl() {
//   let url = route.fullPath
//   if (page.value == 1) {
//     url = withQuery(url, { page: undefined })
//   } else {
//     url = withQuery(url, { page: page.value.toString() })
//   }
//   if (searchQuery.value) {
//     url = withQuery(url, { search: searchQuery.value })
//   } else {
//     url = withQuery(url, { search: undefined })
//   }
//   router.push(url)
// }

const pageChanged = (newVal: number) => {
  let url = route.fullPath
  if (page.value == 1) {
    url = withQuery(url, { page: undefined })
  } else {
    url = withQuery(url, { page: page.value.toString() })
  }
  router.push(url)
  emit('pageChanged', newVal)
  loadData()
}

const performFilter = () => {
  let url = route.fullPath
  url = withQuery(url, { page: undefined })
  if (searchQuery.value) {
    url = withQuery(url, { search: searchQuery.value })
  } else {
    url = withQuery(url, { search: undefined })
  }
  // TODO Check filters
  router.push(url)
  page.value = 1
  loadData()
}

const performReset = () => {
  page.value = 1
  searchQuery.value = ''
  filters.value = {}
  let url = route.path
  router.push(url)
  loadData()
}

const deleteObj = async (datum: Record<string, any>, ev: Event) => {
  const modal = useModal()
  modal.confirmDelete().then(() => {
    if (endpoint) {
      executeDelete(datum)
    } else {
      emit('deleteObj', datum)
    }
  })
}

const executeDelete = async (datum: Record<string, any>) => {
  const objId: number = datum.id
  useFetch(`${endpoint?.split('?')[0]}/${objId}`, {
    method: 'DELETE',
  }).then((res) => {
    const error = res.error.value
    // if (error) {
    //   toast.error(
    //     'Deleting failed! May be other objects are dependent on this object.',
    //     {
    //       timeout: 2000,
    //     }
    //   )
    // } else {
    //   toast.success('Deleted successfully!', {
    //     timeout: 2000,
    //   })
    //   loadData()
    // }
  })
}

const toggleChange = async (datum: Record<string, any>, ev: Event) => {
  const target = <HTMLInputElement>ev.currentTarget
  const val = target.checked
  await nextTick()
  target.checked = !val
  const newDct: Record<string, boolean> = {}
  newDct[props.toggleKey] = val
  const newDatum = Object.assign(datum, newDct)
  const doToggle = () => {
    target.checked = !target.checked
  }
  const eventData: ToggleEventData = {
    value: val,
    obj: newDatum,
    change: newDct,
    el: target,
    callback: doToggle,
  }
  await nextTick()
  target.checked = !val
  if (endpoint) {
    executeToggle(eventData)
  } else {
    emit('toggle', eventData)
  }
}

const sendEventRequest = async (eventData: ToggleEventData | EventData) => {
  const actionType = eventData.value ? 'Activate' : 'Deactivate'
  const objId: number = eventData.obj.id
  useFetch(`${endpoint?.split('?')[0]}/${objId}`, {
    method: 'PATCH',
    body: eventData.change || eventData.obj,
  }).then((res) => {
    const error = res.error.value
    // if (error) {
    //   toast.error(
    //     `${actionType} Failed! May be other objects are dependent on this object.`,
    //     {
    //       timeout: 2000,
    //     }
    //   )
    // } else {
    //   eventData.callback && eventData.callback()
    // }
  })
}

const executeToggle = async (eventData: ToggleEventData) => {
  const modal = useModal()
  if (eventData.value) {
    modal.confirmActivate().then(() => sendEventRequest(eventData))
  } else {
    modal.confirmDeactivate().then(() => sendEventRequest(eventData))
  }
}

interface EventData {
  action: string
  obj: Record<string, any>
  el: HTMLInputElement
  change?: Record<string, any>
  callback?: () => void
}

const sendAction = async (
  action: string,
  datum: Record<string, any>,
  ev: Event,
  change?: Record<string, any>
) => {
  const target = <HTMLInputElement>ev.currentTarget
  await nextTick()
  const doChange = () => {
    Object.assign(datum, change || {})
  }
  const eventData: EventData = {
    action,
    change,
    obj: datum,
    el: target,
    callback: doChange,
  }
  if (props.propagateActions.includes(action)) {
    emit('newAction', eventData)
  } else {
    const modal = useModal()
    modal.confirmAction(action).then(() => {
      if (endpoint) {
        sendEventRequest(eventData)
      } else {
        emit('newAction', eventData)
      }
    })
  }
}

const modalClosed = () => {
  showCreateModal.value = false
  showEditModal.value = false
}

const modalSaved = () => {
  modalClosed()
  loadData()
}
</script>

<style>
.computed-filter .v-select {
  height: 100%;
}
.computed-filter .v-select.input-primary {
  padding-top: 1rem;
}
</style>
