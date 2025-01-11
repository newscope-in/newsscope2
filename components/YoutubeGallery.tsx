"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"

interface VideoItem {
    id: string
    title: string
    youtubeId: string
    thumbnail: string
}

const videos: VideoItem[] = [
    {
        id: "1",
        title: "Tragic Death at EY: Uncovering India's Employment Law Gaps",
        youtubeId: "7wYBWAUU2t0",
    },
    {
        id: "2",
        title: "Hasina's Exit: Crisis Next Door",
        youtubeId: "z3HRVeaa5aU",
    },
    {
        id: "3",
        title: "Afghan Women Under Taliban Rule: A Crisis of Rights and Resilience",
        youtubeId: "Pt_jDlKVlj0",
    },
    {
        id: "4",
        title: "The Meitei-Kuki Conflict: Understanding Manipur’s Crisis",
        youtubeId: "32Q38tTDTPQ",
    },
].map(video => ({
    ...video,
    thumbnail: `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`,
}));

export default function YoutubeGallery() {
    const [activeVideo, setActiveVideo] = useState(videos[0]);

    return (
        <div className="p-4 bg-transparent h-[50vh] w-[70%] mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-black">Latest Videos</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Featured Video Player */}
                <motion.div
                    className="lg:col-span-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="relative overflow-hidden bg-white shadow-sm border border-gray-200">
                        <CardContent className="p-0 aspect-video">
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}`}
                                title={activeVideo.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                                className="w-full h-full"
                            />
                        </CardContent>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-black">{activeVideo.title}</h3>
                        </div>
                    </Card>
                </motion.div>

                {/* Sidebar Videos */}
                <div className="space-y-4">
                    {videos.map((video, index) => (
                        <motion.div
                            key={video.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <Card
                                className={`relative group overflow-hidden cursor-pointer transition-colors ${activeVideo.id === video.id ? 'bg-gray-100' : 'bg-white'
                                    } border border-gray-200`}
                                onClick={() => setActiveVideo(video)}
                            >
                                <CardContent className="p-0">
                                    <div className="flex gap-4">
                                        <div className="relative w-40">
                                            <img
                                                src={video.thumbnail}
                                                alt=""
                                                className="w-full aspect-video object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Play className="w-8 h-8 text-white" />
                                            </div>
                                        </div>
                                        <div className="flex-1 p-2">
                                            <h3 className={`text-sm font-medium line-clamp-2 ${activeVideo.id === video.id ? 'text-black' : 'text-gray-700'
                                                }`}>
                                                {video.title}
                                            </h3>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
