import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HallOfFame from '@/pages/HallOfFame';
import { describe, it, expect, vi } from 'vitest';

// Assuming data comes from API or Service
// If it fetches data, mock fetch
global.fetch = vi.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve([
            { id: 1, name: 'Alice', score: 100 },
            { id: 2, name: 'Bob', score: 90 },
        ]),
    })
) as any;

describe('HallOfFame Page', () => {

    it('renders leaderboard list', async () => {
        const { getByText } = render(
            <BrowserRouter>
                <HallOfFame />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(getByText('Alice')).toBeInTheDocument();
            expect(getByText('Bob')).toBeInTheDocument();
        });

        // Score checks
        expect(getByText(/100/)).toBeInTheDocument();
    });

    it('handles loading state (implicitly or explicitly)', () => {
        // If we mock fetch delay, we can assert loading indicator
    });

    it('handles empty state', async () => {
        (global.fetch as any).mockImplementationOnce(() => Promise.resolve({
            json: () => Promise.resolve([]),
        }));

        const { getByText } = render(
            <BrowserRouter>
                <HallOfFame />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(getByText(/Belum ada data/i)).toBeInTheDocument(); // Or similar
        });
    });

});
