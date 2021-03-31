const tokenData = 'token_data'

export function getTokenData() {
  try {
    return JSON.parse(localStorage.getItem(tokenData))
  } catch ($e) {
    return {}
  }
}

export function setTokenData(token) {
  return localStorage.setItem(tokenData, JSON.stringify(token))
}

export function removeTokenData() {
  return localStorage.removeItem(tokenData)
}

const frontItem = 'front_item'

export function getFrontItem() {
  try {
    return JSON.parse(localStorage.getItem(frontItem))
  } catch ($e) {
    return {}
  }
}

export function setFrontItem(token) {
  return localStorage.setItem(frontItem, JSON.stringify(token))
}

export function removeFrontItem() {
  return localStorage.removeItem(frontItem)
}

