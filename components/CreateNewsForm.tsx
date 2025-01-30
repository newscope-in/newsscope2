"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { TextInput, ThumbnailUpload, CategorySelect } from "@/components/NewsFormInputs"
import { MarkdownEditor } from "@/components/MarkdownEditor"
import TagSelector from "./TagSelector"

const categories = [
  "Technology",
  "Politics",
  "Sports",
  "Entertainment",
  "Business",
  "Science",
  "Health",
  "World",
  "Other",
]

export default function CreateNewsForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    videoLink: "",
    imageSource: "",
    category: "",
    author: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const requestData = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      if (value) requestData.append(key, value.toString())
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
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <Card className="max-w-4xl mx-auto shadow-lg bg-white dark:bg-gray-800">
      <CardHeader>
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">Create News Article</h1>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <TextInput
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter news title"
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Content</label>
            <MarkdownEditor
              value={formData.description}
              onChange={(content) => setFormData((prev) => ({ ...prev, description: content }))}
              placeholder="Write your news article content here..."
            />
          </div>
          <ThumbnailUpload
            onSuccess={(url) => setFormData((prev) => ({ ...prev, thumbnail: url }))}
            value={formData.thumbnail}
          />
          <TextInput
            label="Video Link (Optional)"
            name="videoLink"
            value={formData.videoLink}
            onChange={handleChange}
            placeholder="Enter video link"
            type="url"
          />
          <CategorySelect
            value={formData.category}
            onChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
            categories={categories}
          />
          <TagSelector/>
          <TextInput
            label="Author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            placeholder="Enter author name"
          />
          <TextInput
            label="Image Source"
            name="imageSource"
            value={formData.imageSource}
            onChange={handleChange}
            required
            placeholder="Enter image source"
          />
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
          disabled={isLoading}
          onClick={handleSubmit}
        >
          {isLoading ? "Publishing..." : "Publish News"}
        </Button>
      </CardFooter>
    </Card>
  )
}

