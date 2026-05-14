import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View, ViewStyle } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { getPhaseColor } from "@/utils/cycle";
import { phaseNames } from "@/constants/theme";
import { useColors } from "@/hooks/useColors";
import type { CyclePhase } from "@/types";

interface PhaseRingProps {
  phase: CyclePhase;
  progress: number;
  dayOfCycle: number;
  cycleLength: number;
  size?: number;
  style?: ViewStyle;
  showLabel?: boolean;
}

export function PhaseRing({
  phase,
  progress,
  dayOfCycle,
  cycleLength,
  size = 160,
  style,
  showLabel = true,
}: PhaseRingProps) {
  const c = useColors();
  const anim = useRef(new Animated.Value(0)).current;
  const phaseColor = getPhaseColor(phase);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const cx = size / 2;
  const cy = size / 2;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: progress / 100,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const strokeDashoffset = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  const AnimatedCircle = Animated.createAnimatedComponent(Circle);

  return (
    <View style={[styles.container, style]}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFillObject}>
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={c.border}
          strokeWidth={8}
          fill="transparent"
        />
        <AnimatedCircle
          cx={cx}
          cy={cy}
          r={radius}
          stroke={phaseColor}
          strokeWidth={8}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${cx}, ${cy}`}
        />
      </Svg>
      <View style={styles.center}>
        <Text style={[styles.day, { color: phaseColor }]}>{dayOfCycle}</Text>
        <Text style={[styles.dayLabel, { color: c.mutedForeground }]}>dia {dayOfCycle}/{cycleLength}</Text>
        {showLabel && (
          <Text style={[styles.phase, { color: c.foreground }]} numberOfLines={2}>
            {phaseNames[phase]}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
  day: {
    fontSize: 36,
    fontWeight: "700",
    lineHeight: 42,
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
  },
  phase: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 4,
    paddingHorizontal: 8,
  },
});
