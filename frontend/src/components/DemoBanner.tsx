'use client';

import { useDemo } from '@/context/DemoContext';

export default function DemoBanner() {
    const { isDemo, setIsDemo } = useDemo();

    if (!isDemo) {
        return null;
    }

    return (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <span className="text-amber-600 font-semibold text-sm">
                    ✨ Demo Mode
                </span>
                <span className="text-amber-700 text-sm">
                    Viewing sample data
                </span>
            </div>
            <button
                onClick={() => setIsDemo(false)}
                className="text-amber-600 hover:text-amber-700 font-medium text-sm underline"
            >
                Exit Demo
            </button>
        </div>
    );
}
