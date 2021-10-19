import { Fragment, useState } from 'react'
import {
  Dialog,
  Disclosure,
  Menu,
  Popover,
  Transition,
} from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { ChevronDownIcon, FilterIcon } from '@heroicons/react/solid'
import classNames from '@components/utils/classNames'
import ProductSort from '@components/product/ProductSort'
import FilterList from './FilterList'

interface Props {
  products: any
  handleSortBy: any
}

export default function Filters({
  products = { filters: [] },
  handleSortBy,
}: Props) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-transparent">
      {/* Mobile filter dialog */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 flex z-40" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <div className="ml-auto relative max-w-xs w-full h-full bg-white shadow-xl py-4 pb-6 flex flex-col overflow-y-auto">
              <div className="px-4 flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  className="-mr-2 w-10 h-10 bg-white p-2 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Filters */}
              <form className="mt-4">
                {products.filters?.map((section: any) => (
                  <Disclosure
                    as="div"
                    key={section.name}
                    className="border-t border-gray-200 px-4 py-6"
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-mx-2 -my-3 flow-root">
                          <Disclosure.Button className="px-2 py-3 bg-white w-full flex items-center justify-between text-sm text-gray-400">
                            <span className="font-medium text-gray-900">
                              {section.name}
                            </span>
                            <span className="ml-6 flex items-center">
                              <ChevronDownIcon
                                className={classNames(
                                  open ? '-rotate-180' : 'rotate-0',
                                  'h-5 w-5 transform'
                                )}
                                aria-hidden="true"
                              />
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-6">
                            <FilterList
                              sectionKey={section.key}
                              items={section.items}
                            />
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </form>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition.Root>

      <div className="max-w-3xl mx-auto px-4 text-center sm:px-6 lg:max-w-7xl lg:px-8">
        <section
          aria-labelledby="filter-heading"
          className="border-t border-gray-200 py-6"
        >
          <h2 id="filter-heading" className="sr-only">
            Product filters
          </h2>

          <div className="flex items-center justify-between">
            <h2 id="filter-heading" className="sr-only">
              Filters
            </h2>
            <div className="relative col-start-1 row-start-1 py-4">
              <div className="max-w-7xl mx-auto flex space-x-6 divide-x divide-gray-200 text-sm px-4 sm:px-6 lg:px-8">
                <div>
                  <button
                    onClick={() => setOpen(true)}
                    className="group text-gray-700 font-medium flex items-center"
                  >
                    <FilterIcon
                      className="flex-none w-5 h-5 mr-2 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                    2 Filters
                  </button>
                </div>
                <div className="pl-6">
                  <button type="button" className="text-gray-500">
                    Clear all
                  </button>
                </div>
              </div>
            </div>

            <ProductSort products={products} action={handleSortBy} />
          </div>
        </section>
      </div>
    </div>
  )
}