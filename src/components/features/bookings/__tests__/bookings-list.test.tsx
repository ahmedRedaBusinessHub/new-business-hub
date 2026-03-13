import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BookingsList } from '../bookings-list';
import { useUserBookings } from '@/lib/hooks/use-bookings';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

// Mock dependencies
jest.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key,
    useLocale: () => 'en',
}));

jest.mock('@/lib/hooks/use-bookings', () => ({
    useUserBookings: jest.fn(),
}));

jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
    useSearchParams: jest.fn(),
    usePathname: jest.fn(),
}));

// Mock child components
jest.mock('../booking-card', () => ({
    BookingCard: ({ booking }: any) => <div data-testid="booking-card">{booking.id}</div>,
}));

jest.mock('../booking-filters', () => ({
    BookingFilters: ({ onStatusChange }: any) => (
        <button onClick={() => onStatusChange('confirmed')} data-testid="status-filter">Filter</button>
    ),
}));

describe('BookingsList', () => {
    const mockRouterPush = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        (useRouter as jest.Mock).mockReturnValue({
            push: mockRouterPush,
        });

        (usePathname as jest.Mock).mockReturnValue('/en/bookings');

        (useSearchParams as jest.Mock).mockReturnValue({
            get: (key: string) => key === 'page' ? '1' : null,
            toString: () => 'page=1',
        });
    });

    it('renders a list of bookings and pagination controls', () => {
        (useUserBookings as jest.Mock).mockReturnValue({
            data: {
                data: [{ id: 1 }, { id: 2 }],
                totalPages: 2,
                total: 15,
            },
            isLoading: false,
            isError: false,
        });

        render(<BookingsList />);

        expect(screen.getAllByTestId('booking-card')).toHaveLength(2);
        expect(screen.getByText(/pagination_page 1 pagination_of 2/)).toBeInTheDocument();
    });

    it('renders the empty state placeholder with Book Now CTA when no bookings exist', () => {
        (useUserBookings as jest.Mock).mockReturnValue({
            data: {
                data: [],
                totalPages: 0,
                total: 0,
            },
            isLoading: false,
            isError: false,
        });

        render(<BookingsList />);

        expect(screen.getByText('booking_no_bookings_found')).toBeInTheDocument();
        expect(screen.getByText('book_now')).toBeInTheDocument();
    });

    it('redirects to page 1 if current page is out of bounds', async () => {
        (useSearchParams as jest.Mock).mockReturnValue({
            get: (key: string) => key === 'page' ? '999' : null,
            toString: () => 'page=999',
        });

        (useUserBookings as jest.Mock).mockReturnValue({
            data: {
                data: [],
                totalPages: 2,
                total: 15,
            },
            isLoading: false,
            isError: false,
        });

        render(<BookingsList />);

        await waitFor(() => {
            expect(mockRouterPush).toHaveBeenCalledWith('/en/bookings?page=1', { scroll: false });
        });
    });

    it('resets page to 1 when filters change', async () => {
        (useSearchParams as jest.Mock).mockReturnValue({
            get: (key: string) => key === 'page' ? '2' : null,
            toString: () => 'page=2',
        });

        (useUserBookings as jest.Mock).mockReturnValue({
            data: {
                data: [{ id: 11 }],
                totalPages: 2,
                total: 15,
            },
            isLoading: false,
            isError: false,
        });

        render(<BookingsList />);

        fireEvent.click(screen.getByTestId('status-filter'));

        await waitFor(() => {
            expect(mockRouterPush).toHaveBeenCalledWith('/en/bookings?page=1', { scroll: false });
        });
    });
});
