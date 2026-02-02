/**
 * Ebook Lead Capture Function
 * Captures email leads from landing3harisampah.html
 * Stores in Firestore for export to UTAS email marketing
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

const db = admin.firestore();

interface LeadPayload {
    email: string;
    source: string;
    timestamp: string;
}

/**
 * Capture Ebook Lead Cloud Function
 */
export const captureEbookLead = functions
    .region('asia-southeast1')
    .https.onRequest(async (req, res) => {
        // CORS headers
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
        res.set('Access-Control-Allow-Headers', 'Content-Type');

        // Handle preflight
        if (req.method === 'OPTIONS') {
            res.status(200).send();
            return;
        }

        // Only accept POST
        if (req.method !== 'POST') {
            res.status(405).send({ error: 'Method not allowed' });
            return;
        }

        try {
            console.log('📧 Lead capture request:', JSON.stringify(req.body));

            const payload: LeadPayload = req.body;

            // Validate email
            if (!payload.email || !payload.email.includes('@')) {
                console.error('❌ Invalid email:', payload.email);
                res.status(400).send({ error: 'Invalid email address' });
                return;
            }

            const email = payload.email.toLowerCase().trim();
            const source = payload.source || 'unknown';
            const userAgent = req.headers['user-agent'] || 'unknown';

            // Check if lead already exists
            const existingLeadsQuery = await db
                .collection('ebookLeads')
                .where('email', '==', email)
                .limit(1)
                .get();

            let leadId: string;

            if (!existingLeadsQuery.empty) {
                // Update existing lead
                const existingLead = existingLeadsQuery.docs[0];
                leadId = existingLead.id;

                await db.collection('ebookLeads').doc(leadId).update({
                    lastSubmission: admin.firestore.FieldValue.serverTimestamp(),
                    submissionCount: admin.firestore.FieldValue.increment(1),
                    sources: admin.firestore.FieldValue.arrayUnion(source),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                });

                console.log(`✅ Updated existing lead: ${leadId}`);
            } else {
                // Create new lead
                const newLeadRef = await db.collection('ebookLeads').add({
                    email: email,
                    source: source,
                    sources: [source],
                    userAgent: userAgent,
                    submissionCount: 1,
                    status: 'new', // new, contacted, converted
                    exportedToUTAS: false,
                    createdAt: admin.firestore.FieldValue.serverTimestamp(),
                    lastSubmission: admin.firestore.FieldValue.serverTimestamp(),
                    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                });

                leadId = newLeadRef.id;
                console.log(`✅ Created new lead: ${leadId}`);
            }

            // Log activity
            await db.collection('leadActivities').add({
                leadId: leadId,
                email: email,
                action: 'form_submission',
                source: source,
                userAgent: userAgent,
                ipAddress: req.ip || 'unknown',
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
            });

            console.log(`📊 Activity logged for lead: ${leadId}`);

            // Respond success
            res.status(200).send({
                success: true,
                message: 'Lead captured successfully',
                leadId: leadId,
            });

            console.log(`🎉 Lead capture complete: ${email}`);

        } catch (error) {
            console.error('❌ Error capturing lead:', error);
            res.status(500).send({
                error: 'Internal server error',
                message: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    });
