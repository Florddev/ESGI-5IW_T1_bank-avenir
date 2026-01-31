'use client';

import { useAuth } from '@workspace/adapter-next/features/auth';
import { NewsView, NewsManageView } from '@workspace/adapter-next/features/news';
import { UserRole } from '@workspace/domain/entities';

export default function NewsPage() {
    const { user } = useAuth();

    if (!user) {
        return null;
    }

    if (user.role === UserRole.ADVISOR || user.role === UserRole.DIRECTOR) {
        return <NewsManageView />;
    }

    return <NewsView />;
}
