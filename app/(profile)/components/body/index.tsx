import { LatestNews } from "@/components/ui";

import big_data from "../../../../assets/images/big_data.png";
import card_latest_news from "../../../../assets/images/card_latest_news.png";

import { Container } from "./styles";

export default function Body() {
  return (
    <Container>
      <LatestNews
        image={big_data}
        profileTitle="My Posts"
        title="BIG DATA"
        description={`Why Big Data Needs\nThick Data?`}
        numberLike={2.1}
        hours={1}
        isLike
      />

      <LatestNews
        isProfile
        image={card_latest_news}
        title="UX DESIGN"
        description={`Step design sprint for\nUX beginner`}
        numberLike={1.1}
        hours={2}
      />
    </Container>
  );
}
