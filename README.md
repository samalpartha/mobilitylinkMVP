
# MobilityLink MVP

**MobilityLink** is a B2B open-source mobility solution. This Minimum Viable Product (MVP) showcases core functionalities designed to manage and dispatch a fleet of riders efficiently.

## Core Features

-   **Authentication**: User registration and login with role-based access control (Admin, Rider, Client). (MVP: Implemented using `localStorage`).
-   **Rider Profile**: Display and manage rider information, including punch-in/out status and background check status.
-   **Real-time Map Placeholder**: Visual representation of where a live map displaying rider locations would be.
-   **Vehicle Telemetry**: Display mock real-time vehicle data such as battery percentage and location.
-   **Punch In/Out**: Interface for riders to manage their work status.
-   **Suggested Rider (AI)**: An AI-powered tool that suggests the closest available rider for a dispatch task based on a given location.

## Table of Contents

-   [User Flows](#user-flows)
    -   [1. User Registration](#1-user-registration)
    -   [2. User Login](#2-user-login)
    -   [3. Rider Punch In/Out](#3-rider-punch-inout)
    -   [4. Admin/Dispatcher Suggests Rider](#4-admindispatcher-suggests-rider)
    -   [5. Viewing Profile (Rider)](#5-viewing-profile-rider)
    -   [6. Viewing Live Map & Telemetry](#6-viewing-live-map--telemetry)
-   [Application Architecture](#application-architecture)
    -   [Tech Stack](#tech-stack)
    -   [Directory Structure](#directory-structure)
    -   [Authentication (MVP)](#authentication-mvp)
    -   [AI Integration](#ai-integration)
    -   [Styling & UI](#styling--ui)
-   [Setup and Running Instructions](#setup-and-running-instructions)
    -   [Prerequisites](#prerequisites)
    -   [Installation](#installation)
    -   [Environment Variables](#environment-variables)
    -   [Running the Development Server](#running-the-development-server)
    -   [Running Genkit Developer UI](#running-genkit-developer-ui)
-   [MVP Limitations](#mvp-limitations)

## User Flows

### 1. User Registration
   - New users navigate to the `/register` page.
   - They fill in their full name, email, password, and select a role (Rider, Admin, Client - for demo purposes).
   - Upon successful submission:
     - The user's details (including a plain-text password) are stored in the browser's `localStorage`.
     - A toast notification confirms registration and "simulates" sending a confirmation email.
     - The user is redirected to the `/login` page.
   - If the email is already registered, an error message is displayed.

### 2. User Login
   - Users navigate to the `/login` page.
   - They enter their email and password.
   - The system checks the credentials against the user data stored in `localStorage`.
   - Upon successful login:
     - User information (excluding password) is stored in a session cookie.
     - The user is redirected to their dashboard (`/dashboard`).
   - If credentials are invalid or the user doesn't exist, an error message is shown.
   - Default demo users (`rider@example.com`, `admin@example.com`, `client@example.com` with password "password") are pre-populated in `localStorage` if no users are found, for easy initial access.

### 3. Rider Punch In/Out
   - A logged-in Rider navigates to their Profile page (`/profile`).
   - A "Time Clock" card displays their current punch status and the current time.
   - The Rider can click "Punch In" or "Punch Out".
   - The status is updated locally in the component's state and mock profile data.
   - A toast notification confirms the action.
   - The last punch time is recorded and displayed.

### 4. Admin/Dispatcher Suggests Rider
   - A logged-in Admin navigates to the Dispatch Tool page (`/dispatch`).
   - The Admin enters a task location (latitude, longitude) into the "Suggest Closest Rider" form.
   - Upon clicking "Find Rider":
     - A Genkit AI flow (`suggestRiderFlow`) is invoked.
     - The AI (simulated) processes the location and returns a suggested rider's ID, name, and current location.
     - The suggested rider's details are displayed on the page.
     - A toast notification confirms the suggestion.

### 5. Viewing Profile (Rider)
   - A logged-in Rider navigates to their Profile page (`/profile`).
   - Their profile information (name, email, phone, vehicle type, background check status, punch status, avatar) is displayed.
   - This data is currently mocked but is retrieved based on the logged-in user's email.

### 6. Viewing Live Map & Telemetry
   - **Admin View**:
     - Navigates to the Live Map page (`/map`).
     - Sees a placeholder image for the map.
     - Below the map, a list of all mock active riders' vehicle telemetry data (rider name, vehicle ID, battery, location, speed, online status) is displayed.
   - **Rider View**:
     - Navigates to the Live Map page (`/map`).
     - Sees a placeholder image for the map.
     - Below the map, only their own vehicle's telemetry data is displayed.

## Application Architecture

### Tech Stack
-   **Frontend Framework**: Next.js 15 (App Router)
-   **UI Library**: React 18
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS, ShadCN UI components
-   **AI Integration**: Genkit (with Google AI provider)
-   **State Management**: React Context (for `useAuth`), local component state
-   **Form Handling**: React Hook Form (implicitly via ShadCN components where applicable, direct state for simpler forms)

### Directory Structure
```
.
├── src/
│   ├── ai/                     # Genkit AI integration
│   │   ├── flows/              # Genkit flow definitions (e.g., suggest-rider.ts)
│   │   ├── dev.ts              # Genkit dev server entry point
│   │   └── genkit.ts           # Genkit global configuration
│   ├── app/                    # Next.js App Router
│   │   ├── (app)/              # Authenticated routes layout and pages
│   │   │   ├── dashboard/
│   │   │   ├── dispatch/
│   │   │   ├── map/
│   │   │   ├── profile/
│   │   │   └── layout.tsx      # Layout for authenticated section
│   │   ├── login/              # Login page
│   │   ├── register/           # Registration page
│   │   ├── globals.css         # Global styles and ShadCN theme variables
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Root page (redirects to dashboard)
│   ├── components/             # React components
│   │   ├── auth/               # Authentication related components (LoginForm, RegistrationForm)
│   │   ├── dispatch/           # Dispatch related components (SuggestRiderForm)
│   │   ├── layout/             # Layout components (AppHeader, AppSidebar, UserProfileDropdown)
│   │   ├── rider/              # Rider specific components (PunchClock, RiderProfileDisplay)
│   │   ├── shared/             # Common shared components (Logo, PageHeader)
│   │   ├── ui/                 # ShadCN UI Primitives (Button, Card, Input, etc.)
│   │   └── vehicle/            # Vehicle related components (VehicleTelemetry)
│   ├── hooks/                  # Custom React hooks (useAuth, useToast, useIsMobile)
│   ├── lib/                    # Utility functions and constants
│   │   ├── authConstants.ts    # Authentication related constants (cookie names, roles, routes)
│   │   └── utils.ts            # General utility functions (e.g., cn for Tailwind)
│   ├── middleware.ts           # Next.js middleware for route protection
│   └── types/                  # TypeScript type definitions (index.ts)
├── public/                     # Static assets (if any)
├── .env                        # Environment variables (Google API Key for Genkit)
├── components.json             # ShadCN UI configuration
├── next.config.ts              # Next.js configuration
├── package.json                # Project dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

### Authentication (MVP)
-   User registration and login are handled client-side.
-   User credentials (including plain-text passwords for MVP) are stored in `localStorage` via `src/components/auth/RegistrationForm.tsx`.
-   `src/components/auth/LoginForm.tsx` validates credentials against `localStorage`.
-   Upon successful login, user details (excluding password) are stored in a browser cookie (`mobilitylink-auth`) managed by `src/hooks/useAuth.ts`.
-   `src/middleware.ts` protects routes based on the presence of this auth cookie, redirecting unauthenticated users to `/login`.
-   The `useAuth` hook provides user context and auth functions (login, logout, hasRole) throughout the authenticated parts of the app.

### AI Integration
-   Genkit is used for AI-powered features.
-   The "Suggest Rider" feature is implemented in `src/ai/flows/suggest-rider.ts`.
    -   It defines an input schema (`SuggestRiderInputSchema`) for the task location.
    -   It defines an output schema (`SuggestRiderOutputSchema`) for the suggested rider's details.
    -   A prompt is defined to instruct the LLM (Gemini via Google AI provider) on how to select a rider.
    -   This flow is called from `src/components/dispatch/SuggestRiderForm.tsx`.
-   Genkit configuration is in `src/ai/genkit.ts`, initialized with the Google AI plugin.
-   A development server for Genkit can be run to inspect flows (see [Running Genkit Developer UI](#running-genkit-developer-ui)).

### Styling & UI
-   **Tailwind CSS**: Used for utility-first styling. Configured in `tailwind.config.ts`.
-   **ShadCN UI**: Provides a set of pre-built, accessible, and customizable React components. These are located in `src/components/ui/`.
-   **Global Styles**: `src/app/globals.css` contains base styles, Tailwind layer directives, and CSS variables for the ShadCN theme (primary, accent, background colors, etc.).
-   **Fonts**: 'Inter' is used for body and headlines, configured in `src/app/layout.tsx` and `tailwind.config.ts`.
-   **Icons**: `lucide-react` is used for iconography.

## Setup and Running Instructions

### Prerequisites
-   Node.js (v18 or later recommended)
-   npm or yarn

### Installation
1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd mobilitylink-mvp
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or
    # yarn install
    ```

### Environment Variables
1.  Create a `.env` file in the root of the project.
2.  Add your Google AI API Key (e.g., Gemini API Key) for Genkit functionality:
    ```env
    GOOGLE_API_KEY=your_google_api_key_here
    ```
    *Note: The AI "Suggest Rider" feature will not work without a valid API key.*

### Running the Development Server
To run the Next.js application:
```bash
npm run dev
```
This will start the application, typically on `http://localhost:9002`.

### Running Genkit Developer UI
To explore and test Genkit flows, run the Genkit development UI in a separate terminal:
```bash
npm run genkit:dev
```
This usually starts the Genkit UI on `http://localhost:4000`. You can inspect and invoke flows like `suggestRiderFlow` from this interface.

## MVP Limitations
This project is an MVP and has certain limitations for simplicity and demonstration purposes:

-   **Mock Authentication**: User data (including passwords in plain text) is stored in `localStorage`. This is **not secure** and is for demo purposes only. Real applications require a secure backend authentication system with password hashing.
-   **No Real Database**: All data (user profiles, telemetry, punch status) is mocked or stored in component state/`localStorage`.
-   **Simulated Email Notifications**: Email sending (e.g., for registration confirmation) is simulated with toast notifications.
-   **Placeholder Map**: The live map is represented by a placeholder image. Integration with a real mapping service (like OpenStreetMap with Leaflet or Mapbox) is a future step.
-   **Mock Telemetry Data**: Vehicle telemetry data is hardcoded for demonstration.
-   **Limited Error Handling**: While some basic error handling is in place, comprehensive error management is not fully implemented.
-   **No Keycloak Integration**: The "Authentication using Keycloak" feature mentioned in the initial PRD is not implemented in this MVP; `localStorage` auth is used instead.
-   **AI is Simulated**: The "Suggest Rider" AI flow uses a prompt to an LLM. In a real system, this would need to integrate with live rider availability and location data, possibly using Genkit Tools for data retrieval.
```