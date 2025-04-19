'use client';

import Link from 'next/link';
import { Article as ArticleType } from '@shora/common/models/Article';
import { Language } from '@shora/common/models/types';

type ArticleCardProps = {
  article: ArticleType;
  locale: Language;
  dict: any;
};

export default function ArticleCard({ article, locale, dict }: ArticleCardProps) {
  // Get the localized content for the current locale
  const localizedContent = article.content[locale];
  
  // Format the date based on locale
  const formattedDate = new Date(
    typeof article.publishedAt === 'object' && 'toDate' in article.publishedAt
      ? article.publishedAt.toDate()
      : article.publishedAt
  ).toLocaleDateString(
    locale === 'he' ? 'he-IL' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );
  
  return (
    <div className="card hover:shadow-lg transition-shadow duration-300">
      {article.imageUrl && (
        <div className="h-48 overflow-hidden">
          <img 
            src={article.imageUrl} 
            alt={localizedContent.title} 
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="card-body">
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <span>{formattedDate}</span>
          <span className="mx-2">•</span>
          <span>{article.author}</span>
        </div>
        <h2 className="text-xl font-bold mb-2 text-foreground">
          <Link href={`/${locale}/articles/${article.id}`} className="hover:text-primary transition-colors">
            {localizedContent.title}
          </Link>
        </h2>
        <p className="text-muted-foreground mb-4 line-clamp-3">{localizedContent.summary}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {article.tags.map((tag, index) => (
            <span 
              key={index} 
              className="badge badge-info"
            >
              {tag}
            </span>
          ))}
        </div>
        <Link 
          href={`/${locale}/articles/${article.id}`}
          className="inline-block text-primary hover:text-primary/80 font-medium"
        >
          {dict.article.readMore} →
        </Link>
      </div>
    </div>
  );
} 