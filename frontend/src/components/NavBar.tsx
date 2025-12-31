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
                    <Link href="/" className="text-lg font-bold text-gray-900 flex items-center gap-3">
                        <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                            <svg
                                className="w-6 h-6 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                        </div>
                        Fraudsight
                    </Link>
                    <div className="text-sm text-gray-600">Loading...</div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
                <Link href="/" className="text-lg font-bold text-gray-900 flex items-center gap-2 sm:gap-3 hover:text-blue-600 transition-colors group flex-shrink-0">
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg group-hover:bg-blue-700 transition-colors flex-shrink-0">
                        <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                        </svg>
                    </div>
                    <span className="hidden sm:inline">Fraudsight</span>
                </Link>

                <div className="flex items-center gap-3 sm:gap-6 ml-auto">
                    {isAuthenticated ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors hidden sm:block"
                            >
                                Dashboard
                            </Link>
                            <div className="flex items-center gap-2 sm:gap-4">
                                <div className="flex items-center gap-1 sm:gap-2">
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
                                    className="bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium border border-red-200 whitespace-nowrap"
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <button
                            onClick={handleLogin}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-4 sm:px-5 py-2 rounded-lg transition-all text-xs sm:text-sm font-medium shadow-md hover:shadow-lg whitespace-nowrap"
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}