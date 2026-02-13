// The secret prompt is hardcoded here.
// In a real production app, this might be on the backend to be truly "secret",
// but for a client-side demo, we store it here.
export const SECRET_PROMPT = `Render my architectural image in a realistic contemporary architectural photography style with an eye-level viewpoint. Keep the architecture, urban context, paving, trees, benches, and surrounding buildings exactly the same as the original image, with no changes to layout, proportions, or composition. Use hard daylight lighting, allowing shadows. Materials should appear realistic and understated - metal mesh, glass, stone paving, and concrete - without overtly added textures or stylization. Include minimal human presence with slight motion blur to suggest everyday activity. Add dramatic late afternoon lighting, with cinematic effects, and slight saturation. The final image should feel calm, documentary, and architecturally precise, like a professional European architectural photograph of a built project. Shot on Kodak Kodachrome`;

export const MODEL_NAME = 'gemini-3-pro-image-preview'; // Nano Banana Pro

export const PLACEHOLDER_IMAGE = 'https://picsum.photos/800/600';