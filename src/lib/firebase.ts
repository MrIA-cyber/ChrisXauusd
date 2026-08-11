import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { TradeSetup, UserSubscription, AuthUser } from '../types';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(
  app,
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== ''
    ? firebaseConfig.firestoreDatabaseId
    : '(default)'
);

const SETUPS_COLLECTION = 'setups';
const SUBSCRIPTIONS_COLLECTION = 'subscriptions';

/**
 * Save or update a single Trade Setup in Firestore database
 */
export async function saveSetupToFirestore(setup: TradeSetup): Promise<void> {
  try {
    const setupRef = doc(db, SETUPS_COLLECTION, setup.id);
    await setDoc(setupRef, setup, { merge: true });
  } catch (error) {
    console.error('Error saving trade setup to Firestore:', error);
  }
}

/**
 * Save multiple Trade Setups to Firestore
 */
export async function saveMultipleSetupsToFirestore(setups: TradeSetup[]): Promise<void> {
  try {
    const promises = setups.map((setup) => saveSetupToFirestore(setup));
    await Promise.all(promises);
  } catch (error) {
    console.error('Error saving multiple setups to Firestore:', error);
  }
}

/**
 * Fetch initial setups from Firestore
 */
export async function fetchSetupsFromFirestore(): Promise<TradeSetup[]> {
  try {
    const setupsRef = collection(db, SETUPS_COLLECTION);
    const snapshot = await getDocs(setupsRef);
    if (snapshot.empty) {
      return [];
    }
    const setups: TradeSetup[] = [];
    snapshot.forEach((doc) => {
      setups.push(doc.data() as TradeSetup);
    });
    return setups;
  } catch (error) {
    console.error('Error fetching setups from Firestore:', error);
    return [];
  }
}

/**
 * Real-time listener for Trade Setups in Firestore
 */
