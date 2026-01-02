import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import NavBar from '@/components/NavBar';
import DemoBanner from '@/components/DemoBanner';
import { Auth0ProviderWrapper } from '@/context/Auth0ProviderWrapper';
import { DemoProvider } from '@/context/DemoContext';

const inter = Inter({ subsets: ['latin'] });
const plusJakartaSans = Plus_Jakarta_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-plus-jakarta-sans',
});

export const metadata: Metadata = {
    title: 'Fraudsight',
    description: 'Real-time financial risk analytics platform by Owen Puhl.',
    keywords: 'portfolio risk analytics, VaR, Sharpe Ratio, financial intelligence, risk metrics',
    icons: {
        icon: '/logo.png',
    },
    verification: {
        google: 'F8Ugx6C7T4bHvmf4ppsXsVoM0Nfn-WOl8rEYmrc-sYY',
    },
    openGraph: {
        title: 'Fraudsight',
        description: 'Real-time financial risk analytics platform by Owen Puhl.',
        url: 'https://fraudsight.vercel.app',
        type: 'website',
    },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={plusJakartaSans.variable}>
        <body className={inter.className}>
        <DemoProvider>
            <Auth0ProviderWrapper>
                <DemoBanner />
                <NavBar />
                <main>{children}</main>
            </Auth0ProviderWrapper>
        </DemoProvider>
        </body>
        </html>
    );
}