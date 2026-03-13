import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '@/components/ui/EmptyState';
import { MapPin } from 'lucide-react';

describe('EmptyState Component', () => {
    it('renders with default props', () => {
        render(<EmptyState />);

        expect(screen.getByText('No data available')).toBeInTheDocument();
        expect(screen.getByText('There is nothing to display at the moment.')).toBeInTheDocument();
    });

    it('renders custom title and description', () => {
        render(
            <EmptyState
                title="Custom Title"
                description="Custom description text"
            />
        );

        expect(screen.getByText('Custom Title')).toBeInTheDocument();
        expect(screen.getByText('Custom description text')).toBeInTheDocument();
    });

    it('renders an action button', () => {
        render(
            <EmptyState
                action={<button>Retry</button>}
            />
        );

        expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });

    it('renders icon when provided', () => {
        render(
            <EmptyState
                icon={<MapPin data-testid="map-pin-icon" />}
            />
        );

        expect(screen.getByTestId('map-pin-icon')).toBeInTheDocument();
    });
});