export function subscribeToSetupsFromFirestore(
  onUpdate: (setups: TradeSetup[]) => void
): () => void {
  try {
    const setupsRef = collection(db, SETUPS_COLLECTION);
    const unsubscribe = onSnapshot(
      setupsRef,
      (snapshot) => {
        const setups: TradeSetup[] = [];
        snapshot.forEach((doc) => {
          setups.push(doc.data() as TradeSetup);
        });
        if (setups.length > 0) {
          onUpdate(setups);
        }
      },
      (error) => {
        console.error('Firestore setups snapshot error:', error);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.error('Failed to subscribe to Firestore setups:', error);
    return () => {};
  }
}

/**
 * Save User Subscription & Auth Profile in Firestore with Device ID binding
 */
export async function saveUserSubscriptionToFirestore(
  userId: string,
  subscription: UserSubscription,
  userData?: Partial<AuthUser>
): Promise<void> {
  try {
    const subRef = doc(db, SUBSCRIPTIONS_COLLECTION, userId);
    await setDoc(
      subRef,
      {
        userId,
        ...subscription,
        ...(userData ? { userDetails: userData } : {}),
        activeDeviceId: userData?.activeDeviceId || null,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error saving subscription to Firestore:', error);
  }
}

/**
 * Register active device ID session in Firestore (1 abonnement = 1 compte = 1 appareil)
 */
export async function registerDeviceSessionInFirestore(
  userId: string,
  deviceId: string
): Promise<void> {
  try {
    const subRef = doc(db, SUBSCRIPTIONS_COLLECTION, userId);
    await setDoc(
      subRef,
      {
        activeDeviceId: deviceId,
        lastDeviceLogin: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error registering device session in Firestore:', error);
  }
}

/**
 * Real-time listener for user subscription & device session changes
 */
export function subscribeToUserSubscriptionFromFirestore(
  userId: string,
  onUpdate: (subscription: UserSubscription, activeDeviceId?: string) => void
): () => void {
  try {
    const subRef = doc(db, SUBSCRIPTIONS_COLLECTION, userId);
    const unsubscribe = onSnapshot(
      subRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          const sub: UserSubscription = {
            status: data.status,
            startDate: data.startDate,
            expirationDate: data.expirationDate,
            daysRemaining: data.daysRemaining,
            paymentMethod: data.paymentMethod,
            amountFcfa: data.amountFcfa,
          };
          onUpdate(sub, data.activeDeviceId);
        }
      },
      (error) => {
        console.error('Firestore user subscription snapshot error:', error);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.error('Failed to subscribe to user subscription:', error);
    return () => {};
  }
}

/**
 * Fetch User Subscription from Firestore
 */
export async function fetchUserSubscriptionFromFirestore(
  userId: string
): Promise<UserSubscription | null> {
  try {
    const subRef = doc(db, SUBSCRIPTIONS_COLLECTION, userId);
    const snap = await getDocs(query(collection(db, SUBSCRIPTIONS_COLLECTION), limit(10)));
    const docData = snap.docs.find((d) => d.id === userId);
    if (docData && docData.exists()) {
      const data = docData.data();
      return {
        status: data.status,
        startDate: data.startDate,
        expirationDate: data.expirationDate,
        daysRemaining: data.daysRemaining,
        paymentMethod: data.paymentMethod,
        amountFcfa: data.amountFcfa,
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching user subscription from Firestore:', error);
    return null;
  }
}

export interface FirestoreSubscriptionRecord {
  userId: string;
  status: 'VISITOR' | 'ACTIVE' | 'EXPIRING_SOON' | 'EXPIRED' | 'PENDING_VERIFICATION';
  startDate: string | null;
  expirationDate: string | null;
  daysRemaining: number;
  paymentMethod?: string;
  amountFcfa: number;
  userDetails?: {
    name?: string;
    email?: string;
    phone?: string;
    country?: string;
    flag?: string;
    avatarUrl?: string;
  };
  activeDeviceId?: string | null;
  updatedAt?: string;
  approvedAt?: string;
}

/**
 * Real-time listener for ALL subscriptions in Firestore (For Admin Portal live feed)
 */
export function subscribeToAllSubscriptionsFromFirestore(
  onUpdate: (records: FirestoreSubscriptionRecord[]) => void
): () => void {
  try {
    const subsRef = collection(db, SUBSCRIPTIONS_COLLECTION);
    const unsubscribe = onSnapshot(
      subsRef,
      (snapshot) => {
        const list: FirestoreSubscriptionRecord[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          list.push({
            userId: docSnap.id,
            status: data.status || 'VISITOR',
            startDate: data.startDate || null,
            expirationDate: data.expirationDate || null,
            daysRemaining: typeof data.daysRemaining === 'number' ? data.daysRemaining : 0,
            paymentMethod: data.paymentMethod || 'Mobile Money',
            amountFcfa: data.amountFcfa || 700000,
            userDetails: data.userDetails || {},
            activeDeviceId: data.activeDeviceId || null,
            updatedAt: data.updatedAt,
            approvedAt: data.approvedAt,
          });
        });
        onUpdate(list);
      },
      (error) => {
        console.error('Firestore all subscriptions snapshot error:', error);
      }
    );
    return unsubscribe;
  } catch (error) {
    console.error('Failed to subscribe to all Firestore subscriptions:', error);
    return () => {};
  }
}

/**
 * Admin Action: Approve / Authorize User Subscription in Firestore
 */
export async function approveUserSubscriptionInFirestore(
  userId: string,
  daysCount = 30
): Promise<void> {
  try {
    const subRef = doc(db, SUBSCRIPTIONS_COLLECTION, userId);
    const now = new Date();
    const expDate = new Date(now.getTime() + daysCount * 24 * 3600 * 1000);

    await setDoc(
      subRef,
      {
        status: 'ACTIVE',
        startDate: now.toISOString(),
        expirationDate: expDate.toISOString(),
        daysRemaining: daysCount,
        updatedAt: now.toISOString(),
        approvedAt: now.toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error approving user subscription in Firestore:', error);
  }
}

/**
 * Admin Action: Update User Subscription Expiration & Status in Firestore
 */
export async function updateUserSubscriptionExpirationInFirestore(
  userId: string,
  newExpirationDateIso: string,
  newStatus: 'ACTIVE' | 'EXPIRED' | 'VISITOR' | 'PENDING_VERIFICATION' | 'EXPIRING_SOON' = 'ACTIVE'
): Promise<void> {
  try {
    const subRef = doc(db, SUBSCRIPTIONS_COLLECTION, userId);
    const expTime = new Date(newExpirationDateIso).getTime();
    const nowTime = Date.now();
    const daysRemaining = Math.max(0, Math.ceil((expTime - nowTime) / (1000 * 3600 * 24)));

    await setDoc(
      subRef,
      {
        expirationDate: newExpirationDateIso,
        status: daysRemaining > 0 ? newStatus : 'EXPIRED',
        daysRemaining: daysRemaining,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error updating user subscription expiration in Firestore:', error);
  }
}

/**
 * Admin Action: Reject / Revoke User Subscription in Firestore
 */
export async function rejectUserSubscriptionInFirestore(userId: string): Promise<void> {
  try {
    const subRef = doc(db, SUBSCRIPTIONS_COLLECTION, userId);
    await setDoc(
      subRef,
      {
        status: 'EXPIRED',
        daysRemaining: 0,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error rejecting user subscription in Firestore:', error);
  }
}

/**
 * Admin Action: Delete User Subscription Record from Firestore
 */
export async function deleteUserSubscriptionFromFirestore(userId: string): Promise<void> {
  try {
    const subRef = doc(db, SUBSCRIPTIONS_COLLECTION, userId);
    await deleteDoc(subRef);
  } catch (error) {
    console.error('Error deleting user subscription from Firestore:', error);
  }
}
