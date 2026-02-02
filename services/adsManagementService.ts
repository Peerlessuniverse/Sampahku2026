import {
    collection, doc, getDocs, getDoc, addDoc, updateDoc,
    query, where, serverTimestamp, increment, setDoc,
    OrderByDirection, orderBy, limit
} from 'firebase/firestore';
import { db } from './firebaseConfig';

// --- MODELS ---

export type UserRole = 'admin' | 'partner';
export type CampaignStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'PAUSED' | 'ENDED';
export type PricingModel = 'CPM' | 'CPC' | 'FLAT';

export interface Partner {
    id: string;
    name: string;
    email?: string;
    package_type?: string;
    status: 'active' | 'disabled';
    balance: number;
    createdAt: any;
}

// Backward compatibility alias
export type Advertiser = Partner;

export interface Placement {
    id: string;
    name: string;
    location: string;
    size: string;
    pricing_model: PricingModel;
    base_price: number;
    is_active: boolean;
}

export interface Campaign {
    id: string;
    partner_id: string;
    name: string;
    start_date: string;
    end_date: string;
    daily_budget: number;
    total_budget: number;
    status: CampaignStatus;
    created_by: string;
    createdAt: any;
}

export interface AdCreative {
    id: string;
    campaign_id: string;
    partner_id: string;
    name: string;
    status: CampaignStatus;
    landing_url: string;
    cta_text: string;
    file_url: string;
    file_type: 'image' | 'video';
    rejection_reason?: string;
    createdAt: any;
    updatedAt: any;
}

export interface AuditLog {
    id?: string;
    actor_user_id: string;
    actor_role: UserRole;
    partner_id?: string;
    action: string;
    entity_type: string;
    entity_id: string;
    before_json?: any;
    after_json?: any;
    createdAt: any;
}

export interface PartnerRequest {
    id: string;
    brand_name: string;
    email: string;
    package_type: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: any;
}

// Backward compatibility alias
export type AdvertiserRequest = PartnerRequest;

// --- MIDDLEWARE-LIKE TENANCY CHECKS ---

const checkPermission = (role: string | null, targetPartnerId?: string) => {
    const authRole = localStorage.getItem('auth_role');
    const authPartnerId = localStorage.getItem('auth_partner_id');

    if (authRole === 'admin') return true;
    if (authRole === 'partner' && authPartnerId === targetPartnerId) return true;

    throw new Error('Unauthorized: Insufficient permissions or tenant mismatch');
};

// --- CORE SERVICES ---

// PLACEMENTS (Admin Only)
export const dbGetPlacements = async () => {
    const snap = await getDocs(collection(db, 'placements'));
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Placement));
};

export const dbUpsertPlacement = async (id: string | null, data: Partial<Placement>) => {
    if (localStorage.getItem('auth_role') !== 'admin') throw new Error('Admin only');
    if (id) {
        await updateDoc(doc(db, 'placements', id), data);
    } else {
        await addDoc(collection(db, 'placements'), { ...data, is_active: true });
    }
};

// PARTNERS & CAMPAIGNS (Tenant Restricted)
export const dbGetPartnerById = async (id: string) => {
    const docRef = doc(db, 'partners', id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Partner;
};

// Backward compatibility alias
export const dbGetAdvertiserById = dbGetPartnerById;

export const dbGetPartnerCampaigns = async (partnerId: string) => {
    checkPermission('partner', partnerId);
    const q = query(collection(db, 'campaigns'), where('partner_id', '==', partnerId), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Campaign));
};

// Backward compatibility alias
export const dbGetAdvertiserCampaigns = dbGetPartnerCampaigns;

export const dbCreateCampaign = async (data: Omit<Campaign, 'id' | 'createdAt'>) => {
    checkPermission('partner', data.partner_id);
    const docRef = await addDoc(collection(db, 'campaigns'), {
        ...data,
        status: 'DRAFT',
        createdAt: serverTimestamp()
    });

    await dbLogAction({
        action: 'CREATE_CAMPAIGN',
        entity_type: 'campaign',
        entity_id: docRef.id,
        after_json: data,
        partner_id: data.partner_id
    });

    return docRef.id;
};

