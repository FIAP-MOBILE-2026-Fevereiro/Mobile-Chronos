# Design System — Void Protocol

## Visão Geral

O **Void Protocol** é o design system proprietário do **Chronos DTN Mobile**. Seu visual é inspirado no espaço profundo cislunar: fundos Void Black, bordas neon pulsantes, gradientes de galáxia e estrelas cintilantes.

---

## Paleta de Cores (`constants/Colors.ts`)

| Token | Valor | Uso |
|---|---|---|
| `background` | `#0A0E1A` | Fundo principal (Void Black — espaço profundo) |
| `surface` | `#121926` | Fundo de cards sólidos |
| `accent` | `#0085FF` | Ion Blue — botões, CTAs e bordas ativas |
| `cyan` | `#00D4FF` | Status online e latência |
| `gold` | `#FFB800` | Alertas de buffer e relógio lunar |
| `glassSurface` | `rgba(18,25,38,0.85)` | Vidro escuro para cards glassmorphic |
| `glassBorder` | `rgba(0,133,255,0.15)` | Borda sutil translúcida |
| `textPrimary` | `#FFFFFF` | Texto principal |
| `textSecondary` | `#C8D6E5` | Lunar Silver — subtítulos e labels |
| `purple` | `#4A5568` | Labels e texto inativo |
| `alert` | `#FF3B5C` | Vermelho de erro |

---

## Tipografia

| Fonte | Peso | Uso |
|---|---|---|
| `Syne-Bold` | 700 | Títulos de tela, métricas grandes, CTAs |
| `DMSans-Bold` | 700 | Nomes de itens, valores de cards |
| `DMSans-Medium` | 500 | Labels e rótulos |
| `DMSans-Regular` | 400 | Textos de corpo e descrições |

---

## Tokens de Layout (`constants/Layout.ts`)

| Token | Valor | Uso |
|---|---|---|
| `SPACING.md` | `16px` | Padding padrão de telas |
| `RADIUS.md` | `12px` | Border radius de cards |
| `RADIUS.pill` | `30px` | Botões pílula |
| `SHADOW.card` | — | Sombra padrão de cards |
| `SHADOW.neon` | — | Sombra neon azul para elementos focados |

---

## Efeitos Visuais

- **Neon Pulsante:** `Animated.Value` interpolado de `rgba(0,133,255,0.15)` → `rgba(0,212,255,0.55)` em loop de 1800ms
- **Estrelas Cintilantes:** Componente `EstrelaCintilante` com `Animated.Value` individual, delay aleatório, 10 estrelas por card de relógio
- **Gradiente Galáxia:** `LinearGradient` com `#0D1B2A → #131a2e → #0a1628` nos cards do Auditor
- **Glassmorphic:** `glassSurface` + `glassBorder` com `overflow: hidden` nos cards da Home

---

## Diretrizes de Componentes

- **Border radius padrão:** `12px` (cards), `20px` (sub-cards), `30px` (botões pílula)
- **Padding lateral de telas:** `16px`
- **Padding superior (safe area):** `50px`
- **Altura da tab bar:** `70px`
- **Skeleton screens:** `COLORS.surface` + `COLORS.border` durante carregamentos de 1.28s
