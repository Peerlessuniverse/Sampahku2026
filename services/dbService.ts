import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";

export interface CreditData {
    credits: number;
    completedActivities: string[];
    displayName?: string;
    photoURL?: string;
    uid?: string;
}

export interface Transaction {
    id: string;
    amount: number;
    description: string;
    timestamp: string;
    type: 'earn' | 'redeem';
    userId: string;
}

export const saveUserProfile = async (profile: { uid: string, displayName: string, photoURL: string }) => {
    const docRef = doc(db, "users", profile.uid);
    await setDoc(docRef, {
        displayName: profile.displayName,
        photoURL: profile.photoURL,
        uid: profile.uid,
        lastSeen: new Date().toISOString()
    }, { merge: true });
};

export const getUserCredits = async (userId: string): Promise<CreditData> => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        return {
            credits: data.credits || 0,
            completedActivities: data.completedActivities || [],
            displayName: data.displayName,
            photoURL: data.photoURL
        };
    } else {
        const newData: CreditData = { credits: 0, completedActivities: [] };
        await setDoc(docRef, newData);
        return newData;
    }
};

export const updateUserCredits = async (userId: string, amount: number, description: string, activityId?: string) => {
    const docRef = doc(db, "users", userId);
    const currentData = await getUserCredits(userId);

    const newCredits = currentData.credits + amount;
    const updatePayload: any = { credits: newCredits };

    if (activityId) {
        updatePayload.completedActivities = arrayUnion(activityId);
    }

    await updateDoc(docRef, updatePayload);

    const transRef = doc(collection(db, "transactions"));
    await setDoc(transRef, {
        id: transRef.id,
        userId,
        amount,
        description,
        timestamp: new Date().toISOString(),
        type: amount > 0 ? 'earn' : 'redeem'
    });

    return newCredits;
};

export const getUserHistory = async (userId: string): Promise<Transaction[]> => {
    const q = query(
        collection(db, "transactions"),
        where("userId", "==", userId),
        orderBy("timestamp", "desc"),
        limit(50)
    );

    const querySnapshot = await getDocs(q);
    const transactions: Transaction[] = [];
    querySnapshot.forEach((doc) => {
        transactions.push(doc.data() as Transaction);
    });

    return transactions;
};

export const getGlobalLeaderboard = async (): Promise<CreditData[]> => {
    const q = query(
        collection(db, "users"),
        orderBy("credits", "desc"),
        limit(10)
    );

    const querySnapshot = await getDocs(q);
    const leaderboard: CreditData[] = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.credits > 0) {
            leaderboard.push({
                uid: doc.id,
                credits: data.credits,
                displayName: data.displayName || 'Anonymous Guardian',
                photoURL: data.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${doc.id}`,
                completedActivities: []
            });
        }
    });

    return leaderboard;
};
