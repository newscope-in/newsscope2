"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Article {
  _id: string;
  title: string;
  author: string;
  thumbnail: string;
}

const NewsBanner = ({ title, author, imageUrl, id }: {
  title: string;
  author: string;
  imageUrl: string;
  id: string;
}) => (
  <Link href={`/news/${id}`} className="block relative w-full group cursor-pointer">
    <div className="relative w-full md:h-[70vh] h-[40vh] overflow-hidden rounded-xl shadow-lg">
      <div className="absolute inset-0">
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
      </div>
      
      <div className="absolute bottom-0 p-4 w-full">
        <h1 className="text-xl md:text-4xl font-bold text-white mb-2 line-clamp-2">
          {title}
        </h1>
        <p className="text-sm text-gray-300">{author}</p>
      </div>
    </div>
  </Link>
);

const NewsSlider = ({ articles, autoplayInterval = 5000 }: {
  articles: Article[];
  autoplayInterval?: number;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  useEffect(() => {
    if (!articles?.length) return;
    const intervalId = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length);
    }, autoplayInterval);
    return () => clearInterval(intervalId);
  }, [articles, autoplayInterval]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (Math.abs(distance) > 50) {
      setCurrentIndex((prev) => 
        distance > 0 
          ? (prev + 1) % articles.length 
          : (prev - 1 + articles.length) % articles.length
      );
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  if (!articles?.length) return null;

  return (
    <div 
      className="relative w-full px-2 md:px-2"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="mt-4 md:mt-12 mb-0 relative transition-all duration-500">
        <NewsBanner
          title={articles[currentIndex].title}
          author={articles[currentIndex].author}
          imageUrl={articles[currentIndex].thumbnail}
          id={articles[currentIndex]._id}
        />
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-1.5 z-20">
        {articles.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-white scale-110' 
                : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default NewsSlider;