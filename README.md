# Shora Financial Blog Platform

A TypeScript-based financial blog platform with server-side rendering (SSR) using Next.js. The platform automatically fetches financial news using a Node.js worker, generates blog posts using AI with suitable generated images, and stores them in Firebase via an internal API.

## Features

- **Multilingual Support**: Full support for English and Hebrew languages with RTL capabilities
- **Server-Side Rendering**: Fast page loads and SEO optimization with Next.js SSR
- **Automated Content Generation**: AI-powered article generation from financial news sources
- **Stock References**: Each article includes keywords of the stocks it references
- **Admin Capabilities**: Admins can manually edit articles through the UI
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend Framework**: Next.js (with SSR)
- **Language**: TypeScript
- **Database**: Firebase Firestore
- **Backend API**: Express API routes
- **AI Integration**: OpenAI integration for content generation
- **Automation**: Node.js worker app that runs periodically to fetch news and publish articles
- **Architecture**: Modular monorepo with shared models and encapsulated services

## Project Structure

```
/shora
├── /apps
│   ├── /web                   # Next.js frontend
│   ├── /api                   # Express API backend
│   └── /worker                # Node.js worker for automated news aggregation & article generation
├── /packages
│   └── /common                # Shared TypeScript models (e.g., Article.ts, Stock.ts)
├── /services
│   ├── /ai-agent              # Logic to generate articles using an AI model
│   └── /firebase              # Firebase setup
│       ├── config.ts          # Firebase initialization
│       ├── firestoreClient.ts # Firestore client helpers
│       └── authClient.ts      # Firebase Auth
├── /scripts
│   └── test-system.sh         # Script to test the complete system
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- Firebase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd shora
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in each app directory with the following variables:

   ```
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   
   # OpenAI Configuration (for worker and AI agent)
   OPENAI_API_KEY=your_openai_api_key
   ```

### Running the Applications

#### Frontend (Next.js)

```bash
cd apps/web
npm run dev
```

The frontend will be available at http://localhost:3000

#### API Backend

```bash
cd apps/api
npm run dev
```

The API will be available at http://localhost:3001

#### Worker (for content generation)

Run once:
```bash
cd apps/worker
npm run generate
```

Or start in scheduled mode:
```bash
cd apps/worker
npm run start
```

## Core Components

### Common Models

Shared TypeScript interfaces used across all applications:

- `Article`: Represents a blog post with multilingual content
- `Stock`: Represents a stock with price information and references
- `User`: Represents a user with authentication details and preferences

### Firebase Services

Services for interacting with Firebase:

- `FirestoreClient`: Helper for database operations
- `AuthClient`: Helper for authentication operations

### Next.js Frontend

A server-side rendered React application with the following pages:

- `Home`: Landing page with featured articles and market overview
- `Articles`: List of all articles with filtering capabilities
- `Stocks`: List of stocks with price information and related articles
- `Benefits`: Information about the platform's benefits
- `Login`: User authentication page

### API Backend

Express API with the following endpoints:

- `/api/articles`: CRUD operations for articles
- `/api/stocks`: CRUD operations for stocks
- `/api/auth`: Authentication operations

### Worker Application

Node.js application that:

- Fetches financial news from various sources
- Uses AI to generate article content in multiple languages
- Creates images for articles
- Publishes articles to the API

### AI Service

Service for generating content using AI:

- `AIAgent`: Class for generating article content and tags

## Deployment

The platform can be deployed to various hosting services:

- Frontend: Vercel, Netlify, or Firebase Hosting
- API: Cloud Functions, Heroku, or any Node.js hosting
- Worker: Cloud Functions with scheduled triggers or any Node.js hosting

## License

This project is licensed under the MIT License - see the LICENSE file for details.
