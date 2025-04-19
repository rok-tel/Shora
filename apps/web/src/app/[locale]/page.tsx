import { Article as ArticleType } from "@shora/common/models/Article";
import { DBFactory } from "@shora/common/db/dbFactory";
import { Language } from '@shora/common/models/types'
import { getDictionary } from '@/i18n/config'
import ArticleCard from '@/components/ArticleCard';

type HomePageProps = {
  params: {
    locale: Language
  }
}

export default async function HomePage(props: HomePageProps) {
  const { params: { locale } } = props;

  console.log("Rendering HomePage with locale:", locale);
 
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
    })
    .slice(0, 6); // Get the 6 most recent articles

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-4">{dict.nav.home}</h1>
        <p className="text-lg text-muted-foreground">Financial insights platform providing the latest news and analysis.</p>
      </div>
      
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-foreground mb-6">{dict.home.latest}</h2>
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