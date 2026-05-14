import { Redirect } from "expo-router";
import React from "react";
import { View } from "react-native";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { hasSeenOnboarding, isLoading: appLoading } = useApp();

  if (authLoading || appLoading) {
    return <View style={{ flex: 1, backgroundColor: "#0F0A1A" }} />;
  }

  if (!hasSeenOnboarding) {
    return <Redirect href="/onboarding" />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(tabs)" />;
}
