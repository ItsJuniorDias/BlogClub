import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MotiView } from "moti";

const tutorialSteps = [
  { id: 1, text: "Start by typing the article title 📝" },
  { id: 2, text: "Now add an engaging subtitle ✨" },
  { id: 3, text: "Write the main content of your article ✍️" },
  { id: 4, text: "Choose relevant tags for your post 🏷️" },
  { id: 5, text: "Finally, add a thumbnail by tapping the upload icon 📸" },
];

export default function TutorialOverlay({
  onFinish,
}: {
  onFinish: () => void;
}) {
  const [step, setStep] = useState(0);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    if (step < tutorialSteps.length) {
      const timer = setTimeout(() => {
        // animação de saída
        setShowBanner(false);
        setTimeout(() => {
          setStep((prev) => prev + 1);
          setShowBanner(true);
        }, 500); // duração da animação de saída
      }, 7000); // muda a cada 10 segundos
      return () => clearTimeout(timer);
    } else {
      onFinish?.();
    }
  }, [step]);

  if (step >= tutorialSteps.length) return null;

  const current = tutorialSteps[step];

  return (
    <View style={styles.overlay}>
      {showBanner && (
        <MotiView
          from={{ opacity: 0, translateY: -50 }}
          animate={{ opacity: 1, translateY: 0 }}
          exit={{ opacity: 0, translateY: -50 }}
          transition={{ type: "timing", duration: 500 }}
          style={styles.banner}
        >
          <Text style={styles.text}>{current.text}</Text>

          <TouchableOpacity
            onPress={() => {
              if (step < tutorialSteps.length - 1) {
                setShowBanner(false);
                setTimeout(() => {
                  setStep(step + 1);
                  setShowBanner(true);
                }, 500);
              } else {
                onFinish?.();
              }
            }}
          >
            <Text style={styles.next}>Next →</Text>
          </TouchableOpacity>
        </MotiView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.55)", // fundo escuro
    justifyContent: "flex-start",
    alignItems: "center",
    paddingTop: 80, // espaço para status bar
    zIndex: 100,
  },
  banner: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 20,
    width: "90%",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  next: {
    marginTop: 10,
    fontWeight: "600",
    textAlign: "right",
    color: "#007AFF",
  },
});
