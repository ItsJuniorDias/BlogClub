import { db } from "@/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export const queryStoryUserByUID = async (uid: string | undefined) => {
  const usersRef = collection(db, "users");

  const q = query(usersRef, where("id", "==", uid));

  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];

    return [
      {
        ...doc.data(),
        thumbnail: doc.data().thumbnail,
      },
    ];
  } else {
    return null;
  }
};
