import type { ReactNode } from 'react';

interface DashboardShellProps {
    header: ReactNode;
    sidebar: ReactNode;
    children: ReactNode;
}

export function DashboardShell({ header, sidebar, children }: DashboardShellProps) {
    return (
        <div className="min-h-screen bg-background">
            {header}
            <div className="container mx-auto px-4 py-6 flex gap-6">
                <aside className="w-64 flex-shrink-0">
                    {sidebar}
                </aside>
                <main className="flex-1 min-w-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
