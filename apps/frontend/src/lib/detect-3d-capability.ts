/**
 * 3D Capability Detection Utility
 * 
 * Performs 6-point detection to determine if the device can handle 3D rendering:
 * 1. Screen size (>= 1024px)
 * 2. Mobile user agent check
 * 3. WebGL GPU support
 * 4. CPU core count (>= 4)
 * 5. Reduced motion preference
 * 6. Network connection quality
 * 
 * @returns boolean - true if device can handle 3D, false otherwise
 */

interface NavigatorWithConnection extends Navigator {
    connection?: {
        effectiveType: string;
        saveData?: boolean;
    };
}

/**
 * Check if the current device can handle 3D WebGL rendering
 */
export function canUse3D(): boolean {
    // SSR guard
    if (typeof window === 'undefined') {
        return false;
    }

    // Check 1: Screen size (desktop only)
    const hasLargeScreen = window.innerWidth >= 1024;

    // Check 2: User agent (block known mobile browsers)
    const isMobile = /Mobile|Android|iPhone|iPad|iPod|webOS|BlackBerry|Opera Mini|IEMobile/i.test(
        navigator.userAgent
    );

    // Check 3: GPU detection via WebGL
    const hasGPU = (() => {
        try {
            const canvas = document.createElement('canvas');
            const gl =
                canvas.getContext('webgl2') ||
                canvas.getContext('webgl') ||
                canvas.getContext('experimental-webgl');

            if (!gl) return false;

            // Additional check: verify renderer info for known weak GPUs
            const debugInfo = (gl as WebGLRenderingContext).getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                const renderer = (gl as WebGLRenderingContext).getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                // Block known software renderers
                if (/SwiftShader|Software|llvmpipe/i.test(renderer)) {
                    return false;
                }
            }

            return true;
        } catch {
            return false;
        }
    })();

    // Check 4: CPU cores (proxy for device power)
    const hasPowerfulCPU = (navigator.hardwareConcurrency || 2) >= 4;

    // Check 5: Accessibility - respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Check 6: Connection speed (fallback to true if API unavailable)
    const hasGoodConnection = (() => {
        const nav = navigator as NavigatorWithConnection;
        if (!nav.connection) return true;

        // Block if data saver is enabled
        if (nav.connection.saveData) return false;

        // Check effective connection type
        const effectiveType = nav.connection.effectiveType;
        return effectiveType === '4g' || effectiveType === 'wifi';
    })();

    // All checks must pass
    return (
        hasLargeScreen &&
        !isMobile &&
        hasGPU &&
        hasPowerfulCPU &&
        !prefersReducedMotion &&
        hasGoodConnection
    );
}

/**
 * Individual check functions for debugging/logging
 */
export const capabilityChecks = {
    /** Check if screen is large enough for 3D */
    hasLargeScreen: () => typeof window !== 'undefined' && window.innerWidth >= 1024,

    /** Check if device is mobile */
    isMobile: () =>
        typeof navigator !== 'undefined' &&
        /Mobile|Android|iPhone|iPad|iPod|webOS|BlackBerry|Opera Mini|IEMobile/i.test(navigator.userAgent),

    /** Check for WebGL support */
    hasWebGL: () => {
        if (typeof document === 'undefined') return false;
        try {
            const canvas = document.createElement('canvas');
            return !!(
                canvas.getContext('webgl2') ||
                canvas.getContext('webgl') ||
                canvas.getContext('experimental-webgl')
            );
        } catch {
            return false;
        }
    },

    /** Check CPU power */
    hasPowerfulCPU: () =>
        typeof navigator !== 'undefined' && (navigator.hardwareConcurrency || 2) >= 4,

    /** Check reduced motion preference */
    prefersReducedMotion: () =>
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches,

    /** Check connection quality */
    hasGoodConnection: () => {
        if (typeof navigator === 'undefined') return true;
        const nav = navigator as NavigatorWithConnection;
        if (!nav.connection) return true;
        if (nav.connection.saveData) return false;
        const effectiveType = nav.connection.effectiveType;
        return effectiveType === '4g' || effectiveType === 'wifi';
    },
};

/**
 * Get a detailed report of all capability checks
 * Useful for debugging and logging
 */
export function getCapabilityReport(): Record<string, boolean> {
    return {
        hasLargeScreen: capabilityChecks.hasLargeScreen(),
        isMobile: capabilityChecks.isMobile(),
        hasWebGL: capabilityChecks.hasWebGL(),
        hasPowerfulCPU: capabilityChecks.hasPowerfulCPU(),
        prefersReducedMotion: capabilityChecks.prefersReducedMotion(),
        hasGoodConnection: capabilityChecks.hasGoodConnection(),
        canUse3D: canUse3D(),
    };
}
