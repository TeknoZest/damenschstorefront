import Dropdown from './Dropdown'
import InlineList from './InlineList'
import { useRouter } from 'next/router'

const ATTR_COMPONENTS: any = {
  Dropdown: (props: any) => <Dropdown {...props} />,
  HorizontalList: (props: any) => <InlineList {...props} />,
  undefined: () => null,
}

const TEMP_MAP: any = {
  'clothing.size': ATTR_COMPONENTS['Dropdown'],
  'global.colour': ATTR_COMPONENTS['HorizontalList'],
}

export default function AttributesHandler({
  product,
  setSelectedAttrData,
}: any) {
  const { attributes, variantProductsAttribute = [], variantProducts } = product

  const router = useRouter()

  const generateLink = (fieldCode: any, value: any) => {
    let slug = ''
    variantProducts.find((item: any) => {
      item.variantAttributes.find((option: any) => {
        const isFieldCode = option.fieldCode === fieldCode
        const isFieldValue = option.fieldValue === value
        if (isFieldCode && isFieldValue) {
          slug = item.slug
        }
      })
    })
    return slug
  }

  const handleChange = (fieldCode: string, value: string) => {
    const slug = generateLink(fieldCode, value)
    if (slug) {
      router.push(`/${slug}`)
    }
  }

  const getAttributesFromSlug = () => {
    const slug = `products/${router.query.slug}`
    return variantProducts.reduce((acc: any, obj: any) => {
      if (obj.slug === slug) {
        obj.variantAttributes.forEach((varAttr: any) => {
          acc[varAttr.fieldCode] = varAttr.fieldValue
        })
      }
      return acc
    }, {})
  }

  const originalAttributes = getAttributesFromSlug()

  const getStockPerAttribute = (key: string, variant: string) => {
    debugger
    let productData = {
      stock: 0,
      productId: '',
      isPreOrderEnabled: false,
      sellWithoutInventory: false,
      stockCode: '',
    }
    // const slug = `products/${router.query.slug}` //TBD
    variantProducts.forEach((variantProduct: any) => {
      variantProduct.variantAttributes.forEach((attr: any) => {
        if (
          key.toLowerCase() === attr.fieldCode.toLowerCase() &&
          attr.fieldValue === variant
          // variantProduct.slug === slug
        ) {
          productData.stock = variantProduct.currentStock
          productData.isPreOrderEnabled = variantProduct.isPreOrderEnabled
          productData.sellWithoutInventory = variantProduct.sellWithoutInventory
          productData.productId = variantProduct.productId
          productData.stockCode = variantProduct.stockCode
        }
      })
    })
    return productData
  }

  const DefaultComponent: any = () => null
  return (
    <>
      {variantProductsAttribute?.map((option: any, idx: number) => {
        const Component = TEMP_MAP[option.fieldCode] || DefaultComponent
        return (
          <div key={idx} className="py-3">
            <Component
              currentAttribute={originalAttributes[option.fieldCode]}
              getStockPerAttribute={getStockPerAttribute}
              items={option.fieldValues}
              label={option.fieldName}
              onChange={handleChange}
              setSelectedAttrData={setSelectedAttrData}
              fieldCode={option.fieldCode}
              productId={product.recordId}
              generateLink={generateLink}
            />
          </div>
        )
      })}
    </>
  )
}
