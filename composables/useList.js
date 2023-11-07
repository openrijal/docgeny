const sortOnKeys = (dict) => {
  const sorted = []
  for (const key in dict) {
    sorted[sorted.length] = key
  }
  sorted.sort()

  const tempDict = {}
  for (let i = 0; i < sorted.length; i++) {
    tempDict[sorted[i]] = dict[sorted[i]]
  }

  return tempDict
}

export const useList = async (endpoint, postFetch, customConfig) => {
  // TODO don't ask for aggregate in subsequent pagination requests

  const route = useRoute()
  const router = useRouter()
  const response = ref(null)
  const scrollElement = ref(null)

  const page = ref(route.query.page || 1)
  const slug = route.params.slug
  const searchQuery = ref(route.query.search || route.query.q || '')
  const filters = ref({})
  const isFilterOpen = ref(false)
  let firstFetch = ref(true)

  const defaults = {
    use_slugged_url_for_filter: true,
    use_slug_for_endpoint: true,
  }

  // Check for slugged filters
  if (route.params.filter) {
    const dct = {}
    const arr = route.params.filter.filter((f) => {
      if (f) return f
    })
    arr.forEach(function (a, i, aa) {
      if (i & 1) {
        dct[aa[i - 1]] = a.split(',')
      }
    })
    if (Object.keys(dct).length) {
      filters.value = dct
    }
  }

  const config = Object.assign({}, defaults, customConfig)

  const buildParamUrl = (url, params) => {
    const queryString = Object.keys(params)
      .reduce(function (acc, key) {
        const value = params[key]
        // return acc.concat([`${key}=${value.join(',').toLowerCase()}`])
        return acc.concat([`${key}=${value.join(',')}`])
      }, [])
      .join('&')
    return url + '?' + queryString
  }

  const buildSluggedUrl = (url, selections) => {
    const builtString = Object.keys(selections)
      .reduce(function (acc, key) {
        if (Array.isArray(selections[key]) && selections[key].length) {
          return acc.concat([key, selections[key].join(',')])
        } else {
          return acc
        }
      }, [])
      .join('/')
    let fullUrl = url.replace(/\/+$/, '') + '/' + builtString
    if (!fullUrl.endsWith('/')) fullUrl = fullUrl + '/'
    return fullUrl
  }

  const filterUrl = computed(() => {
    let routePath = route.path.replace(/%2F/g, '/')
    // Remove filter parts from existing url
    if (route.params.filter?.length) {
      const filterPath = route.params.filter.join('/')
      routePath = routePath.replace(filterPath, '')
    }
    if (config.use_slugged_url_for_filter) {
      return buildSluggedUrl(routePath, filters.value)
    } else {
      return buildParamUrl(routePath, filters.value)
    }
  })

  const filtersUpdate = (selections) => {
    // Merge new selections with existing filters
    let dct = filters.value
    dct = Object.assign({}, filters.value, selections)
    dct = sortOnKeys(dct)
    filters.value = dct
    router.push({ path: filterUrl.value })
    page.value = 1
    // loadData()
  }

  watch(
    () => route.query,
    (newQuery, oldQuery) => {
      const newPage = newQuery.page || 1
      const oldPage = oldQuery.page || 1
      if (newPage !== oldPage) {
        page.value = newPage
        loadData()
      }
      if (newQuery.search !== oldQuery.search) {
        searchQuery.value = newQuery.search
        loadData()
      }
      if (newQuery.q !== oldQuery.q) {
        searchQuery.value = newQuery.q
        loadData()
      }
    }
  )

  const requestUrl = () => {
    let url = endpoint
    if (config.use_slug_for_endpoint && slug) {
      url = `${endpoint}${slug}/`
    }
    let params = Object.assign({}, filters.value, { page: [page.value] })
    if (searchQuery.value) {
      params = Object.assign({}, filters.value, { q: [searchQuery.value] })
    }
    return buildParamUrl(url, params)
  }

  const searchPerformed = (searchQuery) => {
    router.push({
      path: route.fullPath,
      query: { search: searchQuery },
    })
  }

  const fetchError = ref(null)

  const loadData = async () => {
    const url = requestUrl()
    const { data, pending, error } = await useApi(url)
    if (error.value) {
      fetchError.value = error
      firstFetch.value = false
    } else {
      response.value = data.value
      firstFetch.value = false
      if (postFetch && typeof postFetch === 'function') {
        try {
          postFetch(response.value, { filterUrl })
        } catch (error) {
          console.error(error)
        }
      }
    }
  }
  await loadData()

  const firstFetchPending = computed(() => {
    // return firstFetch && fetchState.pending
    return firstFetch.value
  })

  const toggleFilter = () => {
    isFilterOpen.value = !isFilterOpen.value
  }

  const filterClosed = () => {
    isFilterOpen.value = false
  }

  return {
    response,
    fetchError,
    scrollElement,
    page,
    slug,
    filtersUpdate,
    firstFetchPending,
    filters,
    filterUrl,
    isFilterOpen,
    toggleFilter,
    searchPerformed,
    filterClosed,
  }
}
