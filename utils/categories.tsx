export interface SubCategory {
  name: string
  href: string
}

export interface Category {
  name: string
  href: string
  subCategories?: SubCategory[]
}

export const categories: Category[] = [
  { name: "Home", href: "/" },
  { name: "Politics", href: "/category/politics" },
  {
    name: "Business",
    href: "/category/business",
    subCategories: [
      { name: "Entrepreneurship", href: "/category/entrepreneurship" },
      { name: "Stock Market", href: "/category/stock-market" },
    ],
  },
  {
    name: "Education",
    href: "/category/education",
    subCategories: [
      { name: "Science", href: "/category/science" },
      { name: "Technology", href: "/category/technology" },
    ],
  },
  {
    name: "Entertainment",
    href: "/category/entertainment",
    subCategories: [
      { name: "Lifestyle", href: "/category/lifestyle" },
      { name: "Trending", href: "/category/trending" },
    ],
  },
  {
    name: "Rights",
    href: "/category/rights",
    subCategories: [
      { name: "Human Rights", href: "/category/human-rights" },
      { name: "Animal Rights", href: "/category/animal-rights" },
      { name: "Law", href: "/category/law" },
    ],
  },
  { name: "Environment", href: "/category/environment" },
  { name: "World", href: "/category/world" },
  { name: "Sports", href: "/category/sports" },
  { name: "Aperture Alchemist", href: "/category/aperture-alchemist" },
]

