'use client';

import { useState } from 'react';
import { Button } from '@workspace/ui-react/components/button';
import { Newspaper } from 'lucide-react';
import { useTranslations } from '@workspace/ui-react/contexts';
import { useArticles } from '../hooks';
import { useCreateArticle } from '../hooks';
import { ArticleCard, CreateArticleForm } from '../components';
import type { CreateArticleFormData } from '@workspace/adapter-common/validators';

export function NewsManageView() {
    const { articles, isLoading, error } = useArticles();
    const { createArticle, isLoading: isCreating, error: createError, success, reset } = useCreateArticle();
    const [showForm, setShowForm] = useState(false);
    const t = useTranslations();

    const handleCreate = async (data: CreateArticleFormData) => {
        await createArticle(data);
        setTimeout(() => {
            setShowForm(false);
            reset();
        }, 2000);
    };

    const handleCancel = () => {
        setShowForm(false);
        reset();
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('features.news.messages.title')}</h2>
                    <p className="text-muted-foreground">{t('features.news.messages.manageDescription')}</p>
                </div>
                <Button
                    onClick={() => {
                        setShowForm(!showForm);
                        reset();
                    }}
                    variant={showForm ? 'outline' : 'default'}
                >
                    <Newspaper className="h-4 w-4 mr-2" />
                    {t('features.news.messages.createArticle')}
                </Button>
            </div>

            {showForm && (
                <div className="space-y-2">
                    <CreateArticleForm
                        onSubmit={handleCreate}
                        onCancel={handleCancel}
                        isLoading={isCreating}
                    />
                    {createError && (
                        <p className="text-sm text-destructive">{createError}</p>
                    )}
                    {success && (
                        <p className="text-sm text-green-600">{t('features.news.messages.articlePublished')}</p>
                    )}
                </div>
            )}

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
