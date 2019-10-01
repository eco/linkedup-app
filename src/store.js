import { writable } from 'svelte/store'

const prefix = 'com.eco.longy-app'

const lsWritable = name => {
  const lsKey = [prefix, name].join('.')
  const json = localStorage.getItem(lsKey)

  let initialValue
  if (json) {
    initialValue = JSON.parse(json)
  }

  const { subscribe, set } = writable(initialValue)

  return {
    subscribe,
    set: val => {
      localStorage.setItem(lsKey, JSON.stringify(val))
      set(val)
    },
  }
}

export const user = lsWritable('user')
