import { Geist, Geist_Mono } from 'next/font/google';
import type { Metadata } from 'next';

import '@workspace/ui-react/globals.css';
import { Providers } from '@/components/providers';
import { getDictionary, LOCALES, type Locale } from '@/dictionaries';

const fontSans = Geist({
    subsets: ['latin'],
    variable: '--font-sans',
});

const fontMono = Geist_Mono({
    subsets: ['latin'],
    variable: '--font-mono',
});

export const metadata: Metadata = {
    title: {
        default: 'Avenir Bank - Votre partenaire bancaire de confiance',
        template: '%s | Avenir Bank',
    },
    description:
        'Gérez vos finances en toute simplicité avec Avenir Bank. Comptes bancaires, transactions, prêts, investissements et bien plus encore.',
    keywords: [
        'banque',
        'banque en ligne',
        'compte bancaire',
        'transaction',
        'prêt',
        'épargne',
        'investissement',
        'bourse',
        'avenir bank',
    ],
    authors: [{ name: 'Avenir Bank' }],
    creator: 'Avenir Bank',
    publisher: 'Avenir Bank',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: 'website',
        locale: 'fr_FR',
        url: 'https://avenir-bank.com',
        title: 'Avenir Bank - Votre partenaire bancaire de confiance',
        description:
            'Gérez vos finances en toute simplicité avec Avenir Bank. Comptes bancaires, transactions, prêts, investissements et bien plus encore.',
        siteName: 'Avenir Bank',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
};

export async function generateStaticParams() {
    return LOCALES.map((locale) => ({ locale }));
}

interface RootLayoutProps {
    children: React.ReactNode;
    params: Promise<{ locale: Locale }>;
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
    const { locale } = await params;
    const translations = await getDictionary(locale);

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}>
                <Providers locale={locale} translations={translations}>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
