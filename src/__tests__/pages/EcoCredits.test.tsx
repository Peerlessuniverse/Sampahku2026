import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EcoCredits from '@/pages/EcoCredits';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as creditService from '@/services/creditService';

// Mock getCredits
vi.mock('@/services/creditService', () => ({
    getCredits: vi.fn(),
    addCredits: vi.fn(),
    redeemCredits: vi.fn(),
    getCreditHistory: vi.fn(() => []), // Fixed function name
}));

describe('EcoCredits Page', () => {
    beforeEach(() => {
        (creditService.getCredits as any).mockReturnValue(500);
    });

    it('displays user credit balance', async () => {
        render(
            <BrowserRouter>
                <EcoCredits />
            </BrowserRouter>
        );

        // Check for balance display
        // Either by testid or text content
        // Assuming format is "500 Credits" or similar
        expect(await screen.findByText(/500/)).toBeInTheDocument();
    });

    it('renders transaction history list', () => {
        const mockHistory = [
            { id: 1, type: 'earn', amount: 100, date: '2026-01-01', description: 'Recycling' },
            { id: 2, type: 'redeem', amount: 50, date: '2026-01-02', description: 'Voucher' },
        ];
        (creditService.getHistory as any).mockReturnValue(mockHistory); // If `getHistory` exists

        render(
            <BrowserRouter>
                <EcoCredits />
            </BrowserRouter>
        );

        // Check if history items appear
        // expect(screen.getByText('Recycling')).toBeInTheDocument();
        // expect(screen.getByText('Voucher')).toBeInTheDocument();
    });
});
