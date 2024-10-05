interface Image {
  id: string
  slug: string
  blur_hash: string
  alt_description: string
  user: {
    id: string
    username: string
    name: string
    portfolio_url: string
  }
  links: {
    html: string
    photos: string
    likes: string
    portfolio: string
  }
  urls: {
    small: string
    regular: string
    full: string
    raw: string
    thumb: string
  }
}

interface Images {
  images: Image[]
}

export function getImages(): Promise<Images> {
  return useNuxtApp().$api('/images')
}
