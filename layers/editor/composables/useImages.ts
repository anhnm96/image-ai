import { getImages } from '~/api'

export function useGetImages() {
  return useQuery({ queryKey: ['images'], queryFn: () => getImages() })
}
