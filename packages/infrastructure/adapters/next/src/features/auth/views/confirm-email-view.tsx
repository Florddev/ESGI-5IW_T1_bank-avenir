'use client';

import { ConfirmEmailFlow } from '../components/confirm-email-flow';

export function ConfirmEmailView() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md">
                <ConfirmEmailFlow />
            </div>
        </div>
    );
}
