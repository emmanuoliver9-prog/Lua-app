import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientCard } from "@/components/GradientCard";
import { useNotifications } from "@/context/NotificationContext";
import { useCycle } from "@/context/CycleContext";
import { useColors } from "@/hooks/useColors";
import { useHaptics } from "@/hooks/useHaptics";

const NOTIF_CONFIG = [
  {
    key: "mood" as const,
    icon: "smile",
    color: "#A78BFA",
    title: "Lembrete de humor",
    description: "Todo dia às 20h para registrar como você está.",
  },
  {
    key: "period" as const,
    icon: "calendar",
    color: "#F87171",
    title: "Alerta de período",
    description: "3 dias e 1 dia antes da menstruação.",
  },
  {
    key: "pms" as const,
    icon: "alert-circle",
    color: "#F472B6",
    title: "Alerta de TPM",
    description: "Aviso no início da fase pré-menstrual.",
  },
  {
    key: "ovulation" as const,
    icon: "sun",
    color: "#FBBF24",
    title: "Fase de ovulação",
    description: "Notificação no dia da ovulação — energia máxima!",
  },
  {
    key: "partner" as const,
    icon: "heart",
    color: "#F9A8D4",
    title: "Conexão com parceiro",
    description: "Lembrete semanal para compartilhar seu humor.",
  },
] as const;

