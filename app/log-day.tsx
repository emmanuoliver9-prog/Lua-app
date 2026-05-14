import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MoodPicker } from "@/components/MoodPicker";
import { SymptomPicker } from "@/components/SymptomPicker";
import { GradientCard } from "@/components/GradientCard";
import { useCycle } from "@/context/CycleContext";
import { useColors } from "@/hooks/useColors";
import { useHaptics } from "@/hooks/useHaptics";
import { formatDate, today } from "@/utils/cycle";
import type { EnergyLevel, FlowLevel, MoodLevel, Symptom } from "@/types";

const FLOW_OPTIONS: { value: FlowLevel; label: string; icon: string; color: string }[] = [
  { value: "none", label: "Nenhum", icon: "minus", color: "#9CA3AF" },
  { value: "light", label: "Leve", icon: "droplet", color: "#FCA5A5" },
  { value: "medium", label: "Médio", icon: "droplets", color: "#F87171" },
  { value: "heavy", label: "Intenso", icon: "droplets", color: "#DC2626" },
];

const ENERGY_OPTIONS = [
  { value: 1, label: "Esgotada", color: "#EF4444" },
  { value: 2, label: "Cansada", color: "#F97316" },
  { value: 3, label: "Ok", color: "#FBBF24" },
  { value: 4, label: "Bem", color: "#84CC16" },
  { value: 5, label: "Cheia de energia", color: "#22C55E" },
];

export default function LogDayScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { logDay, getDayLog } = useCycle();
  const haptics = useHaptics();
  const params = useLocalSearchParams<{ date?: string }>();
  const dateStr = params.date ?? today();
  const existing = getDayLog(dateStr);

  const [flow, setFlow] = useState<FlowLevel>(existing?.flow ?? "none");
  const [symptoms, setSymptoms] = useState<Symptom[]>(existing?.symptoms ?? []);
  const [mood, setMood] = useState<MoodLevel>((existing?.mood ?? 3) as MoodLevel);
  const [energy, setEnergy] = useState<EnergyLevel>((existing?.energy ?? 3) as EnergyLevel);
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    haptics.success();
    setSaving(true);
    await logDay(dateStr, { flow, symptoms, mood, energy: energy as EnergyLevel, notes });
    setSaving(false);
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <LinearGradient
        colors={[c.gradientStart, c.background]}
        style={[styles.header, { paddingTop: insets.top + 16 }]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="x" size={22} color={c.foreground} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.headerTitle, { color: c.foreground }]}>Registrar dia</Text>
            <Text style={[styles.headerDate, { color: c.mutedForeground }]}>
              {formatDate(dateStr, { weekday: "long", day: "numeric", month: "long" })}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            style={[styles.saveHeaderBtn, { backgroundColor: c.primary }]}
          >
            <Text style={styles.saveHeaderText}>{saving ? "..." : "Salvar"}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Flow */}
          <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: c.foreground }]}>Fluxo</Text>
            <GradientCard colors={[c.card, c.surface as string]}>
              <View style={styles.flowRow}>
                {FLOW_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => { haptics.light(); setFlow(opt.value); }}
                    style={[
                      styles.flowBtn,
                      { borderColor: flow === opt.value ? opt.color : c.border },
                      flow === opt.value && { backgroundColor: opt.color + "20" },
                    ]}
                    activeOpacity={0.7}
                  >
                    <Feather name={opt.icon as any} size={18} color={flow === opt.value ? opt.color : c.mutedForeground} />
                    <Text style={[styles.flowLabel, { color: flow === opt.value ? opt.color : c.mutedForeground }]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </GradientCard>
          </Animated.View>

          {/* Mood */}
          <Animated.View entering={FadeInDown.delay(150)} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: c.foreground }]}>Humor</Text>
            <GradientCard colors={[c.card, c.surface as string]}>
              <MoodPicker value={mood} onChange={setMood} />
            </GradientCard>
          </Animated.View>

          {/* Energy */}
          <Animated.View entering={FadeInDown.delay(175)} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: c.foreground }]}>Energia</Text>
            <GradientCard colors={[c.card, c.surface as string]}>
              <View style={styles.energyRow}>
                {ENERGY_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.value}
                    onPress={() => { haptics.light(); setEnergy(opt.value as EnergyLevel); }}
                    style={[
                      styles.energyBtn,
                      { borderColor: energy === opt.value ? opt.color : c.border },
                      energy === opt.value && { backgroundColor: opt.color + "20" },
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.energyValue, { color: energy === opt.value ? opt.color : c.mutedForeground }]}>
                      {opt.value}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={[styles.energyLabel, { color: c.mutedForeground }]}>
                {ENERGY_OPTIONS.find(e => e.value === energy)?.label}
              </Text>
            </GradientCard>
          </Animated.View>

          {/* Symptoms */}
          <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: c.foreground }]}>Sintomas</Text>
            <GradientCard colors={[c.card, c.surface as string]}>
              <SymptomPicker selected={symptoms} onChange={setSymptoms} />
            </GradientCard>
          </Animated.View>

          {/* Notes */}
          <Animated.View entering={FadeInDown.delay(250)} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: c.foreground }]}>Anotações</Text>
            <GradientCard colors={[c.card, c.surface as string]}>
              <TextInput
                style={[styles.notesInput, { color: c.foreground }]}
                placeholder="Como foi seu dia? Como você se sentiu?"
                placeholderTextColor={c.mutedForeground}
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </GradientCard>
          </Animated.View>

          {/* Save Button */}
          <View style={[styles.section, { marginTop: 8 }]}>
            <TouchableOpacity onPress={handleSave} disabled={saving} activeOpacity={0.85}>
              <LinearGradient
                colors={["#C084FC", "#A855F7"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveBigBtn}
              >
                <Feather name="check" size={20} color="#fff" />
                <Text style={styles.saveBigText}>{saving ? "Salvando..." : "Salvar registro"}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 17, fontWeight: "700", textAlign: "center" },
  headerDate: { fontSize: 12, textAlign: "center", textTransform: "capitalize" },
  saveHeaderBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  saveHeaderText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  scroll: { paddingTop: 8 },
  section: { paddingHorizontal: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10 },
  flowRow: { flexDirection: "row", gap: 8 },
  flowBtn: {
    flex: 1, alignItems: "center", paddingVertical: 12, borderRadius: 14,
    borderWidth: 1.5, gap: 6,
  },
  flowLabel: { fontSize: 11, fontWeight: "600" },
  energyRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  energyBtn: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: "center", justifyContent: "center", borderWidth: 2,
  },
  energyValue: { fontSize: 18, fontWeight: "700" },
  energyLabel: { fontSize: 13, textAlign: "center" },
  notesInput: { fontSize: 15, minHeight: 100, lineHeight: 22 },
  saveBigBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 10, paddingVertical: 18, borderRadius: 28,
  },
  saveBigText: { color: "#fff", fontSize: 17, fontWeight: "700" },
});
