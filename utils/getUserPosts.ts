import { db } from "@/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export const getUserPosts = async (foreign_key: string) => {
  try {
    const postsRef = collection(db, "posts");

    const querySnapshotUsers = await getDocs(postsRef);

    const postsData = querySnapshotUsers.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const filterData = postsData.filter(
      (item) => item.foreign_key === foreign_key
    );

    return filterData;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw error;
  }
};
