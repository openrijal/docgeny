// import { orgMiniMicrodata } from '~/lib/constants'

const decodeHtml = (encodedString) => {
  const translatePattern = /&(nbsp|amp|quot|lt|gt);/g
  const translate = {
    nbsp: ' ',
    cent: '¢',
    pound: '£',
    yen: '¥',
    euro: '€',
    copy: '©',
    reg: '®',
    lt: '<',
    gt: '>',
    quot: '"',
    amp: '&',
    apos: "'",
  }
  return encodedString
    .replace(translatePattern, function (match, entity) {
      return translate[entity]
    })
    .replace(/&#(\d+);/gi, function (match, numStr) {
      const num = parseInt(numStr, 10)
      return String.fromCharCode(num)
    })
}

const stripWhiteSpace = (text) => {
  // trim multiple consecutive spaces down to only one space, trim leading and trailing white spaces
  return text.replace(/\s+/g, ' ').trim()
}

const getMetaDescription = (text) => {
  if (!text) {
    return ''
  }
  // remove html tags
  let description = text.replace(/<\/?[^>]+(>|$)/g, '')
  description = stripWhiteSpace(decodeHtml(description))
  // slice to first 170 characters
  return description.substring(0, 170)
}

export const useOg = (data = {}) => {
  const { title, image, description, content, type, url, ld } = data

  const metaDct = {}
  const headDct = {}

  if (title) {
    metaDct.title = title
    headDct.title = title
    metaDct.ogTitle = title
  }

  if (type) {
    metaDct.ogType = type
  }

  if (image) {
    metaDct.ogImage = image
    metaDct.twitterCard = 'summary_large_image'
  }

  if (url) {
    headDct.link = [
      {
        rel: 'canonical',
        href: url,
      },
    ]
    metaDct.ogUrl = url
  }

  if (description) {
    const desc = stripWhiteSpace(
      description.replace(/&nbsp;/g, ' ').replace(/<\/?[^>]+(>|$)/g, '')
    )
    metaDct.description = desc
    metaDct.ogDescription = desc
  } else if (content) {
    const trimmed = getMetaDescription(content)
    metaDct.description = trimmed
    metaDct.ogDescription = trimmed
  }

  // Process ld-json
  if (ld) {
    ld['@context'] = 'https://schema.org'

    if (url) {
      if (!('@id' in ld)) ld['@id'] = url
      if (!('url' in ld)) ld.url = url
    }

    if (type === 'article') {
      ld.mainEntityOfPage = {
        '@type': 'WebPage',
      }
    }

    if (image && !('image' in ld)) ld.image = image

    if (title && !('name' in ld)) {
      ld.name = title
    }

    if (content && !description && !('description' in ld)) {
      let desc = content.replace(/<\/?[^>]+(>|$)/g, '')
      desc = stripWhiteSpace(desc)
      ld.description = desc
    }

    if ('authorObj' in ld && ld.authorObj) {
      const author = {}
      author['@type'] = ld.authorObj.is_organization ? 'Organization' : 'Person'
      author.name = ld.authorObj.name
      if (ld.authorObj.photo) {
        author.image = ld.authorObj.photo
      }
      ld.author = author
      delete ld.authorObj
    } else if (type === 'article') {
      // ld.author = orgMiniMicrodata
    }

    if ('publisher' in ld && ld.publisher === true)
      // ld.publisher = orgMiniMicrodata

    headDct.script = [
      {
        type: 'application/ld+json',
        children: JSON.stringify(ld),
      },
    ]
  }

  // if (Object.keys(metaDct).length) {
  //   useServerSeoMeta(metaDct)
  // }
  // if (Object.keys(headDct).length) {
  //   useHead(headDct)
  // }
}
