import config from '../config'

const contactHeaders = [
  {
    name: 'Name',
    get: c => c.name,
  },
  {
    name: 'Photo',
    get: c => c.imageUrl,
  },
  {
    name: 'Message',
    get: c => c.message,
  },
  ...config.platforms.map(p => {
    return {
      name: p.name,
      get: c => {
        if (!c.sharedAttrs) {
          return null
        }

        const attr = c.sharedAttrs.find(a => a.label === p.name)
        if (!attr) {
          return null
        }

        switch (p.type) {
          case 'url':
            return `https://${p.prefix}${attr.value}`
          default:
            return attr.value
        }
      },
    }
  }),
]

const escapeCsvValue = value => {
  if (!value) {
    return value
  }

  const containsSeparator = value.indexOf(',') > -1
  const containsQuotes = value.indexOf('"') > -1
  const containsNewline = value.indexOf('\n') > -1

  if (containsSeparator || containsQuotes || containsNewline) {
    const newValue = value.replace(/"/g, '""')
    return `"${newValue}"`
  }

  return value
}

export const createContactsCsv = contacts => {
  const headers = contactHeaders.map(h => h.name)
  const contactRows = contacts.map(c =>
    contactHeaders.map(h => h.get(c) || null).map(escapeCsvValue)
  )
  const rows = [headers, ...contactRows]
  return rows.map(r => r.join(',')).join('\n')
}
