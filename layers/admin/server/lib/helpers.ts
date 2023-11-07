export function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
  
  export function createNestedObject(desc: string, content: any) {
    let arr = desc.split('.')
    let obj = content
    arr.reverse().forEach((property) => {
      const newObj: Record<string, any> = {}
      newObj[property] = obj
      obj = newObj
    })
    return obj
  }
  
  export function getProperty(obj: object, desc: string) {
    let arr = desc.split('.')
    // @ts-ignore
    while (arr.length && (obj = obj[arr.shift()]));
    return obj
  }
  
  export function isObject(item: object) {
    return item && typeof item === 'object' && !Array.isArray(item)
  }
  
  export function mergeDeep(
    target: Record<string, any>,
    source: Record<string, any>
  ) {
    let output = Object.assign({}, target)
    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach((key) => {
        if (isObject(source[key])) {
          if (!(key in target)) Object.assign(output, { [key]: source[key] })
          else output[key] = mergeDeep(target[key], source[key])
        } else {
          Object.assign(output, { [key]: source[key] })
        }
      })
    }
    return output
  }
  
  // Exclude keys from obj
  export function excludeKeys<Obj, Key extends keyof Obj>(
    obj: Obj,
    keys: Key[]
  ): Omit<Obj, Key> {
    for (let key of keys) {
      delete obj[key]
    }
    return obj
  }
  
  export function isNumeric(str: string) {
    if (typeof str != 'string') return false // we only process strings!
    return (
      !isNaN(str as any) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
      !isNaN(parseFloat(str))
    ) // ...and ensure strings of whitespace fail
  }
  
  export function timeAgo(dateString: any) {
    const date = new Date(Date.parse(dateString))
    // @ts-ignore
    const seconds = Math.floor((new Date() - date) / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
  
    if (seconds < 60) {
      return `${zeroPad(seconds, 2)} sec ago`
    } else if (minutes < 60) {
      return `${zeroPad(minutes, 2)} min ago`
    } else if (hours < 24) {
      return `${zeroPad(hours, 2)} h ago`
    } else {
      return `${zeroPad(days, 2)} d ago`
    }
  }
  
  function zeroPad(num: number, length: number) {
    return (new Array(length).join('0') + num).slice(length * -1)
  }
  
  export function formatDate(inputDateTimeStr: string) {
    const inputDate = new Date(inputDateTimeStr)
  
    const month = inputDate.getMonth() + 1 // getMonth() returns 0-indexed value
    const day = inputDate.getDate()
    const year = inputDate.getFullYear()
  
    let hours = inputDate.getHours()
    const minutes = inputDate.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours = hours % 12
    hours = hours ? hours : 12
  
    const outputDate = `${month}/${day}/${year} ${hours}:${minutes
      .toString()
      .padStart(2, '0')} ${ampm}`
    return outputDate
  }
  
  export function containsObjectWithId(
    arr: Array<Record<string, any>>,
    id: number
  ) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].id === id) {
        return true
      }
    }
    return false
  }
  
  export function checkUserIsInAllowedGroups(
    userId: number,
    allowedGroups: Array<{
      users: Array<{ id: number }>
    }>
  ) {
    for (const group of allowedGroups) {
      for (const user of group.users) {
        if (user.id === userId) {
          return true
        }
      }
    }
    return false
  }
  