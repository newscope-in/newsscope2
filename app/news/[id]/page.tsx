"use client"

import { useEffect, useState } from "react"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { BackLink } from "@/components/BackLink"
import { ArticleMeta } from "@/components/ArticleMeta"
import { VideoEmbed } from "@/components/VideoEmbed"
import { marked } from "marked"

// Helper function to calculate read time
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const readTime = Math.ceil(wordCount / wordsPerMinute)
  return `${readTime}`
}

// Parse Markdown to HTML
export function parseMarkdownToHtml(markdown: string) {
  try {
    return marked(markdown)
  } catch (error) {
    console.error("Error parsing markdown:", error)
    throw error
  }
}

// Fetch news article data
async function getNewsArticle(id: string) {
  const newUrl = `/api/news/${id}`
  const oldUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/news/${id}`

  try {
    const res = await fetch(newUrl, { cache: "no-store" })
    if (!res.ok) throw new Error("Failed to fetch news article")
    return (await res.json()).data
  } catch (error) {
    console.warn("Trying old domain:", error)
    const res = await fetch(oldUrl, { cache: "no-store" })
    if (!res.ok) throw new Error("Failed to fetch news article from old domain")
    return (await res.json()).data
  }
}

export default function NewsArticlePage({ params }: { params: { id: string } }) {
  const [newsArticle, setNewsArticle] = useState<any>(null)
  const [parsedDescription, setParsedDescription] = useState<string>("")

  useEffect(() => {
    async function fetchData() {
      try {
        const { id } = await params
        const article = await getNewsArticle(id)
        setNewsArticle(article)
        setParsedDescription(await parseMarkdownToHtml(article.description))
      } catch (error) {
        console.error(error)
        notFound()
      }
    }
    fetchData()
  }, [params])

  if (!newsArticle) return <div className="flex h-screen items-center justify-center text-lg">Loading...</div>

  const readTime = calculateReadTime(newsArticle.description)

  return (
    <main className="container mx-auto max-w-4xl px-6 py-8">
      <div className="mb-8">
        <BackLink />
      </div>

      <article className="space-y-8">
        {/* Hero Image */}
        {newsArticle.thumbnail && (
          <div className="relative aspect-[2/1] overflow-hidden rounded-lg shadow-lg">
            <Image
              src={newsArticle.thumbnail || "/placeholder.svg"}
              alt={`Thumbnail for ${newsArticle.title}`}
              width={1200}
              height={800}
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <Card className="border-none p-8 shadow-xl rounded-2xl bg-white">
          <div className="space-y-6">
            {/* Title */}
            <h1 className="font-heading text-4xl font-bold tracking-tight text-gray-900 lg:text-5xl">
              {newsArticle.title}
            </h1>

            {/* Category & Subcategory */}
            <div className="flex flex-wrap items-center gap-2">
            
              {newsArticle.subCategory && (
                <span className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-full">
                  {newsArticle.subCategory}
                </span>
              )}
            </div>

            {/* Meta Information */}
            <ArticleMeta date={newsArticle.createdAt} category={newsArticle.category} readTime={readTime} />

            {/* Content */}
            <div
              className="prose prose-gray max-w-none text-lg leading-relaxed"
              dangerouslySetInnerHTML={{ __html: parsedDescription }}
            ></div>

            {/* Video Embed */}
            {newsArticle.videoLink && (
              <div className="mt-8">
                <VideoEmbed url={newsArticle.videoLink} title={newsArticle.title} />
              </div>
            )}
          </div>
        </Card>

        {/* Attribution Section */}
        <div className="mt-6 space-y-2 text-sm text-gray-600">
          {newsArticle.imageSource && <p className="italic">Image Source: {newsArticle.imageSource}</p>}
          {newsArticle.author && (
            <div className="flex items-center gap-2">
              <span className="font-medium">Written by:</span>
              <span className="text-primary font-semibold">{newsArticle.author}</span>
            </div>
          )}
        </div>

        {newsArticle.keywords && newsArticle.keywords.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            Tags: 
            {newsArticle.keywords.map((keyword: string, index: number) => (
              <span key={index} className="px-3 py-1 text-sm font-medium text-white bg-primary rounded-full">
                {keyword}
              </span>
            ))}
          </div>
        )}
      </article>
    </main>
  )
}
