import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientCard } from "@/components/GradientCard";
import { useCycle } from "@/context/CycleContext";
import { useColors } from "@/hooks/useColors";
import { useHaptics } from "@/hooks/useHaptics";
import {
  formatDate,
  generateCalendarDays,
  getDayPhase,
  getFirstDayOfWeek,
  getMonthName,
  isToday,
  today,
} from "@/utils/cycle";
import { getPhaseColor } from "@/utils/cycle";
import { phaseNames, symptomLabels, moodLabels } from "@/constants/theme";
import type { CyclePhase } from "@/types";

const DAYS_OF_WEEK = ["D", "S", "T", "Q", "Q", "S", "S"];

export default function CalendarScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { cycleData, prediction, getDayLog } = useCycle();
  const haptics = useHaptics();

  const now = new Date();
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState(today());

  const days = useMemo(() => generateCalendarDays(viewYear, viewMonth), [viewYear, viewMonth]);
  const firstDow = useMemo(() => getFirstDayOfWeek(viewYear, viewMonth), [viewYear, viewMonth]);

  const selectedLog = getDayLog(selectedDate);
  const selectedPhase = getDayPhase(
    selectedDate,
    cycleData.lastPeriodDate,
    cycleData.cycleLength,
    cycleData.periodLength
  );

  const prevMonth = () => {
    haptics.light();
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    haptics.light();
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <LinearGradient
        colors={[c.gradientStart, c.background]}
        style={[styles.topGradient, { paddingTop: insets.top + 16 }]}
      >
        <Text style={[styles.screenTitle, { color: c.foreground }]}>Calendário</Text>
        <Text style={[styles.screenSub, { color: c.mutedForeground }]}>Seu ciclo visualizado</Text>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Calendar */}
        <Animated.View entering={FadeIn.duration(500)} style={styles.pad}>
          <GradientCard colors={[c.card, c.surface as string]}>
            {/* Month nav */}
            <View style={styles.monthNav}>
              <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
                <Feather name="chevron-left" size={20} color={c.foreground} />
              </TouchableOpacity>
              <Text style={[styles.monthLabel, { color: c.foreground }]}>
                {getMonthName(viewMonth)} {viewYear}
              </Text>
              <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
                <Feather name="chevron-right" size={20} color={c.foreground} />
              </TouchableOpacity>
            </View>

            {/* DOW header */}
            <View style={styles.dowRow}>
              {DAYS_OF_WEEK.map((d, i) => (
                <Text key={i} style={[styles.dowLabel, { color: c.mutedForeground }]}>{d}</Text>
              ))}
            </View>

            {/* Days grid */}
            <View style={styles.daysGrid}>
              {Array.from({ length: firstDow }).map((_, i) => (
                <View key={`empty-${i}`} style={styles.dayCell} />
              ))}
              {days.map((dateStr) => {
                const phase = getDayPhase(dateStr, cycleData.lastPeriodDate, cycleData.cycleLength, cycleData.periodLength);
                const phaseColor = phase ? getPhaseColor(phase) : null;
                const hasLog = !!cycleData.logs[dateStr];
                const isSelected = dateStr === selectedDate;
                const isTodayFlag = isToday(dateStr);
                const dayNum = parseInt(dateStr.split("-")[2], 10);

                return (
                  <TouchableOpacity
                    key={dateStr}
                    onPress={() => { haptics.selection(); setSelectedDate(dateStr); }}
                    style={[
                      styles.dayCell,
                      phase && { backgroundColor: phaseColor + "20" },
                      isSelected && [styles.selectedDay, { borderColor: phaseColor ?? c.primary }],
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.dayNum,
                        { color: isSelected ? (phaseColor ?? c.primary) : isTodayFlag ? c.primary : c.foreground },
                        (isSelected || isTodayFlag) && { fontWeight: "700" },
                      ]}
                    >
                      {dayNum}
                    </Text>
                    {hasLog && <View style={[styles.logDot, { backgroundColor: phaseColor ?? c.primary }]} />}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Legend */}
            <View style={styles.legend}>
              {(["menstrual", "follicular", "ovulation", "luteal", "pms"] as CyclePhase[]).map((ph) => (
                <View key={ph} style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: getPhaseColor(ph) }]} />
                  <Text style={[styles.legendText, { color: c.mutedForeground }]}>{phaseNames[ph].split(" ")[1] ?? phaseNames[ph]}</Text>
                </View>
              ))}
            </View>
          </GradientCard>
        </Animated.View>

        {/* Selected Day Detail */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.pad}>
          <View style={styles.dayHeader}>
            <View>
              <Text style={[styles.selectedDateLabel, { color: c.foreground }]}>
                {formatDate(selectedDate, { weekday: "long", day: "numeric", month: "long" })}
              </Text>
              {selectedPhase && (
                <Text style={[styles.selectedPhaseLabel, { color: getPhaseColor(selectedPhase) }]}>
                  {phaseNames[selectedPhase]}
                </Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => router.push({ pathname: "/log-day", params: { date: selectedDate } })}
              style={[styles.logBtn, { backgroundColor: c.primary + "20", borderColor: c.primary }]}
            >
              <Feather name={selectedLog ? "edit-2" : "plus"} size={16} color={c.primary} />
              <Text style={[styles.logBtnText, { color: c.primary }]}>
                {selectedLog ? "Editar" : "Registrar"}
              </Text>
            </TouchableOpacity>
          </View>

          {selectedLog ? (
            <GradientCard colors={[c.card, c.surface as string]} style={{ gap: 12 }}>
              <View style={styles.logRow}>
                <Feather name="droplets" size={16} color={c.luaPink} />
                <Text style={[styles.logLabel, { color: c.mutedForeground }]}>Fluxo:</Text>
                <Text style={[styles.logValue, { color: c.foreground }]}>{selectedLog.flow === "none" ? "Nenhum" : selectedLog.flow}</Text>
              </View>
              <View style={styles.logRow}>
                <Feather name="smile" size={16} color={c.luaPurple} />
                <Text style={[styles.logLabel, { color: c.mutedForeground }]}>Humor:</Text>
                <Text style={[styles.logValue, { color: c.foreground }]}>{moodLabels[selectedLog.mood]}</Text>
              </View>
              {selectedLog.symptoms.length > 0 && (
                <View style={styles.symptomsWrap}>
                  {selectedLog.symptoms.slice(0, 4).map((s) => (
                    <View key={s} style={[styles.symptomChip, { backgroundColor: c.muted }]}>
                      <Text style={[styles.symptomText, { color: c.mutedForeground }]}>{symptomLabels[s]}</Text>
                    </View>
                  ))}
                  {selectedLog.symptoms.length > 4 && (
                    <View style={[styles.symptomChip, { backgroundColor: c.muted }]}>
                      <Text style={[styles.symptomText, { color: c.mutedForeground }]}>+{selectedLog.symptoms.length - 4}</Text>
                    </View>
                  )}
                </View>
              )}
              {selectedLog.notes ? (
                <Text style={[styles.notes, { color: c.mutedForeground }]}>{selectedLog.notes}</Text>
              ) : null}
            </GradientCard>
          ) : (
            <GradientCard colors={[c.card, c.surface as string]}>
              <View style={styles.emptyLog}>
                <Feather name="calendar" size={32} color={c.mutedForeground} />
                <Text style={[styles.emptyText, { color: c.mutedForeground }]}>Nenhum registro neste dia</Text>
              </View>
            </GradientCard>
          )}
        </Animated.View>
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
  pad: { paddingHorizontal: 20, marginBottom: 16 },
  monthNav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  navBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  monthLabel: { fontSize: 16, fontWeight: "700" },
  dowRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 8 },
  dowLabel: { width: 36, textAlign: "center", fontSize: 12, fontWeight: "600" },
  daysGrid: { flexDirection: "row", flexWrap: "wrap" },
  dayCell: {
    width: "14.28%", aspectRatio: 1, alignItems: "center", justifyContent: "center",
    borderRadius: 8, borderWidth: 1.5, borderColor: "transparent",
  },
  selectedDay: { borderWidth: 2 },
  dayNum: { fontSize: 14 },
  logDot: { width: 4, height: 4, borderRadius: 2, marginTop: 2 },
  legend: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 10 },
  dayHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  selectedDateLabel: { fontSize: 16, fontWeight: "600", textTransform: "capitalize" },
  selectedPhaseLabel: { fontSize: 13, fontWeight: "500", marginTop: 2 },
  logBtn: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1,
  },
  logBtnText: { fontSize: 13, fontWeight: "600" },
  logRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  logLabel: { fontSize: 13 },
  logValue: { fontSize: 13, fontWeight: "600" },
  symptomsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  symptomChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  symptomText: { fontSize: 11 },
  notes: { fontSize: 13, fontStyle: "italic" },
  emptyLog: { alignItems: "center", gap: 8, paddingVertical: 16 },
  emptyText: { fontSize: 14 },
});
