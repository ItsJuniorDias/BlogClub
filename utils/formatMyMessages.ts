import { db } from "@/firebaseConfig";
import { getAuth } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";

const auth = getAuth();

export const formatMyMessages = async () => {
  const fetchAllMessages = async () => {
    const docRef = collection(db, "chats");

    const docSnap = await getDocs(docRef);

    return docSnap.docs.map((item) => ({
      ...item.data(),
    }));
  };

  const resultMyMessage = await fetchAllMessages();

  const filterHideMessage = resultMyMessage.filter((item) =>
    item.messages.removedFor.includes(auth.currentUser?.uid)
  );

  if (!!filterHideMessage.length) {
    return [];
  }

  const filterMyMessageOne = resultMyMessage.filter(
    (item) => item?.messages?.participants[0] === auth?.currentUser?.uid
  );

  if (!filterMyMessageOne?.length) {
    const filterMyMessageTwo = resultMyMessage.filter(
      (item) => item?.messages?.participants[1] === auth?.currentUser?.uid
    );

    return filterMyMessageTwo;
  }

  return filterMyMessageOne;
};
