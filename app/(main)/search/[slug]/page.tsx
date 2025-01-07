import { NewsList } from "@/components/NewsList";

type PageProps = {
  params: {
    slug: string;
  };
};

export default function SearchResults({ params }: PageProps) {
  const query = params.slug;

  return (
    <div className="container mx-auto px-4 py-8">
      <NewsList search={query} />
    </div>
  );
}
