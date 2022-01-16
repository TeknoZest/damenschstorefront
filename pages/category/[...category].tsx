import { useReducer } from 'react'
import withDataLayer, { PAGE_TYPES } from '@components/withDataLayer'
import { getAllCategories, getCategoryBySlug } from '@framework/category'
import { getCategoryProducts } from '@framework/api/operations'
import ProductGrid from '@components/product/Grid'
import ProductSort from '@components/product/ProductSort'

const PAGE_TYPE = PAGE_TYPES.Category

export async function getStaticProps(context: any) {
  const slugName = Object.keys(context.params)[0]
  const slug = slugName + '/' + context.params[slugName].join('/')
  const category = await getCategoryBySlug(slug)
  if (category) {
    const categoryProducts = await getCategoryProducts(category.id)
    return {
      props: {
        category,
        products: categoryProducts,
      },
      revalidate: 60,
    }
  } else
    return {
      props: {
        category,
        products: null,
      },
      revalidate: 60,
    }
}

const generateCategories = (categories: any) => {
  const categoryMap: any = []
  const generateCategory = (category: any) => {
    if (category.link) categoryMap.push(`/${category.link}`)
    if (category.subCategories) {
      category.subCategories.forEach((i: any) => generateCategory(i))
    }
  }
  categories.forEach((category: any) => generateCategory(category))
  return categoryMap
}

export async function getStaticPaths() {
  const data = await getAllCategories()
  return {
    paths: generateCategories(data),
    fallback: 'blocking',
  }
}

export const ACTION_TYPES = {
  SORT_BY: 'SORT_BY',
  PAGE: 'PAGE',
  SORT_ORDER: 'SORT_ORDER',
  CLEAR: 'CLEAR',
  HANDLE_FILTERS_UI: 'HANDLE_FILTERS_UI',
  ADD_FILTERS: 'ADD_FILTERS',
  REMOVE_FILTERS: 'REMOVE_FILTERS',
}

interface actionInterface {
  type?: string
  payload?: object | any
}

interface stateInterface {
  sortBy?: string
  currentPage?: string | number
  sortOrder?: string
  filters: any
}

const IS_INFINITE_SCROLL =
  process.env.NEXT_PUBLIC_ENABLE_INFINITE_SCROLL === 'true'

const {
  SORT_BY,
  PAGE,
  SORT_ORDER,
  CLEAR,
  HANDLE_FILTERS_UI,
  ADD_FILTERS,
  REMOVE_FILTERS,
} = ACTION_TYPES

const DEFAULT_STATE = {
  sortBy: '',
  sortOrder: 'asc',
  currentPage: 1,
  filters: [],
}

function reducer(state: stateInterface, { type, payload }: actionInterface) {
  switch (type) {
    case SORT_BY:
      return { ...state, sortBy: payload }
    case PAGE:
      return { ...state, currentPage: payload }
    case SORT_ORDER:
      return { ...state, sortOrder: payload }
    case CLEAR:
      return { ...state, filters: [] }
    case HANDLE_FILTERS_UI:
      return { ...state, areFiltersOpen: payload }
    case ADD_FILTERS:
      return { ...state, filters: [...state.filters, payload] }
    case REMOVE_FILTERS:
      return {
        ...state,
        filters: state.filters.filter(
          (item: any) => item.Value !== payload.Value
        ),
      }
    default:
      return { ...state }
  }
}

function CategoryPage({ category, products }: any) {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE)

  const handleSortBy = (payload: any) => {
    dispatch({
      type: SORT_BY,
      payload: payload,
    })
  }

  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <main className="pb-24">
        <div className="text-center py-16 px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            {category.name}
          </h1>

          {!!products && (
            <h1 className="text-xl mt-2 font-bold tracking-tight text-gray-500">
              {products.total} results
            </h1>
          )}
        </div>
        {!!products && (
          <>
            <div className="py-5 w-full justify-end flex max-w-3xl mx-auto px-4 text-center sm:px-6 lg:max-w-7xl lg:px-8">
              <ProductSort
                routerSortOption={state.sortBy}
                products={products}
                action={handleSortBy}
              />
            </div>
            <ProductGrid
              products={products}
              currentPage={products.currentPage}
              handlePageChange={() => {}}
              handleInfiniteScroll={() => {}}
            />
          </>
        )}
      </main>
    </div>
  )
}

export default withDataLayer(CategoryPage, PAGE_TYPE)