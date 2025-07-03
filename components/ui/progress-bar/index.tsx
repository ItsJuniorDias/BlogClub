import { Animated, View, StyleSheet } from "react-native";
import { Container } from "./styles";
import { useEffect, useRef, useState } from "react";

interface ProgressBarProsp {
  progress: number;
  color: string;
}

export default function ProgressBar({ progress, color }: ProgressBarProsp) {
  const animation = useRef(new Animated.Value(0)).current;
  const [barWidth, setBarWidth] = useState(0);

  useEffect(() => {
    Animated.timing(animation, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const widthInterpolated = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, barWidth],
  });

  return (
    <View
      style={styles.progressBackground}
      onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
    >
      <Animated.View
        style={[
          styles.progressForeground,
          {
            backgroundColor: color,
            width: widthInterpolated,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  progressBackground: {
    width: "100%",
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 6,
    overflow: "hidden",
    marginBottom: 20,
    marginRight: 16,
  },
  progressForeground: {
    height: "100%",
    borderRadius: 6,
  },
});
