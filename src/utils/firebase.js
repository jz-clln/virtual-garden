import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, off, set, update, push, remove } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDrCV5ryIa8V_RY3RuZweC3wMxkfRkThPE",
  authDomain: "virtual-garden-a9ec0.firebaseapp.com",
  databaseURL: "https://virtual-garden-a9ec0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "virtual-garden-a9ec0",
  storageBucket: "virtual-garden-a9ec0.firebasestorage.app",
  messagingSenderId: "443634956658",
  appId: "1:443634956658:web:a94f37d921b63c2696c5eb"
};

// ── Initialize ──
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
export const gardenRef = ref(db, 'garden');

// ── Serialize (strip transient fields) ──
function serializeFlower(flower) {
  const { messagePromise, ...serializable } = flower;
  return serializable;
}

// ── Normalize (add transient fields) ──
function normalizeFlower(raw) {
  return {
    ...raw,
    messagePromise: Promise.resolve(raw.letterBody ?? ''),
    // Ensure numbers for timers
    plantedAt: Number(raw.plantedAt),
    growDuration: Number(raw.growDuration),
  };
}

// ── CRUD Helpers ──
export async function addFlower(flower) {
  const newRef = push(gardenRef);
  await set(newRef, serializeFlower(flower));
  return newRef.key;
}

export async function updateFlower(flowerId, updates) {
  const path = `garden/${flowerId}`;
  await update(ref(db, path), updates);
}

export async function deleteFlower(flowerId) {
  const path = `garden/${flowerId}`;
  await remove(ref(db, path));
}

export async function clearGarden() {
  await set(gardenRef, null);  // Wipes entire /garden
}

// ── Realtime listener helper ──
export function listenToGarden(callback) {
  const unsubscribe = onValue(gardenRef, (snapshot) => {
    const data = snapshot.val();
    const flowers = data ? Object.values(data).map(normalizeFlower) : [];
    callback(flowers);
  });
  return unsubscribe;
}

