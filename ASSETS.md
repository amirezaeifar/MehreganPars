# Hero artwork and design references

Asset: `public/images/care-hero.png`
Method: built-in image_gen tool; original generated artwork, not a photograph of the organisation's actual staff or premises.
Usage: campaign hero and editorial care feature.

## Final generation prompt

Create a premium photorealistic editorial website hero photograph, very wide landscape 16:9. For an Iranian health and rehabilitation holding company called Mehregan, no text, no logos. A bright contemporary physiotherapy studio, warm daylight through tall windows. Left half of composition: a friendly female Iranian physiotherapist wearing modest ivory clinical tunic and a neatly draped light neutral headscarf, attentively supporting a mature male patient's arm as he practices a simple standing mobility exercise beside a wooden rehabilitation barre, both fully dressed, calm authentic natural interaction. Tasteful red accent in physiotherapy equipment or small stool, warm pale pink and off-white interior. Right 40 percent mostly quiet architectural light and pale background suitable for overlaying large dark typography. Credible anatomically correct hands, elegant magazine photography, authentic lived-in healthcare, neither hospital emergency nor generic futuristic technology. Muted photographic color, beautifully lit, understated but alive. Wide composition, generous negative space.

## Interface direction

- https://www.apple.com/ — compact global navigation, expandable grouped navigation, product-led presentation.
- https://www.virgin.com/ — requested direction for red/white colour blocking and an editorial group-of-brands composition. Direct retrieval returned HTTP 403; indexed Virgin company and story pages were available.
- Mehregan's care, movement, recovery, mental wellbeing and nutrition are the content foundation. No Apple or Virgin logos or marketing copy are reused.

## Refined imagery

Article illustrations are original assets generated with the built-in image tool and saved locally as `public/images/article-movement.png`, `article-knee.png`, and `article-mind.png`. Each has distinct subject matter within the same red, blush, charcoal and ivory sculptural editorial style. The final prompts are recorded below.

1. Movement: Original editorial illustration for a health journal article about small daily movements and feeling better. Landscape 4:3 image, NO TEXT. Cohesive visual system: sculptural matte clay-like 3D forms, soft paper texture, vivid vermilion red, pale blush pink, dark charcoal and ivory. A single abstract human figure in comfortable clothes stretching arms gently, confident accessible anatomy, subtle curved motion trail. Sophisticated magazine art direction, simple graphic silhouette, large shapes, crisp lighting. Avoid hospital equipment, stock photo aesthetics and any lettering.
2. Knee: Original editorial illustration for a health journal article about knee health and physiotherapy. Landscape 4:3 image, NO TEXT. Match a visual series: sculptural matte clay-like 3D forms, soft paper texture, vivid vermilion red, pale blush pink, dark charcoal and ivory. Close composed view of a bent leg and knee shown as a gentle anatomical-inspired form with supportive rounded bands and curved motion trail; reassuring and nonclinical, clearly about movement and joint care. Sophisticated magazine art direction, simple graphic silhouette, large shapes, crisp lighting. No lettering.
3. Mind: Original editorial illustration for a health journal article about peace of mind during rehabilitation. Landscape 4:3 image, NO TEXT. Match a visual series: sculptural matte clay-like 3D forms, soft paper texture, vivid vermilion red, pale blush pink, dark charcoal and ivory. An abstract relaxed human face in profile with layered arcs and flowing shapes conveying calm, emotional support and recovery. Sophisticated magazine art direction, simple graphic silhouette, large shapes, crisp lighting. Avoid lotus icons, brains, hospital equipment and lettering.

