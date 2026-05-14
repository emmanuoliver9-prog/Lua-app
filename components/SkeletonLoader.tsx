import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";
import { useColors } from "@/hooks/useColors";

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonLoader({ width = "100%", height = 20, borderRadius = 8, style }: SkeletonProps) {
  const c = useColors();
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const opacity = anim.interpolate({ inputRange: [0, 1], outputRange: [0.4, 1] });

  return (
    <Animated.View
      style={[
        { width: width as any, height, borderRadius, backgroundColor: c.shimmer, opacity },
        style,
      ]}
    />
  );
}

export function CardSkeleton({ style }: { style?: ViewStyle }) {
  return (
    <View style={[styles.card, style]}>
      <SkeletonLoader width={120} height={14} borderRadius={7} />
      <SkeletonLoader height={40} borderRadius={10} style={styles.mt} />
      <SkeletonLoader width="60%" height={12} borderRadius={6} style={styles.mt} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, gap: 8 },
  mt: { marginTop: 8 },
});
