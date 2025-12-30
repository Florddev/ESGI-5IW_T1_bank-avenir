import type { ReactNode } from 'react';

interface DashboardHeaderProps {
    title: string;
    badge?: string;
    actions?: ReactNode;
    userInfo?: ReactNode;
}

export function DashboardHeader({ title, badge, actions, userInfo }: DashboardHeaderProps) {
    return (
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-primary">{title}</h1>
                    {badge && (
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                            {badge}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    {userInfo}
                    {actions}
                </div>
            </div>
        </header>
    );
}
