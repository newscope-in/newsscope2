import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export interface SubCategory {
  name: string;
  href: string;
}

export interface Category {
  name: string;
  href: string;
  subCategories?: SubCategory[];
}

interface CategoriesProps {
  categories: Category[];
}

export default function Categories({ categories }: CategoriesProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  return (
    <nav className="bg-gray-800 text-white sticky top-0 z-10 w-full">
      <div className="container mx-auto">
        <ul className="flex justify-between p-2">
          {categories.map((category, index) => (
            <li key={category.name} className="relative">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="text-base font-normal"
              >
                <Link
                  href={category.href}
                  className="hover:text-gray-300 transition-colors p-2 inline-block"
                  onClick={() => setOpenCategory(openCategory === category.name ? null : category.name)}
                >
                  {category.name}
                </Link>
              </motion.div>

              {/* Dropdown for subcategories */}
              {category.subCategories && openCategory === category.name && (
                <ul className="absolute bg-gray-900 mt-2 py-2 w-48 rounded-lg shadow-lg">
                  {category.subCategories.map((sub) => (
                    <li key={sub.name}>
                      <Link
                        href={sub.href}
                        className="block px-4 py-2 text-sm hover:bg-gray-700"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
