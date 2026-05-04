const buildUrl = (functionName, params = {}) => {
  const url = new URL(`/.netlify/functions/${functionName}`, window.location.origin)

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value))
    }
  })

  return url.toString()
}

const request = async (functionName, options = {}, params = {}) => {
  const response = await fetch(buildUrl(functionName, params), {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    throw new Error(data?.error || 'Request failed')
  }

  return data
}

export const apiGet = (functionName) => request(functionName, { method: 'GET' })
export const apiPost = (functionName, body) =>
  request(functionName, {
    method: 'POST',
    body: JSON.stringify(body),
  })
export const apiPut = (functionName, body) =>
  request(functionName, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
export const apiDelete = (functionName, id) => request(functionName, { method: 'DELETE' }, { id })
