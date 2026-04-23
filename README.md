# Rojo Jacob — iOS Portfolio

Personal portfolio site for **Rojo Jacob**, Associate Team Lead & Senior iOS Developer at Webandcrafts.

Live at: https://rojojacob.github.io/rojo-portfolio/

## What's inside

A single-file, hand-tuned HTML portfolio featuring:

- Hero with a portrait and 8 app icons that burst out from the phone on load
- Interactive toolkit filter with a liquid/gooey transition between categories
- Horizontal-scrolling work gallery with 8 project cards, each with its own original iOS-style mock screen
- Animated process terminal
- Testimonials carousel
- Experience timeline, awards, education + languages, contact
- Command palette (⌘K), custom cursor, particle background, and more

## Tech

- Plain HTML/CSS/JS — no build step
- [GSAP 3.12](https://gsap.com) + ScrollTrigger for scroll and filter animations
- [Lenis](https://github.com/studio-freight/lenis) for smooth scroll
- Google Fonts: Space Grotesk, Instrument Serif, JetBrains Mono

## Local preview

Just open `index.html` in any modern browser, or serve locally:

```bash
# any of these work:
python3 -m http.server 8000
npx serve .
```

Then visit `http://localhost:8000`.

## Deploy

Hosted on GitHub Pages. Pushing to `main` redeploys automatically.

## Analytics

The site is wired to **Google Analytics 4** (GA4), property **"My Portfolio"**, Measurement ID **`G-4RFYGT3J9B`**. The ID lives in the `<!-- Analytics -->` block near the top of `<head>` in `index.html` — edit that one line if the property ever changes.

### What's tracked

| Event            | When it fires                                           | GA4 params                          |
|------------------|----------------------------------------------------------|--------------------------------------|
| `page_view`      | Page load (automatic)                                    | standard GA4 fields                  |
| `resume_download`| Click on the Download Resume link                        | `file_name`, `link_text`             |
| `outbound_click` | Click on any external link (mailto, LinkedIn, GitHub, …) | `link_url`, `link_domain`, `link_text` |
| `scroll_depth`   | First time 25 / 50 / 75 / 100 % of the page is visible   | `percent`                            |
| `section_view`   | First time each major section scrolls ~40 % on screen    | `section_id` (hero, about, skills, work, process, testimonials, experience, awards, contact) |

Implementation lives in [`assets/analytics.js`](assets/analytics.js).

### Where to look in GA4

- **How many people viewed the site** → *Reports → Life cycle → Acquisition → Traffic acquisition*. The **Users** column is unique visitors, **Sessions** is visits, **Views** is page loads.
- **Where visitors come from** → same report, *Session source / medium* dimension.
- **Geography & devices** → *Reports → User → Demographics / Tech*.
- **What visitors actually care about** → *Reports → Engagement → Events*. Look at counts for `section_view` (which sections get attention), `scroll_depth` (do they read to the bottom?), `resume_download` and `outbound_click` (real recruiter signal).
- **Where people drop off** → compare `section_view` counts across sections; the biggest drop is the section to rework first.

## Contact

- Email: rojojacob1999@gmail.com
- LinkedIn: [rojo-jacob](https://www.linkedin.com/in/rojo-jacob)
- Phone: +91 89434 69008
