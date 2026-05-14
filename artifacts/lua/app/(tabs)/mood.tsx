import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import Svg, { Line, Path, Circle as SvgCircle } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientCard } from "@/components/GradientCard";
import { MoodPicker } from "@/components/MoodPicker";
import { useCycle } from "@/context/CycleContext";
import { useColors } from "@/hooks/useColors";
import { useHaptics } from "@/hooks/useHaptics";
import { moodColors, moodLabels } from "@/constants/theme";
import { today, addDays, formatDateShort } from "@/utils/cycle";
import type { MoodLevel } from "@/types";

const WEEK_DAYS = Array.from({ length: 7 }, (_, i) => {
  const d = new Date();
  d.setDate(d.getDate() - (6 - i));
  return d.toISOString().split("T")[0];
});

const MOCK_MOOD_DATA: Record<string, MoodLevel> = {
  [WEEK_DAYS[0]]: 2,
  [WEEK_DAYS[1]]: 3,
  [WEEK_DAYS[2]]: 3,
  [WEEK_DAYS[3]]: 4,
  [WEEK_DAYS[4]]: 4,
  [WEEK_DAYS[5]]: 5,
  [WEEK_DAYS[6]]: 4,
};

const MOCK_PARTNER_MOOD: Record<string, MoodLevel> = {
  [WEEK_DAYS[0]]: 3,
  [WEEK_DAYS[1]]: 4,
  [WEEK_DAYS[2]]: 4,
  [WEEK_DAYS[3]]: 3,
  [WEEK_DAYS[4]]: 5,
  [WEEK_DAYS[5]]: 4,
  [WEEK_DAYS[6]]: 5,
};

function MoodLineChart({ myData, partnerData }: { myData: Record<string, number>; partnerData: Record<string, number> }) {
  const c = useColors();
  const W = 280;
  const H = 100;
  const days = WEEK_DAYS;
  const xStep = W / (days.length - 1);

  const pts = (data: Record<string, number>) =>
    days.map((d, i) => ({ x: i * xStep, y: H - ((data[d] ?? 3) / 5) * H }));

  const toPath = (points: { x: number; y: number }[]) =>
    points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(" ");

  const myPts = pts(myData);
  const partnerPts = pts(partnerData);

  return (
    <Svg width={W} height={H + 16} style={{ alignSelf: "center" }}>
      <Path d={toPath(myPts)} stroke={c.primary} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <Path d={toPath(partnerPts)} stroke={c.luaPink} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5,3" />
      {myPts.map((p, i) => (
        <SvgCircle key={i} cx={p.x} cy={p.y} r={4} fill={moodColors[myData[days[i]] ?? 3]} />
      ))}
    </Svg>
  );
}

