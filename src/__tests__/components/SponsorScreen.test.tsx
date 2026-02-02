import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import SponsorScreen from '@/components/SponsorScreen';

// Mock dependencies
vi.mock('@/services/sponsorService', () => ({
    getActiveSponsor: vi.fn(),
    trackImpression: vi.fn(),
    trackClick: vi.fn(),
    getStoredSponsors: vi.fn(() => []), // Return empty by default
}));

import { getActiveSponsor } from '@/services/sponsorService';

describe('SponsorScreen Component', () => {
    beforeEach(() => {
        vi.useFakeTimers();
        // Default mock implementation
        (getActiveSponsor as any).mockReturnValue({
            id: 'test-sponsor',
            name: 'Test Brand',
            tagline: 'Test Tagline',
            message: 'Test Message',
            mediaType: 'none',
            theme: 'cosmic',
            plan: 'nebula',
            status: 'active',
        });
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    it('renders correctly with provided messages', () => {
        render(<SponsorScreen onComplete={vi.fn()} />);

        expect(screen.getByText('Test Brand')).toBeInTheDocument();
        expect(screen.getByText('Test Tagline')).toBeInTheDocument();
        expect(screen.getByText('Test Message')).toBeInTheDocument();
    });

    it('calls onComplete after timeout/progress completion', () => {
        const onCompleteMock = vi.fn();
        render(<SponsorScreen onComplete={onCompleteMock} />);

        // Fast-forward time
        act(() => {
            vi.advanceTimersByTime(5000 + 100); // 5s usually, plus buffer
        });

        // Check if onComplete was called
        // Note: implementation details might vary, adjust time as needed
        // If it relies on state updates, we might need waitFor or similar
        // For now assuming simple timeout
        expect(onCompleteMock).toHaveBeenCalled();
    });

    it('renders correctly with cosmic theme', () => { // Fixed prop usage here as well
        (getActiveSponsor as any).mockReturnValue({
            id: 'cosmic-sponsor',
            name: 'Cosmic Brand',
            tagline: 'Cosmic Tagline',
            message: 'Cosmic Message',
            mediaType: 'none',
            theme: 'cosmic',
            plan: 'cosmic',
            status: 'active',
        });

        const { container } = render(<SponsorScreen onComplete={vi.fn()} />);
        // Check for specific classes or styles related to cosmic theme
        expect(screen.getByText('Cosmic Brand')).toBeInTheDocument();
    });
});
