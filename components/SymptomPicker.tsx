import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { symptomLabels } from "@/constants/theme";
import { useColors } from "@/hooks/useColors";
import { useHaptics } from "@/hooks/useHaptics";
import type { Symptom } from "@/types";

const ALL_SYMPTOMS: Symptom[] = [
  "cramps", "headache", "bloating", "fatigue", "nausea",
  "breast_tenderness", "acne", "mood_swings", "insomnia",
  "appetite", "anxiety", "stress", "libido_low", "libido_high",
  "backache", "spotting",
];

interface SymptomPickerProps {
  selected: Symptom[];
  onChange: (symptoms: Symptom[]) => void;
}

export function SymptomPicker({ selected, onChange }: SymptomPickerProps) {
  const c = useColors();
  const haptics = useHaptics();

  const toggle = (s: Symptom) => {
    haptics.light();
    if (selected.includes(s)) {
      onChange(selected.filter((x) => x !== s));
    } else {
      onChange([...selected, s]);
    }
  };

  return (
    <View style={styles.wrap}>
      {ALL_SYMPTOMS.map((s) => {
        const active = selected.includes(s);
        return (
          <TouchableOpacity
            key={s}
            onPress={() => toggle(s)}
            activeOpacity={0.7}
            style={[
              styles.chip,
              { borderColor: active ? c.primary : c.border },
              active && { backgroundColor: c.primary + "20" },
              !active && { backgroundColor: c.muted },
            ]}
          >
            <Text style={[styles.label, { color: active ? c.primary : c.mutedForeground }]}>
              {symptomLabels[s]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  label: { fontSize: 12, fontWeight: "500" },
});
