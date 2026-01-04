import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

export const LoadingSkeleton = () => (
    <div className="animate-pulse">
        <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-1/3 mb-4" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full mb-2" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
    </div>
);

export const CardSkeleton = () => (
    <div className="animate-pulse glass-panel rounded-2xl p-6">
        <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl w-12 mb-4" />
        <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/2 mb-2" />
        <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
    </div>
);

export function createLazyComponent<T extends ComponentType<any>>(
    importFn: () => Promise<{ default: T }>,
    LoadingComponent: ComponentType = LoadingSkeleton
) {
    return dynamic(importFn, {
        loading: () => <LoadingComponent />,
        ssr: false,
    });
}

export function createLazySSRComponent<T extends ComponentType<any>>(
    importFn: () => Promise<{ default: T }>,
    LoadingComponent: ComponentType = LoadingSkeleton
) {
    return dynamic(importFn, {
        loading: () => <LoadingComponent />,
        ssr: true,
    });
}

export const LazyConfetti = createLazyComponent(
    () => import('@/components/ui/Confetti').then(mod => ({ default: mod.Confetti }))
);

export const LazyTiltCard = createLazySSRComponent(
    () => import('@/components/design-system/TiltCard').then(mod => ({ default: mod.TiltCard })),
    CardSkeleton
);
