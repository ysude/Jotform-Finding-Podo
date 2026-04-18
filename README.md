# Missing Podo Investigation Dashboard

Frontend hackathon project built with React, Vite, TypeScript, and Tailwind.

The app investigates how the mascot **Podo** disappeared by combining multiple evidence sources such as check-ins, messages, sightings, notes, and anonymous tips. The UI is designed to help a user:

- follow Podo's route through Ankara
- inspect linked evidence records
- search and filter the dataset
- review related records in a structured investigation dashboard

## Features

- Route overview with:
  - latest sighting
  - focus person context
  - Leaflet-based Ankara map
  - timeline view
- Evidence dashboard with:
  - searchable and filterable evidence feed
  - grouped linked records
  - detail panel
  - summary strip
  - chronological browsing
- Local Jotform export flow:
  - fetches data from Jotform
  - writes the result to a local JSON file
  - frontend reads from that local JSON file

## Tech Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- React Leaflet
- Leaflet

## How Data Works

The frontend does **not** call the Jotform API directly in the browser.

Instead, the project uses this flow:

1. A local Node script fetches data from Jotform.
2. The script writes the result to `public/jotform-data.json`.
3. The frontend loads that JSON file.

This keeps the API key out of the browser runtime.

## Project Structure

```txt
src/
  app/           main app screen
  components/    UI components
  data/          frontend data loading
  hooks/         local React hooks
  types/         shared TypeScript types
  utils/         normalization and helper logic

api/             Jotform fetch/export-side files
scripts/         local scripts
public/          static assets and exported JSON
```

## Prerequisites

- Node.js 18+ recommended
- npm

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

## Jotform Local Config

If you want to refresh the dataset from Jotform, create or update:

`api/jotform.config.local.ts`

with your real API key and form IDs.

An example file is available here:

`api/jotform.config.example.ts`

Important:

- `api/jotform.config.local.ts` is ignored by Git
- the local export script uses this file
- the browser does not use this file directly

## Running the Project

Start the development server:

```bash
npm run dev
```

What this does:

1. runs the local export script first
2. updates `public/jotform-data.json`
3. starts the Vite dev server

Then open the local URL shown in the terminal.

## Refreshing Data Manually

If you want to update the local JSON without starting the app:

```bash
npm run export:data
```

## Building for Production

```bash
npm run build
```

This also refreshes the exported local JSON before building.

## Previewing the Production Build

```bash
npm run preview
```

## If You Do Not Have API Credentials

You can still run the project if `public/jotform-data.json` already exists in the repository.

In that case:

1. install dependencies
2. run `npm run dev`

If you do not want the automatic export step to run, you can temporarily run Vite directly:

```bash
npx vite
```

## Notes

- The map is intentionally simple and investigation-focused.
- The data model is normalized on the frontend for easier linking and filtering.
- The implementation prioritizes clarity and hackathon speed over heavy architecture.
