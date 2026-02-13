import { StylePreset } from "./types";

export const MODEL_NAME = 'gemini-3-pro-image-preview'; // Nano Banana Pro

export const PLACEHOLDER_IMAGE = 'https://picsum.photos/800/600';

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'architectural',
    label: 'Architectural Genius',
    description: 'Realistic, high-end European architectural photography.',
    prompt: `Render the image in a realistic contemporary architectural photography style with an eye-level viewpoint. Keep the architecture, urban context, paving, trees, benches, and surrounding buildings exactly the same as the original image, with no changes to layout, proportions, or composition. Use hard daylight lighting, allowing shadows. Materials should appear realistic and understated - metal mesh, glass, stone paving, and concrete - without overtly added textures or stylization. Include minimal human presence with slight motion blur to suggest everyday activity. Add dramatic late afternoon lighting, with cinematic effects, and slight saturation. The final image should feel calm, documentary, and architecturally precise, like a professional European architectural photograph of a built project. Shot on Kodak Kodachrome.`
  },
  {
    id: 'cinematic-sheet',
    label: 'Cinematic Contact Sheet',
    description: 'A 9-panel cinematic breakdown covering wide, medium, and close-up angles.',
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
    description: 'Timeless, bold, and intimate medium-format aesthetic.',
    prompt: `shot on medium-format film look, fashion magazine aesthetic, timeless, bold, intimate, confrontational.`
  },
  {
    id: 'watercolor',
    label: 'Ethereal Watercolor',
    description: 'Soft, artistic, painterly watercolor style.',
    prompt: `Convert this image into a beautiful, high-quality watercolor painting. Use soft, bleeding edges, pastel colors, and visible paper texture. The lighting should be diffuse and gentle. Reduce strict details in favor of artistic impressions and washes of color. The composition remains the same, but the reality is interpreted through an artist's brush. White space and loose strokes should define the boundaries. The feeling is serene, artistic, and hand-crafted.`
  },
  {
    id: 'clay',
    label: 'Clay Render',
    description: 'Clean, minimal, 3D soft-clay visualization.',
    prompt: `Render this image as a 3D "clay render" style visualization. All surfaces should have a matte, soft-touch finish similar to unglazed ceramic or clay. Use a monochromatic or limited pastel color palette (soft whites, greys, peaches). The lighting should be studio-quality soft-box lighting with ambient occlusion to highlight shapes and volumes. Remove complex textures (like dirt, graffiti, or detailed material grains) and focus purely on geometry and form. The result should look like a clean, high-end architectural model.`
  }
];