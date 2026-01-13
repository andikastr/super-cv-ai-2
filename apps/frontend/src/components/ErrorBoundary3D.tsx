'use client';

import React from 'react';

/**
 * Props for ErrorBoundary3D component
 */
interface ErrorBoundary3DProps {
    /** Child components to render (typically 3D content) */
    children: React.ReactNode;
    /** Fallback component to render on error */
    fallback: React.ReactNode;
    /** Optional callback when error occurs */
    onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * State for ErrorBoundary3D component
 */
interface ErrorBoundary3DState {
    hasError: boolean;
    error?: Error;
}

/**
 * Error Boundary for 3D Components
 * 
 * Catches errors in 3D rendering and automatically falls back to 2D components.
 * This is critical for handling WebGL context loss, shader compilation errors,
 * and other GPU-related issues gracefully.
 * 
 * @example
 * ```tsx
 * <ErrorBoundary3D fallback={<Landing2D />}>
 *   <Landing3D />
 * </ErrorBoundary3D>
 * ```
 */
export class ErrorBoundary3D extends React.Component<
    ErrorBoundary3DProps,
    ErrorBoundary3DState
> {
    constructor(props: ErrorBoundary3DProps) {
        super(props);
        this.state = { hasError: false };
    }

    /**
     * Update state when error is caught
     */
    static getDerivedStateFromError(error: Error): ErrorBoundary3DState {
        return { hasError: true, error };
    }

    /**
     * Log error details and notify monitoring services
     */
    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        // Log to console in development
        console.error('[3D Error Boundary] Caught error:', error);
        console.error('[3D Error Boundary] Component stack:', errorInfo.componentStack);

        // Call optional error callback
        this.props.onError?.(error, errorInfo);

        // Log to monitoring service (e.g., Sentry) in production
        if (typeof window !== 'undefined') {
            const win = window as Window & { Sentry?: { captureException: (error: Error, context?: unknown) => void } };
            if (win.Sentry) {
                win.Sentry.captureException(error, {
                    contexts: {
                        react: {
                            componentStack: errorInfo.componentStack,
                        },
                        threeJs: {
                            message: 'WebGL/3D rendering error',
                        },
                    },
                });
            }
        }
    }

    render(): React.ReactNode {
        if (this.state.hasError) {
            // Return fallback component (2D version)
            return this.props.fallback;
        }

        return this.props.children;
    }
}

/**
 * Hook to programmatically trigger error boundary fallback
 * Useful for testing or manual fallback scenarios
 */
export function useErrorBoundary3D() {
    const [shouldThrow, setShouldThrow] = React.useState(false);

    React.useEffect(() => {
        if (shouldThrow) {
            throw new Error('[3D] Manual fallback triggered');
        }
    }, [shouldThrow]);

    return {
        triggerFallback: () => setShouldThrow(true),
    };
}
