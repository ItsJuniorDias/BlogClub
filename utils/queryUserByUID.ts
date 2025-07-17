import { db } from "@/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export const queryUserByUID = async (uid: string | undefined) => {
  const usersRef = collection(db, "users");

  const queryUser = query(usersRef, where("id", "==", uid));

  const querySnapshot = await getDocs(queryUser);

  if (!querySnapshot.empty) {
    return querySnapshot.docs[0].data();
  } else {
    return null;
  }
};
