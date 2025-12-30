'use client';

import Link from 'next/link';

export interface NavItem {
    href: string;
    label: string;
    icon: string;
}

interface DashboardNavProps {
    items: NavItem[];
    currentPath: string;
}

export function DashboardNav({ items, currentPath }: DashboardNavProps) {
    return (
        <nav className="space-y-1 sticky top-24" aria-label="Navigation principale">
            {items.map((item) => {
                const isActive = currentPath === item.href || 
                    (item.href !== '/dashboard' && currentPath.startsWith(item.href));
                
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`
                            flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                            ${isActive 
                                ? 'bg-primary text-primary-foreground font-medium' 
                                : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                            }
                        `}
                    >
                        <span className="text-lg">{item.icon}</span>
                        <span>{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
