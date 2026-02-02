#!/usr/bin/env node

/**
 * Firebase Migration Script: Advertiser → Partner
 *
 * This script migrates all advertiser-related collections to use "partner" terminology:
 * - advertisers → partners
 * - advertiser_requests → partner_requests
 * - Updates advertiser_id → partner_id in related collections
 *
 * ⚠️ IMPORTANT: Backup your Firestore data before running this script!
 *
 * Run with: node scripts/migrateAdvertiserToPartner.js
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    collection,
    doc,
    getDocs,
    setDoc,
    updateDoc,
    query,
    writeBatch
} from 'firebase/firestore';
import dotenv from 'dotenv';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '..', '.env.local');
dotenv.config({ path: envPath });

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Step 1: Migrate advertisers → partners
 */
async function migrateAdvertisers() {
    console.log('\n📦 Step 1: Migrating advertisers → partners...');

    const advertisersSnap = await getDocs(collection(db, 'advertisers'));
    console.log(`   Found ${advertisersSnap.size} advertisers to migrate`);

    let migratedCount = 0;
    const batch = writeBatch(db);

    for (const docSnap of advertisersSnap.docs) {
        const data = docSnap.data();
        const newDocRef = doc(db, 'partners', docSnap.id);

        batch.set(newDocRef, {
            ...data,
            migratedAt: new Date().toISOString(),
            migratedFrom: 'advertisers'
        });

        console.log(`   ✓ Migrating: ${data.name} (${docSnap.id})`);
        migratedCount++;
    }

    await batch.commit();
    console.log(`   ✅ Migrated ${migratedCount} advertisers → partners\n`);

    return migratedCount;
}

/**
 * Step 2: Migrate advertiser_requests → partner_requests
 */
async function migrateAdvertiserRequests() {
    console.log('📦 Step 2: Migrating advertiser_requests → partner_requests...');

    const requestsSnap = await getDocs(collection(db, 'advertiser_requests'));
    console.log(`   Found ${requestsSnap.size} advertiser requests to migrate`);

    let migratedCount = 0;
    const batch = writeBatch(db);

    for (const docSnap of requestsSnap.docs) {
        const data = docSnap.data();
        const newDocRef = doc(db, 'partner_requests', docSnap.id);

        batch.set(newDocRef, {
            ...data,
            migratedAt: new Date().toISOString(),
            migratedFrom: 'advertiser_requests'
        });

        console.log(`   ✓ Migrating request: ${data.brand_name} (${docSnap.id})`);
        migratedCount++;
    }

    await batch.commit();
    console.log(`   ✅ Migrated ${migratedCount} advertiser_requests → partner_requests\n`);

    return migratedCount;
}

/**
 * Step 3: Update advertiser_id → partner_id in campaigns
 */
async function updateCampaignsFields() {
    console.log('📦 Step 3: Updating advertiser_id → partner_id in campaigns...');

    const campaignsSnap = await getDocs(collection(db, 'campaigns'));
    console.log(`   Found ${campaignsSnap.size} campaigns to update`);

    let updatedCount = 0;

    for (const docSnap of campaignsSnap.docs) {
        const data = docSnap.data();

        if (data.advertiser_id) {
            await updateDoc(doc(db, 'campaigns', docSnap.id), {
                partner_id: data.advertiser_id,
                // Keep advertiser_id for backward compatibility (will be removed later)
                _old_advertiser_id: data.advertiser_id
            });

            console.log(`   ✓ Updated campaign: ${data.name} (${docSnap.id})`);
            updatedCount++;
        }
    }

    console.log(`   ✅ Updated ${updatedCount} campaigns\n`);

    return updatedCount;
}

/**
 * Step 4: Update advertiser_id → partner_id in ad_creatives
 */
async function updateAdCreativesFields() {
    console.log('📦 Step 4: Updating advertiser_id → partner_id in ad_creatives...');

    const creativesSnap = await getDocs(collection(db, 'ad_creatives'));
    console.log(`   Found ${creativesSnap.size} ad creatives to update`);

    let updatedCount = 0;

    for (const docSnap of creativesSnap.docs) {
        const data = docSnap.data();

        if (data.advertiser_id) {
            await updateDoc(doc(db, 'ad_creatives', docSnap.id), {
                partner_id: data.advertiser_id,
                _old_advertiser_id: data.advertiser_id
            });

            console.log(`   ✓ Updated ad creative: ${data.name} (${docSnap.id})`);
            updatedCount++;
        }
    }

    console.log(`   ✅ Updated ${updatedCount} ad creatives\n`);

    return updatedCount;
}

/**
 * Step 5: Update advertiser_id → partner_id in audit_logs
 */
async function updateAuditLogsFields() {
    console.log('📦 Step 5: Updating advertiser_id → partner_id in audit_logs...');

    const logsSnap = await getDocs(collection(db, 'audit_logs'));
    console.log(`   Found ${logsSnap.size} audit logs to update`);

    let updatedCount = 0;

    for (const docSnap of logsSnap.docs) {
        const data = docSnap.data();

        if (data.advertiser_id) {
            await updateDoc(doc(db, 'audit_logs', docSnap.id), {
                partner_id: data.advertiser_id,
                _old_advertiser_id: data.advertiser_id
            });

            updatedCount++;
        }

        // Also update actor_role from 'advertiser' to 'partner'
        if (data.actor_role === 'advertiser') {
            await updateDoc(doc(db, 'audit_logs', docSnap.id), {
                actor_role: 'partner',
                _old_actor_role: 'advertiser'
            });
        }
    }

    console.log(`   ✅ Updated ${updatedCount} audit logs\n`);

    return updatedCount;
}

/**
 * Main migration function
 */
async function runMigration() {
    console.log('🚀 Starting Advertiser → Partner Migration...');
    console.log('════════════════════════════════════════════════\n');

    try {
        const stats = {
            advertisers: 0,
            requests: 0,
            campaigns: 0,
            creatives: 0,
            logs: 0
        };

        stats.advertisers = await migrateAdvertisers();
        stats.requests = await migrateAdvertiserRequests();
        stats.campaigns = await updateCampaignsFields();
        stats.creatives = await updateAdCreativesFields();
        stats.logs = await updateAuditLogsFields();

        console.log('════════════════════════════════════════════════');
        console.log('✨ Migration Complete!\n');
        console.log('📊 Summary:');
        console.log(`   - Advertisers migrated: ${stats.advertisers}`);
        console.log(`   - Requests migrated: ${stats.requests}`);
        console.log(`   - Campaigns updated: ${stats.campaigns}`);
        console.log(`   - Ad Creatives updated: ${stats.creatives}`);
        console.log(`   - Audit Logs updated: ${stats.logs}`);
        console.log('\n📝 Next Steps:');
        console.log('   1. Verify data in Firestore Console');
        console.log('   2. Test the application thoroughly');
        console.log('   3. If everything works, you can delete old collections:');
        console.log('      - advertisers (keep for 2+ weeks as backup)');
        console.log('      - advertiser_requests (keep for 2+ weeks as backup)');
        console.log('\n🔥 Firestore Console:');
        console.log(`   https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore`);

    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        console.error('\n⚠️  Please restore from backup if needed');
        process.exit(1);
    }
}

// Run migration
runMigration()
    .then(() => {
        console.log('\n✅ Migration script completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
