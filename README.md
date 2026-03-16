# Canvas Plus — Landing Page

Marketing landing page for [canvascalculator.xyz](https://canvascalculator.xyz), a free grade dashboard for Canvas LMS students.

## What's on the page

- **Hero** — headline, tagline, CTA linking to the app
- **Stats** — 750+ users, 20+ countries, 70% weekly return rate, 100% free
- **Features** — six core features of the app
- **How it works** — 3-step onboarding guide
- **Preview** — interactive mockup of the real dashboard (drag courses to reorder, check off assignments)
- **CTA** — final call to action

## Stack

Pure HTML, CSS, and vanilla JS. No framework, no build step.

| Library | Purpose |
|---|---|
| GSAP 3.12 + ScrollTrigger | Scroll animations, counters, entrance effects |
| Lucide (UMD) | Icons |
| Instrument Serif + DM Sans | Typography (Google Fonts) |

## Local development

Just open `index.html` in a browser — no server needed.

## Deployment

Hosted on Vercel, auto-deploys on every push to `main`.

To deploy manually:
```bash
npx vercel --prod
```

## Screenshots

Drop app screenshots into `assets/screenshot.png` to populate the preview section. The `assets/` folder is gitignored.

## Links

- Live site: [usecanvascalc.com](https://usecanvascalc.com)
- App: [canvascalculator.xyz](https://canvascalculator.xyz)
- GitHub: [github.com/sahajkhandelwal1/use-canvas-calc](https://github.com/sahajkhandelwal1/use-canvas-calc)
