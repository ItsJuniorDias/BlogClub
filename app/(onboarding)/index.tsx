import React, { useEffect, useState } from "react";
import { Alert, TouchableOpacity, Platform } from "react-native";
import { useRouter } from "expo-router";
import Feather from "@expo/vector-icons/Feather";

import { Text } from "../../components/ui";

import thumbnail from "../../assets/images/thumbnail.png";

import { Container, Thumbnail, Body, Footer, Button } from "./styles";
import { Colors } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Purchases, { PurchasesPackage } from "react-native-purchases";

import * as Application from "expo-application";

import * as Linking from "expo-linking";
import ForceUpdateScreen from "../(force-update)";

const MIN_VERSION = "16.0.0";

export default function OnboardingScreen() {
  const [packageToBuy, setPackageToBuy] = useState<PurchasesPackage | null>(
    null
  );

  const [mustUpdate, setMustUpdate] = useState(false);

  const router = useRouter();

  const saveGuestFlag = async (value) => {
    try {
      await AsyncStorage.setItem("isGuest", JSON.stringify(value));
    } catch (e) {
      console.log("Erro ao salvar isGuest", e);
    }
  };

  useEffect(() => {
    saveGuestFlag(false);

    const current = Application.nativeApplicationVersion;

    const compareVersions = (a: string, b: string) => {
      const pa = a.split(".").map(Number);
      const pb = b.split(".").map(Number);

      for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
        const na = pa[i] || 0;
        const nb = pb[i] || 0;
        if (na > nb) return 1;
        if (na < nb) return -1;
      }
      return 0;
    };

    if (compareVersions(current ?? "0.0.0", MIN_VERSION) === -1) {
      setMustUpdate(true);

      Alert.alert(
        "Update Required",
        "Please update the app to continue using it.",
        [
          {
            text: "Update Now",
            onPress: () =>
              Linking.openURL(
                "market://details?id=com.itsjuniordias1997.blogclub"
              ),
          },
        ],
        { cancelable: false }
      );
    }
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const offerings = await Purchases.getOfferings();

        console.log("Offerings:", offerings);

        const pkg = offerings.current?.availablePackages[0];

        setPackageToBuy(pkg);
      } catch (e) {
        Alert.alert("Erro ao carregar planos", e.message);
      }
    }

    load();
  }, []);

  const getIsMember = async () => {
    try {
      const value = await AsyncStorage.getItem("isMember");

      return value != null ? JSON.parse(value) : false;
    } catch (error) {
      console.log("Error reading isMember:", error);
      return false;
    }
  };

  async function onSubscribe() {
    try {
      if (!packageToBuy) {
        Alert.alert("Erro", "Nenhum pacote disponível para compra");
        return;
      }

      const purchase = await Purchases.purchasePackage(packageToBuy);

      if (purchase.customerInfo.entitlements.active["Blog Club Pro"]) {
        Alert.alert("Sucesso", "Assinatura ativada!");
      }
    } catch (error) {
      if (!error.userCancelled) {
        Alert.alert("Erro na compra", error.message);
      }
    }
  }

  if (mustUpdate) {
    return <ForceUpdateScreen />;
  }

  return (
    <Container>
      <Thumbnail contentFit="fill" source={thumbnail} />

      <Body>
        <Text
          title={`Read the article you\nwant instantly`}
          fontFamily="semi-bold"
          fontSize={24}
          lineHeight={32}
          color={Colors.light.darkBlue}
        />

        <Text
          title={`You can read hundreds of articles on Blog\nClub, save them in the application and share\nthem with your loved ones.`}
          fontFamily="regular"
          fontSize={14}
          lineHeight={22}
          color={Colors.light.blueText}
        />

        <Footer>
          <TouchableOpacity
            onPress={() => {
              saveGuestFlag(true);

              router.push("/(tabs)/home");
            }} // ou a tela inicial do app
            style={{ marginTop: 24 }}
          >
            <Text
              title="Continue as guest"
              fontFamily="semi-bold"
              fontSize={16}
              color={Colors.light.blue}
              style={{ textAlign: "center" }}
            />
          </TouchableOpacity>

          <Button
            onPress={async () => {
              if (await getIsMember()) {
                router.push("/(sign-in)");
              } else {
                router.push("/(subscribe)");
              }
            }}
            activeOpacity={0.7}
          >
            <Feather name="arrow-right" size={24} color="white" />
          </Button>
        </Footer>
      </Body>
    </Container>
  );
}
