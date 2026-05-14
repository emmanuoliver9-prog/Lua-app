import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientCard } from "@/components/GradientCard";
import { useColors } from "@/hooks/useColors";
import { useHaptics } from "@/hooks/useHaptics";
import { formatDate } from "@/utils/cycle";
import { MOCK_MEMORIES } from "@/constants/mockData";
import type { Memory } from "@/types";

const TYPE_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  photo: { icon: "camera", color: "#60A5FA", label: "Foto" },
  note: { icon: "edit-3", color: "#A78BFA", label: "Nota" },
  milestone: { icon: "star", color: "#FBBF24", label: "Marco" },
  anniversary: { icon: "heart", color: "#F9A8D4", label: "Aniversário" },
};

export default function MemoriesScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const haptics = useHaptics();
  const [memories, setMemories] = useState<Memory[]>(MOCK_MEMORIES);
  const [filter, setFilter] = useState<Memory["type"] | "all">("all");

  const filtered = filter === "all" ? memories : memories.filter(m => m.type === filter);

  const toggleFavorite = (id: string) => {
    haptics.light();
    setMemories(prev => prev.map(m => m.id === id ? { ...m, isFavorite: !m.isFavorite } : m));
  };

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
            <Text style={[styles.screenTitle, { color: c.foreground }]}>Memórias</Text>
            <Text style={[styles.screenSub, { color: c.mutedForeground }]}>O álbum do casal</Text>
          </View>
          <TouchableOpacity
            onPress={() => Alert.alert("Em breve", "Adicionar memórias estará disponível em breve!")}
            style={[styles.addBtn, { backgroundColor: c.primary + "20", borderColor: c.primary }]}
          >
            <Feather name="plus" size={18} color={c.primary} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pad}>
          {/* Filter Chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.filterRow}>
              {(["all", "milestone", "anniversary", "photo", "note"] as const).map((f) => {
                const config = f === "all" ? { icon: "grid", color: c.primary, label: "Todos" } : TYPE_CONFIG[f];
                const isActive = filter === f;
                return (
                  <TouchableOpacity
                    key={f}
                    onPress={() => { haptics.selection(); setFilter(f); }}
                    style={[
                      styles.filterBtn,
                      { borderColor: isActive ? config.color : c.border },
                      isActive && { backgroundColor: config.color + "20" },
                      !isActive && { backgroundColor: c.muted },
                    ]}
                  >
                    <Feather name={config.icon as any} size={14} color={isActive ? config.color : c.mutedForeground} />
                    <Text style={[styles.filterText, { color: isActive ? config.color : c.mutedForeground }]}>
                      {config.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* Memories List */}
          <View style={{ gap: 12 }}>
            {filtered.map((memory, i) => {
              const config = TYPE_CONFIG[memory.type];
              return (
                <Animated.View key={memory.id} entering={FadeInDown.delay(100 + i * 80)}>
                  <GradientCard colors={[config.color + "12", c.card]} style={{ padding: 0, overflow: "hidden" }}>
                    <View style={styles.memoryBody}>
                      <View style={[styles.memoryIconWrap, { backgroundColor: config.color + "20" }]}>
                        <Feather name={config.icon as any} size={22} color={config.color} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.memoryTitle, { color: c.foreground }]}>{memory.title}</Text>
                        <Text style={[styles.memoryDate, { color: c.mutedForeground }]}>
                          {formatDate(memory.date, { day: "numeric", month: "long", year: "numeric" })}
                        </Text>
                        <Text style={[styles.memoryDesc, { color: c.mutedForeground }]}>{memory.description}</Text>
                        <View style={[styles.memoryTag, { backgroundColor: config.color + "15" }]}>
                          <Text style={[styles.memoryTagText, { color: config.color }]}>{config.label}</Text>
                        </View>
                      </View>
                      <TouchableOpacity onPress={() => toggleFavorite(memory.id)} style={styles.favBtn}>
                        <Feather name="heart" size={20} color={memory.isFavorite ? "#F87171" : c.mutedForeground} />
                      </TouchableOpacity>
                    </View>
                  </GradientCard>
                </Animated.View>
              );
            })}
          </View>

          {/* Empty state */}
          {filtered.length === 0 && (
            <View style={styles.emptyState}>
              <Feather name="image" size={40} color={c.mutedForeground} />
              <Text style={[styles.emptyText, { color: c.mutedForeground }]}>Nenhuma memória ainda</Text>
            </View>
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
  addBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  scroll: {},
  pad: { paddingHorizontal: 20, gap: 16, paddingTop: 8 },
  filterRow: { flexDirection: "row", gap: 8, paddingRight: 20 },
  filterBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  filterText: { fontSize: 13, fontWeight: "500" },
  memoryBody: { flexDirection: "row", gap: 12, padding: 16, alignItems: "flex-start" },
  memoryIconWrap: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  memoryTitle: { fontSize: 15, fontWeight: "700" },
  memoryDate: { fontSize: 12, marginTop: 2 },
  memoryDesc: { fontSize: 13, lineHeight: 18, marginTop: 4 },
  memoryTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, alignSelf: "flex-start", marginTop: 6 },
  memoryTagText: { fontSize: 10, fontWeight: "600" },
  favBtn: { padding: 4 },
  emptyState: { alignItems: "center", gap: 12, paddingVertical: 40 },
  emptyText: { fontSize: 15 },
});
