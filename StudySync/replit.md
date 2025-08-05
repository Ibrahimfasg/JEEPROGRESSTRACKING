# Overview

This is a JEE Study Tracker application designed for two study partners to track their progress through JEE (Joint Entrance Examination) preparation. The application allows students to log in as either "Him" or "Her", track their progress through Physics, Chemistry, and Mathematics syllabi, create daily study plans, and compare their progress with their study partner through interactive charts and visualizations.

# User Preferences

Preferred communication style: Simple, everyday language.
Deployment preferences: Firebase for database, GitHub for version control, Netlify for hosting.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development and building
- **UI Library**: shadcn/ui components built on Radix UI primitives for consistent, accessible design
- **Styling**: Tailwind CSS with CSS variables for theming and glassmorphism design effects
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Charts**: Chart.js for rendering comparative progress charts between study partners

## Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript with ES modules for type safety and modern JavaScript features
- **Session Management**: Basic authentication with username/password verification
- **Storage**: In-memory storage implementation with interface for future database integration
- **API Design**: RESTful endpoints for authentication, progress tracking, and daily study management

## Data Storage Solutions
- **Current Implementation**: In-memory storage using Maps for development/demo purposes
- **Database Ready**: Drizzle ORM configured with PostgreSQL schema definitions
- **Firebase Integration**: Planned migration to Firebase Firestore for persistent cloud storage
- **Schema**: Three main entities - users, progress_data, and daily_study with proper relationships
- **Migration Support**: Drizzle Kit configured for database migrations and schema management

## Authentication and Authorization
- **Simple Authentication**: Username/password login system with predefined users ("him"/"her")
- **User Context**: User state managed in React with logout functionality
- **Session Persistence**: Basic session handling without complex JWT or cookie management
- **Avatar System**: Gender-based avatar selection (boy/girl) with emoji representations

## External Dependencies
- **Database**: Neon Database (serverless PostgreSQL) configured but not yet connected
- **Firebase**: Ready for integration with Firestore database and authentication
- **UI Components**: Extensive use of Radix UI primitives for accessibility and interaction patterns
- **Development Tools**: 
  - ESBuild for server bundling
  - PostCSS with Autoprefixer for CSS processing
  - Vite for development and building
  - TypeScript for type safety
- **Styling Framework**: Tailwind CSS with custom configuration for design system
- **Type Safety**: Zod schemas for runtime validation and type inference

## Recent Changes (August 5, 2025)
- Fixed all TypeScript type errors and accessibility warnings
- Application fully functional with authentication and progress tracking
- Ready for Firebase integration and deployment setup