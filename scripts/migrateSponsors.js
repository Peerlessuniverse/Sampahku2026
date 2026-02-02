#!/usr/bin/env node

/**
 * Firebase Migration Script
 * Migrates sponsors from sponsors.json to Firestore
 * 
 * Run with: node scripts/migrateSponsors.js
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
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

async function migrateSponsors() {
    console.log('🚀 Starting Sponsor Migration to Firestore...\n');

    try {
        // Read sponsors.json
        const sponsorsPath = join(__dirname, '..', 'sponsors.json');
        const sponsorsData = readFileSync(sponsorsPath, 'utf-8');
        const sponsors = JSON.parse(sponsorsData);

        console.log(`📦 Found ${sponsors.length} sponsors to migrate\n`);

        // Migrate each sponsor
        for (const sponsor of sponsors) {
            const { id, ...sponsorData } = sponsor;

            console.log(`   Migrating: ${sponsor.name} (${id})`);

            // Use original ID as document ID
            const sponsorRef = doc(db, 'sponsors', id);

            await setDoc(sponsorRef, {
                ...sponsorData,
                stats: sponsorData.stats || { impressions: 0, clicks: 0 },
                createdAt: sponsorData.createdAt || new Date().toISOString(),
                migratedAt: new Date().toISOString()
            });

            console.log(`   ✅ Migrated: ${sponsor.name}`);
        }

        console.log(`\n✨ Migration Complete!`);
        console.log(`   Total migrated: ${sponsors.length} sponsors`);
        console.log(`\n🔥 Check your Firestore console:`);
        console.log(`   https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore`);

    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run migration
migrateSponsors()
    .then(() => {
        console.log('\n✅ Done!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
