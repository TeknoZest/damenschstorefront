import { XIcon as XIconSolid } from '@heroicons/react/solid'
import { Layout } from '@components/common'
import { GetServerSideProps } from 'next'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { useCart as getCart } from '@framework/cart'
import cookie from 'cookie'
import { basketId as basketIdGenerator } from '@components/ui/context'
import Link from 'next/link'
import { useUI } from '@components/ui/context'
import cartHandler from '@components/services/cart'
import { PlusSmIcon, MinusSmIcon } from '@heroicons/react/outline'
import PromotionInput from '../components/cart/PromotionInput'
import { useEffect } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { NEXT_SHIPPING_PLANS } from '@components/utils/constants'
import {
  BTN_CHECKOUT_NOW,
  GENERAL_CATALOG,
  GENERAL_DISCOUNT,
  GENERAL_ORDER_SUMMARY,
  GENERAL_REMOVE,
  GENERAL_SHIPPING,
  GENERAL_SHOPPING_CART,
  GENERAL_TOTAL,
  IMG_PLACEHOLDER,
  ITEMS_IN_YOUR_CART,
  SUBTOTAL_INCLUDING_TAX,
} from '@components/utils/textVariables'

function Cart({ cart }: any) {
  const { setCartItems, cartItems, basketId } = useUI()
  const { addToCart } = cartHandler()

  const mapShippingPlansToItems = (plans?: any, items?: any) => {
    const itemsClone = [...items]
    return plans?.reduce((acc: any, obj: any) => {
      acc?.forEach((cartItem?: any) => {
        const foundShippingPlan = obj.items.find((item: any) => {
          return (
            item.productId.toLowerCase() === cartItem.productId.toLowerCase()
          )
        })
        if (foundShippingPlan) {
          cartItem.shippingPlan = obj
        }
      })
      return acc
    }, itemsClone)
  }

  const fetchShippingPlans = async () => {
    const shippingMethodItem: any = cart.shippingMethods.find(
      (method: any) => method.id === cart.shippingMethodId
    )

    const model = {
      BasketId: basketId,
      OrderId: '00000000-0000-0000-0000-000000000000',
      PostCode: '',
      ShippingMethodType: shippingMethodItem.type,
      ShippingMethodId: cart?.shippingMethodId,
      ShippingMethodName: shippingMethodItem.displayName,
      ShippingMethodCode: shippingMethodItem.shippingCode,
      DeliveryItems: cart?.lineItems?.map((item: any) => {
        return {
          BasketLineId: Number(item.id),
          OrderLineRecordId: '00000000-0000-0000-0000-000000000000',
          ProductId: item.productId,
          ParentProductId: item.parentProductId,
          StockCode: item.stockCode,
          Qty: item.qty,
          PoolCode: item.poolCode || null,
        }
      }),
      AllowPartialOrderDelivery: true,
      AllowPartialLineDelivery: true,
      PickupStoreId: '00000000-0000-0000-0000-000000000000',
      RefStoreId: null,
      PrimaryInventoryPool: 'PrimaryInvPool',
      SecondaryInventoryPool: 'PrimaryInvPool',
      IsEditOrder: false,
      OrderNo: null,
      DeliveryCenter: null,
    }
    const response = await axios.post(NEXT_SHIPPING_PLANS, { model })
    setCartItems({
      ...cart,
      lineItems: mapShippingPlansToItems(response.data, cart.lineItems),
    })
  }

  useEffect(() => {
    if (cart?.shippingMethods.length > 0) fetchShippingPlans()
    else {
      setCartItems(cart)
    }
  }, [])

  const handleItem = (product: any, type = 'increase') => {
    const asyncHandleItem = async () => {
      const data: any = {
        basketId,
        productId: product.id,
        stockCode: product.stockCode,
        manualUnitPrice: product.manualUnitPrice,
        displayOrder: product.displayOrderta,
        qty: -1,
      }
      if (type === 'increase') {
        data.qty = 1
      }
      if (type === 'delete') {
        data.qty = 0
        userCart.lineItems = userCart.lineItems.filter(
          (item: { id: any }) => item.id !== product.id
        )
      }
      try {
        const item = await addToCart(data)
        setCartItems(item)
      } catch (error) {
        console.log(error)
      }
    }
    asyncHandleItem()
  }

  const userCart = cartItems
  const isEmpty: boolean = userCart?.lineItems?.length === 0

  return (
    <div className="bg-white">
      <main className="max-w-2xl mx-auto sm:pt-4 pt-4 sm:pb-10 pb-0 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl">
          {GENERAL_SHOPPING_CART}
        </h1>
        {!isEmpty && (
          <form className="relative sm:mt-6 mt-8 lg:grid lg:grid-cols-12 lg:gap-x-4 lg:items-start xl:gap-x-4">
            <section aria-labelledby="cart-heading" className="lg:col-span-7">
              <h2 id="cart-heading" className="sr-only">
                {ITEMS_IN_YOUR_CART}
              </h2>

              <ul
                role="list"
              >
                {userCart.lineItems?.map((product: any, productIdx: number) => (
                  <li key={productIdx} className="flex py-4 sm:p-3 border border-gray-200 mb-2">
                    <div className="flex-shrink-0">
                      <Image
                        layout="fixed"
                        width={160}
                        height={200}
                        src={`${product.image}?fm=webp&h=200&w=200` || IMG_PLACEHOLDER}
                        alt={product.name}
                        className="w-16 h-full object-center object-cover sm:w-32 sm:h-full image"
                      ></Image>
                    </div>
                    <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                      <div className="relative sm:pr-9 pr-6 flex justify-between sm:pr-0 h-full">
                        <div className="flex flex-col justify-between h-full">
                          <div>
                            <div className="flex justify-between flex-col">
                              <h4 className='text-md font-bold text-black mb-2'>{product.brand}</h4>
                              <h3 className="text-sm my-2 sm:my-0">
                                <Link href={`/${product.slug}`}>
                                  <a
                                    href={product.slug}
                                    className="font-normal text-gray-600 hover:text-pink hover:underline text-md sm:text-lg"
                                  >
                                    {product.name}
                                  </a>
                                </Link>
                              </h3>
                            </div>

                            <p className="mt-1 text-md sm:text-lg font-bold text-black">
                              {product.price?.formatted?.withTax}
                              {product?.listPrice?.raw?.withTax > 0 && product?.listPrice?.raw?.withTax != product?.price?.raw?.withTax &&
                                <span className='px-2 text-sm line-through font-normal text-red-400'>{product?.listPrice?.formatted?.withTax}</span>
                              }
                            </p>
                            <div className='flex mt-2'>
                              <div className="border border-gray-200 sm:px-4 px-2 text-gray-900 flex flex-row hover:border-gray-700">
                                <MinusSmIcon
                                  onClick={() => handleItem(product, 'decrease')}
                                  className="w-6 cursor-pointer hover:text-pink"
                                />
                                <span className="text-md px-6 sm:py-2 py-1">
                                  {product.qty}
                                </span>
                                <PlusSmIcon
                                  className="w-6 cursor-pointer hover:text-pink"
                                  onClick={() => handleItem(product, 'increase')}
                                />
                              </div>
                            </div>
                            {product.children?.map(
                              (child: any, idx: number) => {
                                return (
                                  <div
                                    className="flex mt-3 border p-2"
                                    key={'child' + idx}
                                  >
                                    <div className="flex-shrink-0 w-12 h-12 border border-gray-200 overflow-hidden">
                                      <img
                                        src={child.image}
                                        alt={child.name}
                                        className="w-full h-full object-center object-cover"
                                      />
                                    </div>
                                    <div className="flex ml-5 justify-between font-medium text-gray-900">
                                      <Link href={`/${child.slug}`}>
                                        {child.name}
                                      </Link>
                                      <p className="ml-4">
                                        {child.price?.formatted?.withTax}
                                      </p>
                                      {/* <p className="mt-1 text-sm text-gray-500">{product.color}</p> */}
                                    </div>
                                    <div className="flex-1 flex items-center justify-end text-sm">
                                      {/* <p className="text-gray-500">Qty {product.quantity}</p> */}

                                      <button
                                        type="button"
                                        onClick={() =>
                                          handleItem(child, 'delete')
                                        }
                                        className="inline-flex text-gray-600 hover:text-red-500 -my-3 relative -top-3"
                                      >
                                        <span className="sr-only">
                                          {GENERAL_REMOVE}
                                        </span>
                                        <XIconSolid
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </button>
                                    </div>
                                  </div>
                                )
                              }
                            )}
                          </div>
                          <p className="py-5 text-sm font-medium text-gray-900 sm:block hidden">
                            {product.shippingPlan?.shippingSpeed}
                          </p>
                        </div>
                       
                        <div className="absolute top-0 right-0">
                          <button
                            type="button"
                            onClick={() => handleItem(product, 'delete')}
                            className="inline-flex text-gray-700 hover:text-red-500 -my-1 relative -top-0"
                          >
                            <span className="sr-only">{GENERAL_REMOVE}</span>
                            <XIconSolid
                              className="sm:h-5 sm:w-5 h-4 w-4 mt-2"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col sm:hidden block">
                        <p className="pt-3 sm:text-sm text-xs font-bold text-gray-700">
                          {product.shippingPlan?.shippingSpeed}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
            {/* Order summary */}
            <section
              aria-labelledby="summary-heading"
              className="md:sticky top-0 sm:mt-16 mt-4 bg-white border border-gray-200 rounded-sm px-4 py-6 sm:p-3 lg:p-3 lg:mt-0 lg:col-span-5"
            >
              <h2
                id="summary-heading"
                className="text-xl font-bold text-black uppercase"
              >
                {GENERAL_ORDER_SUMMARY}
              </h2>

              <dl className="mt-6 sm:space-y-4 space-y-2">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">
                    {SUBTOTAL_INCLUDING_TAX}
                  </dt>
                  <dd className="text-md font-medium text-gray-900">
                    {cartItems.subTotal?.formatted?.withTax}
                  </dd>
                </div>
                <div className="border-t border-gray-200 sm:pt-4 pt-2 flex items-center justify-between">
                  <dt className="flex items-center text-sm text-gray-600">
                    <span>{GENERAL_SHIPPING}</span>
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {cartItems.shippingCharge?.formatted?.withTax}
                  </dd>
                </div>
                <div className="border-t border-gray-200 sm:pt-4 pt-2 flex items-center justify-between">
                  {userCart.promotionsApplied?.length > 0 && (
                    <>
                      <dt className="flex items-center text-sm text-indigo-600">
                        <span>{GENERAL_DISCOUNT}</span>
                      </dt>
                      <dd className="text-indigo-600 text-sm font-medium">
                        <p>{cartItems.discount?.formatted?.withTax}</p>
                      </dd>
                    </>
                  )}
                </div>
                <PromotionInput />

                <div className="text-gray-900 border-t border-gray-200 pt-4 flex items-center justify-between">
                  <dt className="font-medium text-xl text-gray-900">{GENERAL_TOTAL}</dt>
                  <dd className="font-bold text-2xl text-black">
                    {cartItems.grandTotal?.formatted?.withTax}
                  </dd>
                </div>
              </dl>

              <div className="mt-6">
                <Link href="/checkout">
                  <a
                    type="submit"
                    className="text-center w-full bg-black border uppercase border-transparent rounded-sm shadow-sm py-3 px-4 font-medium text-white hover:bg-pink focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-500"
                  >
                    {BTN_CHECKOUT_NOW}
                  </a>
                </Link>
              </div>
            </section>
          </form>
        )}
        {isEmpty && (
          <div className="py-10 text-gray-900 h-full w-full flex flex-col justify-center items-center">
            Uh-oh, you don't have any items in here
            <Link href="/search">
              <button
                type="button"
                className="text-indigo-600 font-medium hover:text-indigo-500"
              >
                {GENERAL_CATALOG}
                <span aria-hidden="true"> &rarr;</span>
              </button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
Cart.Layout = Layout

const PAGE_TYPE = PAGE_TYPES['Checkout']

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = cookie.parse(context.req.headers.cookie || '')
  let basketRef: any = cookies.basketId
  if (!basketRef) {
    basketRef = basketIdGenerator()
    context.res.setHeader('set-cookie', `basketId=${basketRef}`)
  }

  const response = await getCart()({
    basketId: basketRef,
    cookies: context.req.cookies,
  })

  return {
    props: { cart: response }, // will be passed to the page component as props
  }
}

export default withDataLayer(Cart, PAGE_TYPE)
