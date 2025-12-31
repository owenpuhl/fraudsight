'use client';

import { useAuth0 } from '@auth0/auth0-react';
import Link from 'next/link';

export default function NavBar() {
    const { user, isAuthenticated, isLoading, logout, loginWithRedirect } = useAuth0();

    const handleLogout = () => {
        logout({
            logoutParams: {
                returnTo: window.location.origin
            }
        });
    };

    const handleLogin = () => {
        loginWithRedirect({
            appState: { returnTo: '/dashboard' }
        });
    };

    if (isLoading) {
        return (
            <nav className="bg-white border-b border-gray-100 shadow-sm">
                <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                    <Link href="/" className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <span className="text-2xl">📊</span>
                        Fraudsight
                    </Link>
                    <div className="text-sm text-gray-600">Loading...</div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="text-lg font-bold text-gray-900 flex items-center gap-2 hover:text-blue-600 transition-colors">
                    <span className="text-2xl">📊</span>
                    Fraudsight
                </Link>

                <div className="flex items-center gap-6">
                    {isAuthenticated ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                            >
                                Dashboard
                            </Link>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    {user?.picture && (
                                        <img
                                            src={user.picture}
                                            alt={user.name || 'User'}
                                            className="w-8 h-8 rounded-full"
                                        />
                                    )}
                                    <span className="hidden sm:inline text-sm font-medium text-gray-700">
                                        {user?.name || user?.email}
                                    </span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 px-4 py-2 rounded-lg transition-colors text-sm font-medium border border-red-200"
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <button
                            onClick={handleLogin}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-5 py-2 rounded-lg transition-all text-sm font-medium shadow-md hover:shadow-lg"
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}