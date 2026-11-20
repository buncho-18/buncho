import CategoryPage, { categoryMetadata } from '@/components/CategoryPage';

export const generateMetadata = ({ searchParams }) => categoryMetadata('core', searchParams);

// Same list as AI, HR and SQL: topics (document tabs: Java, DBMS, CN, OS) with their questions.
export default function CoreProblemsPage({ searchParams }) {
  return <CategoryPage category="core" searchParams={searchParams} />;
}