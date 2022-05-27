import { FC, memo, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { SearchIcon } from '@heroicons/react/outline'
import { Transition } from '@headlessui/react'
import { BTN_SEARCH } from '@components/utils/textVariables'
interface Props {
  id?: string
  onClick: any
}

const Searchbar: FC<Props> = ({ id = 'search', onClick }) => {
  return (
    <div className="flex flex-row mr-10 relative">
      <button
        onClick={onClick}
        className="p-2 text-gray-400 bg-gray-100 rounded-md" aria-label="Search"
      >
        <span className="sr-only" aria-label="Search">{BTN_SEARCH}</span>       
        <span className='text-black pr-2 font-normal text-sm sm:inline-block sm:pr-48 hidden'>Search</span>
        <SearchIcon className="w-5 h-5 inline-block text-black absolute right-2 top-3" aria-hidden="true" aria-label="Search" />
      </button>
    </div>
  )
}

export default memo(Searchbar)
