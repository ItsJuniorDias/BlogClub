import { db } from "@/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export const getLastPostByUser = async (uid: string) => {
  const querySnapshot = await getDocs(collection(db, "posts"));

  const dataList = (querySnapshot?.docs ?? []).map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  if (!querySnapshot.empty) {
    const filterForeignKeyData = dataList.filter(
      (item) => item.foreign_key === uid
    );

    const mostRecentItem = filterForeignKeyData.reduce((latest, current) => {
      return new Date(current.createdAt) > new Date(latest.createdAt)
        ? latest
        : current;
    });

    return mostRecentItem;
  } else {
    console.log("No posts found for this user.");
    return null;
  }
};
