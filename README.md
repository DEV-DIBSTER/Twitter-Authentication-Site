# Twitter Authentication Site (Next.js Version)

This is a modern rewrite of the Twitter Authentication Site using Next.js and Shadcn UI components. The application allows users to authorize Twitter accounts to third-party software using either website-based or PIN-based authentication flows.

## Features

- Modern UI with Shadcn components
- Dark/Light mode toggle (system default by default)
- Website-based Twitter authentication
- PIN-based Twitter authentication
- Responsive design
- Server-side API routes for secure authentication

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Twitter API credentials (Consumer Token and Consumer Secret)

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
# or
yarn install
```

4. Configure the application:
   - Rename `example.config.json` to `config.json` (or use the existing one)
   - Update the configuration in `src/config/index.ts` with your Twitter API credentials

### Running the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Building for Production

```bash
npm run build
# or
yarn build
```

### Running in Production

```bash
npm run start
# or
yarn start
```

## Project Structure

- `src/app`: Next.js app router pages and API routes
- `src/components`: Reusable UI components
- `src/config`: Application configuration
- `src/lib`: Utility functions and services

## Authentication Flows

### Website-Based Authentication

1. User clicks on "Website Based Authorization"
2. User is redirected to Twitter to authorize the application
3. Twitter redirects back to the callback URL
4. User receives their access token and secret

### PIN-Based Authentication

1. User clicks on "Pin Based Authorization"
2. User is redirected to Twitter to authorize the application
3. Twitter provides a PIN
4. User enters the PIN in the application
5. User receives their access token and secret

# 🔐 License:
- Distributed under the Apache-2.0 license. See LICENSE.md for more information.
- Ask you include credits when you are using this. Link back to this repository or state my GitHub name.
