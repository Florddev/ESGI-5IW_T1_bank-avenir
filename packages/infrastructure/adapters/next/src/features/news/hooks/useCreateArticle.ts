'use client';

import { useState } from 'react';
import { getArticlesClient } from '@workspace/adapter-next/client';

export function useCreateArticle() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const createArticle = async (data: { title: string; content: string }) => {
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const client = getArticlesClient();
            const result = await client.createArticle(data);
            setSuccess(true);
            return result;
        } catch (err) {
            const message = err instanceof Error ? err.message : "Erreur lors de la création de l'article";
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const reset = () => {
        setError(null);
        setSuccess(false);
    };

    return { createArticle, isLoading, error, success, reset };
}
