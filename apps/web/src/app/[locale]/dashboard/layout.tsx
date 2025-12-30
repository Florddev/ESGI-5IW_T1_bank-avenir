import { DashboardLayoutClient } from '@workspace/adapter-next/features/dashboard';
import type { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
