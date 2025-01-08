interface VideoEmbedProps {
  url: string;
  title: string;
}

function convertToEmbedUrl(url: string): string {
  const urlObj = new URL(url);
  if (urlObj.hostname === 'www.youtube.com' && urlObj.pathname === '/watch') {
    const videoId = urlObj.searchParams.get('v');
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
  }
  return url;
}

export function VideoEmbed({ url, title }: VideoEmbedProps) {
  const embedUrl = convertToEmbedUrl(url);

  return (
    <div className="relative aspect-video overflow-hidden rounded-lg">
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}