export const dbUpdateCampaignStatus = async (campaignId: string, status: CampaignStatus, reason?: string) => {
    const campaignRef = doc(db, 'campaigns', campaignId);
    const campaignSnap = await getDoc(campaignRef);
    if (!campaignSnap.exists()) throw new Error('NotFound');

    const oldData = campaignSnap.data();
    const partnerId = oldData.partner_id;

    // Check permission: Admin can do anything, Partner can only submit or pause their own
    const authRole = localStorage.getItem('auth_role');
    if (authRole === 'partner') {
        if (partnerId !== localStorage.getItem('auth_partner_id')) throw new Error('Unauthorized');
        if (!['SUBMITTED', 'PAUSED', 'ACTIVE'].includes(status)) throw new Error('Invalid status transition for partner');
        // If updating creative after approval, auto-revert to submitted (handled in UI or here)
    }

    const updates: any = { status, updatedAt: serverTimestamp() };
    if (reason) updates.rejection_reason = reason;

    await updateDoc(campaignRef, updates);

    await dbLogAction({
        action: `UPDATE_STATUS_${status}`,
        entity_type: 'campaign',
        entity_id: campaignId,
        before_json: { status: oldData.status },
        after_json: { status },
        partner_id: partnerId
    });
};

// AUDIT LOGGING
export const dbLogAction = async (log: Partial<AuditLog>) => {
    const actorId = localStorage.getItem('auth_user_id') || 'system';
    const actorRole = (localStorage.getItem('auth_role') as UserRole) || 'partner';

    await addDoc(collection(db, 'audit_logs'), {
        ...log,
        actor_user_id: actorId,
        actor_role: actorRole,
        createdAt: serverTimestamp()
    });
};

// REVIEW QUEUE (Admin Only)
export const dbGetReviewQueue = async () => {
    if (localStorage.getItem('auth_role') !== 'admin') throw new Error('Admin only');
    const q = query(collection(db, 'campaigns'), where('status', '==', 'SUBMITTED'), orderBy('createdAt', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Campaign));
};

// ANALYTICS (Seeded/Mocked for now)
export const dbGetStats = async (partnerId?: string) => {
    // In production, this would query stats_daily collection
    return [
        { date: '2026-01-28', impressions: 1200, clicks: 45, spend: 15.5 },
        { date: '2026-01-29', impressions: 1540, clicks: 82, spend: 22.1 },
        { date: '2026-01-30', impressions: 2100, clicks: 110, spend: 35.0 },
        { date: '2026-01-31', impressions: 1800, clicks: 95, spend: 28.5 },
    ];
};

// SYSTEM INITIALIZATION (SEEDING)
export const dbInitializeSystem = async () => {
    if (localStorage.getItem('auth_role') !== 'admin') throw new Error('Admin only');

    console.log("🚀 Initializing Ads System Seed...");

    // 1. Seed Placements
    const placements = [
        { name: 'Standard Transition', location: 'Scan Portal', pricing_model: 'CPM' as PricingModel, base_price: 5, size: 'Full Screen' },
        { name: 'Reward Gateway', location: 'EcoCredits Page', pricing_model: 'CPC' as PricingModel, base_price: 0.5, size: 'Banner' }
    ];

    for (const p of placements) {
        await addDoc(collection(db, 'placements'), { ...p, is_active: true });
    }

    // 2. Seed Initial Partner
    const partnerId = 'partner-001';
    await setDoc(doc(db, 'partners', partnerId), {
        name: 'EcoAqua Solutions',
        status: 'active',
        balance: 1000,
        createdAt: serverTimestamp()
    });

    // 3. Seed Initial Campaign (Draft)
    await addDoc(collection(db, 'campaigns'), {
        partner_id: partnerId,
        name: 'Q1 Eco-Awareness',
        start_date: '2026-02-01',
        end_date: '2026-03-01',
        daily_budget: 50,
        total_budget: 1500,
        status: 'DRAFT',
        created_by: 'system',
        createdAt: serverTimestamp()
    });

    console.log("✅ Seed Complete.");
};

