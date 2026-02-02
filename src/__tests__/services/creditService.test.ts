import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as creditService from '@/services/creditService';
import { getCredits, addCredits, redeemCredits } from '@/services/creditService';

describe('creditService', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('addCredits increases total balance', async () => {
        let balance = getCredits();
        expect(balance).toBe(0); // Assuming starts at 0

        await addCredits(100, 'Test earn');
        expect(getCredits()).toBe(100);

        await addCredits(50, 'Test earn 2');
        expect(getCredits()).toBe(150);
    });

    it('redeemCredits deducts if sufficient balance', async () => {
        await addCredits(200, 'Initial');
        const voucher = await redeemCredits(50, 'Test redebt');
        expect(voucher).not.toBeNull();
        expect(getCredits()).toBe(150);
    });

    it('redeemCredits fails if insufficient balance', async () => {
        // Reset balance or ensure low
        localStorage.clear();
        await addCredits(50, 'Initial low');

        const voucher = await redeemCredits(100, 'Fail redeem');
        expect(voucher).toBeNull();
        expect(getCredits()).toBe(50);
    });
});
