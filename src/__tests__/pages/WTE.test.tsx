import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import WTE from '@/pages/WTE';
import { describe, it, expect, vi } from 'vitest';

describe('WTE Page (Waste-to-Energy Lab)', () => {

    it('renders correctly and switches tabs', () => {
        const { getByText, queryByText } = render(
            <BrowserRouter>
                <WTE />
            </BrowserRouter>
        );

        // Assuming default tab is 'Kebutuhan' or similar
        expect(getByText('Kebutuhan Energi')).toBeInTheDocument();

        // Switch to 'Jenis Sampah' tab (if button exists)
        const typeTab = getByText('Jenis Sampah');
        fireEvent.click(typeTab);

        expect(getByText('Organik')).toBeVisible(); // Or some content specific to 'Jenis Sampah' list

        // Switch to 'Sumber Energi' tab
        const sourceTab = getByText('Sumber Energi');
        fireEvent.click(sourceTab);

        expect(getByText('Biogas')).toBeVisible(); // Or some content specific to 'Sumber Energi' list
    });

});
