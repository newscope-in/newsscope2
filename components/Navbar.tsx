'use client'

import { useState, FormEvent, JSX } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search, Menu, X, ChevronDown } from 'lucide-react'
import { Category, SubCategory, categories } from '@/utils/categories'

interface CategoryDropdownProps {
  category: Category;
}

interface SearchFormEvent extends FormEvent<HTMLFormElement> {
  preventDefault: () => void;
}

export default function Navbar(): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const router = useRouter()

  const handleSearch = (e: SearchFormEvent): void => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search/${searchQuery}`)
    }
  }

  const CategoryDropdown = ({ category }: CategoryDropdownProps): JSX.Element => {
    const [isHovered, setIsHovered] = useState<boolean>(false)

    const handleMouseEnter = (): void => setIsHovered(true)
    const handleMouseLeave = (): void => setIsHovered(false)

    return (
      <div
        className="relative group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link 
          href={category.href}
          className="flex items-center px-4 py-2 text-gray-200 hover:text-white transition-colors"
        >
          {category.name}
          {category.subCategories && (
            <ChevronDown className="ml-1 h-4 w-4" />
          )}
        </Link>
        
        {category.subCategories && isHovered && (
          <div className="absolute left-0 mt-0 w-48 bg-white rounded-md shadow-lg py-1 z-20">
            {category.subCategories.map((subCat: SubCategory) => (
              <Link
                key={subCat.name}
                href={subCat.href}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {subCat.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <header>
      <div className="bg-[#be1e2d] text-red-500 p-4">
        <div className="container mx-auto px-5 flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer bg-white">
              <Image 
                src="/navLogo.png" 
                height={150} 
                width={150} 
                alt="Newscope" 
                className="w-auto h-auto" 
              />
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form 
            onSubmit={handleSearch} 
            className="hidden md:flex items-center space-x-2 bg-white border border-gray-300 rounded-full px-6 py-2.5 shadow-sm w-[480px]"
          >
            <Search className="text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search News..."
              className="focus:outline-none w-full text-gray-700"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-blue-950"
            onClick={(): void => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            type="button"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navbar */}
      <div
        className={`md:hidden transform transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden bg-white border-t border-gray-200`}
      >
        <div className="container mx-auto px-5 py-4">
          {/* Mobile Search Bar */}
          <form 
            onSubmit={handleSearch} 
            className="flex items-center space-x-2 bg-gray-100 border border-gray-300 rounded-full px-4 py-2 mb-4"
          >
            <Search className="text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Search News..."
              className="bg-transparent focus:outline-none w-full text-gray-700"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            />
          </form>
          {/* Mobile Navigation Links */}
          <nav>
            <ul className="space-y-2">
              {categories.map((category: Category) => (
                <li key={category.name} className="relative">
                  <Link 
                    href={category.href} 
                    className="block text-gray-600 hover:text-red-500 py-2"
                  >
                    {category.name}
                  </Link>
                  {category.subCategories && (
                    <ul className="pl-4 mt-1 space-y-1">
                      {category.subCategories.map((subCat: SubCategory) => (
                        <li key={subCat.name}>
                          <Link 
                            href={subCat.href} 
                            className="block text-gray-500 hover:text-red-500 py-1"
                          >
                            {subCat.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Desktop Navbar */}
      <div className="hidden md:block sticky top-0 z-10 bg-gray-800">
        <nav className="flex justify-center container mx-auto px-5">
          <div className="flex space-x-1">
            {categories.map((category: Category) => (
              <CategoryDropdown key={category.name} category={category} />
            ))}
          </div>
        </nav>
      </div>
    </header>
  )
}