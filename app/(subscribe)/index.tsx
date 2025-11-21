import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Linking,
} from "react-native";
import Purchases from "react-native-purchases";

export default function SubscriptionScreen() {
  const [loading, setLoading] = useState(true);
  const [offer, setOffer] = useState(null);

  const [monthlyPkg, setMonthlyPkg] = useState(null);
  const [annualPkg, setAnnualPkg] = useState(null);

  const [selectedPkg, setSelectedPkg] = useState(null);

  const router = useRouter();

  useEffect(() => {
    async function loadOfferings() {
      try {
        const offerings = await Purchases.getOfferings();

        if (offerings.current) {
          setOffer(offerings.current);

          const monthly = offerings.current.availablePackages.find(
            (p) => p.packageType === "MONTHLY"
          );

          const annual = offerings.current.availablePackages.find(
            (p) => p.packageType === "ANNUAL"
          );

          setMonthlyPkg(monthly);
          setAnnualPkg(annual);

          setSelectedPkg(monthly || annual);
        }
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    }

    loadOfferings();
  }, []);

  const setIsMember = async (value: boolean) => {
    try {
      await AsyncStorage.setItem("isMember", JSON.stringify(value));
    } catch (error) {
      console.log("Error saving isMember:", error);
    }
  };

  async function handlePurchase() {
    try {
      if (!selectedPkg) {
        Alert.alert("Error", "No subscription package found.");
        return;
      }

      const purchase = await Purchases.purchasePackage(selectedPkg);

      if (purchase.customerInfo.entitlements.active["Blog Club Pro"]) {
        Alert.alert("Success", "Subscription activated!");
        await setIsMember(true);
      }

      router.replace("/(sign-in)");
    } catch (e: any) {
      if (!e.userCancelled) {
        Alert.alert("Purchase Error", e.message);
      }
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading plans...</Text>
      </View>
    );
  }

  if (!monthlyPkg && !annualPkg) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>No subscription plans available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Go Premium</Text>
      <Text style={styles.subtitle}>Unlock all features without limits</Text>

      {/* monthly */}
      {monthlyPkg && (
        <TouchableOpacity
          onPress={() => setSelectedPkg(monthlyPkg)}
          style={[
            styles.card,
            selectedPkg?.identifier === monthlyPkg?.identifier &&
              styles.cardSelected,
          ]}
        >
          <Text style={styles.planTitle}>{monthlyPkg.product.title}</Text>
          <Text style={styles.planPrice}>{monthlyPkg.product.priceString}</Text>
          <Text style={styles.planDesc}>Monthly Billing — Cancel anytime</Text>
        </TouchableOpacity>
      )}

      {/* annual */}
      {annualPkg && (
        <TouchableOpacity
          onPress={() => setSelectedPkg(annualPkg)}
          style={[
            styles.card,
            selectedPkg?.identifier === annualPkg?.identifier &&
              styles.cardSelected,
          ]}
        >
          <Text style={styles.planTitle}>{annualPkg.product.title}</Text>
          <Text style={styles.planPrice}>
            {annualPkg.product.pricePerYearString}
          </Text>
          <Text style={styles.planDesc}>Annual Billing — Save up to 40%</Text>
        </TouchableOpacity>
      )}

      {/* BOTÃO */}
      <TouchableOpacity style={styles.button} onPress={handlePurchase}>
        <Text style={styles.buttonText}>Subscribe Now</Text>
      </TouchableOpacity>

      {/* █████ REQUIRED BY APPLE █████ */}
      <View style={styles.footerContainer}>
        <Text style={styles.footnote}>
          Billing handled by the App Store / Google Play. Cancel anytime.
        </Text>

        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              "https://www.notion.so/Terms-of-Use-Blog-Club-2350df0a2e79800096d4c5f1ca96843e?source=copy_link"
            )
          }
        >
          <Text style={styles.link}>Terms of Use</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() =>
            Linking.openURL(
              "https://www.notion.so/Privacy-Policy-Blog-Club-2b20df0a2e798063a769f2482e902c62?source=copy_link"
            )
          }
        >
          <Text style={styles.link}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* -------------------- STYLES -------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#D00",
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 6,
    color: "#0C1A32",
  },
  subtitle: {
    textAlign: "center",
    color: "#6B7280",
    marginBottom: 28,
    fontSize: 16,
  },

  card: {
    padding: 22,
    backgroundColor: "#F5F5F7",
    borderRadius: 20,
    marginBottom: 18,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: "#007AFF",
    backgroundColor: "#E8F0FF",
  },
  planTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  planPrice: {
    fontSize: 28,
    fontWeight: "700",
    marginVertical: 8,
  },
  planDesc: {
    fontSize: 15,
    color: "#6B7280",
  },

  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 14,
  },
  buttonText: {
    textAlign: "center",
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },

  footerContainer: {
    marginTop: 20,
    alignItems: "center",
  },

  footnote: {
    textAlign: "center",
    marginTop: 8,
    fontSize: 12,
    color: "#6B7280",
  },

  link: {
    marginTop: 10,
    fontSize: 14,
    color: "#007AFF",
    textDecorationLine: "underline",
  },
});
