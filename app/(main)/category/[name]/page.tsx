// // pages/category/[name].tsx or app/category/[name]/page.tsx
// import { Metadata } from 'next';
// import { notFound } from 'next/navigation';
// import { NewsList } from '@/components/NewsList';
// import { categories } from '@/utils/categories';

// // Type definition for page props
// type CategoryPageProps = {
//   params: {
//     name: string;
//   };
// };

// // Metadata generation function
// // export async function generateMetadata({ 
// //   params 
// // }: CategoryPageProps): Promise<Metadata> {
// //   const category = params.name.toLowerCase();
// //   const validCategories = categories.map((c) => c.name.toLowerCase());
  
// //   if (!validCategories.includes(category)) {
// //     return {
// //       title: 'Category Not Found',
// //       description: 'The requested category does not exist.'
// //     };
// //   }

// //   return {
// //     title: `${category.charAt(0).toUpperCase() + category.slice(1)} News`,
// //     description: `Latest news and updates in the ${category} category`
// //   };
// // }

// // Main page component
// export default function CategoryPage({ 
//   params 
// }: CategoryPageProps) {
//   const category = params.name.toLowerCase();
//   const validCategories = categories.map((c) => c.name.toLowerCase());
  
//   if (!validCategories.includes(category)) {
//     notFound(); // Trigger a 404 if the category is invalid
//   }
  
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6 capitalize">
//         {category} News
//       </h1>
//       <NewsList category={category} />
//     </div>
//   );
// }

// // Static params generation for pre-rendering
// export function generateStaticParams() {
//   const categoryNames = [
//     'politics',
//     'sports',
//     'technology',
//     'health',
//     'business',
//     'entertainment',
//     'science',
//     'world',
//     'lifestyle',
//   ];
  
//   return categoryNames.map((name) => ({
//     name, // Matches the dynamic segment `[name]`
//   }));
// }



import { InferGetStaticPropsType } from 'next';
import { notFound } from 'next/navigation';
import { NewsList } from '@/components/NewsList';
import { categories } from '@/utils/categories';
import { getStaticProps } from 'next/dist/build/templates/pages';

type CategoryPageProps = InferGetStaticPropsType<typeof getStaticProps>;

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = params.name.toLowerCase();
  const validCategories = categories.map((c) => c.name.toLowerCase());
  
  if (!validCategories.includes(category)) {
    notFound(); // Trigger a 404 if the category is invalid
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 capitalize">
        {category} News
      </h1>
      <NewsList category={category} />
    </div>
  );
}
