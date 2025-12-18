import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";

const auth = getAuth();

export const formatMyMessages = async () => {
  const userId = auth.currentUser?.uid;

  if (!userId) return [];

  const chatsRef = collection(db, "chats");
  const snapshot = await getDocs(chatsRef);

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .filter(
      (item) =>
        item?.messages?.participants?.includes(userId) &&
        !item?.messages?.removedFor?.includes(userId)
    );
};
