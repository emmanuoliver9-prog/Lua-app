# Lua — Couples & Cycle App

A premium commercial-grade mobile app for couples focused on menstrual cycle tracking, emotional intelligence, relationship improvement, and AI-based suggestions. Ultra-polished, dark mode, glassmorphism, animations, gamification, and premium tier.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- **Mobile:** Expo SDK 54, React Native 0.81.5, expo-router
- **Storage:** AsyncStorage (no backend for v1)
- **UI:** expo-linear-gradient, expo-blur (glassmorphism), react-native-reanimated, react-native-svg
- **Navigation:** expo-router with tabs + modal stack
- **State:** React Context (AuthContext, CycleContext, AppContext)

## Where things live

```
artifacts/lua/
├── app/              # All screens (expo-router)
│   ├── (auth)/       # Login, register
│   ├── (tabs)/       # Home, calendar, mood, partner, profile
│   ├── log-day.tsx   # Daily log modal
│   ├── stats.tsx, places.tsx, memories.tsx, special-dates.tsx
│   ├── premium.tsx, settings.tsx
├── constants/        # colors.ts (full palette), theme.ts, mockData.ts
├── context/          # AuthContext, CycleContext, AppContext
├── types/index.ts    # All TypeScript interfaces
├── utils/            # cycle.ts, storage.ts, suggestions.ts
├── components/       # GradientCard, PhaseRing, MoodPicker, SymptomPicker
├── hooks/            # useColors, useHaptics
```

## Architecture decisions

- **Dark-first design:** Default dark background #0F0A1A with light mode support via `useColors()` hook
- **Local-first:** All data in AsyncStorage via context providers; no Firebase or backend in v1
- **Mock partner:** Partner data is mocked but the UX is fully built for real sync later
- **Cycle algorithm:** `utils/cycle.ts` computes all phase predictions from last period date + cycle/period length
- **AI suggestions:** Rule-based engine in `utils/suggestions.ts` matched to current cycle phase

## Product

- **Cycle tracking:** Phase-colored calendar, daily symptom/mood/flow/energy logging, predictions
- **Partner system:** Code-based connection, mood sharing, weekly challenges, XP/level gamification
- **AI suggestions:** Phase-appropriate restaurant/activity/care suggestions
- **Places:** Location recommendations filtered by cycle phase and category
- **Memories & Special Dates:** Couple's album and countdown to important dates
- **Stats:** Cycle distribution, symptom frequency, mood trends
- **Premium:** Subscription screen with monthly/yearly plans (mock purchase)
- **Gamification:** XP, levels (1–5), badges for milestones

## Design System

- Background: `#0F0A1A` (dark) / `#FDF8FF` (light)
- Primary: `#C084FC` (lilac)
- Secondary: `#F9A8D4` (rose)
- Accent: `#FBBF24` (gold)
- Phase colors: menstrual red, follicular orange, ovulation gold, luteal purple, PMS pink
- Cards: glassmorphism via BlurView (iOS) or LinearGradient with opacity

## User preferences

- Portuguese (Brazilian) — all UI copy in pt-BR
- Premium/startup aesthetic — no generic designs
- Haptic feedback on all interactions
- Dark mode as the primary visual theme

## Gotchas

- Web preview renders differently than native (safe area, blur effects)
- expo-blur glassmorphism only works on iOS native; web/Android gets gradient fallback
- AsyncStorage is async — all reads require `await` or `useEffect` initialization
- Partner data is fully mocked — real-time sync would require a backend (Firebase, Supabase, etc.)
