import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PhaseRing } from "@/components/PhaseRing";
import { GradientCard } from "@/components/GradientCard";
import { useAuth } from "@/context/AuthContext";
import { useCycle } from "@/context/CycleContext";
import { useColors } from "@/hooks/useColors";
import { useHaptics } from "@/hooks/useHaptics";
import { getPhaseColor } from "@/utils/cycle";
import { moodColors, phaseEmotions, phaseNames } from "@/constants/theme";
import { getSuggestions } from "@/utils/suggestions";
import type { CyclePhase, MoodLevel } from "@/types";

const PARTNER_MOOD_ICONS: Record<number, string> = { 1: "frown", 2: "meh", 3: "smile", 4: "smile", 5: "sun" };
const GREETING = () => {
  const h = new Date().getHours();
  if (h < 12) return "Bom dia";
  if (h < 18) return "Boa tarde";
  return "Boa noite";
};

export default function HomeScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { user, partner } = useAuth();
  const { prediction } = useCycle();
  const haptics = useHaptics();

  const phase = prediction?.currentPhase ?? "follicular";
  const phaseColor = getPhaseColor(phase);
  const suggestions = useMemo(() => getSuggestions({ phase, traits: user?.personality ?? [], mood: 3 }), [phase]);

  const quickActions = [
    { icon: "edit-3", label: "Registrar", color: "#C084FC", onPress: () => router.push("/log-day") },
    { icon: "map-pin", label: "Lugares", color: "#F9A8D4", onPress: () => router.push("/places") },
    { icon: "image", label: "Memórias", color: "#FBBF24", onPress: () => router.push("/memories") },
    { icon: "bar-chart-2", label: "Estatísticas", color: "#A78BFA", onPress: () => router.push("/stats") },
  ];

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
      >
        {/* Header */}
        <LinearGradient
          colors={[c.gradientStart, c.background]}
          style={[styles.header, { paddingTop: insets.top + 16 }]}
        >
          <View style={styles.headerRow}>
            <View>
              <Text style={[styles.greeting, { color: c.mutedForeground }]}>{GREETING()},</Text>
              <Text style={[styles.name, { color: c.foreground }]}>{user?.name ?? "Bem-vinda"}</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/premium")}
              style={[styles.premiumBtn, { backgroundColor: c.accent + "20", borderColor: c.accent }]}
            >
              <Feather name="star" size={14} color={c.accent} />
              <Text style={[styles.premiumText, { color: c.accent }]}>Premium</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Phase Ring Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.sectionPad}>
          <GradientCard
            colors={[phaseColor + "18", phaseColor + "08"]}
            style={styles.phaseCard}
          >
            <View style={styles.phaseCardInner}>
              <PhaseRing
                phase={phase}
                progress={prediction?.cycleProgress ?? 40}
                dayOfCycle={prediction?.dayOfCycle ?? 1}
                cycleLength={28}
                size={160}
              />
              <View style={styles.phaseInfo}>
                <Text style={[styles.phaseLabel, { color: phaseColor }]}>{phaseNames[phase]}</Text>
                <Text style={[styles.phaseEmotion, { color: c.mutedForeground }]}>{phaseEmotions[phase]}</Text>
                <View style={[styles.periodBadge, { backgroundColor: phaseColor + "20", borderColor: phaseColor }]}>
                  <Feather name="calendar" size={12} color={phaseColor} />
                  <Text style={[styles.periodBadgeText, { color: phaseColor }]}>
                    {prediction?.daysUntilPeriod === 0
                      ? "Hoje"
                      : `${prediction?.daysUntilPeriod ?? "--"} dias`}
                  </Text>
                </View>
                <Text style={[styles.periodHint, { color: c.mutedForeground }]}>próx. menstruação</Text>
              </View>
            </View>
          </GradientCard>
        </Animated.View>

        {/* Partner Mood */}
        {partner && (
          <Animated.View entering={FadeInDown.delay(150).duration(600)} style={styles.sectionPad}>
            <Text style={[styles.sectionTitle, { color: c.foreground }]}>Seu parceiro</Text>
            <GradientCard
              colors={["rgba(249,168,212,0.15)", "rgba(192,132,252,0.08)"]}
            >
              <View style={styles.partnerRow}>
                <View style={[styles.partnerAvatar, { backgroundColor: c.luaPink + "30" }]}>
                  <Text style={styles.partnerInitial}>{partner.name[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.partnerName, { color: c.foreground }]}>{partner.name}</Text>
                  <Text style={[styles.partnerStatus, { color: c.mutedForeground }]}>{partner.moodNote}</Text>
                </View>
                <View style={[styles.moodBadge, { backgroundColor: moodColors[partner.mood ?? 3] + "20" }]}>
                  <Feather
                    name={PARTNER_MOOD_ICONS[partner.mood ?? 3] as any}
                    size={16}
                    color={moodColors[partner.mood ?? 3]}
                  />
                </View>
              </View>
            </GradientCard>
          </Animated.View>
        )}

        {/* Quick Actions */}
        <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.sectionPad}>
          <Text style={[styles.sectionTitle, { color: c.foreground }]}>Ações rápidas</Text>
          <View style={styles.quickGrid}>
            {quickActions.map((action, i) => (
              <TouchableOpacity
                key={action.label}
                onPress={() => { haptics.light(); action.onPress(); }}
                activeOpacity={0.8}
                style={[styles.quickBtn, { backgroundColor: action.color + "15", borderColor: action.color + "30" }]}
              >
                <Feather name={action.icon as any} size={22} color={action.color} />
                <Text style={[styles.quickLabel, { color: action.color }]}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Today's Tip */}
        <Animated.View entering={FadeInDown.delay(250).duration(600)} style={styles.sectionPad}>
          <Text style={[styles.sectionTitle, { color: c.foreground }]}>Dica de hoje</Text>
          {suggestions.slice(0, 1).map((s) => (
            <GradientCard
              key={s.id}
              colors={["rgba(192,132,252,0.15)", "rgba(168,85,247,0.08)"]}
            >
              <View style={styles.tipRow}>
                <View style={[styles.tipIcon, { backgroundColor: c.primary + "20" }]}>
                  <Feather name={s.icon as any} size={20} color={c.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.tipTitle, { color: c.foreground }]}>{s.title}</Text>
                  <Text style={[styles.tipDesc, { color: c.mutedForeground }]}>{s.description}</Text>
                </View>
              </View>
            </GradientCard>
          ))}
        </Animated.View>

        {/* All Suggestions */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.sectionPad}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: c.foreground }]}>Sugestões para hoje</Text>
            <TouchableOpacity onPress={() => router.push("/places")}>
              <Text style={[styles.seeAll, { color: c.primary }]}>Ver tudo</Text>
            </TouchableOpacity>
          </View>
          <View style={{ gap: 10 }}>
            {suggestions.slice(1).map((s, i) => (
              <Animated.View key={s.id} entering={FadeInRight.delay(300 + i * 80).duration(500)}>
                <GradientCard colors={[c.card, c.surface as string]} style={{ padding: 12 }}>
                  <View style={styles.suggRow}>
                    <View style={[styles.suggIcon, { backgroundColor: phaseColor + "20" }]}>
                      <Feather name={s.icon as any} size={16} color={phaseColor} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.suggTitle, { color: c.foreground }]}>{s.title}</Text>
                      <Text style={[styles.suggDesc, { color: c.mutedForeground }]}>{s.description}</Text>
                    </View>
                  </View>
                </GradientCard>
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flexGrow: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  greeting: { fontSize: 14, fontWeight: "500" },
  name: { fontSize: 26, fontWeight: "700", marginTop: 2 },
  premiumBtn: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1,
  },
  premiumText: { fontSize: 13, fontWeight: "600" },
  sectionPad: { paddingHorizontal: 20, marginBottom: 20 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: "700", marginBottom: 12 },
  seeAll: { fontSize: 14, fontWeight: "600" },
  phaseCard: { padding: 20 },
  phaseCardInner: { flexDirection: "row", alignItems: "center", gap: 20 },
  phaseInfo: { flex: 1, gap: 4 },
  phaseLabel: { fontSize: 16, fontWeight: "700" },
  phaseEmotion: { fontSize: 13, lineHeight: 18 },
  periodBadge: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20,
    borderWidth: 1, alignSelf: "flex-start", marginTop: 4,
  },
  periodBadgeText: { fontSize: 13, fontWeight: "700" },
  periodHint: { fontSize: 11 },
  partnerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  partnerAvatar: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: "center", justifyContent: "center",
  },
  partnerInitial: { fontSize: 18, fontWeight: "700", color: "#F9A8D4" },
  partnerName: { fontSize: 15, fontWeight: "600" },
  partnerStatus: { fontSize: 13 },
  moodBadge: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  quickGrid: { flexDirection: "row", gap: 10 },
  quickBtn: {
    flex: 1, alignItems: "center", justifyContent: "center",
    gap: 6, paddingVertical: 16, borderRadius: 16, borderWidth: 1,
  },
  quickLabel: { fontSize: 12, fontWeight: "600" },
  tipRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  tipIcon: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  tipTitle: { fontSize: 15, fontWeight: "600" },
  tipDesc: { fontSize: 13, marginTop: 2, lineHeight: 18 },
  suggRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  suggIcon: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  suggTitle: { fontSize: 14, fontWeight: "600" },
  suggDesc: { fontSize: 12, marginTop: 1 },
});
