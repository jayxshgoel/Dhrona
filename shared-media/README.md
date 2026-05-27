# Shared Media

All static media assets for the Dhrona app live here. When you need an image, icon, illustration, or banner — **look here first** before searching through source files.

## Folder Structure

| Folder | What goes here |
|---|---|
| `logos/` | Dhrona brand logos — full wordmark, icon-only, light variant, dark variant |
| `app-icons/` | App store icons (1024×1024), adaptive icon, favicon, splash screen |
| `illustrations/onboarding/` | Visuals for the role-selection and intro screens |
| `illustrations/empty-states/` | "No tests yet", "No students", "No results" placeholder illustrations |
| `illustrations/roles/` | Teacher / Student / Parent hero/role-card images |
| `avatars/` | Default profile pictures — one per role (teacher, student, parent) |
| `subjects/` | Subject thumbnails/icons — Physics, Maths, Chemistry, Biology |
| `ui-icons/` | Custom icons used in navigation, buttons, or cards (export as SVG + PNG) |
| `banners/` | Subscription page banners, promotional visuals, feature highlight graphics |

## Naming Convention

Use lowercase kebab-case. Include a descriptor suffix where relevant:

```
dhrona-logo-full-light.svg
dhrona-logo-icon-dark.png
illustration-empty-tests.png
avatar-teacher-default.png
subject-physics.png
banner-premium-upgrade.png
icon-question-bank.svg
```

## File Format Guidelines

- **Logos & UI icons** → SVG preferred (scalable); also export PNG @2x and @3x for React Native
- **Illustrations & banners** → PNG (transparent bg where needed)
- **Subject thumbnails / avatars** → PNG, minimum 256×256
- **App store assets** → Follow [Expo's asset guidelines](https://docs.expo.dev/develop/user-interface/splash-screen-and-app-icon/)

## How to Reference in Code

```tsx
// React Native
import logo from '@shared-media/logos/dhrona-logo-full-light.png';

// Or via relative path from a component
import { Image } from 'react-native';
<Image source={require('../../../shared-media/subjects/subject-physics.png')} />
```

## Adding New Assets

1. Drop the file into the correct subfolder (create a new one if the category doesn't fit)
2. Follow the naming convention above
3. Update this README if you add a new subfolder
4. Commit — this folder is always tracked by git
