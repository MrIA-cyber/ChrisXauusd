import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
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
 * Save User Subscription & Auth Profile in Firestore
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
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Error saving subscription to Firestore:', error);
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
