import { Text } from "@/components/ui";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Colors } from "@/constants/Colors";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import big_data from "../../../../assets/images/big_data.png";

import { TouchableOpacity } from "react-native";

import {
  Body,
  Container,
  ContentBody,
  ContentText,
  ContentTextBody,
  Row,
  Thumbnail,
} from "./styles";

export default function LatestNews() {
  return (
    <Container>
      <ContentText>
        <Text
          title="Latest News"
          fontFamily="semi-bold"
          fontSize={20}
          color={Colors.light.darkBlue}
        />

        <TouchableOpacity onPress={() => {}}>
          <Text
            title="More"
            fontFamily="regular"
            fontSize={14}
            color={Colors.light.blue}
          />
        </TouchableOpacity>
      </ContentText>

      <Body>
        <Thumbnail source={big_data} />

        <ContentBody>
          <ContentTextBody>
            <Text
              title="Big Data"
              fontFamily="semi-bold"
              fontSize={14}
              color={Colors.light.blue}
            />

            <Text
              title={`Why Big Data Needs\nThick Data?`}
              fontFamily="regular"
              fontSize={14}
              color={Colors.light.darkBlue}
            />
          </ContentTextBody>

          <Row>
            <Row>
              <AntDesign name="like2" size={16} color={Colors.light.blue} />

              <Text
                title={`2.1k`}
                fontFamily="regular"
                fontSize={12}
                color={Colors.light.darkBlue}
              />
            </Row>

            <Row>
              <AntDesign
                name="clockcircleo"
                size={16}
                color={Colors.light.blue}
              />

              <Text
                title={`1hr ago`}
                fontFamily="regular"
                fontSize={12}
                color={Colors.light.darkBlue}
              />
            </Row>

            <Row>
              <MaterialIcons
                name="favorite"
                size={16}
                color={Colors.light.blue}
              />
            </Row>
          </Row>
        </ContentBody>
      </Body>
    </Container>
  );
}
