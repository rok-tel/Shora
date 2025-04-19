import { Article as ArticleType } from "@shora/common/models/Article";
import { DBFactory } from "@shora/common/db/dbFactory";
import { Language } from '@shora/common/models/types';
import { getDictionary } from '@/i18n/config';
import ArticleCard from '@/components/ArticleCard';

type ArticlesPageProps = {
  params: {
    locale: Language;
  };
};

export default async function ArticlesPage({ params: { locale } }: ArticlesPageProps) {
  // Get the dictionary for the current locale
  const dict = await getDictionary(locale);
  
  // Fetch articles from the database
  const articles = await DBFactory.articles.getAll() as ArticleType[];
  
  // Filter published articles and sort by published date (newest first)
  const publishedArticles = articles
    .filter(article => article.isPublished)
    .sort((a, b) => {
      const dateA = typeof a.publishedAt === 'object' && 'toDate' in a.publishedAt
        ? a.publishedAt.toDate()
        : a.publishedAt;
      const dateB = typeof b.publishedAt === 'object' && 'toDate' in b.publishedAt
        ? b.publishedAt.toDate()
        : b.publishedAt;
      return dateB.getTime() - dateA.getTime();
    });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">{dict.nav.articles}</h1>
        <p className="text-lg text-muted-foreground">Browse our latest financial articles and insights.</p>
      </div>
      
      <div className="mb-12">
        {publishedArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedArticles.map(article => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                locale={locale} 
                dict={dict} 
              />
            ))}
          </div>
        ) : (
          <div className="card p-4">
            <p className="text-muted-foreground">No articles available at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}