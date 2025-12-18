import React from "react";
import { View, Platform, ScrollView } from "react-native";
import * as Linking from "expo-linking";

import { Text, Button } from "../../components/ui";
import { Colors } from "@/constants/Colors";

export default function ForceUpdateScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 28,
        justifyContent: "center",
      }}
    >
      {/* Title */}
      <Text
        title="Update Required"
        fontFamily="semi-bold"
        fontSize={24}
        color={Colors.light.darkBlue}
        style={{
          textAlign: "center",
          marginBottom: 12,
        }}
      />

      {/* Description */}
      <Text
        title="A new version of Blog Club is available. Please update the app to continue."
        fontFamily="regular"
        fontSize={16}
        lineHeight={22}
        color={Colors.light.blueText}
        style={{
          textAlign: "center",
          marginBottom: 40,
        }}
      />

      {/* CTA */}
      <Button
        title="Update App"
        onPress={() =>
          Linking.openURL("market://details?id=com.itsjuniordias1997.blogclub")
        }
        isLoading={false}
        style={{
          height: 52,
          borderRadius: 14,
          justifyContent: "center",
        }}
      />

      {/* Footer hint */}
      <Text
        title="This update is required to continue using the app."
        fontFamily="regular"
        fontSize={14}
        color={Colors.light.blueText}
        style={{
          textAlign: "center",
          marginTop: 20,
          opacity: 0.6,
        }}
      />
    </View>
  );
}
