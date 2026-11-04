# BLUE — brand implementation notes

## Source of the identity

This implementation follows the user-supplied second brief: **BLUE — Your Creative Partner**, Instagram `@blue.creative.partner`, **since 2016**, with a dark cinematic blue identity. The palette and logo coordinates below are explicit requirements, not image-color estimates.

The attached logo was visible in the original request. No Instagram screenshots, post images, representative captions, or official master font files were supplied or inspected. The page therefore follows the provided brief and approved logo geometry; it does not claim to reproduce unseen Instagram layouts or derive copy from unseen captions.

## Exact palette

| Token        | Hex       | Role                                                   |
| ------------ | --------- | ------------------------------------------------------ |
| `--navy`     | `#00008F` | Original navy logo triangles and deep brand surfaces   |
| `--cyan`     | `#00B4FA` | Original cyan logo triangle, focus rings, neon accents |
| `--electric` | `#1F2BFF` | Electric highlights, gradients, motion emphasis        |
| `--bg`       | `#05081A` | Main cinematic background                              |
| `--bg2`      | `#0A1030` | Raised surfaces and alternating sections               |
| `--ink`      | `#FFFFFF` | Primary text and original logo wordmark                |
| `--muted`    | `#9AA6D1` | Secondary copy and quiet interface details             |

Use the blue family and white only. Dividers, glass surfaces, glows, gradients, and noise may derive opacity from these shared tokens; they do not introduce unrelated colors. Keep readable text on sufficiently contrasting surfaces. Cyan focus rings remain visible on the dark canvas. Do not rely on neon glow alone to identify an active control.

## Logo geometry and usage

The reusable SVG uses `viewBox="0 0 381 704"` with these exact triangle vertices:

- Top navy: `(0,0) (304,176) (0,353)`.
- Bottom navy: `(0,353) (304,528) (0,704)`.
- Cyan notch: `(381,176) (381,528) (78,353)`.

The cyan triangle contains the white, widely tracked BLUE wordmark around `x=272, y=365` and the tiny uppercase YOUR CREATIVE PARTNER line around `y=392`. The implementation supports full, icon, and horizontal logo variants. The favicon preserves the triangle motif at a compact scale.

Never recolor, stretch, reverse, or alter the logo’s triangle proportions. Assembly animation moves the original shapes into place; it does not change their final geometry or color. When the logo sits on a dark surface, provide space and contextual light behind it rather than painting its navy triangles another color.

A working clear-space rule is one quarter of the icon width around the complete mark. This is a proposed layout rule, not a supplied official brand standard. Treat tiny wordmark details as decorative at favicon size and use the recognizable geometry there.

## Typography

The selected self-hosted fonts come from the families permitted in the brief:

- **Archivo Black** for heavy English poster headlines.
- **Manrope** for clean Latin body copy and interface text.
- **IBM Plex Sans Arabic** for Arabic headlines, body copy, and controls.

These are implementation choices from the brief, not a claim to identify the original Instagram font. Font files use `font-display: swap`; retain their accompanying licenses. English display text uses bold uppercase rhythm, contrast in size, and wide-tracked small labels. Arabic has no artificial letter spacing and keeps comfortable line height and complete glyph forms.

## Composition and visual language

The signature is a large, assembled triangular BLUE mark surrounded by electric atmosphere. Oversized poster typography, controlled edge bleeding, dark-to-electric gradients, a subtle SVG film-grain layer, and neon line-work keep the page cinematic. Cyan/electric glows signal emphasis and hover/focus states without washing out the copy.

Work tiles are local CSS/SVG duotone concepts. Each poster carries a small BLUE / YOUR CREATIVE PARTNER signature. Mesh, handshake, megaphone, triangle, and orbit metaphors should be drawn rather than borrowed from stock-photo libraries. Replace demonstration artwork with approved project images through the data files.

## Copy and evidence

Core language comes from the supplied voice direction:

- “More than Design, It’s Impact.”
- “We’re not just a design studio. We’re your creative partner.”
- “Content is not filler. It’s your brand’s voice.”
- “Don’t just post. Create a reason to stop.”
- “Game on.”

Arabic is the default and uses warm, confident Egyptian-friendly phrasing. English carries the same practical promise, rather than a rigid literal translation. Headlines stay short; CTAs describe a useful next step.

“Since 2016” is supplied business information. Concept projects, their result placeholders, team entries, testimonials, and sample articles are clearly labeled as illustrative. They are not evidence of real clients, campaign performance, endorsements, staff identities, or agency milestones. Do not remove those labels until the material is verified and approved.

## Motion and accessibility

Framer Motion supplies page transitions, reveals, logo assembly, counters, and portfolio layout changes. Reduced-motion preferences suppress decorative movement and keep every control and piece of content usable. A scrolling outlined-text marquee is decorative; it must not be the only place meaningful copy appears.

Keyboard focus uses visible cyan treatment. Menus, dialogs, accordions, and carousels need meaningful names, working dismissal/navigation, and sensible focus placement. RTL mirrors directional arrows and layouts while preserving the logo’s original geometry and the reading direction of phone numbers, URLs, and Latin identifiers.

## Before publication

Confirm official artwork and font approval; replace the phone, email, city, public URL, project imagery, team profiles, numeric results, quotes, and sample articles. Supply representative Instagram posts and captions if a later pass should align the site with specific real-world campaign layouts and writing patterns.
