import { readable } from 'svelte/store'

const fetchable = (fetchFn, opts = {}) => {
  let value = {
    loading: false,
    error: false,
    data: null,
  }

  const store = readable(value, set => {
    const update = newProps => {
      value = { ...value, ...newProps }
      set(value)
    }

    const runFetch = async () => {
      update({ loading: true, error: false })

      try {
        const data = await fetchFn()
        update({ data })
      } catch (e) {
        update({ error: e })
      } finally {
        update({ loading: false })
      }
    }

    runFetch()

    if (opts.pollingInterval) {
      const timerId = setInterval(runFetch, opts.pollingInterval)
      return () => clearInterval(timerId)
    }
  })

  return store
}

export default fetchable
