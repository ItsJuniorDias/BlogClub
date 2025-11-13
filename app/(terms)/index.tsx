import { useEffect, useState } from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { Text } from "@/components/ui";

import { useRouter } from "expo-router";
import { Colors } from "@/constants/Colors";
import { auth, db, doc, setDoc } from "@/firebaseConfig";
import { View } from "react-native";
import { getDoc } from "firebase/firestore";
import { queryUserByUID } from "@/utils/queryUserByUID";

export default function EulaScreen() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const user = auth.currentUser;

  const acceptEULA = async () => {
    try {
      console.log(user);

      if (!user) throw new Error("User not logged in");

      await setDoc(
        doc(db, "users", user.uid),
        {
          acceptedEULA: true,
          acceptedEULADate: new Date().toISOString(),
        },
        { merge: true }
      );

      router.replace("/(tabs)/new-article");

      console.log("✅ EULA accepted and saved.");
    } catch (error) {
      console.error("❌ Error saving EULA acceptance:", error);
    }
  };

  const handleAccept = async () => {
    setLoading(true);

    await acceptEULA();
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={{ flex: 1, paddingTop: 64, padding: 16 }}
      >
        <Text
          title="End User License Agreement (EULA)"
          fontSize={22}
          fontFamily="bold"
          color={Colors.light.darkBlue}
          style={{ marginBottom: 16 }}
        />

        <Text
          title={`By using this app, you agree not to post or share any content that is abusive, illegal, or inappropriate. 
We have zero tolerance for questionable content or abusive users. 
Violation of these terms may result in account suspension or permanent removal.`}
          fontSize={14}
          fontFamily="regular"
          color={Colors.light.darkBlue}
          style={{ marginBottom: 32 }}
        />

        <TouchableOpacity
          disabled={loading}
          onPress={handleAccept}
          style={{
            backgroundColor: Colors.light.blue,
            borderRadius: 12,
            padding: 24,
          }}
        >
          <Text
            title={loading ? "Saving..." : "I Agree and Continue"}
            color="white"
            fontFamily="semi-bold"
            fontSize={16}
            style={{ textAlign: "center" }}
          />
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}
