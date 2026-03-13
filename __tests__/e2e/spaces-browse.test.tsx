import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { SpacesView } from '@/components/features/spaces/spaces-view';
import { SpaceType } from '@/types/api/spaces';

// Mock routing hooks
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
    useRouter: () => ({ push: mockPush }),
    usePathname: () => '/en/spaces',
    useSearchParams: () => new URLSearchParams(),
    useParams: () => ({ locale: 'en' }),
}));

// Mock translations
vi.mock('next-intl', () => ({
    useTranslations: () => (key: string, options: any) => options?.defaultMessage || key,
    useLocale: () => 'en',
}));

// Create a mock hook for useSpaces
const mockUseSpaces = vi.fn();
vi.mock('@/lib/hooks/use-spaces', () => ({
    useSpaces: (...args: any[]) => mockUseSpaces(...args),
}));

// Mock ResizeObserver for Radix UI
global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
};

describe('SpacesView Integration', () => {
    const emptyFilters = {};

    const mockInitialData = {
        data: [
            {
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
            }
        ],
        page: 1,
        totalPages: 3,
        limit: 12,
        total: 36
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseSpaces.mockReturnValue({
            data: undefined, // Will default to initialData
            isLoading: false,
            isError: false,
        });
    });

    it('renders initial data correctly', () => {
        render(
            <SpacesView
                initialData={mockInitialData}
                initialFilters={emptyFilters}
                initialPage={1}
            />
        );

        // Verify it renders the results count
        expect(screen.getByText('36')).toBeInTheDocument();
        expect(screen.getByText('Spaces Found')).toBeInTheDocument();

        // Verify it renders the space card
        expect(screen.getByText('Riyadh Office')).toBeInTheDocument();

        // Verify pagination is rendered (should show numbers 1, 2, 3)
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('renders loading state when fetching new data', () => {
        mockUseSpaces.mockReturnValue({
            data: undefined,
            isLoading: true,
            isError: false,
        });

        const { container } = render(
            <SpacesView
                initialData={mockInitialData}
                initialFilters={emptyFilters}
                initialPage={1}
            />
        );

        // There should be skeleton loaders present
        const skeletons = container.querySelectorAll('.animate-pulse');
        expect(skeletons.length).toBeGreaterThan(0);
    });

    it('renders error state correctly', () => {
        mockUseSpaces.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
        });

        render(
            <SpacesView
                initialData={mockInitialData}
                initialFilters={emptyFilters}
                initialPage={1}
            />
        );

        expect(screen.getByText('workspaces_error_title')).toBeInTheDocument();
    });

    it('updates url parameters on filter change', async () => {
        // This requires simulating the search input which debounces.
        render(
            <SpacesView
                initialData={mockInitialData}
                initialFilters={emptyFilters}
                initialPage={1}
            />
        );

        // Simulate clicking "Clear all" filter, since we mocked search typing in the other test
        const searchInput = screen.getByPlaceholderText('Search spaces...');
        fireEvent.change(searchInput, { target: { value: 'Test Search' } });

        // Wait for debounce and route push
        await waitFor(() => {
            // The router.push should have been called with the updated URL
            expect(mockPush).toHaveBeenCalledWith('/en/spaces?search=Test+Search', { scroll: false });
        }, { timeout: 1000 });
    });

    it('updates page parameter on pagination click', async () => {
        render(
            <SpacesView
                initialData={mockInitialData}
                initialFilters={emptyFilters}
                initialPage={1}
            />
        );

        // Click page 2
        const page2Btn = screen.getByRole('link', { name: '2' });
        fireEvent.click(page2Btn);

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/en/spaces?page=2');
        });
    });
});
