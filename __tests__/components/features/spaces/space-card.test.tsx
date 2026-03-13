import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SpaceCard } from '@/components/features/spaces/space-card';
import { SpaceType } from '@/types/api/spaces';

// Mock next-intl hooks
vi.mock('next-intl', () => ({
    useTranslations: () => (key: string, values?: Record<string, unknown>) => {
        if (key === 'space_capacity_label') return `Up to ${values?.capacity} people`;
        if (key === 'space_view_details') return 'View Details';
        if (key === 'space_starting_from') return 'Starting from';
        if (key === 'space_pricing_hourly') return 'hour';
        return key;
    },
    useLocale: () => 'en',
}));

describe('SpaceCard Component', () => {
    const mockSpace = {
        id: 1,
        name_ar: 'مكتب الرياض',
        name_en: 'Riyadh Office',
        branch: {
            id: 1,
            name_ar: 'فرع العليا',
            name_en: 'Al-Olaya Branch',
        },
        space_type: SpaceType.PRIVATE_OFFICE,
        capacity: 4,
        hourly_rate: 150,
        daily_rate: undefined,
        weekly_rate: undefined,
        monthly_rate: undefined,
        is_active: true,
        main_image: '/images/test.jpg',
        average_rating: 4.5,
    } as any;

    it('renders the space card with English text', () => {
        render(<SpaceCard space={mockSpace} />);

        // Checks name
        expect(screen.getByText('Riyadh Office')).toBeInTheDocument();

        // Checks branch name
        expect(screen.getByText('Al-Olaya Branch')).toBeInTheDocument();

        // Checks capacity
        expect(screen.getByText('Up to 4 people')).toBeInTheDocument();

        // Checks rating
        expect(screen.getByText('4.5')).toBeInTheDocument();
    });
});
