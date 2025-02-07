"use client"

import { useEffect, useState } from "react"
import { notFound, useRouter } from "next/navigation"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { BackLink } from "@/components/BackLink"
import { ArticleMeta } from "@/components/ArticleMeta"
import { VideoEmbed } from "@/components/VideoEmbed"
import { marked } from "marked"
import Loading from "./loading"

function calculateReadTime(content: string): string {
  const wordsPerMinute = 200
  const wordCount = content.split(/\s+/).length
  const readTime = Math.ceil(wordCount / wordsPerMinute)
  return `${readTime}`
}

export function parseMarkdownToHtml(markdown: string) {
  try {
    return marked(markdown)
  } catch (error) {
    console.error("Error parsing markdown:", error)
    throw error
  }
}

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
  const router = useRouter()
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

  if (!newsArticle) return ( 
      <Loading />
   
  )

  const readTime = calculateReadTime(newsArticle.description)

  const handleKeywordClick = (keyword: string) => {
    router.push(`/search/${encodeURIComponent(keyword)}`)
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-6 lg:mb-8">
          <BackLink />
        </div>

        <article>
          <Card className="overflow-hidden border-none bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl">
            {/* Hero Section */}
            {newsArticle.thumbnail && (
              <div className="relative">
                <div className="relative aspect-[21/9]">
                  <Image
                    src={newsArticle.thumbnail || "/placeholder.svg"}
                    alt={`Thumbnail for ${newsArticle.title}`}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 85vw, 75vw"
                  />
                </div>
                {newsArticle.imageSource && (
                  <div className="absolute bottom-0 right-0 bg-black/60 text-white px-4 py-2 text-sm backdrop-blur-sm">
                    Source: {newsArticle.imageSource}
                  </div>
                )}
              </div>
            )}

            {/* Content Section */}
            <div className="p-6 sm:p-8 lg:p-12 space-y-6 lg:space-y-8">


              {/* Title */}
              <h1 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
                {newsArticle.title}
              </h1>

              {/* Meta Information */}
              <ArticleMeta date={newsArticle.createdAt} category={newsArticle.category}  subCategory = {newsArticle.subCategory} readTime={readTime} />
             

              {/* Content */}
              <div className="prose prose-lg dark:prose-invert prose-headings:font-heading prose-a:text-primary hover:prose-a:text-primary/70 prose-img:shadow-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: parsedDescription }} />
              </div>

              {/* Video Embed */}
              {newsArticle.videoLink && (
                <div className="mt-8 overflow-hidden shadow-lg">
                  <VideoEmbed url={newsArticle.videoLink} title={newsArticle.title} />
                </div>
              )}

              {/* Author & Keywords */}
              <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                {newsArticle.author && (
                  <div className="flex items-center gap-3 border-l-4 border-primary pl-4">
                    <span className="text-gray-600 dark:text-gray-400">Written by</span>
                    <span className="text-primary font-semibold">{newsArticle.author}</span>
                  </div>
                )}

                {newsArticle.keywords && newsArticle.keywords.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tags:</span>
                    {newsArticle.keywords.map((keyword: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => handleKeywordClick(keyword)}
                        className="group relative px-4 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-full transition-colors hover:bg-primary/20 cursor-pointer"
                        title={`Click to search for "${keyword}"`}
                      >
                        {keyword}
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Click to search for &quot;{keyword}&quot;
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </article>
      </div>
    </main>
  )
}