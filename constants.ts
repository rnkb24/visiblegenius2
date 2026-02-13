import { StylePreset } from "./types";

export const MODEL_NAME = 'gemini-3-pro-image-preview'; // Nano Banana Pro

export const PLACEHOLDER_IMAGE = 'https://picsum.photos/800/600';

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'architectural',
    label: 'Architectural Genius',
    description: 'UPLOAD A RENDERING TO PROCESS IT AS A REAL PHOTO.',
    prompt: `Render the image in a realistic contemporary architectural photography style with an eye-level viewpoint. Keep the architecture, urban context, paving, trees, benches, and surrounding buildings exactly the same as the original image, with no changes to layout, proportions, or composition. Use hard daylight lighting, allowing shadows. Materials should appear realistic and understated - metal mesh, glass, stone paving, and concrete - without overtly added textures or stylization. Include minimal human presence with slight motion blur to suggest everyday activity. Add dramatic late afternoon lighting, with cinematic effects, and slight saturation. The final image should feel calm, documentary, and architecturally precise, like a professional European architectural photograph of a built project. Shot on Kodak Kodachrome.`
  },
  {
    id: 'cinematic-sheet',
    label: 'Cinematic Contact Sheet',
    description: 'UPLOAD YOUR PHOTO FOR A 9-PANEL CONTACT SHEET FROM DIFFERENT ANGLES.',
    prompt: `Examine the input image and identify every main subject (person, group, vehicle, object) and how they relate within the scene.

Create a unified 3x3 "Cinematic Contact Sheet" that shows these exact subjects in the same environment across 9 distinct shot types.

Adapt each shot to fit the content while keeping all subjects consistent across the grid (same clothing, lighting, environment).

**Row 1 – Establishing**
1. **Extreme Long Shot (ELS):** Subjects appear small within the wider setting.
2. **Long Shot (LS):** Full body or full object visible from top to bottom.
3. **Medium Long Shot (MLS / 3-4):** Knees-up framing (for people) or a 3/4 object view.

**Row 2 – Core Coverage**
4. **Medium Shot (MS):** Waist-up or centered on the main part of the object.
5. **Medium Close-Up (MCU):** Chest-up, more intimate framing.
6. **Close-Up (CU):** Tight focus on the face or the front of the object.

**Row 3 – Details & Angles**
7. **Extreme Close-Up (ECU):** Macro detail on a key feature (eyes, hands, texture, logo).
8. **Low Angle:** Looking up from below (strong, heroic).
9. **High Angle:** Looking down from above (overview).

Maintain continuity across all panels: same subjects, same setting, and natural depth-of-field progression.

The final output is a 9-panel cinematic storyboard that covers wide context, mid-range framing, and detailed angles in a photorealistic, consistently graded style.`
  },
  {
    id: 'luxury-fashion',
    label: 'Luxury Fashion Shoot',
    description: 'UPLOAD A PHOTO TO TRANSFORM INTO A BOLD LUXURY FASHION EDIT.',
    prompt: `shot on medium-format film look, fashion magazine aesthetic, timeless, bold, intimate, confrontational.`
  },
  {
    id: 'lego-it',
    label: 'LEGO IT',
    description: 'UPLOAD ANY IMAGE TO RECONSTRUCT IT ENTIRELY OUT OF LEGO BRICKS.',
    prompt: `Convert this image into a Lego world, everything is made out of lego. Try to respect the general theme of the image. Render as a high-detail physical Lego set with plastic textures and studs visible. Maintain original composition and lighting. Sharp focus, vibrant colors, toy photography style.`
  },
  {
    id: 'story-sequence',
    label: 'STORY SEQUENCE GRID',
    description: 'UPLOAD A MOMENT TO GENERATE A 9-PANEL NARRATIVE SEQUENCE.',
    prompt: `Analyze the input image and identify the main subjects, their actions, the environment, and the implied narrative or moment in time.

Create a unified 3x3 " Sequence Grid" that imagines what happens NEXT in this story across 9 sequential scenes. Each panel should show a progression in time, not different camera angles.

Keep the same characters, art style, and visual consistency throughout all panels.

**Row 1 – Immediate Next Moments**
1. **Scene 1:** The very next moment after the reference image (seconds later).
2. **Scene 2:** A small action or reaction follows.
3. **Scene 3:** The situation develops slightly.

**Row 2 – Rising Action**
4. **Scene 4:** Something changes or a new element is introduced.
5. **Scene 5:** The characters respond or interact with the change.
6. **Scene 6:** Tension or interest builds.

**Row 3 – Climax & Resolution**
7. **Scene 7:** A key moment or turning point.
8. **Scene 8:** The aftermath or consequence.
9. **Scene 9:** A concluding scene or new equilibrium.

Maintain visual continuity: same characters (clothing, appearance), consistent environment, coherent lighting progression (if time passes), and unified art style.

The final output is a 9-panel sequential story grid that tells a visual narrative continuing from the reference image, like frames from a graphic novel or film storyboard.`
  },
  {
    id: 'lighting-styles',
    label: 'LIGHTING STYLES',
    description: 'UPLOAD A PORTRAIT TO STUDY IT ACROSS 9 PROFESSIONAL STUDIO LIGHTING SETUPS.',
    prompt: `Create a clean 3x3 grid layout showcasing nine professional lighting setups applied to the same male portrait.
Use the provided portrait as the base image. Keep the same camera angle, framing, facial expression, and background across all nine images.
Each square should demonstrate a different lighting style, clearly distinct in mood and technique.
Display the name of the lighting setup below each portrait using clean, readable typography.

-Lighting styles to include:
-Rembrandt Lighting
-Split Lighting
-Butterfly Lighting
-Loop Lighting
-Soft Natural Light
-Hard Dramatic Light
-Cinematic Side Light
-High-Key Lighting
-Low-Key Lighting

Ensure lighting accuracy for each setup: correct shadow placement, contrast, and falloff.
The overall presentation should feel cinematic, professional, and educational — suitable for a photography or filmmaking masterclass.
Neutral background, consistent color grading, sharp focus, no stylistic distortion.
Avoid over-processing or artificial effects.`
  },
  {
    id: 'make-me-thin',
    label: 'MAKE ME THIN',
    description: 'UPLOAD A FULL BODY PHOTO FOR SUBTLE ANATOMICAL REFINEMENT.',
    prompt: 'Retake this image and make the person in it look slim'
  }
];