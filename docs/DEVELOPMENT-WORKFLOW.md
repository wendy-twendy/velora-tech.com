# Velora Tech Development Workflow

## Table of Contents
- [Introduction](#introduction)
- [Development Environment Setup](#development-environment-setup)
- [Development Workflow](#development-workflow)
- [Testing](#testing)
- [Building](#building)
- [Deployment](#deployment)
- [Continuous Integration](#continuous-integration)
- [Code Standards](#code-standards)
- [Version Control](#version-control)
- [Common Development Tasks](#common-development-tasks)
- [Troubleshooting](#troubleshooting)

## Introduction

This document outlines the development, testing, and deployment processes for the Velora Tech website. It provides guidelines for contributors to ensure consistency and quality across the codebase.

The Velora Tech website is a bilingual (English and Albanian) corporate website built with TypeScript, HTML, and CSS. It follows a modular architecture with a component-based structure for UI elements.

## Development Environment Setup

### Prerequisites

- Node.js (v14+)
- npm (v6+)
- Git

### Initial Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/velora-tech.com.git
   cd velora-tech.com
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `index.html` in your browser to view the website.

## Development Workflow

The Velora Tech website follows a feature-based development workflow:

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/feature-name
   ```

2. **Implement the feature**:
   - Add/modify TypeScript modules in `src/js/modules/`
   - Add/modify components in `components/`
   - Add/modify styles in `css/`
   - Update translations in `src/locales/` if needed

3. **Run type checking**:
   ```bash
   npm run type-check
   ```

4. **Test your changes**:
   ```bash
   npm run test
   ```

5. **Build the project**:
   ```bash
   npm run build
   ```

6. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add feature: feature-name"
   ```

7. **Push your changes**:
   ```bash
   git push origin feature/feature-name
   ```

8. **Create a pull request** for review.


## Testing

The Velora Tech website uses a custom testing framework for testing components and modules.

### Running Tests

```bash
npm run test
```

This command builds the project in development mode and opens the website in a browser for manual testing.

### Test Files

- `src/js/test-runner.ts`: Test runner that executes all tests
- `src/js/test-utils.ts`: Utility functions for testing

### Writing Tests

Tests are written in TypeScript and placed in the same directory as the module being tested:

```typescript
// Example test for a module
import { testModule } from '../test-utils';

testModule('ModuleName', () => {
  // Test cases
  test('should do something', () => {
    // Test implementation
    expect(result).toBe(expected);
  });
});
```

## Building

The Velora Tech website uses Webpack for bundling and TypeScript for type checking.

### Development Build

```bash
npm run dev
```

This command starts Webpack in watch mode, which automatically rebuilds the project when files change.

### Production Build

```bash
npm run build
```

This command builds the project for production, with optimizations for size and performance.

### Build Output

The build output is placed in the `dist/` directory:
- `bundle.js`: The main JavaScript bundle
- `chunks/`: Dynamically loaded chunks (if any)

## Deployment

The Velora Tech website is deployed to GitHub Pages.

### Deployment Process

1. Build the project for production:
   ```bash
   npm run build
   ```

2. Deploy to GitHub Pages:
   ```bash
   npm run deploy
   ```

This command pushes the changes to the `main` branch, which triggers a GitHub Pages deployment.

### Deployment Configuration

The deployment is configured in the `package.json` file:

```json
{
  "scripts": {
    "deploy": "git push origin main"
  }
}
```

## Continuous Integration

The Velora Tech website uses GitHub Actions for continuous integration.

### CI Workflow

The CI workflow runs on every push to the `main` branch and pull requests:

1. Install dependencies
2. Run type checking
3. Build the project
4. Run tests
5. Deploy to GitHub Pages (only on `main` branch)

### CI Configuration

The CI configuration is defined in `.github/workflows/ci.yml`.

## Code Standards

The Velora Tech website follows these code standards:

### TypeScript

- Use TypeScript for all new code
- Add type annotations for functions and variables
- Use interfaces for complex types
- Follow the existing module pattern

### HTML

- Use semantic HTML elements
- Add `data-i18n` attributes for translatable content
- Use `data-component` attributes for component placeholders

### CSS

- Follow the existing CSS naming conventions
- Use CSS variables for colors, fonts, and other design tokens
- Organize CSS by component or feature

### Commits

- Use descriptive commit messages
- Prefix commits with the type of change (e.g., "feat:", "fix:", "docs:")
- Reference issues in commit messages when applicable

## Version Control

The Velora Tech website uses Git for version control.

### Branch Structure

- `main`: The production branch, deployed to GitHub Pages
- `feature/*`: Feature branches for new features
- `fix/*`: Fix branches for bug fixes
- `docs/*`: Documentation branches

### Pull Requests

All changes should be made through pull requests:

1. Create a branch for your changes
2. Make your changes
3. Push your branch to GitHub
4. Create a pull request
5. Wait for review and approval
6. Merge the pull request

## Common Development Tasks

### Adding a New Module

1. Create a new TypeScript file in `src/js/modules/`:
   ```typescript
   /**
    * New Module
    * Description of the module
    */
   
   // Imports
   import { SomeType } from '../../types';
   
   // Module initialization
   export function initNewModule(): void {
     // Implementation
   }
   
   // Private functions
   function privateFunction() {
     // Implementation
   }
   
   // Export public API
   export { publicFunction, publicVariable };
   ```

2. Import and initialize the module in `src/js/app.ts`:
   ```typescript
   import { initNewModule } from './modules/new-module';
   
   // Initialize the module
   initNewModule();
   ```

### Adding a New Component

1. Create a new HTML file in `components/`:
   ```html
   <!-- components/new-component.html -->
   <div class="new-component">
     <h2 data-i18n="newComponent.title">New Component</h2>
     <p data-i18n="newComponent.description">Description</p>
   </div>
   ```

2. Add translations to `src/locales/en.json` and `src/locales/al.json`:
   ```json
   {
     "newComponent": {
       "title": "New Component",
       "description": "Description"
     }
   }
   ```

3. Add the component placeholder to `index.html`:
   ```html
   <div data-component="new-component"></div>
   ```

### Adding a New Translation

1. Add the translation key and value to `src/locales/en.json`:
   ```json
   {
     "section": {
       "newKey": "English value"
     }
   }
   ```

2. Add the translation to `src/locales/al.json`:
   ```json
   {
     "section": {
       "newKey": "Albanian value"
     }
   }
   ```

3. Use the translation key in HTML:
   ```html
   <element data-i18n="section.newKey">English value</element>
   ```

## Troubleshooting

### Common Issues

#### TypeScript Errors

If you encounter TypeScript errors:

1. Check the error message in the console
2. Verify that all imports and exports are correct
3. Ensure that types are properly defined
4. Run `npm run type-check` to see all type errors

#### Component Loading Issues

If components are not loading:

1. Check the browser console for errors
2. Verify that the component file exists in the `components/` directory
3. Check that the `data-component` attribute is correct
4. Verify that the component-loader module is initialized

#### Translation Issues

If translations are not working:

1. Check that the translation key exists in the locale files
2. Verify that the `data-i18n` attribute is correct
3. Check that the language-manager and translation-service modules are initialized
4. Verify that the language is correctly set

#### Build Issues

If the build is failing:

1. Check the error message in the console
2. Verify that all dependencies are installed
3. Check for TypeScript errors
4. Try cleaning the `dist/` directory and rebuilding
