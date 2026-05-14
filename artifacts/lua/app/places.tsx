import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInRight } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { GradientCard } from "@/components/GradientCard";
import { useCycle } from "@/context/CycleContext";
import { useColors } from "@/hooks/useColors";
import { useHaptics } from "@/hooks/useHaptics";
import { getPhaseColor } from "@/utils/cycle";
import { phaseNames } from "@/constants/theme";
import { MOCK_PLACES } from "@/constants/mockData";

const TYPE_ICONS: Record<string, string> = {
  restaurant: "coffee",
  cafe: "coffee",
  cinema: "film",
  park: "map-pin",
  bar: "music",
  spa: "droplets",
  other: "star",
};

const CATEGORIES = ["Todos", "Café", "Restaurante", "Parque", "Spa", "Cinema", "Bar"];
const CAT_TYPES: Record<string, string> = {
  "Café": "cafe",
  "Restaurante": "restaurant",
  "Parque": "park",
  "Spa": "spa",
  "Cinema": "cinema",
  "Bar": "bar",
};

export default function PlacesScreen() {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const { prediction } = useCycle();
  const haptics = useHaptics();
  const [selectedCat, setSelectedCat] = useState("Todos");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const phase = prediction?.currentPhase ?? "follicular";
  const phaseColor = getPhaseColor(phase);

  const filtered = useMemo(() => {
    let places = MOCK_PLACES;
    if (selectedCat !== "Todos") {
      const type = CAT_TYPES[selectedCat];
      places = places.filter(p => p.type === type);
    }
    return places;
  }, [selectedCat]);

  const phaseRecommended = useMemo(
    () => MOCK_PLACES.filter(p => p.phase.includes(phase)),
    [phase]
  );

  const toggleFav = (id: string) => {
    haptics.light();
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
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
            <Text style={[styles.screenTitle, { color: c.foreground }]}>Lugares</Text>
            <Text style={[styles.screenSub, { color: c.mutedForeground }]}>Descobertas para vocês dois</Text>
          </View>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pad}>
          {/* Phase Recommendation Banner */}
          <Animated.View entering={FadeInDown.delay(100)}>
            <LinearGradient
              colors={[phaseColor + "25", phaseColor + "10"]}
              style={[styles.phaseBanner, { borderColor: phaseColor + "30" }]}
            >
              <Feather name="zap" size={16} color={phaseColor} />
              <Text style={[styles.phaseBannerText, { color: phaseColor }]}>
                Sugestões para {phaseNames[phase]} — {phaseRecommended.length} lugares ideais para você agora
              </Text>
            </LinearGradient>
          </Animated.View>

          {/* Categories */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.catsRow}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => { haptics.selection(); setSelectedCat(cat); }}
                  style={[
                    styles.catBtn,
                    { borderColor: selectedCat === cat ? c.primary : c.border },
                    selectedCat === cat && { backgroundColor: c.primary + "20" },
                    selectedCat !== cat && { backgroundColor: c.muted },
                  ]}
                >
                  <Text style={[styles.catText, { color: selectedCat === cat ? c.primary : c.mutedForeground }]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Places List */}
          <View style={{ gap: 12 }}>
            {filtered.map((place, i) => {
              const isPhaseMatch = place.phase.includes(phase);
              const isFav = favorites.has(place.id);
              return (
                <Animated.View key={place.id} entering={FadeInRight.delay(100 + i * 60).duration(400)}>
                  <GradientCard
                    colors={isPhaseMatch ? [phaseColor + "12", c.card] : [c.card, c.surface as string]}
                    style={{ padding: 0, overflow: "hidden" }}
                  >
                    <View style={styles.placeBody}>
                      <View style={[styles.placeIcon, { backgroundColor: isPhaseMatch ? phaseColor + "20" : c.muted }]}>
                        <Feather name={TYPE_ICONS[place.type] as any} size={24} color={isPhaseMatch ? phaseColor : c.mutedForeground} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <View style={styles.placeNameRow}>
                          <Text style={[styles.placeName, { color: c.foreground }]}>{place.name}</Text>
                          {isPhaseMatch && (
                            <View style={[styles.matchBadge, { backgroundColor: phaseColor + "20" }]}>
                              <Text style={[styles.matchText, { color: phaseColor }]}>Ideal agora</Text>
                            </View>
                          )}
                        </View>
                        <Text style={[styles.placeDesc, { color: c.mutedForeground }]}>{place.description}</Text>
                        <View style={styles.placeFooter}>
                          <View style={styles.placeInfo}>
                            <Feather name="map-pin" size={12} color={c.mutedForeground} />
                            <Text style={[styles.infoText, { color: c.mutedForeground }]}>{place.distance}</Text>
                          </View>
                          <View style={styles.placeInfo}>
                            <Feather name="star" size={12} color={c.accent} />
                            <Text style={[styles.infoText, { color: c.mutedForeground }]}>{place.rating}</Text>
                          </View>
                          <View style={styles.placeTags}>
                            {place.tags.slice(0, 2).map(tag => (
                              <View key={tag} style={[styles.tag, { backgroundColor: c.muted }]}>
                                <Text style={[styles.tagText, { color: c.mutedForeground }]}>{tag}</Text>
                              </View>
                            ))}
                          </View>
                        </View>
                      </View>
                      <View style={styles.placeActions}>
                        <TouchableOpacity onPress={() => toggleFav(place.id)}>
                          <Feather name={isFav ? "heart" : "heart"} size={20} color={isFav ? "#F87171" : c.mutedForeground} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(place.name)}`)}
                          style={[styles.mapsBtn, { backgroundColor: c.primary + "15" }]}
                        >
                          <Feather name="external-link" size={14} color={c.primary} />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </GradientCard>
                </Animated.View>
              );
            })}
          </View>
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
  phaseBanner: {
    flexDirection: "row", alignItems: "center", gap: 8,
    padding: 12, borderRadius: 14, borderWidth: 1,
  },
  phaseBannerText: { flex: 1, fontSize: 13, fontWeight: "500", lineHeight: 18 },
  catsRow: { flexDirection: "row", gap: 8, paddingRight: 20 },
  catBtn: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1,
  },
  catText: { fontSize: 13, fontWeight: "600" },
  placeBody: { flexDirection: "row", gap: 12, padding: 14, alignItems: "flex-start" },
  placeIcon: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  placeNameRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" },
  placeName: { fontSize: 15, fontWeight: "700" },
  matchBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  matchText: { fontSize: 10, fontWeight: "600" },
  placeDesc: { fontSize: 12, lineHeight: 16, marginTop: 2 },
  placeFooter: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 6, flexWrap: "wrap" },
  placeInfo: { flexDirection: "row", alignItems: "center", gap: 3 },
  infoText: { fontSize: 11 },
  placeTags: { flexDirection: "row", gap: 4 },
  tag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  tagText: { fontSize: 10 },
  placeActions: { gap: 10, alignItems: "center" },
  mapsBtn: { width: 30, height: 30, borderRadius: 15, alignItems: "center", justifyContent: "center" },
});
