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

import app, { auth, db } from "@/lib/firebase.js";
import { onValue, ref, set, get } from "firebase/database";

export async function signUp(email, password, username) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential;
}

export async function updateUserDatabase(user) {
  await set(ref(db, `/UserData/${user.uid}`), {
    name: user.displayName,
    email: user.email,
  });
}

export async function updateUserKYC(user, data) {
   await set(ref(db, `/UserData/${user.uid}`), {
    name: user.displayName,
    email: user.email,
    personalInfo: {
      firstName: data.personalInfo.firstName,
      lastName: data.personalInfo.lastName,
      dateOfBirth: data.personalInfo.dateOfBirth,
      nationality: data.personalInfo.nationality,
      phoneNumber: data.personalInfo.phoneNumber,
      street: data.personalInfo.street,
      city: data.personalInfo.city,
      state: data.personalInfo.state,
      zipCode: data.personalInfo.zipCode,
      country: data.personalInfo.country
    },
    verification: {
      approved: data.approved || false
    }
  });
}

export async function signIn(email, password) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return { user: userCredential.user, mfaRequired: false };
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
