'use client';

import { useState, useEffect, useCallback } from 'react';
import { getArticlesClient } from '@workspace/adapter-next/client';
import { useRealtime } from '../../realtime/hooks/useRealtime';
import { useAuth } from '../../auth';
import type { ArticleDto } from '@workspace/application/dtos';

export function useArticles() {
    const { user } = useAuth();
    const [articles, setArticles] = useState<ArticleDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadArticles = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const client = getArticlesClient();
            const data = await client.getArticles();
            setArticles(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors du chargement des actualités');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadArticles();
    }, [loadArticles]);

    useRealtime<ArticleDto>({
        userId: user?.id ?? '',
        events: ['article_new'],
        onEvent: () => {
            loadArticles();
        },
    });

    return { articles, isLoading, error, refetch: loadArticles };
}
