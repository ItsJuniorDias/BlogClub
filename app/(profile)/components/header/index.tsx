import { TouchableOpacity, StyleSheet } from "react-native";
import { Text } from "../../../../components/ui";
import { Colors } from "@/constants/Colors";

import { Feather } from "@expo/vector-icons";

import thumbnail_profile from "../../../../assets/images/thumbnail_profile.png";

import {
  BorderContainer,
  ColumnInfo,
  Container,
  ContainerAbout,
  ContainerBody,
  ContainerInfo,
  Content,
  ContentInfo,
  ContentText,
  Row,
  Thumbnail,
} from "./styles";

interface HeaderProfileProps {
  title: string;
  icon: string;
}

export default function HeaderProfile({ title, icon }: HeaderProfileProps) {
  return (
    <>
      <Container>
        <Text
          title={title}
          fontFamily="semi-bold"
          fontSize={24}
          color={Colors.light.darkBlue}
        />

        <TouchableOpacity onPress={() => {}}>
          <Feather name={icon} size={32} color={Colors.light.darkBlue} />
        </TouchableOpacity>
      </Container>

      <Content>
        <ContainerBody style={styles.shadowBox}>
          <Row>
            <BorderContainer>
              <Thumbnail source={thumbnail_profile} />
            </BorderContainer>

            <ContentText>
              <Text
                title="@joviedan"
                fontFamily="regular"
                fontSize={14}
                color={Colors.light.blueText}
              />

              <Text
                title="Jovi Daniel"
                fontFamily="semi-bold"
                fontSize={18}
                color={Colors.light.darkBlue}
              />

              <Text
                title="UX Designer"
                fontFamily="regular"
                fontSize={16}
                color={Colors.light.blue}
              />
            </ContentText>
          </Row>

          <ContainerAbout>
            <Text
              title="About me"
              fontFamily="semi-bold"
              fontSize={16}
              color={Colors.light.darkBlue}
            />

            <Text
              title="Madison Blackstone is a director of user experience design, with experience managing global teams."
              fontFamily="regular"
              fontSize={14}
              lineHeight={20}
              color={Colors.light.blueText}
            />
          </ContainerAbout>
        </ContainerBody>
      </Content>

      <ContainerInfo>
        <ContentInfo>
          <ColumnInfo>
            <Text
              title="52"
              fontFamily="bold"
              fontSize={20}
              color={Colors.light.background}
            />

            <Text
              title="Post"
              fontFamily="regular"
              fontSize={12}
              color={Colors.light.background}
            />
          </ColumnInfo>

          <ColumnInfo>
            <Text
              title="250"
              fontFamily="bold"
              fontSize={20}
              color={Colors.light.background}
            />

            <Text
              title="Following"
              fontFamily="regular"
              fontSize={12}
              color={Colors.light.background}
            />
          </ColumnInfo>

          <ColumnInfo>
            <Text
              title="4.5K"
              fontFamily="bold"
              fontSize={20}
              color={Colors.light.background}
            />

            <Text
              title="Followers"
              fontFamily="regular"
              fontSize={12}
              color={Colors.light.background}
            />
          </ColumnInfo>
        </ContentInfo>
      </ContainerInfo>
    </>
  );
}

const styles = StyleSheet.create({
  shadowBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.01,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
