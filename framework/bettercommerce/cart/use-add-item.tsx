import { BASKET_ENDPOINT } from '@components/utils/constants'
import fetcher from '../fetcher'
interface Props {
  basketId?: string
  productId?: string
  qty?: number
  manualUnitPrice?: number
  displayOrder?: number
  stockCode?: string
}

export default function useAddItem() {
  return async function handler({
    basketId,
    productId,
    qty,
    manualUnitPrice,
    displayOrder,
    stockCode,
  }: Props) {
    const data = {
      basketId,
      productId,
      qty,
      manualUnitPrice,
      displayOrder,
      stockCode,
    }
    console.log(data)
    try {
      const response: any = await fetcher({
        url: `${BASKET_ENDPOINT}/${basketId}/add`,
        method: 'post',
        data,
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
