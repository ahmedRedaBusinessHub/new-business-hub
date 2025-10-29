# BusinessHub Documentation

## Project Overview

BusinessHub is a modern web application built with Next.js 16, featuring a multi-language interface, authentication system, and theme customization. The application is designed to serve both administrative and client-side functionalities.

## Technology Stack

- **Frontend Framework**: Next.js 16.0.0
- **Language**: TypeScript
- **Styling**: TailwindCSS 4.1
- **Authentication**: NextAuth.js 5.0
- **Internationalization**: next-intl 4.4
- **Theme Management**: next-themes 0.4.6
- **React**: 19.2.0

## Project Structure

### Core Directories

```
src/
├── app/                    # Next.js app router
├── components/            # Reusable React components
├── config/               # Configuration files
├── contexts/             # React context providers
├── i18n/                # Internationalization setup
├── lib/                 # Utility functions
└── types/              # TypeScript type definitions
```

### Key Features

1. **Multi-language Support**

   - Supported languages: English (en) and Arabic (ar)
   - Language files located in `messages/` directory
   - Implemented using next-intl

2. **Authentication**

   - Handled by NextAuth.js
   - Configuration in `src/auth.config.ts`
   - Login functionality in `src/components/auth/LoginForm.tsx`

3. **Routing Structure**

   - Guest routes: Landing page, Login page
   - Protected routes:
     - Admin dashboard
     - Client dashboard
     - Data entry
     - Store management
     - User management
     - Settings

4. **Theme System**

   - Light/Dark mode support
   - Theme configuration in `src/config/themes.ts`
   - Theme provider in `src/contexts/ThemeProvider.tsx`

5. **UI Components**
   - Custom components in `src/components/ui/`
   - Includes: Button, Card, Checkbox, Input, Label, Select, Textarea

## Getting Started

1. **Installation**

   ```bash
   npm install
   ```

2. **Development**

   ```bash
   npm run dev
   ```

   This will start the development server on http://localhost:3000

3. **Building for Production**
   ```bash
   npm run build
   npm start
   ```

## Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Database Configuration
DATABASE_URL=your-database-url

# API Keys (if needed)
API_KEY=your-api-key
```

## Directory Details

### `/src/app/[locale]`

- Contains locale-specific routes
- Divided into guest and authenticated sections
- Global styling and layouts

### `/src/components`

- **auth/**: Authentication-related components
- **icons/**: SVG icons and icon components
- **landing/**: Landing page components
- **layout/**: Main layout components (Header, Footer, Sidebar)
- **ui/**: Reusable UI components

### `/src/config`

- **navigation.ts**: Navigation menu configuration
- **themes.ts**: Theme configuration

### `/src/contexts`

- Contains React context providers
- Theme provider implementation

### `/src/i18n`

- Internationalization setup
- Request handling for language detection

### `/src/lib`

- **geo.ts**: Geolocation utilities
- **utils.ts**: General utility functions

## Development Guidelines

1. **Code Style**

   - Use TypeScript for type safety
   - Follow ESLint configuration
   - Use Tailwind CSS for styling

2. **Component Creation**

   - Place reusable components in `/src/components/ui`
   - Feature-specific components go in their respective feature directories

3. **Routing**

   - Use Next.js App Router
   - Place new pages in appropriate [locale] subdirectories
   - Protected routes should be in the (app) directory

4. **Internationalization**

   - Add new strings to both `messages/en.json` and `messages/ar.json`
   - Use translation keys consistently

5. **Authentication**
   - Protected routes are handled by middleware
   - Configure new auth providers in `auth.config.ts`

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run lint`: Run ESLint

## Performance Considerations

1. **Optimization**

   - Use Next.js Image component for images
   - Implement lazy loading for routes
   - Use proper caching strategies

2. **SEO**
   - Implement metadata in route layouts
   - Use proper semantic HTML
   - Configure robots.txt and sitemap.xml

## Security

1. **Authentication**

   - Protected routes using middleware
   - Secure session management with NextAuth.js
   - Role-based access control

2. **Data Safety**
   - Input validation
   - XSS protection
   - CSRF protection

## Deployment

1. **Prerequisites**

   - Node.js 18+ installed
   - Environment variables configured
   - Database setup completed

2. **Deployment Steps**
   ```bash
   npm install
   npm run build
   npm start
   ```

## Troubleshooting

Common issues and solutions:

1. **Authentication Issues**

   - Verify environment variables
   - Check NextAuth configuration
   - Ensure middleware is properly configured

2. **Styling Issues**

   - Run build process to generate CSS
   - Check Tailwind configuration
   - Verify class naming conventions

3. **API Routes**
   - Check API route handlers
   - Verify authentication middleware
   - Ensure proper error handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is private and proprietary. All rights reserved.
