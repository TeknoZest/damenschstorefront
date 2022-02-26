import { FC, Fragment } from 'react'
import { classNames } from '../../utils'
import { Popover, Transition } from '@headlessui/react'
import { ShoppingBagIcon, HeartIcon, UserIcon } from '@heroicons/react/outline'
import { Searchbar } from '@components/common'
import { Logo } from '@components/ui'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useUI } from '@components/ui'
import Account from './AccountDropdown'
import CurrencySwitcher from './CurrencySwitcher'
import axios from 'axios'
import { NEXT_SET_CONFIG } from '@components/utils/constants'
import Router from 'next/router'
import LanguageSwitcher from './LanguageSwitcher'
import Cookies from 'js-cookie'
import {
  BTN_SIGN_OUT,
  GENERAL_LOGIN,
  GENERAL_MY_ORDERS,
  GENERAL_RECENTLY_VIEWED,
  GENERAL_REGISTER,
  MY_ACCOUNT_TITLE,
  GENERAL_WORKFLOW_TITLE,
  SELECT_CURRENCY,
  SELECT_LANGUAGE,
  GENERAL_ITEM_IN_CART,
} from '@components/utils/textVariables'

interface Props {
  config: []
  currencies: []
  languages: []
}

const accountDropDownConfigUnauthorized: any = [
  {
    href: '/my-account/login',
    title: GENERAL_LOGIN,
    className:
      'mt-5 max-w-xs flex-1 bg-gray-300 border font-semibold border-transparent rounded-md py-3 px-8 flex items-center justify-center font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full',
  },
  {
    href: '/my-account/register',
    title: GENERAL_REGISTER,
    className:
      'mt-5 max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md op-75 py-3 px-8 flex items-center justify-center font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full',
  },
]

