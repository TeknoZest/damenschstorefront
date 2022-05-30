import { FC } from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import AttributeSelector from './AttributeSelector'
import Button from '@components/ui/IndigoButton'
import cartHandler from '@components/services/cart'
import { useUI } from '@components/ui/context'
import axios from 'axios'
import { NEXT_CREATE_WISHLIST } from '@components/utils/constants'
import { HeartIcon } from '@heroicons/react/outline'
import {
  ALERT_SUCCESS_WISHLIST_MESSAGE,
  BTN_ADD_TO_WISHLIST,
  BTN_NOTIFY_ME,
  BTN_PRE_ORDER,
  GENERAL_ADD_TO_BASKET,
  IMG_PLACEHOLDER,
} from '@components/utils/textVariables'
interface Props {
  product: any
}

const colorKey = 'global.colour'

const WISHLIST_BUTTON_COLOR_SCHEME = {
  bgColor: 'bg-gray-500',
  hoverBgColor: 'bg-gray-400',
  focusRingColor: 'focus-gray-400',
}

interface Attribute {
  fieldName?: string
  fieldCode?: string
  fieldValues?: []
}

const SearchProductCard: FC<Props> = ({ product }) => {
  const [isInWishList, setItemsInWishList] = useState(false)
  const [currentProductData, setCurrentProductData] = useState({
    image: product.image,
    link: product.slug,
  })
  const {
    basketId,
    user,
    addToWishlist,
    openWishlist,
    setCartItems,
    openNotifyUser,
  } = useUI()

  const insertToLocalWishlist = () => {
    addToWishlist(product)
    setItemsInWishList(true)
    openWishlist()
  }
  const handleWishList = async () => {
    const accessToken = localStorage.getItem('user')
    if (accessToken) {
      const createWishlist = async () => {
        try {
          await axios.post(NEXT_CREATE_WISHLIST, {
            id: user.userId,
            productId: product.recordId,
            flag: true,
          })
          insertToLocalWishlist()
        } catch (error) {
          console.log(error, 'error')
        }
      }
      createWishlist()
    } else insertToLocalWishlist()
  }

  useEffect(() => {
    setCurrentProductData((prevState): any => {
      if (prevState.link !== product.slug) {
        return { ...prevState, image: product.image, link: product.slug }
      } else return { ...prevState }
    })
  }, [product.slug])

  const productWithColors =
    product.variantProductsAttributeMinimal &&
    product.variantProductsAttributeMinimal.find(
      (item: Attribute) => item.fieldCode === colorKey
    )

  const hasColorVariation =
    productWithColors && productWithColors.fieldValues.length >= 1

  const handleVariableProduct = (attr: any, type: string = 'enter') => {
    if (type === 'enter') {
      const variatedProduct = product.variantProductsMinimal.find((item: any) =>
        item.variantAttributes.find(
          (variant: any) => variant.fieldValue === attr.fieldValue
        )
      )
      if (variatedProduct) {
        setCurrentProductData({
          image: variatedProduct.image,
          link: variatedProduct.slug,
        })
      }
    } else {
      setCurrentProductData({ image: product.image, link: product.slug })
    }
  }

  const secondImage = product.images[1]?.image

  const handleHover = (type: string) => {
    if (type === 'enter' && secondImage)
      setCurrentProductData({ ...currentProductData, image: secondImage })
    if (type === 'leave' && secondImage)
      setCurrentProductData({ ...currentProductData, image: product.image })
  }

  const handleNotification = () => {
    openNotifyUser(product.id)
  }

  const buttonTitle = () => {
    let buttonConfig: any = {
      title: GENERAL_ADD_TO_BASKET,
      action: async () => {
        const item = await cartHandler().addToCart(
          {
            basketId,
            productId: product.recordId,
            qty: 1,
            manualUnitPrice: product.price.raw.withTax,
            stockCode: product.stockCode,
            userId: user.userId,
            isAssociated: user.isAssociated,
          },
          'ADD',
          { product }
        )
        setCartItems(item)
      },
      shortMessage: '',
    }
    if (!product.currentStock && !product.preOrder.isEnabled) {
      buttonConfig.title = BTN_NOTIFY_ME
      buttonConfig.isNotifyMeEnabled = true
      buttonConfig.action = async () => handleNotification()
      buttonConfig.buttonType = 'button'
    } else if (!product.currentStock && product.preOrder.isEnabled) {
      buttonConfig.title = BTN_PRE_ORDER
      buttonConfig.isPreOrderEnabled = true
      buttonConfig.buttonType = 'button'
      buttonConfig.shortMessage = product.preOrder.shortMessage
    }
    return buttonConfig
  }

  const buttonConfig = buttonTitle()
  console.log("Product:"+ JSON.stringify(product));
  return (
    <div className="">
      <div key={product.id} className="relative">
        <Link
          passHref
          href={`/${currentProductData.link}`}
          key={'data-product' + currentProductData.link}
        >
          <a href={currentProductData.link}>
            <div className="relative overflow-hidden bg-gray-200 aspect-w-1 aspect-h-1 whishlist-info">
              <div className='image-container hover:opacity-75'>
                  <Image 
                      src={currentProductData.image || IMG_PLACEHOLDER}
                      alt={product.name}
                      onMouseEnter={() => handleHover('enter')}
                      onMouseLeave={() => handleHover('leave')}
                      layout='fill' 
                      className='w-full sm:h-72 h-48 object-center object-cover image'>
                  </Image>
              </div>
              {buttonConfig.isPreOrderEnabled && (
                <div className="bg-yellow-400 text-white absolute text-xs py-1 pr-5 pl-2 rounded-sm top-4 badge-corner-pre-order">
                  {BTN_PRE_ORDER}
                </div>
              )}
              {buttonConfig.isNotifyMeEnabled && (
                <div className="bg-pink text-white absolute text-xs py-1 pr-5 pl-2 rounded-sm top-4 badge-corner">
                  {BTN_NOTIFY_ME}
                </div>
              )}
              <div className='whishlist-on-hover'>
                {isInWishList ? (
                  <span className="text-gray-900">
                    {ALERT_SUCCESS_WISHLIST_MESSAGE}
                  </span>
                ) : (

                  <button
                      className="absolute right-2 bottom-0 z-99 add-wishlist w-full text-center bg-white border border-gray-300 text-black hover:border-gray-800"
                      onClick={handleWishList}
                  >
                      <HeartIcon
                          className="flex-shrink-0 inline-block h-8 w-8 z-50 rounded-3xl p-1 opacity-80"
                          aria-hidden="true"
                  />
                      <span className="text-sm font-medium">Wishlist</span>
                      <span className="sr-only"></span>
                  </button>            
                )}  
              </div> 
            </div>
          </a>
        </Link>

        <div className="sm:pt-2 pt-2 text-left">         
          {hasColorVariation ? (
             <div className='w-full border-b mb-2'>
                <AttributeSelector
                  attributes={product.variantProductsAttributeMinimal}
                  onChange={handleVariableProduct}
                  link={currentProductData.link}
                />
            </div>
          ) : (
            <div className='w-full border-b border-white mb-2'>
              <div className="sm:h-5 sm:w-5 h-5 w-5 sm:mr-2 mr-1 mt-1 inline-block" />
            </div>
          )}  
          <h4 className='truncate sm:text-sm text-xs font-semibold text-black uppercase mb-2'>{product.brand}</h4>
          <h3 className="truncate sm:text-sm text-xs font-normal text-gray-700">
            <Link href={`/${currentProductData.link}`}>
              <a href={`/${currentProductData.link}`}>{product.name}</a>
            </Link>
          </h3>

          <p className="sm:mt-2 mt-1 font-bold text-black">
            {product?.price?.formatted?.withTax}
          </p>
                  
        </div>
      </div>
    </div>
  )
}

export default SearchProductCard
