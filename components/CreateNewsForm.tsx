"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"

import { ThumbnailUpload, CategorySelect } from "@/components/NewsFormInputs"
import { MarkdownEditor } from "@/components/MarkdownEditor"
import { X, User } from "lucide-react"

const categories = [
  "Politics",
  "Entrepreneurship",
  "Stock Market",
  "Science",
  "Technology",
  "Lifestyle",
  "Trending",
  "Human Rights",
  "Animal Rights",
  "Law",
  "Environment",
  "World",
  "Sports",
  "Aperture alchemist",
]

const subCategoriesMap = {
  Education: ["Science", "Technology", "Entrepreneurship"],
  Entertainment: ["Lifestyle", "Trending"],
  Rights: ["Human rights", "Animal rights"],
}

export default function CreateNewsForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    imageSource: "",
    videoLink: "",
    category: "",
    subCategory: "",
    author: "",
    keywords: [],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const requestData = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        requestData.append(key, value.join(","))
      } else if (value) {
        requestData.append(key, value.toString())
      }
    })

    try {
      const response = await fetch("/api/news", {
        method: "POST",
        body: requestData,
      })
      console.log(response)

      if (!response.ok) {
        throw new Error("Failed to create news")
      }

      toast.success("News created successfully!")
      router.push("/")
    } catch (error) {
      toast.error("Failed to create news")
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name === "category") {
      setFormData((prev) => ({ ...prev, [name]: value, subCategory: "" }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, subCategory: e.target.value }))
  }

  const handleKeywordChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      const keyword = (e.target as HTMLInputElement).value.trim()
      if (keyword && !formData.keywords.includes(keyword)) {
        setFormData((prev) => ({
          ...prev,
          keywords: [...prev.keywords, keyword],
        }))
      }
      (e.target as HTMLInputElement).value = ""
    }
  }

  const removeKeyword = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index),
    }))
  }

  const subCategoryOptions = subCategoriesMap[formData.category as keyof typeof subCategoriesMap] || []

  return (
    <div className="min-h-screen  dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto shadow-xl bg-white dark:bg-gray-800 rounded-xl">
        <CardHeader className="space-y-2 border-b border-gray-200 dark:border-gray-700 pb-6">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Create News Article
          </h1>
          <p className="text-center text-muted-foreground">
            Share your story with the world
          </p>
        </CardHeader>
        <CardContent className="pt-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Title</label>
              <Input 
                name="title" 
                value={formData.title} 
                onChange={handleChange} 
                placeholder="Enter a compelling title"
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                required 
              />
            </div>

            {/* Author */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Author</label>
              <div className="relative">
                <Input 
                  name="author" 
                  value={formData.author} 
                  onChange={handleChange} 
                  placeholder="Enter author name"
                  className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                  required 
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              </div>
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Content</label>
              <MarkdownEditor
                value={formData.description}
                onChange={(content) => setFormData((prev) => ({ ...prev, description: content }))}
                placeholder="Write your news article content here..."
              />
            </div>

            {/* Thumbnail */}
            <div className="space-y-2">
              <ThumbnailUpload 
                onSuccess={(url) => setFormData((prev) => ({ ...prev, thumbnail: url }))} 
                value={formData.thumbnail} 
              />
            </div>

            {/* Image Source */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Image Source</label>
              <Input 
                name="imageSource" 
                value={formData.imageSource} 
                onChange={handleChange} 
                placeholder="Enter image source "
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Link to YouTube Coverage</label>
              <Input 
                name="videoLink" 
                value={formData.videoLink} 
                onChange={handleChange} 
                placeholder="Enter YouTube Link"
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
                required 
              />
            </div>



            {/* Category */}
            <div className="space-y-2">
              <CategorySelect 
                value={formData.category} 
                onChange={(value) => setFormData((prev) => ({ ...prev, category: value, subCategory: "" }))} 
                categories={categories} 
              />
            </div>

            {/* Subcategory */}
            {subCategoryOptions.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Subcategory</label>
                <select 
                  name="subCategory" 
                  value={formData.subCategory} 
                  onChange={handleSubCategoryChange} 
                  className="w-full rounded-lg border border-gray-300 bg-white py-2.5 px-3 shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/20 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition-all duration-200"
                  required
                >
                  <option value="">Select a subcategory</option>
                  {subCategoryOptions.map((subcat) => (
                    <option key={subcat} value={subcat}>
                      {subcat}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Keywords */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Keywords</label>
              <Input 
                type="text" 
                placeholder="Type a keyword and press Enter" 
                onKeyDown={handleKeywordChange}
                className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.keywords.map((keyword, index) => (
                  <span 
                    key={index} 
                    className="flex items-center bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 hover:bg-primary/20"
                  >
                    {keyword}
                    <button 
                      type="button" 
                      onClick={() => removeKeyword(index)} 
                      className="ml-2 text-primary hover:text-primary/70 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </form>
        </CardContent>

        {/* Submit Button */}
        <CardFooter className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:hover:transform-none"
            disabled={isLoading} 
            onClick={handleSubmit}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Publishing...
              </span>
            ) : (
              "Publish News"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}