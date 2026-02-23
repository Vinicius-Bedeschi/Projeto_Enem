# 🎯 Projeto ENEM 2026

Um aplicativo pessoal de estudos focado no **ENEM 2026**, criado para ajudar a manter **consistência, motivação e disciplina diária** de forma simples, bonita e funcional.

Este projeto funciona como um **planner inteligente de estudos**, com sistema de streak, níveis, conquistas, mensagens motivacionais e personalização de perfil.

---

## Funcionalidades

- **Registro diário de estudos**
  - Concluído
  - Parcial
  - Perdido
  - Recuperação de streak

-  **Sistema de streak**
  - Contador de dias seguidos
  - Recorde pessoal
  - Modo recuperação

-  **Conquistas automáticas**
  - Dias seguidos
  - Total de dias estudados
  - Marcos de nível (5, 10, 20, 30, 40, 50…)

-  **Sistema de nível e XP**
  - XP por dia estudado
  - Títulos evolutivos
  - Barra de progresso visual

-  **Rotina semanal**
  - Organização por dia da semana
  - Blocos de estudo com horários e cores

-  **Mensagens motivacionais**
  - Diferentes mensagens para:
    - Dia concluído
    - Dia parcial
    - Recuperação

-  **Perfil personalizável**
  - Nome do usuário
  - Avatar com foto
  - Saudação dinâmica (Bom dia / Boa tarde / Boa noite)

-  **Backup e restauração**
  - Exportar dados em JSON
  - Importar backup quando quiser

-  **Experiência mobile-first**
  - Interface otimizada para celular
  - Pode ser usado como “app” ao adicionar à tela inicial

---

## Tecnologias utilizadas

- **Vite**
- **React**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Lucide Icons**
- **LocalStorage** (persistência dos dados)

---

## Como rodar o projeto localmente

### Pré-requisitos
- Node.js (recomendado via nvm)
- npm

### Passos

```bash
# Clone o repositório
git clone <URL_DO_REPOSITORIO>

# Entre na pasta
cd projeto-enem-2026

# Instale as dependências
npm install

# Rode o projeto
npm run dev