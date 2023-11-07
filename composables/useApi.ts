// https://stackoverflow.com/questions/72041740/how-to-set-global-api-baseurl-used-in-usefetch-in-nuxt-3

// https://stackoverflow.com/questions/72041740/how-to-set-global-api-baseurl-used-in-usefetch-in-nuxt-3
import type { UseFetchOptions } from '#app'
import type { NitroFetchRequest } from 'nitropack'
import type { KeyOfRes } from 'nuxt/dist/app/composables/asyncData'
// import { useToast } from 'vue-toastification'

import { getCurrentInstance } from 'vue'

function checkIfInsideSetup() {
  const instance = getCurrentInstance()
  return instance !== null
}

function getErrorString(data: Record<string, any>) {
  if (
    data.non_field_errors &&
    Array.isArray(data.non_field_errors) &&
    data.non_field_errors.length
  ) {
    return data.non_field_errors[0]
  } else if (typeof data === 'string') {
    return data
  } else if (Object.keys(data).length) {
    let error = data[Object.keys(data)[0]]
    if (Array.isArray(error) && error.length) {
      error = error[0]
    }
    if (error.detail) return error.detail
    return error
  } else if (typeof data === 'object') {
    return data
  }
}

export async function useApi<T>(
  request: NitroFetchRequest,
  opts?:
    | UseFetchOptions<
        T extends void ? unknown : T,
        (res: T extends void ? unknown : T) => T extends void ? unknown : T,
        KeyOfRes<
          (res: T extends void ? unknown : T) => T extends void ? unknown : T
        >
      >
    | undefined,
  propagateErrors?: boolean,
  reactive?: boolean
) {
  const config = useRuntimeConfig()
  const router = useRouter()
  const isSetup = checkIfInsideSetup()

  const returnOnError = () => {
    if (propagateErrors) {
      return Promise.resolve({ data, pending, error, refresh })
    } else {
      return Promise.reject({ data, pending, error, refresh })
    }
  }

  const fetchOpts = Object.assign({}, opts)

  if (!reactive) {
    if (fetchOpts.headers) {
      fetchOpts.headers = Object.assign({}, fetchOpts.headers)
    }
    if (fetchOpts.body) {
      fetchOpts.body = Object.assign({}, fetchOpts.body)
    }
  }

  const user = useStatefulCookie('auth')
  if (user.value?.token) {
    fetchOpts.headers = fetchOpts.headers || {}
    fetchOpts.headers.Authorization = `Token ${user.value.token}`
  }

  const { data, pending, error, refresh } = await useFetch<T>(request, {
    baseURL: config.public.baseURL,
    ...fetchOpts,
  })

  if (error.value) {
    // const toast = useToast()
    if (error.value.statusCode === 401 || error.value.statusCode === 403) {
      user.value = null
      fetchOpts.headers?.Authorization && delete fetchOpts.headers.Authorization
      // TODO Only refetch if 401 is due to invalid token (not due to missing token)
      const response = await $fetch(request, {
        baseURL: config.public.baseURL,
        ...fetchOpts,
      })
      const newData = ref(response)
      const newError = ref(null)
      return Promise.resolve({
        data: newData,
        pending,
        error: newError,
        refresh,
      })
    } else if (
      error.value.statusCode === 406 ||
      error.value.statusCode === 400
    ) {
      const data = error.value.data
      // toast.error(getErrorString(data) || 'Bad request.', { timeout: 5000 })
      return returnOnError()
    } else if (error.value.statusCode === 403) {
      const data = error.value.data
      // toast.error(
      //   getErrorString(data) ||
      //     "You don't have permission to perform this action.",
      //   { timeout: 5000 }
      // )
      if (isSetup) {
        // TODO Maybe redirect to the previous page?
        await navigateTo('/')
      }
      return returnOnError()
    } else if (error.value.statusCode === 404) {
      // toast.error('Resource not found!', { timeout: 5000 })
      throw createError({
        statusCode: 404,
        fatal: true,
      })
    } else if (error.value.statusCode === 429) {
      if (error.value.data && error.value.data.detail) {
        // toast.error(error.value.data.detail, { timeout: 5000 })
        // TODO Read headers from response
      } else if (error.value.response?.headers.get('Retry-After')) {
        // toast.error(
        //   `Too many requests. Please retry after ${error.value.response.headers.get(
        //     'Retry-After'
        //   )} seconds!`,
        //   { timeout: 5000 }
        // )
      } else {
        // toast.error('Too many requests!', { timeout: 5000 })
      }
      return returnOnError()
    } else {
      return Promise.reject(error)
    }
  } else {
    return Promise.resolve({ data, pending, error, refresh })
  }
}