export default function MoodScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { getDayLog, logDay } = useCycle();
  const haptics = useHaptics();
  const todayStr = today();
  const todayLog = getDayLog(todayStr);
  const [currentMood, setCurrentMood] = useState<MoodLevel>((todayLog?.mood ?? 3) as MoodLevel);
  const [saved, setSaved] = useState(false);
  const [note, setNote] = useState("");

  const handleSave = async () => {
    haptics.success();
    await logDay(todayStr, { mood: currentMood });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const avgMood = Math.round(
    WEEK_DAYS.reduce((acc, d) => acc + (MOCK_MOOD_DATA[d] ?? 3), 0) / WEEK_DAYS.length
  );

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <LinearGradient
        colors={[c.gradientStart, c.background]}
        style={[styles.topGradient, { paddingTop: insets.top + 16 }]}
      >
        <Text style={[styles.screenTitle, { color: c.foreground }]}>Humor</Text>
        <Text style={[styles.screenSub, { color: c.mutedForeground }]}>Como você está hoje?</Text>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pad}>
          {/* Log Today's Mood */}
          <Animated.View entering={FadeInDown.delay(100)}>
            <GradientCard
              colors={[`${moodColors[currentMood]}18`, `${moodColors[currentMood]}08`]}
              style={{ gap: 20 }}
            >
              <Text style={[styles.cardTitle, { color: c.foreground }]}>Seu humor agora</Text>
              <MoodPicker value={currentMood} onChange={setCurrentMood} />
              <TouchableOpacity
                onPress={handleSave}
                style={[styles.saveBtn, { backgroundColor: moodColors[currentMood] + "20", borderColor: moodColors[currentMood] }]}
              >
                <Feather name={saved ? "check" : "save"} size={16} color={moodColors[currentMood]} />
                <Text style={[styles.saveBtnText, { color: moodColors[currentMood] }]}>
                  {saved ? "Salvo!" : "Salvar humor"}
                </Text>
              </TouchableOpacity>
            </GradientCard>
          </Animated.View>

          {/* Weekly Chart */}
          <Animated.View entering={FadeInDown.delay(150)}>
            <Text style={[styles.sectionTitle, { color: c.foreground }]}>Semana emocional</Text>
            <GradientCard colors={[c.card, c.surface as string]} style={{ gap: 16 }}>
              <View style={styles.chartLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendLine, { backgroundColor: c.primary }]} />
                  <Text style={[styles.legendText, { color: c.mutedForeground }]}>Você</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDash, { backgroundColor: c.luaPink }]} />
                  <Text style={[styles.legendText, { color: c.mutedForeground }]}>Parceiro</Text>
                </View>
              </View>
              <MoodLineChart myData={MOCK_MOOD_DATA} partnerData={MOCK_PARTNER_MOOD} />
              <View style={styles.daysRow}>
                {WEEK_DAYS.map((d) => (
                  <Text key={d} style={[styles.dayLabel, { color: c.mutedForeground }]}>
                    {formatDateShort(d).split("/")[0]}
                  </Text>
                ))}
              </View>
            </GradientCard>
          </Animated.View>

          {/* Sync Score */}
          <Animated.View entering={FadeInDown.delay(200)}>
            <Text style={[styles.sectionTitle, { color: c.foreground }]}>Sintonia do casal</Text>
            <View style={styles.syncRow}>
              <GradientCard colors={["rgba(192,132,252,0.15)", "rgba(168,85,247,0.08)"]} style={[styles.syncCard, { gap: 4 }]}>
                <Feather name="zap" size={24} color={c.primary} />
                <Text style={[styles.syncValue, { color: c.primary }]}>87%</Text>
                <Text style={[styles.syncLabel, { color: c.mutedForeground }]}>Sintonia</Text>
              </GradientCard>
              <GradientCard colors={["rgba(249,168,212,0.15)", "rgba(244,114,182,0.08)"]} style={[styles.syncCard, { gap: 4 }]}>
                <Feather name="trending-up" size={24} color={c.luaPink} />
                <Text style={[styles.syncValue, { color: c.luaPink }]}>{avgMood}.0</Text>
                <Text style={[styles.syncLabel, { color: c.mutedForeground }]}>Humor médio</Text>
              </GradientCard>
              <GradientCard colors={["rgba(251,191,36,0.15)", "rgba(251,191,36,0.08)"]} style={[styles.syncCard, { gap: 4 }]}>
                <Feather name="award" size={24} color={c.accent} />
                <Text style={[styles.syncValue, { color: c.accent }]}>12</Text>
                <Text style={[styles.syncLabel, { color: c.mutedForeground }]}>Streak</Text>
              </GradientCard>
            </View>
          </Animated.View>

          {/* Emotional Insights */}
          <Animated.View entering={FadeInDown.delay(250)}>
            <Text style={[styles.sectionTitle, { color: c.foreground }]}>Insights emocionais</Text>
            <View style={{ gap: 10 }}>
              {[
                { icon: "trending-up", text: "Seu humor melhorou 15% esta semana", color: "#22C55E" },
                { icon: "heart", text: "Vocês estão em alta sintonia esta semana", color: c.luaPink },
                { icon: "sun", text: "Você está na fase de maior energia do ciclo", color: c.accent },
              ].map((insight, i) => (
                <GradientCard key={i} colors={[c.card, c.surface as string]} style={{ padding: 14 }}>
                  <View style={styles.insightRow}>
                    <View style={[styles.insightIcon, { backgroundColor: insight.color + "20" }]}>
                      <Feather name={insight.icon as any} size={16} color={insight.color} />
                    </View>
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
  screenTitle: { fontSize: 28, fontWeight: "700" },
  screenSub: { fontSize: 14, marginTop: 2 },
  scroll: {},
  pad: { paddingHorizontal: 20, gap: 16 },
  cardTitle: { fontSize: 16, fontWeight: "700" },
  saveBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, paddingVertical: 12, borderRadius: 14, borderWidth: 1,
  },
  saveBtnText: { fontSize: 14, fontWeight: "600" },
  sectionTitle: { fontSize: 17, fontWeight: "700", marginTop: 4 },
  chartLegend: { flexDirection: "row", gap: 16, justifyContent: "center" },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendLine: { width: 16, height: 2.5, borderRadius: 2 },
  legendDash: { width: 16, height: 2.5, borderRadius: 2, opacity: 0.7 },
  legendText: { fontSize: 12 },
  daysRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 8 },
  dayLabel: { fontSize: 11, width: 28, textAlign: "center" },
  syncRow: { flexDirection: "row", gap: 10 },
  syncCard: { flex: 1, alignItems: "center", padding: 14 },
  syncValue: { fontSize: 22, fontWeight: "700" },
  syncLabel: { fontSize: 11, textAlign: "center" },
  insightRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  insightIcon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  insightText: { flex: 1, fontSize: 14, lineHeight: 20 },
});
