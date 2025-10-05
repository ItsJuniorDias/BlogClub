import { View, StyleSheet, Animated, Dimensions } from "react-native";
import { Colors } from "@/constants/Colors";
import React, { useEffect, useRef } from "react";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function SkeletonNews() {
  const animatedValue = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, [animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [-1, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  return (
    <View style={styles.container}>
      <View style={styles.thumbnailSkeleton} />
      <View style={styles.textSkeletonContainer}>
        <View style={styles.lineSkeleton} />
        <View style={[styles.lineSkeleton, { width: "80%" }]} />
      </View>

      {/* Shimmer Overlay */}
      <Animated.View
        style={[
          styles.shimmerOverlay,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#E0E0E0", // cinza claro
    borderRadius: 16,
    overflow: "hidden",
    marginVertical: 8,
    height: 120,
    flexDirection: "row",
    padding: 10,
    position: "relative",
  },
  thumbnailSkeleton: {
    width: 100,
    height: "100%",
    borderRadius: 8,
    backgroundColor: "#C0C0C0", // cinza médio
  },
  textSkeletonContainer: {
    flex: 1,
    marginLeft: 10,
    justifyContent: "space-around",
  },
  lineSkeleton: {
    height: 20,
    borderRadius: 4,
    backgroundColor: "#C0C0C0", // cinza médio
    marginVertical: 4,
  },
  shimmerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "30%",
    backgroundColor: "rgba(255,255,255,0.3)", // brilho do shimmer
    transform: [{ rotate: "20deg" }],
  },
});
