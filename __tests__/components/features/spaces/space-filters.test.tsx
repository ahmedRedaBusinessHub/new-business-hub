import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SpaceFiltersPanel } from '@/components/features/spaces/space-filters';
import { SpaceType } from '@/types/api/spaces';

// Mock next-intl
vi.mock('next-intl', () => ({
    useTranslations: () => (key: string, options: any) => {
        return options?.defaultMessage || key;
    },
    useLocale: () => 'en',
}));

// Mock hooks
vi.mock('@/hooks/use-debounce', () => ({
    useDebounce: (val: string) => val, // Pass through immediately for testing
}));

describe('SpaceFiltersPanel Component', () => {
    const mockBranches = [
        { id: 1, name_en: 'Al-Olaya Branch', name_ar: 'فرع العليا' },
        { id: 2, name_en: 'King Fahd Branch', name_ar: 'فرع الملك فهد' }
    ];

    it('renders filters empty state correctly', () => {
        const handleFilterChange = vi.fn();

        render(
            <SpaceFiltersPanel
                onFilterChange={handleFilterChange}
                branches={mockBranches}
            />
        );

        // Initial labels rendered
        expect(screen.getByText('Filters')).toBeInTheDocument();
        expect(screen.getAllByText('Branch')[0]).toBeInTheDocument();
    });

    it('calls onFilterChange when search input is typed', async () => {
        const handleFilterChange = vi.fn();

        render(
            <SpaceFiltersPanel
                onFilterChange={handleFilterChange}
                branches={mockBranches}
            />
        );

        // Get search input by its placeholder
        const searchInput = screen.getByPlaceholderText('Search spaces...');

        // Simulate typing
        fireEvent.change(searchInput, { target: { value: 'Private Office' } });

        // Since our mock debounce passes through immediately, we can check the call
        await waitFor(() => {
            expect(handleFilterChange).toHaveBeenCalledWith(expect.objectContaining({
                search: 'Private Office'
            }));
        });
    });

    it('clears filters when Clear All button is clicked', async () => {
        const handleFilterChange = vi.fn();

        // Render with some initial filters
        render(
            <SpaceFiltersPanel
                initialFilters={{ search: 'Test', branch_id: 1, space_type: SpaceType.HOT_DESK }}
                onFilterChange={handleFilterChange}
                branches={mockBranches}
            />
        );

        // Find the Clear All button
        const clearButton = screen.getByRole('button', { name: /Clear all/i });
        expect(clearButton).toBeInTheDocument();

        // Click it
        fireEvent.click(clearButton);

        // Check that onFilterChange was called with empty object
        await waitFor(() => {
            expect(handleFilterChange).toHaveBeenCalledWith({});
            // And the search input should be empty
            expect(screen.getByPlaceholderText('Search spaces...')).toHaveValue('');
        });
    });
});
