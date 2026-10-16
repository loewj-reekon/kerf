# Kerf

Kerf is a measurement logger for construction crews. Someone on site takes measurements with a
Bluetooth tape measure, labels them and files them under a project. Back at the office, someone
else checks the office dashboard to see what's been measured.

This repo contains:

| Path              | What it is                                                         |
| ----------------- | ------------------------------------------------------------------ |
| `src/`            | The Expo (React Native) app: crew screens and the office dashboard |
| `packages/api`    | Node + TypeScript API backed by SQLite                             |
| `packages/shared` | Types and display formatting shared by the app and the API         |

The tape measure is simulated (`src/lib/tape.ts`), so you don't need any hardware.

## Setup

You need **Node 22.13 or newer** (the API uses the built-in `node:sqlite`) and **Yarn 1**. You
don't need Docker, Xcode or Android Studio.

```bash
yarn
yarn dev
```

`yarn dev` starts the API on port 4000 and the Expo dev server on port 8081. The app calls the API
directly on port 4000 of the machine it was loaded from: `localhost` in a desktop browser, your
computer's Wi-Fi address on a phone. To point it somewhere else, set `EXPO_PUBLIC_API_URL` (for
example in a `.env` file) and reload the app.

- **Phone:** install Expo Go, make sure your phone is on the same Wi-Fi network as your computer,
  and scan the QR code in the terminal. Your phone needs to reach both ports, 8081 and 4000. If your
  computer asks whether to allow incoming connections for `node`, allow them.
- **Browser:** press `w` in the terminal, or open http://localhost:8081.
- **Office dashboard:** open http://localhost:8081/dashboard in a browser. It's meant for a desktop
  browser, but it works on the phone too ("Office dashboard" on the home screen).

If your network blocks device-to-device traffic (common on office and guest Wi-Fi),
`yarn dev --tunnel` tunnels the Expo dev server, but not the API. You'd also need to expose port
4000 with a tunnelling tool of your choice and set `EXPO_PUBLIC_API_URL` to its address. A desktop
browser works without any of this.

### Other scripts

| Command          | What it does                       |
| ---------------- | ---------------------------------- |
| `yarn dev:api`   | API only (restarts on change)      |
| `yarn dev:app`   | Expo dev server only               |
| `yarn test`      | Vitest (there are no tests yet)    |
| `yarn typecheck` | TypeScript for the app and the API |
| `yarn lint`      | ESLint                             |

To add a dependency to the app, use `npx expo install <package>` so you get a version that matches
the Expo SDK.

### Users and data

There's no login. Three users are seeded, each with a fixed bearer token:

| User  | Token            | Projects                                                     |
| ----- | ---------------- | ------------------------------------------------------------ |
| Alex  | `alex-7f3c2a91`  | Hendricks Kitchen Remodel, Unit 4B Flooring, Garage Shelving |
| Priya | `priya-2d9e5b07` | Hendricks Kitchen Remodel (as a subcontractor)               |
| Sam   | `sam-4b8e10d6`   | Maple St Deck                                                |

The app always acts as Alex. You can call the API directly, for example:

```bash
curl -H "Authorization: Bearer alex-7f3c2a91" http://localhost:4000/projects
```

The database lives at `packages/api/data/kerf.db` and is created and seeded on first run. To get
back to the seed data, use **Settings → Reset seed data** in the app, or delete that file.

## Where the product is headed

Crews are starting to share projects, so a superintendent and several subcontractors will log into
the same job. And a few of our larger customers want their own tools to log measurements straight to
the API rather than going through the app.

## The task

Today there's no sign-in: the app always acts as Alex. The office dashboard only shows new
measurements when you reload it, nobody can tell who else is around, and there's no way to get
measurements into a spreadsheet. We want four things.

### 1. Sign-in

Replace the fixed tokens with real sign-in. Each person signs in as themselves, in the app and on
the dashboard, and stays signed in until they sign out. You decide how the seeded users get
credentials; tell us how to sign in as each of them.

### 2. Live updates

New measurements should appear on the office dashboard as soon as they're captured, without a
reload. Choose the approach and any libraries yourself. Whatever you build has to:

- work in a desktop browser and in Expo Go on a phone on the same Wi-Fi network
- after a dropped connection (a laptop going to sleep, a Wi-Fi blip, an API restart), catch up
  on everything that was missed, with nothing missing and nothing repeated
- only ever show a user measurements from projects they belong to

### 3. Who's online

The dashboard should show who's online right now. Someone counts as online while they have the app
or the dashboard open on any device.

- Only show people who share at least one project with you.
- Someone with the app open on two devices shows up once, and stays online if they close just one.
- Someone whose device just disappears (a laptop lid closed, a phone's battery dying) drops off within
  a minute or so.

### 4. CSV export

The office wants to work with measurements in a spreadsheet. Add an export to the office dashboard
that downloads a CSV of the measurements in your projects: project, group, label, measurement, who
captured it, on which device, and when.

- It has to open cleanly in Excel and Google Sheets.
- Measurements must match what the app shows, and people need to be able to do arithmetic with them
  in the spreadsheet.
- Only include projects you belong to.
- It has to work from the dashboard in a desktop browser and on a phone.

## Instructions

- Plan on about **2.5 hours**. You probably won't finish all four tasks, and we don't expect you
  to. Decide what matters most and tell us why.
- Use whatever tools you normally would, AI assistants included. We encourage it.
- If something is ambiguous, make a reasonable call and write it down. If you're stuck on setup or
  have a question, email us at **josh@reekon.tools**.

## What to send back

Send your repo (a link or a zip, with your git history) and a `NOTES.md` at the root covering:

- The design you chose, the alternatives you rejected, and why
- Anything in the existing code that got in your way, and what you did about it
- How you verified it works
- What you deliberately left alone, and why
- At least one place where AI tooling was wrong or unhelpful, and how you noticed
