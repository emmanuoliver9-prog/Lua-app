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
import { useApp } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";
import { useHaptics } from "@/hooks/useHaptics";

const FEATURES = [
  { icon: "zap", label: "IA de relacionamento avançada" },
  { icon: "bar-chart-2", label: "Estatísticas detalhadas do ciclo" },
  { icon: "map-pin", label: "Lugares personalizados ilimitados" },
  { icon: "bell", label: "Notificações emocionais inteligentes" },
  { icon: "heart", label: "Desafios românticos personalizados" },
  { icon: "image", label: "Álbum de memórias sem limite" },
  { icon: "moon", label: "Previsão hormonal com 3 ciclos" },
  { icon: "users", label: "Sincronização em tempo real com parceiro" },
];

const PLANS = [
  {
    id: "monthly",
    name: "Mensal",
    price: "R$ 19,90",
    period: "/mês",
    badge: null,
    savings: null,
  },
  {
    id: "yearly",
    name: "Anual",
    price: "R$ 9,90",
    period: "/mês",
    badge: "Mais popular",
    savings: "Economize 50%",
  },
];

export default function PremiumScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { unlockPremium, isPremium } = useApp();
  const haptics = useHaptics();
  const [selectedPlan, setSelectedPlan] = useState("yearly");

  const handleSubscribe = () => {
    haptics.success();
    Alert.alert(
      "Bem-vinda ao Lua Premium!",
      "Sua assinatura foi ativada com sucesso. Aproveite todas as funcionalidades exclusivas!",
      [{ text: "Continuar", onPress: () => { unlockPremium(); router.back(); } }]
    );
  };

  if (isPremium) {
    return (
      <View style={[styles.container, { backgroundColor: c.background }]}>
        <LinearGradient
          colors={["#FBBF2430", "#C084FC20", c.background]}
          style={[styles.premiumHeader, { paddingTop: insets.top + 20 }]}
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={24} color={c.foreground} />
          </TouchableOpacity>
          <Feather name="star" size={56} color={c.accent} />
          <Text style={[styles.premiumTitle, { color: c.foreground }]}>Você é Premium!</Text>
          <Text style={[styles.premiumSub, { color: c.mutedForeground }]}>
            Aproveite todas as funcionalidades exclusivas do Lua.
          </Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: c.background }]}>
      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient
          colors={["#2D1B4E", "#1A0A2E", c.background]}
          style={[styles.topSection, { paddingTop: insets.top + 16 }]}
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={24} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>

          <View style={styles.crownArea}>
            <LinearGradient colors={["#FBBF24", "#F59E0B"]} style={styles.crownBadge}>
              <Feather name="star" size={28} color="#fff" />
            </LinearGradient>
            <Text style={styles.heroTitle}>Lua Premium</Text>
            <Text style={styles.heroSub}>O relacionamento mais profundo começa aqui.</Text>
          </View>
        </LinearGradient>

        <View style={styles.pad}>
          {/* Features */}
          <Animated.View entering={FadeInDown.delay(100)}>
            <Text style={[styles.sectionTitle, { color: c.foreground }]}>Tudo incluído</Text>
            <View style={{ gap: 10 }}>
              {FEATURES.map((f, i) => (
                <View key={f.label} style={styles.featureRow}>
                  <View style={[styles.featureIcon, { backgroundColor: c.primary + "20" }]}>
                    <Feather name={f.icon as any} size={16} color={c.primary} />
                  </View>
                  <Text style={[styles.featureText, { color: c.foreground }]}>{f.label}</Text>
                  <Feather name="check" size={16} color={c.primary} />
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Plans */}
          <Animated.View entering={FadeInDown.delay(200)}>
            <Text style={[styles.sectionTitle, { color: c.foreground }]}>Escolha seu plano</Text>
            <View style={styles.plansRow}>
              {PLANS.map((plan) => (
                <TouchableOpacity
                  key={plan.id}
                  onPress={() => { haptics.selection(); setSelectedPlan(plan.id); }}
                  activeOpacity={0.8}
                  style={[
                    styles.planCard,
                    { borderColor: selectedPlan === plan.id ? c.primary : c.border },
                    selectedPlan === plan.id && { backgroundColor: c.primary + "12" },
                    selectedPlan !== plan.id && { backgroundColor: c.card },
                  ]}
                >
                  {plan.badge && (
                    <View style={[styles.planBadge, { backgroundColor: c.primary }]}>
                      <Text style={styles.planBadgeText}>{plan.badge}</Text>
                    </View>
                  )}
                  {selectedPlan === plan.id && (
                    <View style={[styles.selectedCheck, { backgroundColor: c.primary }]}>
                      <Feather name="check" size={12} color="#fff" />
                    </View>
                  )}
                  <Text style={[styles.planName, { color: c.foreground }]}>{plan.name}</Text>
                  <Text style={[styles.planPrice, { color: c.primary }]}>{plan.price}</Text>
                  <Text style={[styles.planPeriod, { color: c.mutedForeground }]}>{plan.period}</Text>
                  {plan.savings && (
                    <View style={[styles.savingsBadge, { backgroundColor: c.accent + "20" }]}>
                      <Text style={[styles.savingsText, { color: c.accent }]}>{plan.savings}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>

          {/* CTA */}
          <Animated.View entering={FadeInDown.delay(300)}>
            <TouchableOpacity onPress={handleSubscribe} activeOpacity={0.85}>
              <LinearGradient
                colors={["#FBBF24", "#F59E0B"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.ctaBtn}
              >
                <Feather name="star" size={20} color="#fff" />
                <Text style={styles.ctaText}>Assinar Lua Premium</Text>
              </LinearGradient>
            </TouchableOpacity>
            <Text style={[styles.ctaHint, { color: c.mutedForeground }]}>
              Cancele quando quiser • Sem compromisso
            </Text>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {},
  topSection: { paddingHorizontal: 20, paddingBottom: 32 },
  backBtn: { marginBottom: 24 },
  crownArea: { alignItems: "center", gap: 12 },
  crownBadge: {
    width: 80, height: 80, borderRadius: 40,
    alignItems: "center", justifyContent: "center",
  },
  heroTitle: { fontSize: 30, fontWeight: "700", color: "#FFFFFF" },
  heroSub: { fontSize: 15, color: "rgba(255,255,255,0.6)", textAlign: "center" },
  pad: { paddingHorizontal: 20, gap: 20, paddingTop: 8 },
  sectionTitle: { fontSize: 17, fontWeight: "700", marginBottom: 4 },
  featureRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  featureIcon: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  featureText: { flex: 1, fontSize: 14 },
  plansRow: { flexDirection: "row", gap: 12 },
  planCard: {
    flex: 1, padding: 16, borderRadius: 20, borderWidth: 2,
    alignItems: "center", gap: 4, position: "relative",
  },
  planBadge: {
    position: "absolute", top: -10, left: "50%",
    transform: [{ translateX: -36 }],
    paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10,
  },
  planBadgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  selectedCheck: {
    position: "absolute", top: 10, right: 10,
    width: 22, height: 22, borderRadius: 11,
    alignItems: "center", justifyContent: "center",
  },
  planName: { fontSize: 13, fontWeight: "600", marginTop: 8 },
  planPrice: { fontSize: 26, fontWeight: "700" },
  planPeriod: { fontSize: 11 },
  savingsBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, marginTop: 4 },
  savingsText: { fontSize: 11, fontWeight: "700" },
  ctaBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 10, paddingVertical: 18, borderRadius: 28,
  },
  ctaText: { color: "#fff", fontSize: 17, fontWeight: "700" },
  ctaHint: { fontSize: 12, textAlign: "center", marginTop: 8 },
  premiumHeader: { flex: 1, alignItems: "center", justifyContent: "center", gap: 16, padding: 32 },
  premiumTitle: { fontSize: 28, fontWeight: "700" },
  premiumSub: { fontSize: 15, textAlign: "center" },
});
