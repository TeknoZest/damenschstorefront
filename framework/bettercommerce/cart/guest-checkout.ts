import { SHIPPING_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'
interface Props {
  basketId: string
  email: string
  notifyByEmail: boolean
  notifyBySms: boolean
  notifyByPost: boolean
}

export default function useGuestCheckout() {
  return async function handler({
    basketId,
    email,
    notifyByEmail,
    notifyBySms,
    notifyByPost,
  }: Props) {
    try {
      const response: any = await fetcher({
        url: `${SHIPPING_ENDPOINT}/${basketId}/guest-checkout`,
        method: 'post',
        data: {
          email,
          notifyByEmail,
          notifyBySms,
          notifyByPost,
        },
        headers: {
          DomainId: process.env.NEXT_PUBLIC_DOMAIN_ID,
        },
      })
      return response.result
    } catch (error: any) {
      console.log(error)
      // throw new Error(error.message)
    }
  }
}