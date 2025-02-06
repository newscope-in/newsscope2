"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ThumbnailUpload, CategorySelect } from "@/components/NewsFormInputs"
import { MarkdownEditor } from "@/components/MarkdownEditor"
import { X } from "lucide-react"

// Categories and Subcategories
const categories = [
  "Home",
  "Politics",
  "Business",
  "Education",
  "Entertainment",
  "Rights",
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

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      const keyword = e.target.value.trim()
      if (keyword && !formData.keywords.includes(keyword)) {
        setFormData((prev) => ({
          ...prev,
          keywords: [...prev.keywords, keyword],
        }))
      }
      e.target.value = "" // Clear input after adding keyword
    }
  }

  const removeKeyword = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((_, i) => i !== index),
    }))
  }

  const subCategoryOptions = subCategoriesMap[formData.category] || []

  return (
    <Card className="max-w-4xl mx-auto my-8 shadow-lg bg-white dark:bg-gray-800 p-6">
      <CardHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
          Create News Article
        </h1>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Title</label>
            <Input name="title" value={formData.title} onChange={handleChange} placeholder="Enter news title" required />
          </div>

          {/* Content */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Content</label>
            <MarkdownEditor
              value={formData.description}
              onChange={(content) => setFormData((prev) => ({ ...prev, description: content }))}
              placeholder="Write your news article content here..."
            />
          </div>

          {/* Thumbnail */}
          <ThumbnailUpload onSuccess={(url) => setFormData((prev) => ({ ...prev, thumbnail: url }))} value={formData.thumbnail} />

          {/* Image Source */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Image Source</label>
            <Input name="imageSource" value={formData.imageSource} onChange={handleChange} placeholder="Enter image source URL" required />
          </div>

          {/* Category */}
          <CategorySelect value={formData.category} onChange={(value) => setFormData((prev) => ({ ...prev, category: value, subCategory: "" }))} categories={categories} />

          {/* Subcategory */}
          {subCategoryOptions.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Subcategory</label>
              <select name="subCategory" value={formData.subCategory} onChange={handleSubCategoryChange} className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-primary focus:ring-primary dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" required>
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
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Keywords</label>
            <Input type="text" placeholder="Press Enter to add keywords" onKeyDown={handleKeywordChange} />
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.keywords.map((keyword, index) => (
                <span key={index} className="flex items-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100 px-3 py-1 rounded-md text-sm">
                  {keyword}
                  <button type="button" onClick={() => removeKeyword(index)} className="ml-2 text-red-500 hover:text-red-700">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <CardFooter className="pt-6">
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-4 rounded-lg transition transform hover:-translate-y-1 hover:shadow-lg" disabled={isLoading} onClick={handleSubmit}>
              {isLoading ? "Publishing..." : "Publish News"}
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  )
}
