import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientCard } from "@/components/GradientCard";
import { MoodPicker } from "@/components/MoodPicker";
import { useAuth } from "@/context/AuthContext";
import { useCycle } from "@/context/CycleContext";
import { useColors } from "@/hooks/useColors";
import { useHaptics } from "@/hooks/useHaptics";
import { formatDate, today } from "@/utils/cycle";
import { getPhaseColor } from "@/utils/cycle";
import { moodColors, phaseNames } from "@/constants/theme";
import type { MoodLevel } from "@/types";

const CHALLENGE_ITEMS = [
  { id: "1", icon: "heart", text: "Dizer 'eu te amo' três vezes hoje", xp: 10, done: false },
  { id: "2", icon: "coffee", text: "Tomar um café juntos sem celular", xp: 20, done: true },
  { id: "3", icon: "message-circle", text: "Compartilhar uma memória boa", xp: 15, done: false },
];

export default function PartnerScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { user, partner, connectPartner, disconnectPartner } = useAuth();
  const { prediction } = useCycle();
  const haptics = useHaptics();
  const [inviteCode, setInviteCode] = useState("");
  const [myMood, setMyMood] = useState<MoodLevel>(3);
  const [moodShared, setMoodShared] = useState(false);
  const [challenges, setChallenges] = useState(CHALLENGE_ITEMS);

  const daysTogether = 425;
  const connectionStreak = 12;
  const syncScore = 87;

  const handleConnect = async () => {
    if (inviteCode.length < 4) { Alert.alert("Digite o código do seu parceiro"); return; }
    haptics.medium();
    const ok = await connectPartner(inviteCode.trim().toUpperCase());
    if (ok) {
      haptics.success();
      Alert.alert("Conectados!", "Vocês estão agora conectados no Lua.");
    }
  };

  const handleShareMood = () => {
    haptics.success();
    setMoodShared(true);
    setTimeout(() => setMoodShared(false), 3000);
  };

  const toggleChallenge = (id: string) => {
    haptics.light();
    setChallenges(prev => prev.map(c => c.id === id ? { ...c, done: !c.done } : c));
  };

  if (!partner) {
    return (
      <View style={[styles.container, { backgroundColor: c.background }]}>
        <LinearGradient
          colors={[c.gradientStart, c.background]}
          style={[styles.topGradient, { paddingTop: insets.top + 16 }]}
        >
          <Text style={[styles.screenTitle, { color: c.foreground }]}>Parceiro</Text>
          <Text style={[styles.screenSub, { color: c.mutedForeground }]}>Conecte-se com quem você ama</Text>
        </LinearGradient>

        <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}>
          <View style={styles.pad}>
            <Animated.View entering={FadeInDown.delay(100)} style={styles.connectCard}>
              <LinearGradient
                colors={["rgba(192,132,252,0.2)", "rgba(249,168,212,0.1)"]}
                style={styles.connectBanner}
              >
                <Feather name="heart" size={48} color={c.luaPink} />
                <Text style={[styles.connectTitle, { color: c.foreground }]}>Convide seu parceiro</Text>
                <Text style={[styles.connectSubtitle, { color: c.mutedForeground }]}>
                  Compartilhe seu código ou insira o dele para se conectar
                </Text>

                <View style={[styles.myCode, { backgroundColor: c.primary + "20", borderColor: c.primary }]}>
                  <Text style={[styles.myCodeLabel, { color: c.mutedForeground }]}>Seu código</Text>
                  <Text style={[styles.myCodeValue, { color: c.primary }]}>{user?.partnerCode ?? "------"}</Text>
                </View>
              </LinearGradient>

              <View style={styles.pad}>
                <Text style={[styles.label, { color: c.foreground }]}>Código do parceiro</Text>
                <View style={[styles.inputWrap, { backgroundColor: c.muted, borderColor: c.border }]}>
                  <Feather name="link" size={18} color={c.mutedForeground} />
                  <TextInput
                    style={[styles.codeInput, { color: c.foreground }]}
                    placeholder="Ex: XYZ123"
                    placeholderTextColor={c.mutedForeground}
                    value={inviteCode}
                    onChangeText={setInviteCode}
                    autoCapitalize="characters"
                    maxLength={8}
                  />
                </View>
                <TouchableOpacity onPress={handleConnect} activeOpacity={0.85}>
                  <LinearGradient colors={["#C084FC", "#A855F7"]} style={styles.connectBtn}>
                    <Text style={styles.connectBtnText}>Conectar</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </View>
    );
  }

  const partnerPhaseColor = partner.cyclePhase ? getPhaseColor(partner.cyclePhase) : c.primary;

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <LinearGradient
        colors={[c.gradientStart, c.background]}
        style={[styles.topGradient, { paddingTop: insets.top + 16 }]}
      >
        <Text style={[styles.screenTitle, { color: c.foreground }]}>Parceiro</Text>
        <Text style={[styles.screenSub, { color: c.mutedForeground }]}>Sua conexão emocional</Text>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pad}>
          {/* Partner Card */}
          <Animated.View entering={FadeInDown.delay(100)}>
            <LinearGradient
              colors={[partnerPhaseColor + "25", "rgba(26,15,46,0.05)"]}
              style={[styles.partnerBanner, { borderColor: partnerPhaseColor + "40" }]}
            >
              <View style={[styles.bigAvatar, { backgroundColor: c.luaPink + "30" }]}>
                <Text style={styles.bigInitial}>{partner.name[0]}</Text>
              </View>
              <Text style={[styles.partnerName, { color: c.foreground }]}>{partner.name}</Text>
              <View style={[styles.phaseBadge, { backgroundColor: partnerPhaseColor + "20", borderColor: partnerPhaseColor }]}>
                <Text style={[styles.phaseText, { color: partnerPhaseColor }]}>
                  {partner.cyclePhase ? phaseNames[partner.cyclePhase] : "Fase desconhecida"}
                </Text>
              </View>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: c.foreground }]}>{daysTogether}</Text>
                  <Text style={[styles.statLabel, { color: c.mutedForeground }]}>Dias juntos</Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: c.border }]} />
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: c.foreground }]}>{connectionStreak}</Text>
                  <Text style={[styles.statLabel, { color: c.mutedForeground }]}>Streak</Text>
                </View>
                <View style={[styles.statDivider, { backgroundColor: c.border }]} />
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: c.primary }]}>{syncScore}%</Text>
                  <Text style={[styles.statLabel, { color: c.mutedForeground }]}>Sintonia</Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Mood Share */}
          <Animated.View entering={FadeInDown.delay(150)}>
            <Text style={[styles.sectionTitle, { color: c.foreground }]}>Seu humor hoje</Text>
            <GradientCard colors={[c.card, c.surface as string]} style={{ gap: 16 }}>
              <MoodPicker value={myMood} onChange={setMyMood} />
              <TouchableOpacity
                onPress={handleShareMood}
                style={[styles.shareBtn, { backgroundColor: c.primary + "15", borderColor: c.primary }]}
              >
                <Feather name={moodShared ? "check" : "send"} size={16} color={c.primary} />
                <Text style={[styles.shareBtnText, { color: c.primary }]}>
                  {moodShared ? "Humor compartilhado!" : "Compartilhar humor"}
                </Text>
              </TouchableOpacity>
            </GradientCard>
          </Animated.View>

          {/* Weekly Challenges */}
          <Animated.View entering={FadeInDown.delay(200)}>
            <Text style={[styles.sectionTitle, { color: c.foreground }]}>Desafios da semana</Text>
            <View style={{ gap: 10 }}>
              {challenges.map((ch) => (
                <TouchableOpacity
                  key={ch.id}
                  onPress={() => toggleChallenge(ch.id)}
                  activeOpacity={0.8}
                >
                  <GradientCard
                    colors={ch.done ? [c.primary + "15", c.primary + "08"] : [c.card, c.surface as string]}
                    style={{ padding: 14 }}
                  >
                    <View style={styles.challengeRow}>
                      <View style={[styles.challengeCheck, {
                        backgroundColor: ch.done ? c.primary + "20" : c.muted,
                        borderColor: ch.done ? c.primary : c.border,
                      }]}>
                        <Feather name={ch.done ? "check" : ch.icon as any} size={16} color={ch.done ? c.primary : c.mutedForeground} />
                      </View>
                      <Text style={[styles.challengeText, { color: ch.done ? c.mutedForeground : c.foreground }, ch.done && { textDecorationLine: "line-through" }]}>
                        {ch.text}
                      </Text>
                      <View style={[styles.xpBadge, { backgroundColor: c.accent + "20" }]}>
                        <Text style={[styles.xpText, { color: c.accent }]}>+{ch.xp} XP</Text>
                      </View>
                    </View>
                  </GradientCard>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* Disconnect */}
          <TouchableOpacity
            onPress={() => Alert.alert("Desconectar?", "Isso removerá a conexão com seu parceiro.", [
              { text: "Cancelar", style: "cancel" },
              { text: "Desconectar", style: "destructive", onPress: () => disconnectPartner() },
            ])}
            style={[styles.disconnectBtn, { borderColor: c.border }]}
          >
            <Text style={[styles.disconnectText, { color: c.mutedForeground }]}>Desconectar parceiro</Text>
          </TouchableOpacity>
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
  connectCard: { overflow: "hidden", borderRadius: 20 },
  connectBanner: { alignItems: "center", padding: 32, gap: 12 },
  connectTitle: { fontSize: 22, fontWeight: "700" },
  connectSubtitle: { fontSize: 14, textAlign: "center", lineHeight: 20 },
  myCode: {
    paddingHorizontal: 24, paddingVertical: 12, borderRadius: 16,
    borderWidth: 1, alignItems: "center", gap: 4,
  },
  myCodeLabel: { fontSize: 12 },
  myCodeValue: { fontSize: 26, fontWeight: "700", letterSpacing: 4 },
  label: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
  inputWrap: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 16, height: 52, borderRadius: 14, borderWidth: 1, marginBottom: 12,
  },
  codeInput: { flex: 1, fontSize: 18, fontWeight: "600", letterSpacing: 4 },
  connectBtn: { height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center" },
  connectBtnText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  partnerBanner: {
    borderRadius: 20, padding: 24, alignItems: "center", gap: 12,
    borderWidth: 1, marginBottom: 0,
  },
  bigAvatar: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center" },
  bigInitial: { fontSize: 32, fontWeight: "700", color: "#F9A8D4" },
  partnerName: { fontSize: 22, fontWeight: "700" },
  phaseBadge: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20,
    borderWidth: 1,
  },
  phaseText: { fontSize: 13, fontWeight: "600" },
  statsRow: { flexDirection: "row", gap: 24, alignItems: "center", marginTop: 8 },
  statItem: { alignItems: "center", gap: 2 },
  statValue: { fontSize: 22, fontWeight: "700" },
  statLabel: { fontSize: 11 },
  statDivider: { width: 1, height: 32 },
  sectionTitle: { fontSize: 17, fontWeight: "700", marginTop: 8, marginBottom: 4 },
  shareBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, paddingVertical: 12, borderRadius: 14, borderWidth: 1,
  },
  shareBtnText: { fontSize: 14, fontWeight: "600" },
  challengeRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  challengeCheck: {
    width: 34, height: 34, borderRadius: 17,
    alignItems: "center", justifyContent: "center", borderWidth: 1,
  },
  challengeText: { flex: 1, fontSize: 14 },
  xpBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  xpText: { fontSize: 11, fontWeight: "700" },
  disconnectBtn: {
    paddingVertical: 14, borderRadius: 14,
    borderWidth: 1, alignItems: "center", marginTop: 8,
  },
  disconnectText: { fontSize: 14 },
});
