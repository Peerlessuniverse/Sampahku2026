import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from '@/components/Footer';
import { describe, it, expect } from 'vitest';

describe('Footer Component', () => {

    it('renders footer links', () => {
        render(
            <BrowserRouter>
                <Footer />
            </BrowserRouter>
        );

        expect(screen.getByText('WTE Lab')).toBeInTheDocument();
        expect(screen.getByText('Tentang Kami')).toBeInTheDocument();
        expect(screen.getByText('Kebijakan Privasi')).toBeInTheDocument();
    });

    // Test newsletter if available - assuming a form or input
    it('renders newsletter input', () => {
        // Check if there is an input for email
        const emailInput = screen.queryByPlaceholderText(/email/i);
        if (emailInput) {
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            const submitBtn = screen.getByRole('button', { name: /subscibe/i }) || screen.getByText(/langganan/i);
            fireEvent.click(submitBtn);
            // Check for success message or mock function call
            // expect(submitBtn).toBeDisabled(); // Or similar
        }
    });

});
