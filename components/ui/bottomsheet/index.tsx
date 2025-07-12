/* eslint-disable react/display-name */
import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

const BottomSheet = forwardRef((props, ref) => {
  const sheetHeight = SCREEN_HEIGHT * 0.8;

  const translateY = useRef(new Animated.Value(sheetHeight)).current;
  const lastTranslateY = useRef(sheetHeight);

  const animateTo = useCallback((toValue) => {
    Animated.spring(translateY, {
      toValue,
      useNativeDriver: true,
    }).start(() => {
      lastTranslateY.current = toValue;
    });
  }, []);

  useImperativeHandle(ref, () => ({
    open: () => animateTo(0),
    close: () => animateTo(sheetHeight),
  }));

  return (
    <Animated.View
      style={[
        styles.bottomSheet,
        {
          height: sheetHeight,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={styles.handleBar} />
      <View style={styles.content}>{props.children}</View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  bottomSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 0,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 2.5,
    alignSelf: "center",
    marginTop: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default BottomSheet;
