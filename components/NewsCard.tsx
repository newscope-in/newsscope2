"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, User } from "lucide-react"
import { marked } from "marked"

interface NewsArticle {
  _id: string
  title: string
  description: string
  author: string
  createdAt: string
  thumbnail: string
  category: string
}

interface NewsCardProps {
  article: NewsArticle
}

// Utility function to truncate content (handles both HTML and markdown)
const truncateContent = (content: string, maxLength = 150): string => {
  try {
    // First check if content is HTML
    const isHtml = /<[a-z][\s\S]*>/i.test(content)

    // Remove HTML tags if present
    let plainText = isHtml
      ? content.replace(/<[^>]+>/g, "")
      : content
          .replace(/\[(.*?)\]$$.*?$$/g, "$1") // Remove markdown links but keep text
          .replace(/[#*`_~]/g, "") // Remove markdown symbols
          .replace(/\n+/g, " ") // Replace newlines with spaces

    // Clean up extra spaces
    plainText = plainText
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim()

    // Truncate the text
    return plainText.length > maxLength ? plainText.substring(0, maxLength).trim() + "..." : plainText
  } catch (error) {
    console.error("Error truncating content:", error)
    return ""
  }
}

// Utility function to format date
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date)
  } catch (error) {
    console.error("Error formatting date:", error)
    return dateString
  }
}

// Utility function to get category color
function getCategoryColor(category: string): string {
  const categories: Record<string, string> = {
    Technology: "bg-red-500",
    Politics: "bg-red-500",
    Sports: "bg-red-500",
    Entertainment: "bg-red-500",
    Business: "bg-red-500",
    Science: "bg-red-500",
    Health: "bg-red-500",
    World: "bg-red-500",
    Other: "bg-red-500",
  }
  return categories[category] || categories.Other
}

export function NewsCard({ article }: NewsCardProps) {
  const truncatedDescription = truncateContent(article.description)

  return (
    <Link href={`/news/${article._id}`} className="block h-full">
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={article.thumbnail || "/placeholder.svg"}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-4 left-4 z-10">
            <Badge variant="secondary" className={`${getCategoryColor(article.category)} text-white hover:opacity-90 rounded-2xl py-1`}>
              {article.category}
            </Badge>
          </div>
        </div>

        <CardHeader>
          <h2 className="text-xl font-bold leading-tight line-clamp-2 hover:text-primary transition-colors">
            {article.title}
          </h2>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground line-clamp-3">{truncatedDescription}</p>
        </CardContent>

        <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>{article.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <time dateTime={article.createdAt}>{formatDate(article.createdAt)}</time>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

export default NewsCard

