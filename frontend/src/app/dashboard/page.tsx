'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth0 } from '@auth0/auth0-react';
import { useDemo } from '@/context/DemoContext';
import AccountsList from '@/components/AccountsList';
import AnalyticsToolSwitcher, { AnalyticsTool } from '@/components/AnalyticsToolSwitcher';
import AccountGraphAnalytics from '@/components/AccountGraphAnalytics';
import ForecastPanel from '@/components/ForecastPanel';

export default function DashboardPage() {
    const { isAuthenticated, isLoading } = useAuth0();
    const { isDemo } = useDemo();
    const router = useRouter();
    const [currentTool, setCurrentTool] = useState<AnalyticsTool>('accounts');

    useEffect(() => {
        if (!isLoading && !isAuthenticated && !isDemo) {
            router.push('/');
        }
    }, [isLoading, isAuthenticated, isDemo, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    const renderToolContent = () => {
        switch (currentTool) {
            case 'accounts':
                return <AccountsList />;
            case 'insights':
                return <AccountGraphAnalytics />;
            case 'forecast':
                return <ForecastPanel />;
            default:
                return <AccountsList />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto p-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Financial Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Manage your financial accounts and analytics
                    </p>
                </div>

                <AnalyticsToolSwitcher
                    currentTool={currentTool}
                    onToolChange={setCurrentTool}
                />

                <div className="mt-6">
                    {renderToolContent()}
                </div>
            </div>
        </div>
    );
}