import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TransformationDetail from '@/pages/TransformationDetail';
import { describe, it, expect, vi } from 'vitest';

// Mock child components or services if needed, but for now we test integration
// We can mock image loader if it fails in test environment
// Or just check if alt text is present

describe('TransformationDetail Page', () => {

    it('renders correct content based on route params (organic)', () => {
        render(
            <MemoryRouter initialEntries={['/wte/organic']}>
                <Routes>
                    <Route path="/wte/:methodId" element={<TransformationDetail />} />
                </Routes>
            </MemoryRouter>
        );

        // Expect titles or content related to 'organic' (e.g., Maggot BSF, Kompos)
        // This assumes the component fetches data or has static data based on ID
        expect(screen.getByText(/Maggot/i)).toBeInTheDocument();
        expect(screen.getByAltText(/Maggot/i)).toBeInTheDocument();
    });

    it('renders correct content based on route params (inorganic)', () => {
        // Assuming 'inorganic' or 'plastic' ID exists
        render(
            <MemoryRouter initialEntries={['/wte/plastic']}>
                <Routes>
                    <Route path="/wte/:methodId" element={<TransformationDetail />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText(/Pirolisis/i)).toBeInTheDocument();
        // Adjust based on actual content for 'plastic' method
    });

    it('handles invalid method ID gracefully', () => {
        render(
            <MemoryRouter initialEntries={['/wte/invalid-id']}>
                <Routes>
                    <Route path="/wte/:methodId" element={<TransformationDetail />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText(/Tidak Ditemukan/i)).toBeInTheDocument();
    });

});
