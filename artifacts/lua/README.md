# Lua — App para Casais & Ciclo Menstrual

Aplicativo mobile premium para casais, com rastreamento de ciclo menstrual, inteligência emocional, sugestões de IA e gamificação. Desenvolvido com React Native + Expo.

---

## Como gerar o APK

### Pré-requisitos

1. **Conta Expo**: Crie em [expo.dev](https://expo.dev)
2. **EAS CLI** instalado globalmente:
   ```bash
   npm install -g eas-cli
   ```

### Passo a passo

#### 1. Clone o repositório
```bash
git clone https://github.com/SEU_USUARIO/lua-app.git
cd lua-app/artifacts/lua
```

#### 2. Instale as dependências
```bash
npm install
# ou se estiver no monorepo raiz:
pnpm install
```

#### 3. Login no EAS
```bash
eas login
```

#### 4. Configure o projeto EAS (primeira vez)
```bash
eas init
```
Isso vai gerar um `projectId` no `app.json`. Substitua `YOUR_EAS_PROJECT_ID` pelo ID gerado.

#### 5. Gere o APK

**APK de teste (sem conta no Play Store):**
```bash
eas build --platform android --profile preview
```

**APK de produção (AAB para o Play Store):**
```bash
eas build --platform android --profile production
```

O build roda na nuvem da Expo. Quando terminar, você recebe um link para baixar o APK.

---

## Build automático via GitHub Actions

O repositório já inclui um workflow em `.github/workflows/eas-build-apk.yml`.

### Configuração

1. Vá em **GitHub → Settings → Secrets and variables → Actions**
2. Adicione o secret:
   - `EXPO_TOKEN` → seu token de acesso da Expo (gerado em [expo.dev/settings/access-tokens](https://expo.dev/settings/access-tokens))

### Disparo automático
- **Push na branch `main`** com alterações em `artifacts/lua/` dispara o build automaticamente
- **Manual**: vá em **Actions → Build APK (EAS) → Run workflow**

---

## Executar localmente

```bash
cd artifacts/lua
npx expo start
```

Escaneie o QR code com o app **Expo Go** (disponível no Play Store e App Store).

---

## Stack

- **Expo SDK 54** + React Native 0.81.5
- **expo-router** para navegação
- **AsyncStorage** para persistência local
- **react-native-reanimated** para animações
- **expo-linear-gradient** + **expo-blur** para glassmorphism
- **react-native-svg** para gráficos

## Estrutura

```
artifacts/lua/
├── app/              # Telas (expo-router)
│   ├── (auth)/       # Login, cadastro
│   ├── (tabs)/       # Home, calendário, humor, parceiro, perfil
│   ├── log-day.tsx   # Modal de registro diário
│   ├── places.tsx, memories.tsx, special-dates.tsx
│   ├── premium.tsx, settings.tsx, stats.tsx
├── constants/        # Cores, tema, dados mock
├── context/          # AuthContext, CycleContext, AppContext
├── types/index.ts    # Interfaces TypeScript
├── utils/            # cycle.ts, storage.ts, suggestions.ts
├── components/       # GradientCard, PhaseRing, MoodPicker
└── hooks/            # useColors, useHaptics
```

---

## Configuração do `app.json` para produção

Antes de fazer o build de produção, remova a linha de origem do Replit no `app.json`:

```json
"plugins": [
  "expo-router",   ← remova o array e deixe só a string
  "expo-font",
  "expo-web-browser",
  "expo-location"
]
```

---

## Licença

Projeto privado — todos os direitos reservados.
