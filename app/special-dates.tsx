import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientCard } from "@/components/GradientCard";
import { useColors } from "@/hooks/useColors";
import { diffDays, formatDate, today } from "@/utils/cycle";
import { MOCK_SPECIAL_DATES } from "@/constants/mockData";

const TYPE_CONFIG: Record<string, { color: string; bg: string }> = {
  anniversary: { color: "#F9A8D4", bg: "#F9A8D420" },
  birthday: { color: "#FBBF24", bg: "#FBBF2420" },
  firstDate: { color: "#A78BFA", bg: "#A78BFA20" },
  trip: { color: "#34D399", bg: "#34D39920" },
  custom: { color: "#60A5FA", bg: "#60A5FA20" },
};

export default function SpecialDatesScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();

  const enriched = useMemo(() => {
    const t = today();
    return MOCK_SPECIAL_DATES.map((d) => {
      const daysLeft = diffDays(t, d.date);
      const isPast = daysLeft < 0;
      return { ...d, daysLeft, isPast };
    }).sort((a, b) => a.daysLeft - b.daysLeft);
  }, []);

  const upcoming = enriched.filter(d => !d.isPast);
  const past = enriched.filter(d => d.isPast);

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
            <Text style={[styles.screenTitle, { color: c.foreground }]}>Datas Especiais</Text>
            <Text style={[styles.screenSub, { color: c.mutedForeground }]}>Momentos que importam</Text>
          </View>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pad}>
          {/* Upcoming */}
          {upcoming.length > 0 && (
            <Animated.View entering={FadeInDown.delay(100)}>
              <Text style={[styles.sectionTitle, { color: c.foreground }]}>Próximas</Text>
              <View style={{ gap: 10 }}>
                {upcoming.map((d, i) => {
                  const cfg = TYPE_CONFIG[d.type];
                  return (
                    <Animated.View key={d.id} entering={FadeInDown.delay(100 + i * 60)}>
                      <GradientCard colors={[cfg.bg, c.card]}>
                        <View style={styles.dateRow}>
                          <View style={[styles.dateIcon, { backgroundColor: cfg.bg }]}>
                            <Feather name={d.icon as any} size={22} color={cfg.color} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.dateName, { color: c.foreground }]}>{d.name}</Text>
                            <Text style={[styles.dateStr, { color: c.mutedForeground }]}>
                              {formatDate(d.date, { day: "numeric", month: "long" })}
                            </Text>
                            {d.notes && <Text style={[styles.dateNotes, { color: c.mutedForeground }]}>{d.notes}</Text>}
                          </View>
                          <View style={[styles.countdown, { backgroundColor: cfg.bg, borderColor: cfg.color }]}>
                            {d.daysLeft === 0 ? (
                              <Text style={[styles.countdownToday, { color: cfg.color }]}>Hoje!</Text>
                            ) : (
                              <>
                                <Text style={[styles.countdownNum, { color: cfg.color }]}>{d.daysLeft}</Text>
                                <Text style={[styles.countdownLabel, { color: cfg.color }]}>dias</Text>
                              </>
                            )}
                          </View>
                        </View>
                      </GradientCard>
                    </Animated.View>
                  );
                })}
              </View>
            </Animated.View>
          )}

          {/* Past */}
          {past.length > 0 && (
            <Animated.View entering={FadeInDown.delay(300)}>
              <Text style={[styles.sectionTitle, { color: c.foreground }]}>Passadas</Text>
              <View style={{ gap: 10 }}>
                {past.map((d, i) => {
                  const cfg = TYPE_CONFIG[d.type];
                  return (
                    <GradientCard key={d.id} colors={[c.card, c.surface as string]} style={{ opacity: 0.7 }}>
                      <View style={styles.dateRow}>
                        <View style={[styles.dateIcon, { backgroundColor: c.muted }]}>
                          <Feather name={d.icon as any} size={22} color={c.mutedForeground} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={[styles.dateName, { color: c.foreground }]}>{d.name}</Text>
                          <Text style={[styles.dateStr, { color: c.mutedForeground }]}>
                            {formatDate(d.date, { day: "numeric", month: "long" })}
                          </Text>
                        </View>
                        <Text style={[styles.pastLabel, { color: c.mutedForeground }]}>
                          {Math.abs(d.daysLeft)}d atrás
                        </Text>
                      </View>
                    </GradientCard>
                  );
                })}
              </View>
            </Animated.View>
          )}
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
  sectionTitle: { fontSize: 17, fontWeight: "700", marginBottom: 4 },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  dateIcon: { width: 50, height: 50, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  dateName: { fontSize: 15, fontWeight: "700" },
  dateStr: { fontSize: 13, marginTop: 2 },
  dateNotes: { fontSize: 12, marginTop: 2 },
  countdown: {
    alignItems: "center", justifyContent: "center",
    minWidth: 52, paddingVertical: 8, paddingHorizontal: 10,
    borderRadius: 14, borderWidth: 1,
  },
  countdownNum: { fontSize: 20, fontWeight: "700", lineHeight: 22 },
  countdownLabel: { fontSize: 10, fontWeight: "500" },
  countdownToday: { fontSize: 14, fontWeight: "700" },
  pastLabel: { fontSize: 12 },
});
