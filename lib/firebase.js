import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {}
const app = initializeApp(firebaseConfig);
export default app;
export const initFirebase = () => {
  return app;
};
export const db = getDatabase(app)

export const auth = getAuth();