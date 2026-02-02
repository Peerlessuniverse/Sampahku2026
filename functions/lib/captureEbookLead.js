"use strict";
/**
 * Ebook Lead Capture Function
 * Captures email leads from landing3harisampah.html
 * Stores in Firestore for export to UTAS email marketing
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.captureEbookLead = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const db = admin.firestore();
/**
 * Capture Ebook Lead Cloud Function
 */
exports.captureEbookLead = functions
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
        const payload = req.body;
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
        let leadId;
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
        }
        else {
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
    }
    catch (error) {
        console.error('❌ Error capturing lead:', error);
        res.status(500).send({
            error: 'Internal server error',
            message: error instanceof Error ? error.message : 'Unknown error',
        });
    }
});
//# sourceMappingURL=captureEbookLead.js.map