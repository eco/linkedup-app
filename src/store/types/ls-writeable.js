import { writable } from 'svelte/store'

const prefix = 'com.eco.longy-app'

const lsWritable = (name, initialValueWhenEmpty) => {
  const lsKey = [prefix, name].join('.')
  const json = localStorage.getItem(lsKey)

  const initialValue = json ? JSON.parse(json) : initialValueWhenEmpty
  const { subscribe, set } = writable(initialValue)

  return {
    subscribe,
    set: val => {
      localStorage.setItem(lsKey, JSON.stringify(val))
      set(val)
    },
  }
}

export default lsWritable
