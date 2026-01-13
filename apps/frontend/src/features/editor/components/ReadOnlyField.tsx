"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ReadOnlyFieldProps {
    value: string;
    className?: string;
    tagName?: "h1" | "h2" | "h3" | "p" | "span" | "div";
    style?: React.CSSProperties;
}

/**
 * Read-only version of EditableField for Preview mode.
 * Renders HTML content with clickable hyperlinks.
 */
export function ReadOnlyField({ value, className, tagName = "div", style }: ReadOnlyFieldProps) {
    // Handle click on links to open in new tab
    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        const target = e.target as HTMLElement;
        const linkElement = target.closest('a');
        if (linkElement) {
            e.preventDefault();
            const href = linkElement.getAttribute('href');
            if (href) {
                window.open(href, '_blank', 'noopener,noreferrer');
            }
        }
    };

    const combinedClassName = cn(
        "px-1",
        "[&_a]:text-blue-600 [&_a]:underline [&_a]:cursor-pointer [&_a]:hover:text-blue-800",
        className
    );

    return React.createElement(tagName, {
        style,
        className: combinedClassName,
        onClick: handleClick,
        dangerouslySetInnerHTML: { __html: value },
    });
}

