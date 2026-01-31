'use client';

import { useArticles } from '../hooks';
import { ArticleCard } from '../components';
import { useTranslations } from '@workspace/ui-react/contexts';

export function NewsView() {
    const { articles, isLoading, error } = useArticles();
    const t = useTranslations();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{t('features.news.messages.title')}</h2>
                <p className="text-muted-foreground">{t('features.news.messages.description')}</p>
            </div>

            {isLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                    <p>{t('features.news.messages.loading')}</p>
                </div>
            ) : error ? (
                <div className="text-center py-12 text-destructive">
                    <p>{error}</p>
                </div>
            ) : articles.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <p>{t('features.news.messages.noArticles')}</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {articles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            )}
        </div>
    );
}
