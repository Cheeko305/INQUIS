⚫ INQUIS

### Galactic Intelligence & Command Portal

> **One Empire. One Network. No Escape.**

INQUIS is a frontend-only, interactive galactic command and intelligence portal designed for the **HCET Syndicate competition**.

Inspired by advanced Imperial command systems, INQUIS provides a simulated environment for monitoring planets, tracking Jedi activity, managing fleets, coordinating missions, analyzing intelligence, and responding to emerging threats across the galaxy.

The platform combines an immersive sci-fi interface with functional frontend state management to create a realistic military command experience.

---

## ✦ Features

### 🌌 Interactive 3D Galaxy Map

* Interactive galactic visualization
* Planet selection and intelligence
* Threat-level visualization
* Fleet tracking
* Hyperspace routes
* Sector visualization
* Tactical markers and overlays
* Camera controls and cinematic transitions

### 🛰️ Fleet Command

* Monitor Imperial fleets
* View fleet status and readiness
* Deploy fleets to strategic locations
* Track fleet movement
* Assign fleets to operations
* Simulated fleet activity

### 🎯 Mission Center

* Create Imperial operations
* Assign fleets and commanders
* Select targets
* Track mission status
* Complete, abort, or archive operations
* Dynamic mission statistics

### 🔎 Jedi Intelligence

* Searchable Jedi database
* Threat classifications
* Last-known locations
* Jedi status tracking
* Capture probability
* Target prioritization

### 🧠 Project Sentinel

A deterministic, frontend-based intelligence assistant.

Project Sentinel provides predefined intelligence queries and generates recommendations using the application's current state.

Example queries include:

* Which planet currently has the highest Jedi threat?
* Which Jedi is the highest-priority target?
* Where should the Empire deploy its next fleet?
* Which sector is most unstable?
* What is the current fleet readiness?
* Which planets have the highest recruitment probability?

Sentinel does not require an external AI API or backend.

### 🚨 Emergency Response

Simulate critical Jedi detections and observe the command network respond.

Emergency events can:

* Increase planetary threat levels
* Generate intelligence reports
* Create critical alerts
* Focus the galaxy map on the affected location
* Trigger Sentinel recommendations
* Recommend fleet deployment
* Generate response operations

### 📡 Intelligence Network

* Live simulated intelligence feed
* Threat classifications
* Planetary reports
* Probe droid reports
* Surveillance events
* Alert management

### 💬 HoloNet Communications

* Imperial command channels
* Local message state
* Multiple communication channels
* Simulated command communications

### 🤖 Probe Droid Network

* Deploy probe droids
* Track probe status
* Monitor signal strength
* Monitor battery status
* Generate simulated intelligence

### 🛰️ Satellite Network

* Monitor surveillance coverage
* Track satellite deployment
* Identify surveillance gaps
* Visualize coverage across sectors

### 📊 Analytics

Dynamic analytics for:

* Jedi threats
* Fleet deployment
* Mission success
* Sector control
* Intelligence reports
* Resource usage
* Threat trends

### 🏆 Achievement System

Unlock achievements through activity within the portal.

Examples:

* First Deployment
* Master Hunter
* Fleet Commander
* Intelligence Director
* Red Alert
* Outer Rim Control

### 🧭 Hyperspace Planner

Calculate simulated:

* Route distance
* Travel time
* Fuel requirements
* Danger level
* Recommended routes

---

## ⚙️ Architecture

INQUIS is intentionally designed as a **frontend-only application**.

There is no:

* Backend server
* Database
* Authentication server
* External AI service
* WebSocket server
* API dependency

Application state is managed locally through frontend state management and structured mock data.

### Technology Stack

| Technology        | Purpose                        |
| ----------------- | ------------------------------ |
| Next.js           | Application framework          |
| React             | UI architecture                |
| TypeScript        | Type safety                    |
| Tailwind CSS      | Styling                        |
| Three.js          | 3D rendering                   |
| React Three Fiber | React integration for Three.js |
| Drei              | 3D utilities                   |
| Framer Motion     | UI animations                  |
| Zustand           | Global state management        |
| Recharts          | Data visualization             |

---

## 📁 Project Structure

```text
inquis/
│
├── app/
│   ├── dashboard/
│   ├── galaxy/
│   ├── planets/
│   ├── jedi/
│   ├── fleets/
│   ├── missions/
│   ├── intelligence/
│   ├── communications/
│   ├── analytics/
│   └── settings/
│
├── components/
│   ├── ui/
│   ├── galaxy/
│   ├── dashboard/
│   ├── fleets/
│   ├── missions/
│   ├── intelligence/
│   ├── communications/
│   └── ...
│
├── data/
│   ├── planets.ts
│   ├── jedi.ts
│   ├── fleets.ts
│   ├── missions.ts
│   └── intelligence.ts
│
├── store/
│   ├── galaxyStore.ts
│   ├── fleetStore.ts
│   ├── missionStore.ts
│   └── ...
│
├── lib/
│   ├── sentinelEngine.ts
│   ├── simulationEngine.ts
│   └── calculations.ts
│
├── public/
│
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Install:

* Node.js
* npm
* Git

A recent LTS version of Node.js is recommended.

### Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/inquis.git
cd inquis
```

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

Open the local URL displayed in the terminal, typically:

```text
http://localhost:3000
```

---

## 🧪 Production Build

To create a production build:

```bash
npm run build
```

To run the production build locally:

```bash
npm start
```

---

## 🎮 Demo Flow

For the best demonstration experience:

```text
Login
  ↓
Command Dashboard
  ↓
Open Galaxy Map
  ↓
Select Planet
  ↓
View Planet Intelligence
  ↓
Open Jedi Database
  ↓
Select Target
  ↓
Create Operation
  ↓
Assign Fleet
  ↓
Deploy Fleet
  ↓
Open Project Sentinel
  ↓
Run Intelligence Query
  ↓
Trigger Jedi Detection
  ↓
Emergency Mode
  ↓
Deploy Response Fleet
  ↓
Resolve Alert
  ↓
View Updated Analytics
```

The portal is designed so that actions taken in one section can affect other parts of the interface through shared frontend state.


## 🎨 Design Philosophy

INQUIS follows a dark, tactical, cinematic visual language inspired by futuristic military command systems.

The interface emphasizes:

* Dark command-center environments
* Imperial red alerts
* Holographic blue/cyan information systems
* Tactical data visualization
* Minimal but purposeful motion
* High information density
* Clear visual hierarchy
* Interactive 3D environments

The goal is to make the application feel less like a conventional dashboard and more like a **galactic command operating system**.



## 🔒 Security & Data

INQUIS is a frontend simulation and does not currently process real military, personal, or classified information.

All operational data is fictional and locally simulated.

Do not add API keys, credentials, or other secrets directly to the repository.

If environment variables are introduced, store sensitive values in local `.env` files and keep them out of version control.



## 🛠️ Development Philosophy

The project prioritizes:

1. Interactive functionality
2. Visual quality
3. Consistent state management
4. Performance
5. Reusable components
6. Maintainable TypeScript
7. Immersive user experience

Buttons and controls are intended to perform meaningful actions rather than acting as static visual elements.