Historical image setup (replaced on 2026-10-12): the campaign and mission sections requested external Pexels photographs with generated fallbacks. Previous sources: [physiotherapy session by Funkcinės Terapijos Centras](https://www.pexels.com/photo/physiotherapist-helping-patient-to-exercising-20860618/) and [doctor-patient conversation by Pavel Danilyuk](https://www.pexels.com/photo/a-doctor-talking-to-his-patient-7108157/). These are editorial stock images, not pictures of Mehregan staff or facilities.


## Local editorial refresh — 2026-10-12

All active home, journal and care-directory image references now use local files in `public/images`. External Pexels and Unsplash downloads timed out, so the new artwork was created with the built-in image generation tool. These are illustrative generated scenes, not photographs of actual Mehregan staff, facilities or patients. Generated originals are retained in the Codex image library; project copies are JPEGs resized to 1400px (1600px for the campaign) at quality 86.

| Asset | Subject and use |
| --- | --- |
| `care-session.jpg` | Optimized version of the existing generated care hero; home campaign and health-centre introduction. |
| `daily-care.jpg` | Warm conversation between two women in a sunlit room; home mission, about hero and Oncopars. |
| `journal-life.jpg` | Open book, tea and olive branch by a window; journal hero. |
| `movement.jpg` | Gentle standing movement beside a chair; daily-movement article and Physiopars. |
| `knee-care.jpg` | Calm close-up of a seated person resting a hand above their knee; knee-care article. |
| `quiet-moment.jpg` | A quiet moment looking into a garden; mental-wellbeing article and Psychopars. |
| `nutrition.jpg` | Simple fresh salad, whole-grain bread and water; Telenutrition and nutrition draft cover. |

Art direction: natural daylight, restrained sage and oak palette, simple compositions, no embedded lettering, no decorative medical overlays. The old SVG and PNG article assets are retained but are no longer selected by `articleImages.ts`.

## Final contextual imagery — 2026-10-12

This section supersedes the image assignments above. These 17 original images were generated with the built-in image tool and optimized locally to 1400px JPEGs at quality 86. Generated scenes illustrate the context; they do not depict actual staff or patients. Every major section has its own image, while an article consistently uses its own cover in cards and reading views.

| Assets in `public/images` | Current role |
| --- | --- |
| `article-movement-art.jpg`, `article-knee-art.jpg`, `article-mind-art.jpg`, `article-nutrition-art.jpg` | Cohesive non-photorealistic paper/gouache article illustrations: burgundy, blush, ivory and sage; movement, knee care, mental wellbeing and nutrition respectively. |
| `mission-life.jpg` | Home mission: everyday wellbeing through a father and daughter walking in a garden. |
| `about-connected.jpg` | About page: clinicians collaborating around a shared care plan. |
| `overview-health.jpg` | Health-centre overview: an attentive clinician-patient conversation. |
| `directory-health.jpg`, `directory-physio.jpg`, `directory-onco.jpg`, `directory-psycho.jpg`, `directory-nutrition.jpg` | Separate contextual images for the five platform cards in the directory. |
| `brand-health.jpg`, `brand-physio.jpg`, `brand-onco.jpg`, `brand-psycho.jpg`, `brand-nutrition.jpg` | Distinct human-centred photographs for each platform site's hero, coordinated with its brand palette. |

`journal-life.jpg` remains the magazine hero. Existing `movement.jpg`, `daily-care.jpg`, `quiet-moment.jpg` and `nutrition.jpg` now serve only their corresponding platform overviews. Earlier article cover assets are retained but inactive.
## Home mission image revision

`public/images/mission-care-conversation.jpg` replaces `mission-life.jpg` on the home page. Created with the built-in image generation tool; optimized to a 1200px JPEG. This generated scene illustrates a specialist listening to a visitor, with warm daylight and understated burgundy accents.

Final generation prompt: Create a premium natural editorial photograph for an Iranian integrated healthcare website's mission section 'Health is part of life'. Portrait 4:5 composition. A warm attentive female Iranian health specialist in a simple ivory tunic and neatly draped beige headscarf, seated at the same level as an adult woman wearing a muted burgundy cardigan and light headscarf, in a beautiful light-filled community wellness consultation room. They are having a relaxed genuine conversation about everyday wellbeing; both faces clearly visible in a three-quarter side view, gentle natural expressions, hands resting naturally on a small oak table with a simple open notebook. Not looking at camera. Large window with softly out-of-focus garden greenery, warm ivory walls, subtle dusty rose and deep burgundy accents matching an elegant health brand. The scene must communicate listening, thoughtful coordinated care and human connection, not generic outdoor lifestyle, not exercise, not a team meeting. Minimal composition, only two people, medium framing, both faces grouped within central 65 percent safe for website cropping, subtle realistic skin texture, soft daylight, sophisticated restrained magazine photography, no excessive props, no medical machinery, no logos, no text or watermark.

