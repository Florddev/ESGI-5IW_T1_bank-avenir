'use client';

import { Card, CardContent } from '@workspace/ui-react/components/card';
import { User, Calendar } from 'lucide-react';
import type { ArticleDto } from '@workspace/application/dtos';

interface ArticleCardProps {
    article: ArticleDto;
}

export function ArticleCard({ article }: ArticleCardProps) {
    return (
        <Card>
            <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 whitespace-pre-line">{article.content}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{article.authorName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(article.publishedAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                        })}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
