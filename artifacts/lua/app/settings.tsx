import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
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
import { useAuth } from "@/context/AuthContext";
import { useCycle } from "@/context/CycleContext";
import { useColors } from "@/hooks/useColors";
import { useHaptics } from "@/hooks/useHaptics";

export default function SettingsScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { user, updateProfile } = useAuth();
  const { cycleData, updateCycleSettings } = useCycle();
  const haptics = useHaptics();

  const [cycleLength, setCycleLength] = useState(String(cycleData.cycleLength));
  const [periodLength, setPeriodLength] = useState(String(cycleData.periodLength));

  const handleSaveCycle = async () => {
    const cl = parseInt(cycleLength, 10);
    const pl = parseInt(periodLength, 10);
    if (isNaN(cl) || cl < 21 || cl > 45) { Alert.alert("Ciclo inválido", "O ciclo deve ter entre 21 e 45 dias."); return; }
    if (isNaN(pl) || pl < 2 || pl > 10) { Alert.alert("Período inválido", "O período deve ter entre 2 e 10 dias."); return; }
    haptics.success();
    await updateCycleSettings(cycleData.lastPeriodDate, cl, pl);
    Alert.alert("Salvo!", "Suas configurações de ciclo foram atualizadas.");
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
          <Text style={[styles.screenTitle, { color: c.foreground }]}>Configurações</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pad}>
          {/* Cycle Settings */}
          <Animated.View entering={FadeInDown.delay(100)}>
            <Text style={[styles.sectionTitle, { color: c.foreground }]}>Meu ciclo</Text>
            <GradientCard colors={[c.card, c.surface as string]} style={{ gap: 16 }}>
              <View style={styles.inputRow}>
                <Text style={[styles.inputLabel, { color: c.foreground }]}>Duração do ciclo</Text>
                <View style={[styles.numInput, { borderColor: c.border, backgroundColor: c.muted }]}>
                  <TextInput
                    style={[styles.numText, { color: c.foreground }]}
                    value={cycleLength}
                    onChangeText={setCycleLength}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                  <Text style={[styles.numUnit, { color: c.mutedForeground }]}>dias</Text>
                </View>
              </View>
              <View style={styles.inputRow}>
                <Text style={[styles.inputLabel, { color: c.foreground }]}>Duração do período</Text>
                <View style={[styles.numInput, { borderColor: c.border, backgroundColor: c.muted }]}>
                  <TextInput
                    style={[styles.numText, { color: c.foreground }]}
                    value={periodLength}
                    onChangeText={setPeriodLength}
                    keyboardType="number-pad"
                    maxLength={2}
                  />
                  <Text style={[styles.numUnit, { color: c.mutedForeground }]}>dias</Text>
                </View>
              </View>
              <TouchableOpacity onPress={handleSaveCycle} activeOpacity={0.85}>
                <LinearGradient colors={["#C084FC", "#A855F7"]} style={styles.saveBtn}>
                  <Text style={styles.saveBtnText}>Salvar</Text>
                </LinearGradient>
              </TouchableOpacity>
            </GradientCard>
          </Animated.View>

          {/* Notifications */}
          <Animated.View entering={FadeInDown.delay(150)}>
            <Text style={[styles.sectionTitle, { color: c.foreground }]}>Notificações</Text>
            <GradientCard colors={[c.card, c.surface as string]} style={{ padding: 0, overflow: "hidden" }}>
              <TouchableOpacity
                onPress={() => { haptics.light(); router.push("/notifications"); }}
                activeOpacity={0.7}
                style={styles.menuItem}
              >
                <View style={[styles.menuIcon, { backgroundColor: "#F9A8D420" }]}>
                  <Feather name="bell" size={18} color="#F9A8D4" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.menuLabel, { color: c.foreground }]}>Gerenciar alertas</Text>
                  <Text style={[styles.menuSub, { color: c.mutedForeground }]}>Período, TPM, ovulação, humor</Text>
                </View>
                <Feather name="chevron-right" size={16} color={c.mutedForeground} />
              </TouchableOpacity>
            </GradientCard>
          </Animated.View>

          {/* Privacy */}
          <Animated.View entering={FadeInDown.delay(200)}>
            <Text style={[styles.sectionTitle, { color: c.foreground }]}>Privacidade</Text>
            <GradientCard colors={[c.card, c.surface as string]} style={{ padding: 0, overflow: "hidden" }}>
              {[
                { icon: "shield", label: "PIN de segurança", color: "#60A5FA" },
                { icon: "eye-off", label: "Modo privado", color: "#A78BFA" },
                { icon: "trash-2", label: "Apagar todos os dados", color: c.destructive },
              ].map((item, i, arr) => (
                <TouchableOpacity
                  key={item.label}
                  onPress={() => {
                    if (item.label === "Apagar todos os dados") {
                      Alert.alert("Apagar dados?", "Esta ação é irreversível.", [
                        { text: "Cancelar", style: "cancel" },
                        { text: "Apagar", style: "destructive" },
                      ]);
                    } else {
                      Alert.alert("Em breve", "Esta funcionalidade estará disponível na próxima versão.");
                    }
                  }}
                  style={[
                    styles.menuItem,
                    i < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: c.border },
                  ]}
                  activeOpacity={0.7}
                >
                  <View style={[styles.menuIcon, { backgroundColor: item.color + "20" }]}>
                    <Feather name={item.icon as any} size={18} color={item.color} />
                  </View>
                  <Text style={[styles.menuLabel, { color: item.label === "Apagar todos os dados" ? c.destructive : c.foreground }]}>
                    {item.label}
                  </Text>
                  <Feather name="chevron-right" size={16} color={c.mutedForeground} />
                </TouchableOpacity>
              ))}
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
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  screenTitle: { fontSize: 20, fontWeight: "700" },
  scroll: {},
  pad: { paddingHorizontal: 20, gap: 16, paddingTop: 8 },
  sectionTitle: { fontSize: 17, fontWeight: "700", marginTop: 4 },
  inputRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  inputLabel: { fontSize: 15, fontWeight: "500" },
  numInput: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1,
  },
  numText: { fontSize: 18, fontWeight: "700", width: 32, textAlign: "center" },
  numUnit: { fontSize: 13 },
  saveBtn: { paddingVertical: 14, borderRadius: 14, alignItems: "center" },
  saveBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
  menuItem: { flexDirection: "row", alignItems: "center", gap: 14, padding: 16 },
  menuSub: { fontSize: 12, marginTop: 2 },
  menuIcon: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: "500" },
});
