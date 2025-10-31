import { useState, useEffect } from 'react'

export default function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(url)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(err => { console.error(err); setLoading(false) })
  }, [url])

  return { data, loading }
}
