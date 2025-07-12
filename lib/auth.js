import { useEffect, useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile,
  getMultiFactorResolver,
  TotpMultiFactorGenerator,
} from "firebase/auth";

import { auth, db } from "@/lib/firebase.js";
import { onValue, ref, set, get } from "firebase/database";

export async function signUp(email, password) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  // await sendEmailVerification(userCredential.user);
  return userCredential;
}

export async function updateUserDatabase(user){  
  await set(ref(db, `/UserData/${user.uid}`), { name: user.displayName, email: user.email });
}

export async function signIn(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    if (!userCredential.user.emailVerified) {
      await sendEmailVerification(userCredential.user);
      throw new Error("Email not verified. Verification email sent.");
    }

    return { user: userCredential.user, mfaRequired: false };
  } catch (error) {
    if (error.code === "auth/multi-factor-auth-required") {
      const resolver = getMultiFactorResolver(auth, error);
      return { resolver, mfaRequired: true };
    }
    throw error;
  }
}

export async function signOut() {
  return firebaseSignOut(auth);
}

export function useUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}



export async function updateUserProfile(user, data) {
  return updateProfile(user, data);
}
