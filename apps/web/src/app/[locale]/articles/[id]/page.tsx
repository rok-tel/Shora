import { Article as ArticleType } from "@shora/common/models/Article";
import { DBFactory } from "@shora/common/db/dbFactory";
import { Language } from '@shora/common/models/types';
import { getDictionary } from '@/i18n/config';
import { notFound } from 'next/navigation';

type ArticlePageProps = {
  params: {
    locale: Language;
    id: string;
  };
};

export default async function ArticlePage({ params: { locale, id } }: ArticlePageProps) {
  // Get the dictionary for the current locale
  const dict = await getDictionary(locale);
  
  // Fetch the article from the database
  const article = await DBFactory.articles.getById(id) as ArticleType | null;
  
  // If article doesn't exist or isn't published, return 404
  if (!article || !article.isPublished) {
    notFound();
  }
  
  // Get the localized content for the current locale
  const localizedContent = article.content[locale];
  
  // Format the published date
  const publishedDate = typeof article.publishedAt === 'object' && 'toDate' in article.publishedAt
    ? article.publishedAt.toDate()
    : article.publishedAt;
  
  const formattedDate = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(publishedDate);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">{localizedContent.title}</h1>
          <div className="flex items-center gap-4 text-muted-foreground mb-6">
            <time dateTime={publishedDate.toISOString()}>{formattedDate}</time>
            {article.tags && article.tags.length > 0 && (
              <div className="flex gap-2">
                {article.tags.map(tag => (
                  <span key={tag} className="badge badge-info">{tag}</span>
                ))}
              </div>
            )}
          </div>
          {localizedContent.summary && (
            <p className="text-xl text-muted-foreground">{localizedContent.summary}</p>
          )}
        </header>
        
        <div className="prose prose-lg max-w-none">
          <div dangerouslySetInnerHTML={{ __html: localizedContent.content }} />
        </div>
        
        {article.stockKeywords && article.stockKeywords.length > 0 && (
          <div className="mt-8 p-6 card">
            <h2 className="text-2xl font-bold text-foreground mb-4">{dict.article.relatedStocks}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {article.stockKeywords.map(stock => (
                <div key={stock.symbol} className="p-4 card">
                  <h3 className="font-bold text-foreground">{stock.name}</h3>
                  <p className="text-muted-foreground">{stock.symbol}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
} 