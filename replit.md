# Sacred Bells - Church Bell Chiming Application

## Overview

Sacred Bells is a web-based application that allows users to schedule and play church bell sounds throughout the day. The application features multiple bell traditions, customizable time ranges, and prayer time scheduling. Built with React and TypeScript, it provides an immersive sacred experience with liturgical design elements and authentic bell sounds.

**Recent Migration (October 2025)**
- Successfully migrated from Lovable to Replit environment
- Removed Supabase integration and dependencies
- Migrated all audio assets to local storage in `/public/audio/`
- Configured Vite development server to run on port 5000 (Replit requirement)
- Application now runs entirely locally without external dependencies

**Multilingual Infrastructure (November 2025)**
- Implemented complete i18n support using react-i18next
- Created 3 comprehensive translation files (EN, FR, IT) with 300+ keys organized by section
- Converted 15+ components to use translations (Navigation, Settings, Index, More, PrayerTimes, etc.)
- Added language switcher in Navigation bar (mobile-friendly)
- Translated all UI text: settings labels, bell names, prayer traditions, day names, buttons
- Updated bellTraditions.ts data structure to support translation keys (nameKey field)

## User Preferences

- Preferred communication style: Simple, everyday language
- Preferred language: French (français)
- DO NOT modify UI/aesthetics unless explicitly asked
- Complete multilingual support required

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for type-safe component development
- **Vite** as the build tool and development server, configured for fast HMR (Hot Module Replacement)
- **React Router** for client-side routing (main index page, premium page, and 404 handling)

**UI Component Library**
- **Radix UI** primitives for accessible, unstyled components (dialogs, dropdowns, accordions, etc.)
- **shadcn/ui** component system built on Radix, providing pre-styled components
- **Tailwind CSS** for utility-first styling with custom theme configuration
- **class-variance-authority (CVA)** for component variant management

**State Management**
- **React hooks** (useState, useEffect) for local component state
- **TanStack Query** (React Query) for server state management and caching
- Custom hooks for shared logic (useAudioPlayer, useCurrentTime, useIsMobile)

**Design System**
- Custom liturgical color palette (burgundy, amber, sacred blues) defined in CSS variables
- Sacred typography using Google Fonts: Cinzel (headings) and Cormorant Garamond (body)
- Gradient backgrounds and shadow effects for atmospheric UI
- Responsive design patterns with mobile-first approach

**Key Features Architecture**
- **Bell Sound Selection**: Users choose from cathedral bells, village bells, or carillon bells
- **Time Zone Support**: Full international time zone selection with live clock display
- **Prayer Time Scheduling**: Integration with Catholic and Orthodox prayer traditions
- **Audio Playback**: Browser-based audio player for bell sound previews
- **Configuration Display**: Real-time summary of user's selected settings

### Mobile Architecture

**Capacitor Integration**
- Capacitor 7.x configured for iOS and Android deployment
- Web-to-native bridge for mobile app capabilities
- Configuration points to Lovable project URL for live content updates

### External Dependencies

**Third-Party Services**
- **Replit Platform**: Project now hosted and deployed through Replit
- **Google Fonts**: Cinzel and Cormorant Garamond fonts loaded via CDN

**AI/ML Integration**
- **Hugging Face Transformers.js**: Client-side image segmentation for background removal using Xenova/segformer model
- WebGPU acceleration for transformer models when available

**Audio Assets**
- Bell sound files stored in `/public/audio/` directory
- MP3 format for cross-browser compatibility
- Three bell traditions with multiple audio variations:
  - Cathedral Bell: cathedral_1.mp3, cathedral_3.mp3
  - Village Bell: village_3.mp3
  - Carillon Bells: 12 variations (CARILLON_1.mp3 through CARILLON_12.mp3) - CARILLON_3.mp3 as default
- Prayer call sounds: short_call.mp3, long_call.mp3

**Development Tools**
- **ESLint** with TypeScript support for code quality
- **PostCSS** with Autoprefixer for CSS processing
- **React Hook Form** with Zod resolvers for form validation (configured but not heavily used)

**Database Preparation**
- Drizzle ORM configured with Neon serverless PostgreSQL in `server/db.ts`
- Schema defined in `@shared/schema` (not provided in repository)
- Database connection via environment variable `DATABASE_URL`
- Note: Database integration is set up but not actively used in current implementation

**UI Component Dependencies**
- 30+ Radix UI primitives for accessible interactions
- Embla Carousel for potential carousel features
- date-fns for date manipulation
- Lucide React for icon system
- Sonner and native toast systems for notifications

**Time Zone Management**
- Predefined list of major world time zones covering Americas, Europe, Asia, and Australia
- Browser's Intl API for time formatting and localization