"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { CldUploadWidget } from "next-cloudinary"
import { Upload } from "lucide-react"
import { MarkdownEditor } from "@/components/MarkdownEditor"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

export default function EditNewsPage() {
  const router = useRouter()
  const { id } = useParams()
  const [newsData, setNewsData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    videoLink: "",
    category: "",
    imageSource: "",
    author: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchNewsData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/news/${id}`)
        if (!response.ok) {
          throw new Error("Failed to fetch news data.")
        }
        const { data } = await response.json()
        setNewsData(data)
      } catch (error) {
        console.error("Error fetching news data:", error)
        toast.error("Failed to load news data.")
        router.push("/admin")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchNewsData()
    }
  }, [id, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewsData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/news/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newsData),
      })

      if (!response.ok) {
        throw new Error("Failed to update news.")
      }

      toast.success("News updated successfully.")
      router.push("/admin")
    } catch (error) {
      console.error("Error updating news:", error)
      toast.error("Failed to update news.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleThumbnailSuccess = (result: any) => {
    setNewsData((prev) => ({
      ...prev,
      thumbnail: result.info.secure_url,
    }))
    toast.success("Thumbnail uploaded successfully!")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading news data...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <h1 className="text-3xl font-bold">Edit News Article</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" value={newsData.title} onChange={handleInputChange} required />
            </div>

            <div className="space-y-2">
              <Label>Content</Label>
              <MarkdownEditor
                value={newsData.description}
                onChange={(content) => setNewsData((prev) => ({ ...prev, description: content }))}
                placeholder="Write your article content in markdown..."
              />
            </div>

            <div className="space-y-2">
              <Label>Thumbnail</Label>
              <CldUploadWidget uploadPreset="newthumb" onSuccess={handleThumbnailSuccess}>
                {({ open }) => (
                  <Button type="button" variant="outline" className="w-full" onClick={() => open()}>
                    <Upload className="mr-2 h-4 w-4" /> Upload Thumbnail
                  </Button>
                )}
              </CldUploadWidget>
              {newsData.thumbnail && (
                <p className="text-sm text-muted-foreground">Current thumbnail: {newsData.thumbnail}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="videoLink">Video Link (Optional)</Label>
              <Input
                id="videoLink"
                name="videoLink"
                type="url"
                value={newsData.videoLink}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newsData.category}
                onValueChange={(value) => setNewsData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Author</Label>
              <Input id="author" name="author" value={newsData.author} onChange={handleInputChange} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageSource">Image Source</Label>
              <Input
                id="imageSource"
                name="imageSource"
                value={newsData.imageSource}
                onChange={handleInputChange}
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full" type="submit" disabled={isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? "Updating..." : "Update News"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

