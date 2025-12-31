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
    description: 'Cutting-edge financial analytics tool',
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