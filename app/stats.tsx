import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Svg, { Rect, Text as SvgText } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientCard } from "@/components/GradientCard";
import { useCycle } from "@/context/CycleContext";
import { useColors } from "@/hooks/useColors";
import { getPhaseColor } from "@/utils/cycle";
import { phaseNames } from "@/constants/theme";
import type { CyclePhase } from "@/types";

const MOCK_PHASE_DISTRIBUTION: { phase: CyclePhase; days: number }[] = [
  { phase: "menstrual", days: 5 },
  { phase: "follicular", days: 9 },
  { phase: "ovulation", days: 3 },
  { phase: "luteal", days: 8 },
  { phase: "pms", days: 3 },
];

const MOCK_SYMPTOMS = [
  { name: "Cólicas", count: 8 },
  { name: "Cansaço", count: 12 },
  { name: "Ansiedade", count: 7 },
  { name: "Inchaço", count: 5 },
  { name: "Acne", count: 4 },
];

function BarChart({ data }: { data: { name: string; count: number }[] }) {
  const c = useColors();
  const W = 280;
  const H = 120;
  const maxCount = Math.max(...data.map(d => d.count));
  const barW = (W - (data.length - 1) * 10) / data.length;

  return (
    <Svg width={W} height={H + 24} style={{ alignSelf: "center" }}>
      {data.map((item, i) => {
        const barH = (item.count / maxCount) * H;
        const x = i * (barW + 10);
        const y = H - barH;
        return (
          <React.Fragment key={item.name}>
            <Rect x={x} y={y} width={barW} height={barH} rx={6} fill={c.primary + "90"} />
            <SvgText x={x + barW / 2} y={H + 16} textAnchor="middle" fontSize={9} fill={c.mutedForeground}>
              {item.name.substring(0, 6)}
            </SvgText>
          </React.Fragment>
        );
      })}
    </Svg>
  );
}

export default function StatsScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { cycleData, prediction } = useCycle();

  const totalDays = Object.keys(cycleData.logs).length;

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <LinearGradient
        colors={[c.gradientStart, c.background]}
        style={[styles.topGradient, { paddingTop: insets.top + 16 }]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color={c.foreground} />
          </TouchableOpacity>
          <View>
            <Text style={[styles.screenTitle, { color: c.foreground }]}>Estatísticas</Text>
            <Text style={[styles.screenSub, { color: c.mutedForeground }]}>Seu ciclo em números</Text>
          </View>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pad}>
          {/* Summary Cards */}
          <Animated.View entering={FadeInDown.delay(100)}>
            <View style={styles.summaryGrid}>
              {[
                { label: "Duração do ciclo", value: `${cycleData.cycleLength} dias`, icon: "rotate-cw", color: c.primary },
                { label: "Dias de período", value: `${cycleData.periodLength} dias`, icon: "droplet", color: c.menstrual },
                { label: "Dias registrados", value: String(totalDays || 14), icon: "edit-3", color: c.accent },
                { label: "Próx. período", value: `${prediction?.daysUntilPeriod ?? "--"}d`, icon: "calendar", color: c.luaPink },
              ].map((item) => (
                <GradientCard
                  key={item.label}
                  colors={[item.color + "15", item.color + "08"]}
                  style={styles.summaryCard}
                >
                  <Feather name={item.icon as any} size={20} color={item.color} />
                  <Text style={[styles.summaryValue, { color: item.color }]}>{item.value}</Text>
                  <Text style={[styles.summaryLabel, { color: c.mutedForeground }]}>{item.label}</Text>
                </GradientCard>
              ))}
            </View>
          </Animated.View>

          {/* Phase Distribution */}
          <Animated.View entering={FadeInDown.delay(150)}>
            <Text style={[styles.sectionTitle, { color: c.foreground }]}>Distribuição do ciclo</Text>
            <GradientCard colors={[c.card, c.surface as string]} style={{ gap: 14 }}>
              {MOCK_PHASE_DISTRIBUTION.map((item) => {
                const color = getPhaseColor(item.phase);
                const pct = Math.round((item.days / cycleData.cycleLength) * 100);
                return (
                  <View key={item.phase} style={styles.phaseRow}>
                    <View style={[styles.phaseDot, { backgroundColor: color }]} />
                    <Text style={[styles.phaseLabel, { color: c.foreground }]}>{phaseNames[item.phase]}</Text>
                    <View style={[styles.phaseBar, { backgroundColor: c.muted }]}>
                      <View style={[styles.phaseFill, { width: `${pct}%`, backgroundColor: color }]} />
                    </View>
                    <Text style={[styles.phasePct, { color: c.mutedForeground }]}>{item.days}d</Text>
                  </View>
                );
              })}
            </GradientCard>
          </Animated.View>

          {/* Symptom Frequency */}
          <Animated.View entering={FadeInDown.delay(200)}>
            <Text style={[styles.sectionTitle, { color: c.foreground }]}>Sintomas frequentes</Text>
            <GradientCard colors={[c.card, c.surface as string]} style={{ gap: 12 }}>
              <BarChart data={MOCK_SYMPTOMS} />
            </GradientCard>
          </Animated.View>

          {/* Insights */}
          <Animated.View entering={FadeInDown.delay(250)}>
            <Text style={[styles.sectionTitle, { color: c.foreground }]}>Insights automáticos</Text>
            <View style={{ gap: 10 }}>
              {[
                { text: "Seu ciclo é regular e previsível — ótimo sinal de saúde hormonal.", icon: "check-circle", color: "#22C55E" },
                { text: "Cansaço aparece frequentemente na fase lútea. Considere ajustar sua rotina.", icon: "alert-circle", color: c.accent },
                { text: "Seu humor melhora significativamente durante a fase folicular.", icon: "trending-up", color: c.primary },
              ].map((insight, i) => (
                <GradientCard key={i} colors={[c.card, c.surface as string]} style={{ padding: 14 }}>
                  <View style={styles.insightRow}>
                    <Feather name={insight.icon as any} size={18} color={insight.color} />
                    <Text style={[styles.insightText, { color: c.foreground }]}>{insight.text}</Text>
                  </View>
                </GradientCard>
              ))}
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topGradient: { paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  screenTitle: { fontSize: 22, fontWeight: "700", textAlign: "center" },
  screenSub: { fontSize: 13, textAlign: "center" },
  scroll: {},
  pad: { paddingHorizontal: 20, gap: 16, paddingTop: 8 },
  summaryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  summaryCard: { width: "47.5%", alignItems: "center", gap: 6, padding: 16 },
  summaryValue: { fontSize: 20, fontWeight: "700" },
  summaryLabel: { fontSize: 11, textAlign: "center" },
  sectionTitle: { fontSize: 17, fontWeight: "700", marginTop: 4 },
  phaseRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  phaseDot: { width: 10, height: 10, borderRadius: 5 },
  phaseLabel: { width: 90, fontSize: 12 },
  phaseBar: { flex: 1, height: 8, borderRadius: 4, overflow: "hidden" },
  phaseFill: { height: 8, borderRadius: 4 },
  phasePct: { width: 24, fontSize: 11, textAlign: "right" },
  insightRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  insightText: { flex: 1, fontSize: 14, lineHeight: 20 },
});