export default function NotificationsScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const haptics = useHaptics();
  const { prefs, updatePref, requestAndSchedule } = useNotifications();
  const { prediction } = useCycle();

  const handleToggle = async (key: typeof NOTIF_CONFIG[number]["key"], value: boolean) => {
    haptics.light();

    if (value && !prefs.hasPermission) {
      const ok = await requestAndSchedule({
        pmsStartDate: prediction?.pmsStart ?? "",
        nextPeriodDate: prediction?.nextPeriodDate ?? "",
        ovulationDate: prediction?.ovulationDate ?? "",
      });
      if (!ok) {
        Alert.alert(
          "Permissão necessária",
          "Permita notificações nas configurações do seu celular para receber alertas do Lua.",
          [{ text: "OK" }]
        );
        return;
      }
    }

    await updatePref(key, value);
  };

  const handleEnableAll = async () => {
    haptics.medium();
    const ok = await requestAndSchedule({
      pmsStartDate: prediction?.pmsStart ?? "",
      nextPeriodDate: prediction?.nextPeriodDate ?? "",
      ovulationDate: prediction?.ovulationDate ?? "",
    });
    if (ok) {
      for (const item of NOTIF_CONFIG) {
        await updatePref(item.key, true);
      }
      Alert.alert("Notificações ativadas!", "Você receberá alertas personalizados do Lua.");
    } else {
      Alert.alert("Permissão negada", "Ative as notificações nas configurações do celular.");
    }
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
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={[styles.screenTitle, { color: c.foreground }]}>Notificações</Text>
            <Text style={[styles.screenSub, { color: c.mutedForeground }]}>Alertas inteligentes do ciclo</Text>
          </View>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pad}>
          {/* Banner de status de permissão */}
          <Animated.View entering={FadeInDown.delay(80)}>
            {prefs.hasPermission ? (
              <LinearGradient
                colors={["rgba(34,197,94,0.15)", "rgba(34,197,94,0.05)"]}
                style={[styles.permBanner, { borderColor: "rgba(34,197,94,0.3)" }]}
              >
                <Feather name="check-circle" size={18} color="#22C55E" />
                <Text style={[styles.permText, { color: "#22C55E" }]}>
                  Notificações ativas neste dispositivo
                </Text>
              </LinearGradient>
            ) : (
              <TouchableOpacity onPress={handleEnableAll} activeOpacity={0.85}>
                <LinearGradient
                  colors={["#C084FC", "#A855F7"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.enableAllBtn}
                >
                  <Feather name="bell" size={18} color="#fff" />
                  <Text style={styles.enableAllText}>Ativar todas as notificações</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </Animated.View>

          {/* Lista de tipos de notificação */}
          <Animated.View entering={FadeInDown.delay(150)}>
            <Text style={[styles.sectionTitle, { color: c.foreground }]}>Tipos de alerta</Text>
            <GradientCard colors={[c.card, c.surface as string]} style={{ padding: 0, overflow: "hidden" }}>
              {NOTIF_CONFIG.map((item, i) => (
                <View
                  key={item.key}
                  style={[
                    styles.notifRow,
                    i < NOTIF_CONFIG.length - 1 && { borderBottomWidth: 1, borderBottomColor: c.border },
                  ]}
                >
                  <View style={[styles.notifIcon, { backgroundColor: item.color + "20" }]}>
                    <Feather name={item.icon as any} size={18} color={item.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.notifTitle, { color: c.foreground }]}>{item.title}</Text>
                    <Text style={[styles.notifDesc, { color: c.mutedForeground }]}>{item.description}</Text>
                  </View>
                  <Switch
                    value={prefs[item.key]}
                    onValueChange={(v) => handleToggle(item.key, v)}
                    trackColor={{ false: c.muted, true: item.color + "80" }}
                    thumbColor={prefs[item.key] ? item.color : c.mutedForeground}
                  />
                </View>
              ))}
            </GradientCard>
          </Animated.View>

          {/* Próximos alertas agendados */}
          {prediction && (
            <Animated.View entering={FadeInDown.delay(250)}>
              <Text style={[styles.sectionTitle, { color: c.foreground }]}>Próximos alertas</Text>
              <View style={{ gap: 10 }}>
                {[
                  {
                    icon: "alert-circle",
                    color: "#F472B6",
                    label: "Alerta de TPM",
                    date: prediction.pmsStart,
                    enabled: prefs.pms,
                  },
                  {
                    icon: "calendar",
                    color: "#F87171",
                    label: "Próximo período",
                    date: prediction.nextPeriodDate,
                    enabled: prefs.period,
                  },
                  {
                    icon: "sun",
                    color: "#FBBF24",
                    label: "Ovulação",
                    date: prediction.ovulationDate,
                    enabled: prefs.ovulation,
                  },
                ].map((alert) => (
                  <GradientCard
                    key={alert.label}
                    colors={[alert.enabled ? alert.color + "12" : c.card, c.card]}
                    style={{ padding: 14, opacity: alert.enabled ? 1 : 0.5 }}
                  >
                    <View style={styles.alertRow}>
                      <View style={[styles.alertIcon, { backgroundColor: alert.color + "20" }]}>
                        <Feather name={alert.icon as any} size={16} color={alert.color} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.alertLabel, { color: c.foreground }]}>{alert.label}</Text>
                        <Text style={[styles.alertDate, { color: c.mutedForeground }]}>
                          {new Date(alert.date + "T00:00:00").toLocaleDateString("pt-BR", {
                            day: "numeric",
                            month: "long",
                          })}
                        </Text>
                      </View>
                      <View style={[styles.alertStatus, {
                        backgroundColor: alert.enabled ? alert.color + "20" : c.muted,
                      }]}>
                        <Feather
                          name={alert.enabled ? "bell" : "bell-off"}
                          size={14}
                          color={alert.enabled ? alert.color : c.mutedForeground}
                        />
                      </View>
                    </View>
                  </GradientCard>
                ))}
              </View>
            </Animated.View>
          )}

          {/* Dica */}
          <Animated.View entering={FadeInDown.delay(300)}>
            <GradientCard
              colors={["rgba(192,132,252,0.1)", "rgba(192,132,252,0.04)"]}
              style={{ padding: 14 }}
            >
              <View style={styles.tipRow}>
                <Feather name="info" size={16} color={c.primary} />
                <Text style={[styles.tipText, { color: c.mutedForeground }]}>
                  As notificações são agendadas localmente no seu celular e funcionam mesmo sem internet.
                </Text>
              </View>
            </GradientCard>
          </Animated.View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topGradient: { paddingHorizontal: 20, paddingBottom: 16 },
  headerRow: { flexDirection: "row", alignItems: "center" },
  screenTitle: { fontSize: 20, fontWeight: "700" },
  screenSub: { fontSize: 13, marginTop: 2 },
  scroll: {},
  pad: { paddingHorizontal: 20, gap: 16, paddingTop: 8 },
  permBanner: {
    flexDirection: "row", alignItems: "center", gap: 10,
    padding: 14, borderRadius: 14, borderWidth: 1,
  },
  permText: { fontSize: 14, fontWeight: "500", flex: 1 },
  enableAllBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 10, paddingVertical: 16, borderRadius: 14,
  },
  enableAllText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  sectionTitle: { fontSize: 17, fontWeight: "700", marginTop: 4 },
  notifRow: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16 },
  notifIcon: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  notifTitle: { fontSize: 14, fontWeight: "600" },
  notifDesc: { fontSize: 12, marginTop: 2, lineHeight: 16 },
  alertRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  alertIcon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  alertLabel: { fontSize: 14, fontWeight: "600" },
  alertDate: { fontSize: 12, marginTop: 2, textTransform: "capitalize" },
  alertStatus: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  tipRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  tipText: { flex: 1, fontSize: 13, lineHeight: 18 },
});
