import NewsBanner from "@/components/NewsBanner";
import { NewsList } from "@/components/NewsList";
import TopRead from "@/components/TopRead";
import { fetchNews } from "@/utils/newsArticles";

interface Article {
  _id: string;
  title: string;
  description: string;
  author: string;
  createdAt: string;
  thumbnail: string;
  slug: string;
  category: string;
}

export default async function Home() {
  // Add error handling for fetchNews
  let news: Article[] = [];
  try {
    news = await fetchNews() || [];
  } catch (error) {
    console.error("Error fetching news:", error);
  }

  const getRandomArticle = (articles: Article[]): Article | null => {
    if (!articles || articles.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * articles.length);
    return articles[randomIndex];
  };

  const randomArticle = getRandomArticle(news.slice(0, 5));
  const topArticles = news;

  // If no random article is found, show a fallback
  if (!randomArticle) {
    return (
      <main className="container mx-auto min-h-screen">
        <div className="lg:m-5 rounded-3xl">
          <p className="text-center p-4">No articles available at the moment.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto min-h-screen">
      <div className="lg:m-5 rounded-3xl">
        <NewsBanner
          title={randomArticle.title}
          description={randomArticle.description}
          author={randomArticle.author}
          createdAt={randomArticle.createdAt}
          imageUrl={randomArticle.thumbnail}
          id={randomArticle._id}
          category={randomArticle.category}
        />
      </div>

      <div className="container mx-auto px-4 py-12">
        <NewsList />
      </div>

      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 pl-14">Top Read</h2>
        {topArticles.length > 0 ? (
          <TopRead articles={topArticles} />
        ) : (
          <p className="text-center">No top articles available.</p>
        )}
      </div>
    </main>
  );
}