// --- NEW PARTNER REGISTRATION WORKFLOW ---

export const dbRequestPartnerAccount = async (data: { brand_name: string, email: string, package_type: string }) => {
    const docRef = await addDoc(collection(db, 'partner_requests'), {
        ...data,
        status: 'PENDING',
        createdAt: serverTimestamp()
    });
    return docRef.id;
};

// Backward compatibility alias
export const dbRequestAdvertiserAccount = dbRequestPartnerAccount;

export const dbGetPartnerRequests = async () => {
    const authRole = localStorage.getItem('auth_role');
    console.log("🔐 dbGetPartnerRequests - Auth Role:", authRole);

    if (authRole !== 'admin') {
        console.error("❌ Unauthorized: Role is not admin, current role:", authRole);
        throw new Error('Admin only');
    }

    // Simplified query without orderBy to ensure it works without complex composite indexes
    const q = query(collection(db, 'partner_requests'), where('status', '==', 'PENDING'));
    console.log("🔍 Querying Firestore for partner_requests with status=PENDING");

    const snap = await getDocs(q);
    console.log("📦 Firestore response - Total documents:", snap.size);

    const results = snap.docs.map(d => {
        console.log("📄 Document found:", d.id, d.data());
        return { id: d.id, ...d.data() } as PartnerRequest;
    });

    return results;
};

// Backward compatibility alias
export const dbGetAdvertiserRequests = dbGetPartnerRequests;

export const dbRejectPartnerRequest = async (requestId: string) => {
    if (localStorage.getItem('auth_role') !== 'admin') throw new Error('Admin only');

    const requestRef = doc(db, 'partner_requests', requestId);

    // Option 1: Mark as REJECTED (keep record)
    await updateDoc(requestRef, { status: 'REJECTED' });

    await dbLogAction({
        action: 'REJECT_PARTNER_REQUEST',
        entity_type: 'partner_request',
        entity_id: requestId,
        after_json: { status: 'REJECTED' }
    });
};

// Backward compatibility alias
export const dbRejectAdvertiserRequest = dbRejectPartnerRequest;

export const dbDeletePartnerRequest = async (requestId: string) => {
    if (localStorage.getItem('auth_role') !== 'admin') throw new Error('Admin only');

    const requestRef = doc(db, 'partner_requests', requestId);
    const requestSnap = await getDoc(requestRef);

    if (requestSnap.exists()) {
        const requestData = requestSnap.data();
        await dbLogAction({
            action: 'DELETE_PARTNER_REQUEST',
            entity_type: 'partner_request',
            entity_id: requestId,
            before_json: requestData
        });
    }

    // Delete completely from database
    await updateDoc(requestRef, { status: 'DELETED' }); // Soft delete for audit trail
};

// Backward compatibility alias
export const dbDeleteAdvertiserRequest = dbDeletePartnerRequest;

export const dbApprovePartnerRequest = async (requestId: string) => {
    if (localStorage.getItem('auth_role') !== 'admin') throw new Error('Admin only');

    const requestRef = doc(db, 'partner_requests', requestId);
    const requestSnap = await getDoc(requestRef);
    if (!requestSnap.exists()) throw new Error('Request not found');

    const requestData = requestSnap.data() as PartnerRequest;

    // 1. Create the actual partner document
    const partnerId = `partner-${Date.now()}`;
    await setDoc(doc(db, 'partners', partnerId), {
        name: requestData.brand_name,
        email: requestData.email,
        status: 'active',
        balance: 0, // Initial balance
        package_type: requestData.package_type,
        createdAt: serverTimestamp()
    });

    // 2. Mark request as approved
    await updateDoc(requestRef, { status: 'APPROVED' });

    // 3. Log the action
    await dbLogAction({
        action: 'APPROVE_PARTNER_REQUEST',
        entity_type: 'partner',
        entity_id: partnerId,
        after_json: { brand_name: requestData.brand_name, email: requestData.email }
    });

    return partnerId;
};

// Backward compatibility alias
export const dbApproveAdvertiserRequest = dbApprovePartnerRequest;
