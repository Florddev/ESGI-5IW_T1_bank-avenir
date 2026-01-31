'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@workspace/ui-react/components/button';
import { Input } from '@workspace/ui-react/components/input';
import { Label } from '@workspace/ui-react/components/label';
import { Textarea } from '@workspace/ui-react/components/textarea';
import { createArticleSchema, type CreateArticleFormData } from '@workspace/adapter-common/validators';
import { useTranslations } from '@workspace/ui-react/contexts';

interface CreateArticleFormProps {
    onSubmit: (data: CreateArticleFormData) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

export function CreateArticleForm({ onSubmit, onCancel, isLoading }: CreateArticleFormProps) {
    const t = useTranslations();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CreateArticleFormData>({
        resolver: zodResolver(createArticleSchema),
        defaultValues: {
            title: '',
            content: '',
        },
    });

    return (
        <div className="bg-card p-6 rounded-lg border shadow-sm">
            <h3 className="text-xl font-semibold mb-4">{t('features.news.messages.createArticle')}</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <Label htmlFor="title">{t('features.news.messages.articleTitle')}</Label>
                    <Input
                        id="title"
                        {...register('title')}
                        placeholder={t('features.news.messages.articleTitlePlaceholder')}
                        disabled={isLoading}
                    />
                    {errors.title && (
                        <p className="text-sm text-destructive mt-1">{errors.title.message}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="content">{t('features.news.messages.articleContent')}</Label>
                    <Textarea
                        id="content"
                        {...register('content')}
                        placeholder={t('features.news.messages.articleContentPlaceholder')}
                        disabled={isLoading}
                        rows={6}
                    />
                    {errors.content && (
                        <p className="text-sm text-destructive mt-1">{errors.content.message}</p>
                    )}
                </div>

                <div className="flex gap-2">
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? t('features.news.messages.publishing') : t('features.news.messages.publish')}
                    </Button>
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                        {t('features.news.messages.cancel')}
                    </Button>
                </div>
            </form>
        </div>
    );
}