const Navbar: FC<Props> = ({ config, currencies, languages }) => {
  const router = useRouter()

  const {
    wishListItems,
    cartItems,
    user,
    deleteUser,
    openCart,
    openWishlist,
    setShowSearchBar,
  } = useUI()

  const hyperlinkHandler = (hyperlink: string) => {
    return hyperlink[0] === '/' ? hyperlink : `/${hyperlink}`
  }

  const accountDropDownConfigAuthorized: any = [
    {
      href: '/my-account',
      title: MY_ACCOUNT_TITLE,
      className: 'text-left p-2 cursor-pointer',
    },
    {
      href: '/my-account?view=orders',
      title: GENERAL_MY_ORDERS,
      className: 'text-left p-2 cursor-pointer',
    },
    {
      href: '/my-account?view=details',
      title: GENERAL_RECENTLY_VIEWED,
      className: 'text-left p-2 cursor-pointer',
    },
    {
      href: '/',
      onClick: () => deleteUser(),
      title: BTN_SIGN_OUT,
      className: 'text-left p-2 cursor-pointer text-red-600',
    },
  ]

  let accountDropdownConfig = accountDropDownConfigUnauthorized
  let title = user.userId ? `Hi, ${user.firstName}` : 'My account'

  if (user.userId) {
    accountDropdownConfig = accountDropDownConfigAuthorized
  }

  const configAction = (pair: any) => {
    const value: any = Object.values(pair)[0]
    const key = Object.keys(pair)[0]
    const { pathname, asPath, query } = Router
    Cookies.set(key, value)
    axios
      .post(NEXT_SET_CONFIG, { obj: pair })
      .then(() => {
        Router.reload()
      })
      .catch((err: any) => console.log(err))
  }

  return (
    <div className="bg-white">
      <header className="relative bg-white">
        <nav aria-label="Top" className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="border-b border-gray-200 px-4 pb-14 sm:px-0 sm:pb-0">
            <div className="h-16 flex items-center justify-between">
              {/* Logo */}
              <Link href="/">
                <div className="w-auto flex cursor-pointer">
                  <span className="sr-only">{GENERAL_WORKFLOW_TITLE}</span>
                  <Logo />
                </div>
              </Link>

              {/* Flyout menus */}
              <Popover.Group className="absolute bottom-0 inset-x-0 sm:static w-full sm:self-stretch">
                <div className="border-t h-14 px-4 flex space-x-8 overflow-x-auto pb-px sm:h-full sm:border-t-0 sm:justify-center sm:overflow-visible sm:pb-0">
                  {config.map((item: any, idx: number) => {
                    return (
                      <Popover key={idx} className="flex">
                        {({ open }) => (
                          <>
                            {!item.navBlocks.length ? (
                              <Link
                                href={hyperlinkHandler(item.hyperlink)}
                                passHref
                              >
                                <a
                                  className="relative flex"
                                  href={item.hyperlink}
                                >
                                  <Popover.Button
                                    className={classNames(
                                      open
                                        ? 'border-indigo-600 text-indigo-600'
                                        : 'border-transparent text-gray-700 hover:text-gray-800',
                                      'relative z-10 flex items-center transition-colors ease-out duration-200 text-sm font-medium border-b-2 -mb-px pt-px'
                                    )}
                                  >
                                    {item.caption}
                                  </Popover.Button>
                                </a>
                              </Link>
                            ) : (
                              <Popover.Button
                                className={classNames(
                                  open
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-gray-700 hover:text-gray-800',
                                  'relative z-10 flex items-center transition-colors ease-out duration-200 text-sm font-medium border-b-2 -mb-px pt-px'
                                )}
                              >
                                {item.caption}
                              </Popover.Button>
                            )}
                            {item.navBlocks.length ? (
                              <Transition
                                as={Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Popover.Panel className="absolute top-full z-50 inset-x-0 text-gray-500 sm:text-sm">
                                  {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                                  <div
                                    className="absolute inset-0 top-1/2 bg-white shadow"
                                    aria-hidden="true"
                                  />

                                  <div className="relative bg-white">
                                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                      <div className="grid grid-cols-1 items-start gap-y-10 gap-x-6 pt-10 pb-12 md:grid-cols-1 lg:gap-x-8">
                                        {item.navBlocks.map(
                                          (navBlock: any, navIdx: number) => {
                                            return (
                                              <div
                                                key={navIdx}
                                                className="grid grid-cols-1 gap-y-10 gap-x-6 lg:gap-x-8"
                                              >
                                                <div>
                                                  <p className="font-semibold capitalize text-xl text-gray-900">
                                                    {navBlock.boxTitle}
                                                  </p>
                                                  <div className="mt-4 border-t border-gray-100 pt-6 sm:grid sm:grid-cols-1 sm:gap-x-6">
                                                    <ul
                                                      role="list"
                                                      aria-labelledby="clothing-heading"
                                                      className="grid grid-cols-4"
                                                    >
                                                      {navBlock.navItems.map(
                                                        (navItem: any) => (
                                                          <li
                                                            key={
                                                              navItem.caption
                                                            }
                                                            className="flex my-2"
                                                          >
                                                            <Link
                                                              href={`/${navItem.itemLink}`}
                                                              passHref
                                                            >
                                                              <a className="hover:text-gray-800">
                                                                <Popover.Button
                                                                  className={classNames(
                                                                    open
                                                                      ? ''
                                                                      : 'border-transparent text-gray-700 hover:text-gray-800',
                                                                    'relative z-10 flex items-center transition-colors ease-out duration-200 text-sm -mb-px pt-px'
                                                                  )}
                                                                >
                                                                  {
                                                                    navItem.caption
                                                                  }
                                                                </Popover.Button>
                                                              </a>
                                                            </Link>
                                                          </li>
                                                        )
                                                      )}
                                                    </ul>
                                                  </div>
                                                </div>
                                              </div>
                                            )
                                          }
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </Popover.Panel>
                              </Transition>
                            ) : null}
                          </>
                        )}
                      </Popover>
                    )
                  })}
                </div>
              </Popover.Group>
              <div className="flex-1 flex items-center justify-end">
                {/* Search */}
                <Searchbar onClick={setShowSearchBar} />
                {/* account */}
                <Account title={title} config={accountDropdownConfig} />
                {/* currency */}
                <CurrencySwitcher
                  config={currencies}
                  title={SELECT_CURRENCY}
                  action={configAction}
                />
                <LanguageSwitcher
                  title={SELECT_LANGUAGE}
                  action={configAction}
                  config={languages}
                />
                {/* Wishlist*/}

                <div className="px-2 flow-root">
                  <button
                    className="group -m-2 p-2 flex items-center"
                    onClick={openWishlist}
                  >
                    <HeartIcon
                      className="flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                      {wishListItems.length}
                    </span>
                    <span className="sr-only">{GENERAL_ITEM_IN_CART}</span>
                  </button>
                </div>
                {/* Cart */}

                <div className="px-2 flow-root">
                  <button
                    className="group -m-2 p-2 flex items-center"
                    onClick={openCart}
                  >
                    <ShoppingBagIcon
                      className="flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                    <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                      {cartItems.lineItems?.length}
                    </span>
                    <span className="sr-only">{GENERAL_ITEM_IN_CART}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
export default Navbar
