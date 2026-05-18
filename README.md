# NJ Brew 🍯🍺

Moderne Fullstack-Webapp mit **Nuxt 4**, **Vue 3**, **Pinia**, **TailwindCSS v4**, **daisyUI**, **Drizzle ORM** und **SQLite**.

---

## Inhaltsverzeichnis

- [Tech Stack](#tech-stack)
- [Voraussetzungen](#voraussetzungen)
- [Node.js installieren](#nodejs-installieren)
- [pnpm installieren](#pnpm-installieren)
- [Repository klonen](#repository-klonen)
- [Dependencies installieren](#dependencies-installieren)
- [Entwicklungsserver starten](#entwicklungsserver-starten)
- [VSCode Setup](#vscode-setup)
- [GitHub Workflow](#github-workflow)
- [Issue Templates](#issue-templates)
- [VSCode GitHub Extension](#vscode-github-extension)
- [Architektur](#architektur)
- [Verfügbare Scripts](#verfügbare-scripts)
- [Datenbank Commands](#datenbank-commands)
- [Lizenz](#lizenz)

---

## Tech Stack

### Frontend

- Nuxt 4
- Vue 3
- Pinia
- TailwindCSS v4
- daisyUI
- Iconify / Nuxt Icon
- vee-validate
- zod

### Backend

- Nuxt Server Routes
- Drizzle ORM
- SQLite
- Better Auth

### Tooling

- pnpm
- ESLint
- VSCode Workspace Settings
- GitHub Issues + Projects Workflow

---

## Voraussetzungen

Installiere folgende Tools:

- Node.js >= 22
- pnpm >= 10
- VSCode

---

## Node.js installieren

Download:

https://nodejs.org

Prüfen:

```bash
node -v
```

---

## pnpm installieren

Dieses Projekt verwendet ausschließlich **pnpm**.

Installation:

```bash
npm install -g pnpm
```

Prüfen:

```bash
pnpm -v
```

---

## Repository klonen

```bash
git clone https://github.com/NIKmigg/nj-brew.git
cd nj-brew
```

---

## Dependencies installieren

```bash
pnpm install
```

---

## Environment Variablen

Eine `.env` Datei im Root-Ordner anlegen und folgende Variablen befüllen:

```txt
NODE_ENV=
DB_FILE_NAME=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

---

## Datenbank initialisieren

```bash
pnpm db:generate
pnpm db:migrate
```

---

## Entwicklungsserver starten

```bash
pnpm dev
```

Die Anwendung läuft anschließend unter:

```txt
http://localhost:3000
```

---

## VSCode Setup

Im Repository befinden sich bereits:

```txt
.vscode/settings.json
.vscode/extensions.json
```

### Einrichtung

1. Projekt in VSCode öffnen
2. Empfohlene Extensions installieren
3. VSCode neu starten

---

## GitHub Workflow

Das Projekt verwendet:

- GitHub Issues
- GitHub Projects
- Pull Requests

### Projekt Board

https://github.com/users/NIKmigg/projects/4

---

## Issue Templates

Unter:

```txt
.github/ISSUE_TEMPLATE/
```

existieren Templates für:

```txt
bug.md
feature.md
```

Neue Issues sollen ausschließlich über die VSCode Extension erstellt werden.

---

## VSCode GitHub Extension

Verwendete Extension:

```txt
GitHub Pull Requests and Issues
```

Marketplace:

https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-pull-request-github

Mit der Extension können:

- Issues erstellt
- Pull Requests verwaltet
- Reviews durchgeführt
- GitHub Projects genutzt werden

---

## Architektur

### Environment Variablen

Die Environment Variablen werden zentral und typensicher unter:

```txt
server/lib/env.ts
```

verwaltet.

Alle neuen ENV Variablen müssen dort gepflegt und validiert werden.

---

### Datenbank

Die Datenbanklogik befindet sich vollständig unter:

```txt
server/db/
```

Die lokale SQLite Datenbank wird unter:

```txt
data/database.sqlite
```

gespeichert.

---

### Drizzle Studio

Die SQLite Datenbank kann visuell über Drizzle Studio verwaltet werden.

Starten mit:

```bash
pnpm db:studio
```

---

## Verfügbare Scripts

### Entwicklung

```bash
pnpm dev
```

---

### Production Build

```bash
pnpm build
```

---

### Preview

```bash
pnpm preview
```

---

### Static Generate

```bash
pnpm generate
```

---

### Linting

```bash
pnpm lint
```

Automatisch fixen:

```bash
pnpm lint:fix
```

---

## Datenbank Commands

### Migration generieren

```bash
pnpm db:generate
```

---

### Migration ausführen

```bash
pnpm db:migrate
```

---

### Drizzle Studio

```bash
pnpm db:studio
```

---

## Lizenz

Private Project
