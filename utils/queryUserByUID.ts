import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export const queryUserByUID = async (uid: string | undefined) => {
  if (!uid) return null;

  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() };
  } else {
    return null;
  }
};
