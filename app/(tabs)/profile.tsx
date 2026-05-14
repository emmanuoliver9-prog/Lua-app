import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
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
import { useAuth } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";
import { useCycle } from "@/context/CycleContext";
import { useColors } from "@/hooks/useColors";
import { useHaptics } from "@/hooks/useHaptics";
import { getPhaseColor } from "@/utils/cycle";
import { MOCK_BADGES } from "@/constants/mockData";
import { LEVELS } from "@/constants/theme";

const MENU_ITEMS = [
  { icon: "settings", label: "Configurações", route: "/settings", color: "#A78BFA" },
  { icon: "bell", label: "Notificações", route: "/notifications", color: "#F9A8D4" },
  { icon: "calendar", label: "Configurar ciclo", route: "/settings", color: "#FB923C" },
  { icon: "image", label: "Memórias", route: "/memories", color: "#FBBF24" },
  { icon: "gift", label: "Datas especiais", route: "/special-dates", color: "#F472B6" },
  { icon: "map-pin", label: "Lugares", route: "/places", color: "#34D399" },
  { icon: "star", label: "Premium", route: "/premium", color: "#FBBF24" },
  { icon: "bar-chart-2", label: "Estatísticas", route: "/stats", color: "#60A5FA" },
] as const;

export default function ProfileScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { totalXP, level } = useApp();
  const { prediction, cycleData } = useCycle();
  const haptics = useHaptics();

  const phase = prediction?.currentPhase ?? "follicular";
  const phaseColor = getPhaseColor(phase);
  const levelInfo = LEVELS[level - 1];
  const nextLevel = LEVELS[level] ?? null;
  const xpForNext = nextLevel ? nextLevel.xpRequired : totalXP;
  const xpProgress = nextLevel ? ((totalXP - levelInfo.xpRequired) / (nextLevel.xpRequired - levelInfo.xpRequired)) * 100 : 100;

  const earnedBadges = MOCK_BADGES.filter(b => b.earned);

  const handleLogout = () => {
    Alert.alert("Sair", "Tem certeza que deseja sair?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: async () => { haptics.medium(); await logout(); router.replace("/(auth)/login"); } },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <LinearGradient
          colors={[phaseColor + "30", c.gradientStart, c.background]}
          style={[styles.profileHeader, { paddingTop: insets.top + 20 }]}
        >
          <Animated.View entering={FadeInDown.delay(100)} style={styles.avatarContainer}>
            <LinearGradient
              colors={[phaseColor + "60", phaseColor + "20"]}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>{user?.name?.[0] ?? "U"}</Text>
            </LinearGradient>
            <TouchableOpacity style={[styles.editAvatarBtn, { backgroundColor: c.primary }]}>
              <Feather name="camera" size={14} color="#fff" />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View entering={FadeInDown.delay(150)} style={{ alignItems: "center", gap: 4 }}>
            <Text style={[styles.profileName, { color: c.foreground }]}>{user?.name ?? "Usuária"}</Text>
            <Text style={[styles.profileEmail, { color: c.mutedForeground }]}>{user?.email}</Text>
          </Animated.View>
        </LinearGradient>

        <View style={styles.pad}>
          {/* Level & XP */}
          <Animated.View entering={FadeInDown.delay(150)}>
            <GradientCard
              colors={[levelInfo.color + "20", levelInfo.color + "08"]}
              style={{ gap: 10 }}
            >
              <View style={styles.levelRow}>
                <View style={[styles.levelBadge, { backgroundColor: levelInfo.color + "20" }]}>
                  <Text style={[styles.levelBadgeText, { color: levelInfo.color }]}>Nível {level}</Text>
                </View>
                <Text style={[styles.levelName, { color: levelInfo.color }]}>{levelInfo.name}</Text>
                <Text style={[styles.xpText, { color: c.mutedForeground }]}>{totalXP} XP</Text>
              </View>
              <View style={[styles.xpBar, { backgroundColor: c.muted }]}>
                <View style={[styles.xpFill, { width: `${xpProgress}%`, backgroundColor: levelInfo.color }]} />
              </View>
              {nextLevel && (
                <Text style={[styles.xpHint, { color: c.mutedForeground }]}>
                  {nextLevel.xpRequired - totalXP} XP para {nextLevel.name}
                </Text>
              )}
            </GradientCard>
          </Animated.View>

          {/* Badges */}
          <Animated.View entering={FadeInDown.delay(200)}>
            <Text style={[styles.sectionTitle, { color: c.foreground }]}>Conquistas</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.badgesRow}>
                {MOCK_BADGES.map((badge) => (
                  <View
                    key={badge.id}
                    style={[
                      styles.badgeItem,
                      { backgroundColor: badge.earned ? c.primary + "15" : c.muted, borderColor: badge.earned ? c.primary : c.border },
                    ]}
                  >
                    <Feather name={badge.icon as any} size={22} color={badge.earned ? c.primary : c.mutedForeground} />
                    <Text style={[styles.badgeName, { color: badge.earned ? c.foreground : c.mutedForeground }]}>{badge.name}</Text>
                    <Text style={[styles.badgeXP, { color: badge.earned ? c.accent : c.mutedForeground }]}>+{badge.xp} XP</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </Animated.View>

          {/* Cycle Info */}
          <Animated.View entering={FadeInDown.delay(220)}>
            <Text style={[styles.sectionTitle, { color: c.foreground }]}>Meu ciclo</Text>
            <GradientCard colors={[c.card, c.surface as string]}>
              <View style={styles.cycleRow}>
                <View style={styles.cycleItem}>
                  <Text style={[styles.cycleValue, { color: phaseColor }]}>{cycleData.cycleLength}</Text>
                  <Text style={[styles.cycleLabel, { color: c.mutedForeground }]}>Dias de ciclo</Text>
                </View>
                <View style={[styles.cycleDivider, { backgroundColor: c.border }]} />
                <View style={styles.cycleItem}>
                  <Text style={[styles.cycleValue, { color: c.menstrual }]}>{cycleData.periodLength}</Text>
                  <Text style={[styles.cycleLabel, { color: c.mutedForeground }]}>Dias de período</Text>
                </View>
                <View style={[styles.cycleDivider, { backgroundColor: c.border }]} />
                <View style={styles.cycleItem}>
                  <Text style={[styles.cycleValue, { color: c.accent }]}>{prediction?.daysUntilPeriod ?? "--"}</Text>
                  <Text style={[styles.cycleLabel, { color: c.mutedForeground }]}>Dias até período</Text>
                </View>
              </View>
            </GradientCard>
          </Animated.View>

          {/* Menu */}
          <Animated.View entering={FadeInDown.delay(250)}>
            <Text style={[styles.sectionTitle, { color: c.foreground }]}>Menu</Text>
            <GradientCard colors={[c.card, c.surface as string]} style={{ padding: 0, overflow: "hidden" }}>
              {MENU_ITEMS.map((item, i) => (
                <TouchableOpacity
                  key={item.label}
                  onPress={() => { haptics.light(); router.push(item.route as any); }}
                  activeOpacity={0.7}
                  style={[
                    styles.menuItem,
                    i < MENU_ITEMS.length - 1 && { borderBottomWidth: 1, borderBottomColor: c.border },
                  ]}
                >
                  <View style={[styles.menuIcon, { backgroundColor: item.color + "20" }]}>
                    <Feather name={item.icon as any} size={18} color={item.color} />
                  </View>
                  <Text style={[styles.menuLabel, { color: c.foreground }]}>{item.label}</Text>
                  <Feather name="chevron-right" size={18} color={c.mutedForeground} />
                </TouchableOpacity>
              ))}
            </GradientCard>
          </Animated.View>

          {/* Logout */}
          <Animated.View entering={FadeInDown.delay(280)}>
            <TouchableOpacity onPress={handleLogout} style={[styles.logoutBtn, { borderColor: c.destructive + "40" }]}>
              <Feather name="log-out" size={18} color={c.destructive} />
              <Text style={[styles.logoutText, { color: c.destructive }]}>Sair da conta</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {},
  profileHeader: { alignItems: "center", paddingBottom: 24, gap: 12 },
  avatarContainer: { position: "relative" },
  avatar: {
    width: 90, height: 90, borderRadius: 45,
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { fontSize: 36, fontWeight: "700", color: "#fff" },
  editAvatarBtn: {
    position: "absolute", bottom: 0, right: 0,
    width: 28, height: 28, borderRadius: 14,
    alignItems: "center", justifyContent: "center",
  },
  profileName: { fontSize: 22, fontWeight: "700" },
  profileEmail: { fontSize: 14 },
  pad: { paddingHorizontal: 20, gap: 16, paddingTop: 8 },
  levelRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  levelBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  levelBadgeText: { fontSize: 12, fontWeight: "700" },
  levelName: { fontSize: 15, fontWeight: "600", flex: 1 },
  xpText: { fontSize: 13 },
  xpBar: { height: 6, borderRadius: 3, overflow: "hidden" },
  xpFill: { height: 6, borderRadius: 3 },
  xpHint: { fontSize: 11, textAlign: "center" },
  sectionTitle: { fontSize: 17, fontWeight: "700", marginTop: 4 },
  badgesRow: { flexDirection: "row", gap: 10, paddingRight: 20 },
  badgeItem: {
    width: 90, alignItems: "center", padding: 12, borderRadius: 16,
    borderWidth: 1, gap: 4,
  },
  badgeName: { fontSize: 11, textAlign: "center", fontWeight: "600" },
  badgeXP: { fontSize: 10, fontWeight: "700" },
  cycleRow: { flexDirection: "row", alignItems: "center" },
  cycleItem: { flex: 1, alignItems: "center", gap: 4 },
  cycleValue: { fontSize: 26, fontWeight: "700" },
  cycleLabel: { fontSize: 11, textAlign: "center" },
  cycleDivider: { width: 1, height: 40 },
  menuItem: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16 },
  menuIcon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: "500" },
  logoutBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, paddingVertical: 14, borderRadius: 14, borderWidth: 1, marginBottom: 8,
  },
  logoutText: { fontSize: 15, fontWeight: "600" },
});
