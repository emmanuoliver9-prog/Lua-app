import { Feather } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { moodColors, moodLabels } from "@/constants/theme";
import { useColors } from "@/hooks/useColors";
import { useHaptics } from "@/hooks/useHaptics";
import type { MoodLevel } from "@/types";

const MOOD_ICONS: Record<number, string> = {
  1: "frown",
  2: "meh",
  3: "smile",
  4: "smile",
  5: "sun",
};

interface MoodPickerProps {
  value: MoodLevel;
  onChange: (mood: MoodLevel) => void;
  showLabel?: boolean;
}

function MoodButton({ level, selected, onPress }: { level: number; selected: boolean; onPress: () => void }) {
  const c = useColors();
  const scale = useSharedValue(1);
  const color = moodColors[level];

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = () => {
    scale.value = withSpring(1.3, { damping: 8 }, () => { scale.value = withSpring(1); });
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <Animated.View
        style={[
          styles.moodBtn,
          animStyle,
          selected && { backgroundColor: color + "20", borderColor: color, borderWidth: 2 },
          !selected && { backgroundColor: c.muted },
        ]}
      >
        <Feather name={MOOD_ICONS[level] as any} size={22} color={selected ? color : c.mutedForeground} />
      </Animated.View>
    </TouchableOpacity>
  );
}

export function MoodPicker({ value, onChange, showLabel = true }: MoodPickerProps) {
  const c = useColors();
  const haptics = useHaptics();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {[1, 2, 3, 4, 5].map((level) => (
          <MoodButton
            key={level}
            level={level}
            selected={value === level}
            onPress={() => {
              haptics.selection();
              onChange(level as MoodLevel);
            }}
          />
        ))}
      </View>
      {showLabel && (
        <Text style={[styles.label, { color: moodColors[value] }]}>{moodLabels[value]}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", gap: 8 },
  row: { flexDirection: "row", gap: 8 },
  moodBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  label: { fontSize: 13, fontWeight: "600" },
});
