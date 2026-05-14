import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useApp } from "@/context/AppContext";
import { useHaptics } from "@/hooks/useHaptics";

const { width, height } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    icon: "moon",
    title: "Bem-vinda ao Lua",
    subtitle: "O app de casais que entende você de dentro para fora.",
    gradientColors: ["#1A0A2E", "#2D1B4E"] as [string, string],
    accentColor: "#C084FC",
  },
  {
    id: "2",
    icon: "activity",
    title: "Seu ciclo, sua força",
    subtitle: "Acompanhe fases, sintomas e humor com inteligência emocional.",
    gradientColors: ["#1A0A2E", "#3B1C5C"] as [string, string],
    accentColor: "#F9A8D4",
  },
  {
    id: "3",
    icon: "heart",
    title: "Amor com consciência",
    subtitle: "Ajude seu parceiro a entender seu universo e fortaleça a conexão.",
    gradientColors: ["#1A0A2E", "#2D1B3D"] as [string, string],
    accentColor: "#FBBF24",
  },
  {
    id: "4",
    icon: "star",
    title: "Juntos, mais fortes",
    subtitle: "Compartilhe humor, construa memórias e cresçam como casal.",
    gradientColors: ["#1A0A2E", "#1A0F2E"] as [string, string],
    accentColor: "#A78BFA",
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatRef = useRef<FlatList>(null);
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useApp();
  const haptics = useHaptics();

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0]) setCurrentIndex(viewableItems[0].index ?? 0);
  }).current;

  const goNext = () => {
    haptics.light();
    if (currentIndex < SLIDES.length - 1) {
      flatRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      completeOnboarding();
      router.replace("/(auth)/login");
    }
  };

  const skip = () => {
    haptics.light();
    completeOnboarding();
    router.replace("/(auth)/login");
  };

  const slide = SLIDES[currentIndex];

  return (
    <LinearGradient
      colors={slide.gradientColors}
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      <TouchableOpacity onPress={skip} style={[styles.skipBtn, { top: insets.top + 16 }]}>
        <Text style={styles.skipText}>Pular</Text>
      </TouchableOpacity>

      <FlatList
        ref={flatRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={{ width }}>
            <SlideContent slide={item} />
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i === currentIndex ? slide.accentColor : "rgba(255,255,255,0.3)" },
                i === currentIndex && { width: 24 },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity onPress={goNext} activeOpacity={0.85}>
          <LinearGradient
            colors={["#C084FC", "#A855F7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextBtn}
          >
            <Text style={styles.nextText}>
              {currentIndex === SLIDES.length - 1 ? "Começar" : "Próximo"}
            </Text>
            <Feather name="arrow-right" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

function SlideContent({ slide }: { slide: typeof SLIDES[0] }) {
  return (
    <View style={styles.slideContent}>
      <Animated.View entering={FadeIn.duration(600)} style={[styles.iconContainer, { borderColor: slide.accentColor + "40" }]}>
        <LinearGradient
          colors={[slide.accentColor + "30", slide.accentColor + "10"]}
          style={styles.iconBg}
        >
          <Feather name={slide.icon as any} size={56} color={slide.accentColor} />
        </LinearGradient>
      </Animated.View>

      <Animated.Text entering={FadeInUp.delay(200).duration(600)} style={styles.title}>
        {slide.title}
      </Animated.Text>
      <Animated.Text entering={FadeInDown.delay(300).duration(600)} style={styles.subtitle}>
        {slide.subtitle}
      </Animated.Text>

      <View style={styles.orbs}>
        <View style={[styles.orb, { backgroundColor: slide.accentColor + "15", width: 200, height: 200, top: -60, right: -60 }]} />
        <View style={[styles.orb, { backgroundColor: slide.accentColor + "10", width: 120, height: 120, bottom: 40, left: -40 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  skipBtn: { position: "absolute", right: 20, zIndex: 10 },
  skipText: { color: "rgba(255,255,255,0.6)", fontSize: 15, fontWeight: "500" },
  slideContent: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    overflow: "hidden",
    marginBottom: 48,
  },
  iconBg: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 32, fontWeight: "700", color: "#FFFFFF", textAlign: "center", marginBottom: 16, lineHeight: 40 },
  subtitle: { fontSize: 17, color: "rgba(255,255,255,0.7)", textAlign: "center", lineHeight: 26 },
  orbs: { ...StyleSheet.absoluteFillObject, zIndex: -1 },
  orb: { position: "absolute", borderRadius: 999 },
  footer: { paddingHorizontal: 32, paddingBottom: 32, gap: 24 },
  dots: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
  dot: { height: 6, borderRadius: 3, width: 8, backgroundColor: "rgba(255,255,255,0.3)" },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 18,
    borderRadius: 28,
  },
  nextText: { color: "#FFFFFF", fontSize: 17, fontWeight: "700" },
});
