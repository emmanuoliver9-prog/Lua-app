import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useHaptics } from "@/hooks/useHaptics";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const insets = useSafeAreaInsets();
  const haptics = useHaptics();

  const handleLogin = async () => {
    if (!email.trim()) { Alert.alert("E-mail obrigatório"); return; }
    if (!password) { Alert.alert("Senha obrigatória"); return; }
    haptics.medium();
    setLoading(true);
    const ok = await login(email.trim(), password);
    setLoading(false);
    if (ok) {
      haptics.success();
      router.replace("/(tabs)");
    } else {
      haptics.error();
      Alert.alert("Conta não encontrada", "Crie uma conta para continuar.");
    }
  };

  return (
    <LinearGradient colors={["#0F0A1A", "#1A0F2E", "#0F0A1A"]} style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={[styles.content, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 24 }]}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View entering={FadeInDown.delay(100).duration(600)} style={styles.header}>
            <View style={styles.moonIcon}>
              <Feather name="moon" size={36} color="#C084FC" />
            </View>
            <Text style={styles.brand}>Lua</Text>
            <Text style={styles.tagline}>Bem-vinda de volta</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(200).duration(600)} style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>
              <View style={styles.inputWrap}>
                <Feather name="mail" size={18} color="#7C6B9B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="seu@email.com"
                  placeholderTextColor="#7C6B9B"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.inputWrap}>
                <Feather name="lock" size={18} color="#7C6B9B" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="••••••••"
                  placeholderTextColor="#7C6B9B"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Feather name={showPassword ? "eye-off" : "eye"} size={18} color="#7C6B9B" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity activeOpacity={0.85} onPress={handleLogin} disabled={loading}>
              <LinearGradient
                colors={["#C084FC", "#A855F7"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.loginBtn}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.loginBtnText}>Entrar</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.footer}>
            <Text style={styles.footerText}>Ainda não tem conta?</Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text style={styles.footerLink}>Criar conta</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingHorizontal: 28, flexGrow: 1 },
  header: { alignItems: "center", marginBottom: 48 },
  moonIcon: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "rgba(192,132,252,0.15)",
    borderWidth: 1, borderColor: "rgba(192,132,252,0.3)",
    alignItems: "center", justifyContent: "center", marginBottom: 16,
  },
  brand: { fontSize: 38, fontWeight: "700", color: "#FFFFFF", letterSpacing: 2 },
  tagline: { fontSize: 16, color: "rgba(255,255,255,0.5)", marginTop: 4 },
  form: { gap: 20 },
  inputGroup: { gap: 8 },
  label: { color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: "500" },
  inputWrap: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 14, borderWidth: 1, borderColor: "rgba(192,132,252,0.2)",
    paddingHorizontal: 14, height: 52,
  },
  inputIcon: { marginRight: 10 },
  input: { color: "#FFFFFF", fontSize: 16, flex: 1 },
  eyeBtn: { padding: 4 },
  loginBtn: { height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center", marginTop: 8 },
  loginBtnText: { color: "#FFFFFF", fontSize: 17, fontWeight: "700" },
  footer: { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: 40 },
  footerText: { color: "rgba(255,255,255,0.5)", fontSize: 15 },
  footerLink: { color: "#C084FC", fontSize: 15, fontWeight: "600" },
});
