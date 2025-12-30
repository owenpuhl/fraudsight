'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface DemoContextType {
    isDemo: boolean;
    setIsDemo: (value: boolean) => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: React.ReactNode }) {
    const [isDemo, setIsDemo] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const demoMode = localStorage.getItem('fraudsight_demo_mode') === 'true';
        setIsDemo(demoMode);
        setMounted(true);
    }, []);

    useEffect(() => {
        localStorage.setItem('fraudsight_demo_mode', isDemo ? 'true' : 'false');
    }, [isDemo]);

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <DemoContext.Provider value={{ isDemo, setIsDemo }}>
            {children}
        </DemoContext.Provider>
    );
}

export function useDemo() {
    const context = useContext(DemoContext);
    if (context === undefined) {
        throw new Error('useDemo must be used within DemoProvider');
    }
    return context;
}
