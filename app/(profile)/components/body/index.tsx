import { LatestNews } from "@/components/ui";

import big_data from "../../../../assets/images/big_data.png";
import card_latest_news from "../../../../assets/images/card_latest_news.png";

import { Container } from "./styles";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useQuery } from "@tanstack/react-query";
import { getAuth } from "firebase/auth";

export default function Body() {
  const auth = getAuth();
  const user = auth.currentUser;

  const fetch = async () => {
    const querySnapshot = await getDocs(collection(db, "posts"));

    const dataList = (querySnapshot?.docs ?? []).map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const filterForeignKeyData = dataList.filter(
      (item) => item.foreign_key === user?.uid
    );

    return filterForeignKeyData;
  };

  const { data } = useQuery({
    queryKey: ["repoData"],
    queryFn: () => fetch(),
  });

  return (
    <>
      <Container>
        {data?.map((item, index) => (
          <LatestNews
            isProfile={index !== 0}
            profileTitle="My Posts"
            image={item.thumbnail}
            title={item.title}
            description={item.description}
            article={item.article}
            numberLike={item.numberLike}
            hours={item.hours}
            isLike={item.isLike}
          />
        ))}
      </Container>
    </>
  );
}
