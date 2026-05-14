import * as Notifications from "expo-notifications";
import { useEffect, useRef, useCallback } from "react";
import { Platform } from "react-native";
import { router } from "expo-router";
import { requestPermissions } from "@/utils/notifications";
import type { NotifType } from "@/utils/notifications";

export function useNotificationSetup() {
  const responseListener = useRef<Notifications.EventSubscription | null>(null);
  const receivedListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    if (Platform.OS === "web") return;

    requestPermissions();

    receivedListener.current = Notifications.addNotificationReceivedListener((_notification) => {
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const type = response.notification.request.content.data?.type as NotifType | undefined;
      if (type === "mood") {
        router.push("/(tabs)/mood");
      } else if (type === "period" || type === "pms" || type === "ovulation") {
        router.push("/(tabs)");
      } else if (type === "partner") {
        router.push("/(tabs)/partner");
      }
    });

    return () => {
      receivedListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);
}

export function useNotificationPermission() {
  const request = useCallback(async () => {
    if (Platform.OS === "web") return false;
    return requestPermissions();
  }, []);

  return { requestPermission: request };
}
