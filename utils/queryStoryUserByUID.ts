import { db } from "@/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

export const queryStoryUserByUID = async (uid: string | undefined) => {
  const usersRef = collection(db, "users");

  const querySnapshotUsers = await getDocs(collection(db, "users"));

  const usersData = querySnapshotUsers.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const queryUser = query(usersRef, where("id", "==", uid));

  const querySnapshot = await getDocs(queryUser);

  if (!querySnapshot.empty) {
    return [...usersData];
  } else {
    return null;
  }
};
