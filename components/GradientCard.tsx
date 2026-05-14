import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Platform, StyleSheet, View, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { useColors } from "@/hooks/useColors";
import { shadows } from "@/constants/theme";

interface GradientCardProps {
  children: React.ReactNode;
  colors?: [string, string, ...string[]];
  style?: ViewStyle;
  blur?: boolean;
  dark?: boolean;
}

export function GradientCard({ children, colors: gradColors, style, blur = false, dark = false }: GradientCardProps) {
  const c = useColors();
  const defaultColors: [string, string] = dark
    ? ["rgba(26,15,46,0.95)", "rgba(15,10,26,0.98)"]
    : ["rgba(255,255,255,0.9)", "rgba(243,232,255,0.8)"];
  const cols = gradColors ?? defaultColors;

  if (blur && Platform.OS === "ios") {
    return (
      <BlurView intensity={20} tint={dark ? "dark" : "light"} style={[styles.card, shadows.card, style]}>
        {children}
      </BlurView>
    );
  }

  return (
    <LinearGradient
      colors={cols}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.card, shadows.card, { borderColor: c.border }, style]}
    >
      {children}
    </LinearGradient>
  );
}

export function SolidCard({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const c = useColors();
  return (
    <View style={[styles.card, shadows.card, { backgroundColor: c.card, borderColor: c.border }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
});
