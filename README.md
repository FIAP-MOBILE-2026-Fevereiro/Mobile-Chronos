# Chronos DTN — App Mobile (React Native + Expo Router)

> Gateway Financeiro e Roteador de Rede para liquidação e roteamento de stablecoins (USDC/USDT) entre a Terra e a Lua. Projeto desenvolvido para a **Global Solution — FIAP 2026**.

---

## 👥 Integrantes do Grupo

| Nome | RM |
|---|---|
| Fernando Charlles | 566482 |
| Evellyn Ferreira | 562744 |
| Maicon Douglas | 561279 |

---

## 🎥 Demonstração em Vídeo

▶️ **[Assista ao vídeo de demonstração no YouTube] https://youtube.com/shorts/BL8pTIkk230?si=vB1T3Z-bERUlAsRb **


---

## 🛰️ Descrição da Solução

O **Chronos DTN** é um Gateway Financeiro e Roteador de Rede focado na liquidação e roteamento de stablecoins tokenizadas (USDC/USDT) entre a Terra e a Lua.

O projeto adota uma arquitetura híbrida de rede tolerante a atrasos (**DTN — Delay-Tolerant Network**) e reconciliação temporal relativística para resolver as duas maiores dores de engenharia do ambiente cislunar:

- **Queda de sinal constante:** implementada com o padrão *Store-and-Forward* — transações são armazenadas localmente no buffer quando não há visada de rádio e transmitidas em rajada ao restabelecer o link.
- **Dilatação temporal relativística:** o tempo na Lua passa **~56 microssegundos mais rápido por dia** devido à menor gravidade. O Auditor de Tempo aplica a correção PL/SQL ao ledger de sincronização.

O app simula as condições físicas reais do ambiente cislunar:
- ⏱️ **Latência de 1,28 segundos** em todas as chamadas de API (tempo de ida e volta do sinal de rádio Terra-Lua), implementada via interceptores Axios.
- 🔄 **Skeleton screens** durante os carregamentos, representando a espera pelo sinal.
- ⏰ **Auditor de Tempo Relativístico** com correção de +56 μs/dia de drift gravitacional.

---

## 📱 Telas do Aplicativo (5+ telas — Expo Router)

| Tela | Rota | Descrição |
|---|---|---|
| **Splash** | `/` | Animação orbital de entrada com botão "INICIAR CONEXÃO" |
| **Home** | `/(tabs)/` | Dashboard com carteira, telemetria DTN, nós ativos e remessa |
| **Auditor** | `/(tabs)/auditor` | Barra de dias da semana + relógios relativísticos cintilantes |
| **Nós DTN** | `/(tabs)/nodes` | **CRUD completo** — Create, Read, Update, Delete de gateways |
| **Buffer** | `/(tabs)/buffer` | Monitor da fila store-and-forward de stablecoins pendentes |
| **Configurações** | `/(tabs)/profile` | JWT, IP do gateway e **seletor de API (Java / .NET)** |

---

## ⚙️ CRUD com API RESTful

O app implementa **Create, Read, Update e Delete** completos na tela **Nós DTN**, conectando a ambas as APIs do backend via **Axios**:

### API Java — Spring Boot 3 (porta `8080`)
```
GET    /api/nodes          → Lista todos os nós
GET    /api/nodes/:id      → Busca um nó específico
POST   /api/nodes          → Cria novo nó gateway
PUT    /api/nodes/:id      → Atualiza dados do nó
DELETE /api/nodes/:id      → Remove nó (protegido por buffer)
```

### API .NET — ASP.NET Core 8 (porta `5000`)
```
GET    /api/nodes          → Lista todos os nós
GET    /api/nodes/:id      → Busca um nó específico
POST   /api/nodes          → Cria novo nó gateway
PUT    /api/nodes/:id      → Atualiza dados do nó
DELETE /api/nodes/:id      → Remove nó (protegido por buffer)
```

**Feedback visual em erros:** alertas nativos, skeleton screens e estado de loading em todos os botões de ação.

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Função |
|---|---|---|
| React Native | 0.74.1 | Framework de UI nativa multiplataforma |
| Expo SDK | 51 | Toolchain e módulos nativos gerenciados |
| Expo Router | 3.5 | Navegação baseada em sistema de arquivos |
| TypeScript | 5.3 | Tipagem estática e segurança de código |
| Axios | 1.6.8 | Requisições HTTP + interceptores de latência |
| expo-linear-gradient | 56 | Gradientes nativos (galáxia, glassmorphic) |
| @expo-google-fonts/syne | 0.4 | Fonte Syne Bold (títulos e displays) |
| @expo-google-fonts/dm-sans | 0.4 | Fonte DM Sans (corpo e labels) |
| React Native Animated API | nativo | Animações de estrelas, bordas neon e órbita |

---

## 📂 Arquitetura de Pastas

```
mobile-app2/
├── app/
│   ├── _layout.tsx              # Root layout + carregamento de fontes Syne e DM Sans
│   ├── index.tsx                # Splash Page com animação orbital e LED pulsante
│   └── (tabs)/
│       ├── _layout.tsx          # Tab bar com 5 abas e ícones Ionicons animados
│       ├── index.tsx            # Home: carteira + telemetria + remessa + animações
│       ├── auditor.tsx          # Auditor: barra de dias + relógios + estrelas cintilantes
│       ├── nodes.tsx            # Nós: CRUD completo (modal criar/editar + delete protegido)
│       ├── buffer.tsx           # Buffer: fila store-and-forward + upload em lote
│       └── profile.tsx          # Configurações: JWT + IP + seletor API Java/.NET
├── components/
│   ├── LatencyIndicator.tsx     # Barra de latência cislunar com LEDs de status
│   └── TelemetryCard.tsx        # Card de telemetria com gráfico de onda
├── constants/
│   ├── Colors.ts                # Design tokens de cor — paleta Void Protocol
│   └── Layout.ts                # Design tokens de espaçamento, radius e sombra
├── services/
│   ├── axiosService.ts          # Instâncias Axios com interceptores de latência 1.28s
│   ├── nodesJavaApi.ts          # CRUD via API Java (Spring Boot :8080)
│   └── nodesDotnetApi.ts        # CRUD via API .NET (ASP.NET Core :5000)
├── DESIGN.md                    # Documentação completa do design system Void Protocol
└── README.md                    # Este arquivo
```

---

## ▶️ Como Executar

### Pré-requisitos
- [Node.js 18+](https://nodejs.org/)
- App **Expo Go** instalado no celular

### Instalar e iniciar
```bash
npm install
npx expo start
```

Escaneie o QR Code com o app **Expo Go** no celular para abrir o app.

### Configurar o IP do backend
Na tela **Configurações** do app, defina o IP da máquina que roda a API e escolha entre **Java :8080** ou **.NET :5000**.

---

## 🎨 Design System

O app utiliza o design system **Void Protocol**, com identidade visual de espaço profundo:
- Fundo **Void Black** `#0A0E1A`
- Acento **Ion Blue** `#0085FF`
- Efeitos de **bordas neon pulsantes**, **gradiente galáxia** e **estrelas cintilantes**
- Fontes **Syne Bold** (títulos) e **DM Sans** (corpo)

Consulte [DESIGN.md](./DESIGN.md) para a documentação completa.
