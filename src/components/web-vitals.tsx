"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
    useReportWebVitals((metric) => {
        // Log to console 
        // In production, you would send this to your analytics endpoint
        switch (metric.name) {
            case 'FCP':
            case 'LCP':
            case 'CLS':
            case 'FID':
            case 'TTFB':
            case 'INP':
                console.log(`[Web Vitals] ${metric.name}: ${Math.round(metric.value * 100) / 100}`);
                break;
        }
    });

    return null;
}
