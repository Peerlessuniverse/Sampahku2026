/**
 * UTAS Webhook Handler
 * Firebase Cloud Function to process UTAS payment notifications
 * 
 * Triggers: HTTP POST from UTAS.co when payment is completed
 * Actions:
 *  1. Receive webhook payload
 *  2. Validate payment state
 *  3. Extract sponsor info (name, email, package tier)
 *  4. Create/update sponsor in Firestore
 *  5. Send confirmation email
 * 
 * Webhook URL (to configure in UTAS):
 * https://asia-southeast1-sampahku2026.cloudfunctions.net/utasWebhook
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin (if not already initialized)
if (!admin.apps.length) {
    admin.initializeApp();
}

const db = admin.firestore();

/**
 * UTAS Webhook Payload Interface
 */
interface UTASWebhookPayload {
    state: 'order' | 'paid' | 'shipping' | 'complete';
    name: string;
    email: string;
    address: string;
    store: string;
    items: Array<{
        item_name: string;
        item_qty: string;
        item_price: string;
        item_data: string;
    }>;
    total: string;
    store_link: string;
}

/**
 * Helper: Determine sponsor tier from product name
 */
function determineTier(productName: string): string {
    const lowerName = productName.toLowerCase();

    if (lowerName.includes('nebula') || lowerName.includes('basic')) {
        return 'nebula';
    } else if (lowerName.includes('galactic') || lowerName.includes('medium')) {
        return 'galactic';
    } else if (lowerName.includes('cosmic') || lowerName.includes('premium') || lowerName.includes('empire')) {
        return 'cosmic';
    }

    // Default to nebula if unknown
    return 'nebula';
}

/**
 * Helper: Calculate expiry date based on tier
 */
function calculateExpiry(tier: string): Date {
    const now = new Date();

    switch (tier) {
        case 'nebula':
            // 30 days
            return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        case 'galactic':
            // 90 days
            return new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
        case 'cosmic':
            // 365 days
            return new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
        default:
            return new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    }
}

/**
 * Helper: Get tier display name
 */
function getTierDisplayName(tier: string): string {
    switch (tier) {
        case 'nebula':
            return 'Nebula Core';
        case 'galactic':
            return 'Galactic Reach';
        case 'cosmic':
            return 'Cosmic Empire';
        default:
            return 'Nebula Core';
    }
}

/**
 * Main Cloud Function: UTAS Webhook Handler
 */
export const utasWebhook = functions
    .region('asia-southeast1')
    .https.onRequest(async (req, res) => {
        // CORS headers (allow UTAS to send webhook)
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');

        // Handle preflight request
        if (req.method === 'OPTIONS') {
            res.status(200).send();
            return;
        }

        // Only accept POST requests
        if (req.method !== 'POST') {
            res.status(405).send({ error: 'Method not allowed' });
            return;
        }

        try {
            console.log('📩 UTAS Webhook received:', JSON.stringify(req.body));

            const payload: UTASWebhookPayload = req.body;

            // Validate required fields
            if (!payload.state || !payload.name || !payload.email || !payload.items) {
                console.error('❌ Invalid payload:', payload);
                res.status(400).send({ error: 'Invalid payload' });
                return;
            }

            // Only process "paid" state (ignore "order", "shipping", "complete")
            if (payload.state !== 'paid') {
                console.log(`ℹ️ Ignoring state: ${payload.state}`);
                res.status(200).send({ message: `Ignored state: ${payload.state}` });
                return;
            }

            // Extract sponsor info
            const sponsorName = payload.name;
            const sponsorEmail = payload.email.toLowerCase().trim();
            const productName = payload.items[0]?.item_name || '';
            const totalPaid = payload.total;

            // Determine tier
            const tier = determineTier(productName);
            const tierDisplayName = getTierDisplayName(tier);

            // Calculate expiry
            const expiryDate = calculateExpiry(tier);

            // Check if sponsor already exists
            const existingSponsorsQuery = await db
                .collection('sponsors')
                .where('email', '==', sponsorEmail)
                .limit(1)
                .get();

            let sponsorId: string;

            if (!existingSponsorsQuery.empty) {
                // Update existing sponsor
                const existingSponsor = existingSponsorsQuery.docs[0];
                sponsorId = existingSponsor.id;

                await db.collection('sponsors').doc(sponsorId).update({
                    name: sponsorName,
                    tier: tier,
                    status: 'active',
                    expiryDate: admin.firestore.Timestamp.fromDate(expiryDate),
                    lastPaymentAmount: totalPaid,
                    lastPaymentDate: admin.firestore.FieldValue.serverTimestamp(),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                });

                console.log(`✅ Updated existing sponsor: ${sponsorId}`);
            } else {
                // Create new sponsor
                const newSponsorRef = await db.collection('sponsors').add({
                    name: sponsorName,
                    email: sponsorEmail,
                    tier: tier,
                    status: 'active',
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                    expiryDate: admin.firestore.Timestamp.fromDate(expiryDate),
                    lastPaymentAmount: totalPaid,
                    lastPaymentDate: admin.firestore.FieldValue.serverTimestamp(),
                    // Ad configuration (default)
                    adConfig: {
                        imageUrl: '',
                        videoUrl: '',
                        targetUrl: '',
                        isActive: false,
                    },
                    // Statistics
                    stats: {
                        impressions: 0,
                        clicks: 0,
                        ctr: 0,
                    },
                });

                sponsorId = newSponsorRef.id;
                console.log(`✅ Created new sponsor: ${sponsorId}`);
            }

            // Log transaction for tracking
            await db.collection('sponsorTransactions').add({
                sponsorId: sponsorId,
                sponsorEmail: sponsorEmail,
                sponsorName: sponsorName,
                tier: tier,
                tierDisplayName: tierDisplayName,
                amount: totalPaid,
                productName: productName,
                source: 'utas',
                status: 'completed',
                utasData: payload,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            console.log(`💰 Transaction logged for sponsor: ${sponsorId}`);

            // TODO: Send confirmation email (optional - needs SendGrid or Firebase Extensions)
            // await sendSponsorConfirmationEmail(sponsorEmail, sponsorName, tierDisplayName, expiryDate);

            // Respond success to UTAS
            res.status(200).send({
                success: true,
                message: 'Sponsor activated successfully',
                sponsor: {
                    id: sponsorId,
                    email: sponsorEmail,
                    tier: tierDisplayName,
                    expiryDate: expiryDate.toISOString(),
                },
            });

            console.log(`🎉 Webhook processed successfully for ${sponsorEmail}`);

        } catch (error) {
            console.error('❌ Error processing webhook:', error);
            res.status(500).send({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    });
