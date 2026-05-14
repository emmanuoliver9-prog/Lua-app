import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { addDays } from "./cycle";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export type NotifType = "mood" | "pms" | "period" | "partner" | "ovulation";

const NOTIF_IDS_KEY = "LUA_NOTIF_IDS";

export async function requestPermissions(): Promise<boolean> {
  if (Platform.OS === "web") return false;
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === "granted") return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function cancelAllByType(type: NotifType) {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const toCancel = scheduled.filter((n) => n.content.data?.type === type);
  await Promise.all(toCancel.map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)));
}

export async function cancelAll() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function scheduleMoodReminder(enabled: boolean) {
  await cancelAllByType("mood");
  if (!enabled) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🌙 Como você está hoje?",
      body: "Registre seu humor e mantenha o parceiro atualizado.",
      data: { type: "mood" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 20,
      minute: 0,
    },
  });
}

export async function schedulePmsAlert(enabled: boolean, pmsStartDate: string) {
  await cancelAllByType("pms");
  if (!enabled) return;

  const triggerDate = new Date(pmsStartDate + "T09:00:00");
  if (triggerDate <= new Date()) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "💜 Fase de TPM se aproximando",
      body: "Nos próximos dias ela pode precisar de mais carinho e paciência.",
      data: { type: "pms" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    },
  });
}

export async function schedulePeriodAlert(enabled: boolean, nextPeriodDate: string) {
  await cancelAllByType("period");
  if (!enabled) return;

  const threeDaysBefore = addDays(nextPeriodDate, -3);
  const oneDayBefore = addDays(nextPeriodDate, -1);

  for (const [dateStr, days] of [[threeDaysBefore, 3], [oneDayBefore, 1]] as [string, number][]) {
    const triggerDate = new Date(dateStr + "T08:00:00");
    if (triggerDate <= new Date()) continue;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: days === 1 ? "🔴 Período amanhã" : `🔴 Período em ${days} dias`,
        body: days === 1
          ? "Prepare-se! Tenha à mão tudo que ela precisa."
          : "O período dela está chegando. Que tal planejar algo especial?",
        data: { type: "period" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      },
    });
  }
}

export async function scheduleOvulationAlert(enabled: boolean, ovulationDate: string) {
  await cancelAllByType("ovulation");
  if (!enabled) return;

  const triggerDate = new Date(ovulationDate + "T09:00:00");
  if (triggerDate <= new Date()) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "✨ Ela está radiante hoje",
      body: "Fase de ovulação! Energia máxima — planeje algo especial juntos.",
      data: { type: "ovulation" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    },
  });
}

export async function schedulePartnerReminder(enabled: boolean) {
  await cancelAllByType("partner");
  if (!enabled) return;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "💑 Não esqueça do seu parceiro",
      body: "Você não compartilha seu humor há algum tempo. Que tal se conectar?",
      data: { type: "partner" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday: 3,
      hour: 19,
      minute: 0,
    },
  });
}

export async function scheduleAllNotifications(opts: {
  mood: boolean;
  pms: boolean;
  period: boolean;
  partner: boolean;
  ovulation: boolean;
  pmsStartDate: string;
  nextPeriodDate: string;
  ovulationDate: string;
}) {
  const hasPermission = await requestPermissions();
  if (!hasPermission) return false;

  await Promise.all([
    scheduleMoodReminder(opts.mood),
    schedulePmsAlert(opts.pms, opts.pmsStartDate),
    schedulePeriodAlert(opts.period, opts.nextPeriodDate),
    scheduleOvulationAlert(opts.ovulation, opts.ovulationDate),
    schedulePartnerReminder(opts.partner),
  ]);

  return true;
}
