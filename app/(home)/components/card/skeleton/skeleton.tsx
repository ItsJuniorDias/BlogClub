import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";

export const SkeletonCard = () => {
  const shimmerTranslate = useSharedValue(-1);

  useEffect(() => {
    shimmerTranslate.value = withRepeat(
      withTiming(1.5, { duration: 2500 }), // 🔹 mais lento e suave
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: shimmerTranslate.value * 120, // 🔹 movimento mais longo
      },
    ],
  }));

  return (
    <View
      style={{
        width: 80,
        marginRight: 16,
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 70,
          height: 70,
          borderRadius: 16,
          marginBottom: 6,
          overflow: "hidden",
          backgroundColor: "#ddd",
          position: "relative",
        }}
      >
        <View style={[StyleSheet.absoluteFill, { backgroundColor: "#ddd" }]} />

        {/* 🔹 shimmer com transição mais suave */}
        <Animated.View
          style={[
            {
              position: "absolute",
              width: "50%",
              height: "100%",
            },
            animatedStyle,
          ]}
        >
          <LinearGradient
            colors={[
              "rgba(255,255,255,0)",
              "rgba(255,255,255,0.4)",
              "rgba(255,255,255,0)",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ width: "100%", height: "100%" }}
          />
        </Animated.View>
      </View>

      <View
        style={{
          width: 60,
          height: 10,
          borderRadius: 4,
          backgroundColor: "#e5e5e5",
        }}
      />
    </View>
  );
};
