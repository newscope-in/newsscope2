"use client";
import Image from 'next/image';
import Link from 'next/link';
import {format} from "date-fns"

interface NewsBannerProps {
  title: string;
  description: string;
  author: string;
  createdAt: string;
  imageUrl: string;
  id: string;
  category: string;
}

export default function NewsBanner({
  title,
  description,
  author,
  createdAt,
  imageUrl,
  id,
  category,
}: NewsBannerProps) {
  return (
    <Link
      href={`/news/${id}`}
      className="block relative w-full group cursor-pointer mt-2 sm:mt-5 px-2 sm:px-5"
    >
      {/* Mobile View */}
      <div className="block sm:hidden relative w-full h-[200px] rounded-xl overflow-hidden shadow-lg">
        <Image
          src={imageUrl}
          alt={title}
          fill
          style={{ objectFit: 'cover' }}
          className="transform group-hover:scale-105 transition-transform duration-700"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
        <div className="absolute bottom-0 p-3 w-full">
          <h1 className="text-lg font-bold text-white line-clamp-2 mb-1">{title}</h1>
          <span className="text-xs text-gray-300">{author}</span>
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block relative w-full h-[60vh] md:h-[70vh] min-h-[500px] md:min-h-[600px] max-h-[800px] overflow-hidden rounded-2xl shadow-lg transition-transform duration-500 group-hover:scale-[1.02] hover:shadow-2xl">
        <div className="absolute inset-0">
          <Image
            src={imageUrl}
            alt={title}
            fill
            style={{ objectFit: 'cover' }}
            className="object-cover transform group-hover:scale-105 transition-transform duration-700"
            priority
            sizes="(max-width: 1024px) 100vw, 100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500" />
        </div>

        <div className="relative h-full flex flex-col justify-end p-6 md:p-8 lg:p-12">
          <div className="max-w-4xl">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-red-600 text-white transform group-hover:translate-y-[-2px] transition-transform duration-300">
                {category}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight tracking-tight group-hover:text-gray-300 transition-colors duration-300">
              {title}
            </h1>

            <div className="text-gray-300 my-2 text-base transition-all duration-300 ease-in-out group-hover:text-gray-400">
              {description}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 mt-2">
              <span className="font-medium">{author}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300/60" />
              <time className="text-gray-300/90" dateTime={createdAt}>
                {format(new Date(createdAt), "MMMM dd, yyyy")}
              </time>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}