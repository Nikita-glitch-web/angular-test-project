# AngularTestProject

A modern Angular application featuring:

- Infinite scroll and paginated API loading
- Responsive design with SCSS mixins and variables
- Material Design UI components
- SVG loader for async states
- Search and filter functionality
- Clean, scalable architecture

## Getting Started

### Development Server

Run the local server:

```bash
ng serve
```

Visit [http://localhost:4200/](http://localhost:4200/) in your browser. The app reloads automatically on code changes.

### Building for Production

Build the project:

```bash
ng build
```

Output is in the `dist/` folder, optimized for performance.

### Testing

Run unit tests:

```bash
ng test
```

Run end-to-end tests:

```bash
ng e2e
```

## Features

- **Responsive Layout:** Mobile-first, fluid grid and flex layouts.
- **Material UI:** Uses Angular Material for cards, buttons, and icons.
- **SVG Loader:** Custom animated loader for async states.
- **Search:** Real-time filtering of articles.
- **SCSS Architecture:** Shared variables and mixins for maintainable styles.

## Project Structure

- `src/app/features/` — Feature modules (home, details, etc.)
- `src/app/shared/components/` — Reusable UI components
- `src/app/core/` — Services, models, and stores
- `src/styles/` — Global SCSS variables and mixins

## Customization

- Replace the favicon in `src/index.html` and `src/assets/`
- Update SCSS variables and mixins in `src/styles/`

## Resources

- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [Angular Material](https://material.angular.io/)

---

For questions or contributions, open an issue or pull request on GitHub.
