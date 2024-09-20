export const getPublicIdFromUrl=(url)=> {
    return url.match(/Threads\/[a-zA-Z0-9]+/)[0]
  }

  