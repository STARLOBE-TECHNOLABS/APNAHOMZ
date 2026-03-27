/**
 * AI Render Service - Handles AI-powered interior rendering
 *
 * Uses the official Replicate Node.js SDK (replicate@^1.4.0).
 * replicate.run() handles auth, sending, polling, and returns the final output.
 *
 * PRIMARY:  FLUX.1 Depth Pro  – depth-aware rendering (needs depth map)
 * FALLBACK: FLUX.1 Pro        – text-to-image (no depth map needed)
 */

const Replicate = require('replicate');
const { generateInteriorPrompt, generatePlanSummary, generateTextOnlyPrompt, generateFloorPlanStructure } = require('../utils/promptGenerator');

// RunPod API configuration (Legacy fallback only)
const RUNPOD_URL = process.env.RUNPOD_URL || null;

// Replicate SDK instance — reads REPLICATE_API_TOKEN from env automatically
const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const replicate = REPLICATE_API_TOKEN
  ? new Replicate({ auth: REPLICATE_API_TOKEN })
  : null;

/**
 * Ensure the depth image is a proper data URI for Replicate
 */
function formatDataUrl(base64) {
  if (!base64) return null;
  return base64.startsWith('data:') ? base64 : `data:image/png;base64,${base64}`;
}

/**
 * Replicate FLUX models (Kontext Pro, Depth Pro) do not support negative_prompt.
 * Inject layout-preservation and anti-hallucination instructions into the main prompt
 * so the AI improves the existing 3D design without adding random items or changing layout.
 * INTERIOR STYLE = aesthetic only (materials, colors, lighting). Never change layout or placement.
 */
function buildLayoutPreservingPrompt(mainPrompt, negativePrompt) {
  const styleRule = ' INTERIOR STYLE is for look only: apply the chosen style to materials, colors, and lighting of the EXISTING items. Do NOT rearrange furniture, change positions, or redesign the space. Layout must stay identical to the reference.';
  const layoutLock = ' CRITICAL: Preserve the exact layout and composition from the reference image. Do not add any new furniture, objects, plants, decorations, or clutter. Do not remove or relocate existing elements. Only improve materials, textures, and lighting. Same number of items, same positions.';
  const avoid = negativePrompt
    ? ` Avoid: ${negativePrompt.replace(/\s+/g, ' ').trim().slice(0, 400)}.`
    : ' Avoid: extra furniture, added objects, hallucinated items, different layout, moved furniture.';
  return (mainPrompt + styleRule + layoutLock + avoid).trim();
}

/**
 * Download a Replicate FileOutput URL and convert to base64
 * replicate.run() returns a FileOutput object; call .url() to get the URL string.
 */
async function fileOutputToBase64(output) {
  // output is a FileOutput object from the SDK
  const url = typeof output.url === 'function' ? output.url() : String(output);
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to download output image: ${response.statusText}`);
  const buffer = await response.arrayBuffer();
  return Buffer.from(buffer).toString('base64');
}

/**
 * PRIMARY: FLUX.1 Depth Pro
 *
 * Takes your Three.js depth map as control_image and generates an
 * interior that preserves the spatial structure of the depth map.
 * Use ONLY as secondary to img2img — it generates a new scene from depth.
 *
 * Cost: ~$0.04/run
 */
async function callFluxDepthPro({ depthImage, prompt, guidance = 15, steps = 50 }) {
  if (!replicate) throw new Error('REPLICATE_API_TOKEN not configured in .env file');

  console.log('→ Calling FLUX.1 Depth Pro via Replicate SDK...');

  const output = await replicate.run('black-forest-labs/flux-depth-pro', {
    input: {
      prompt,
      control_image: formatDataUrl(depthImage),
      guidance,       // Lower guidance = less strict depth control, more style freedom
      steps,
      safety_tolerance: 2,
      prompt_upsampling: false,
      output_format: 'jpg',
    },
  });

  console.log('✓ FLUX.1 Depth Pro completed:', typeof output.url === 'function' ? output.url() : output);
  return fileOutputToBase64(output);
}

/**
 * SECONDARY: FLUX.1 Pro (text-to-image)
 *
 * Used when neither colorImage nor depthImage is available.
 * Cost: ~$0.04/run
 */
async function callFluxTextToImage({ prompt, steps = 28, guidance = 3.5 }) {
  if (!replicate) throw new Error('REPLICATE_API_TOKEN not configured in .env file');

  console.log('→ Calling FLUX.1 Pro (text-to-image) via Replicate SDK...');

  const output = await replicate.run('black-forest-labs/flux-1.1-pro', {
    input: {
      prompt,
      steps,
      guidance,
      output_format: 'jpg',
      safety_tolerance: 2,
      prompt_upsampling: false,
    },
  });

  console.log('✓ FLUX.1 Pro completed:', typeof output.url === 'function' ? output.url() : output);
  return fileOutputToBase64(output);
}

/**
 * BEST: FLUX.1 Pro img2img  (← NEW PRIMARY PATH)
 *
 * Uses the captured 3D render as `image_prompt` so the AI enhances
 * the EXISTING scene in-place instead of generating a random new room.
 *
 * image_prompt_strength controls how closely the output matches the input:
 *   0.0 = ignores the input image (pure text generation)
 *   1.0 = copies the input image exactly (no change)
 *   0.80–0.90 = strong layout fidelity, adds photorealism + style
 *
 * This is the correct approach for "same layout, enhanced style".
 * Cost: ~$0.04/run
 */
async function callFluxImg2Img({ colorImage, prompt, imagePromptStrength = 0.85, steps = 28, guidance = 3.5 }) {
  if (!replicate) throw new Error('REPLICATE_API_TOKEN not configured in .env file');

  console.log('→ Calling FLUX.1.1 Pro (img2img) — layout-preserving enhancement...');

  const output = await replicate.run('black-forest-labs/flux-1.1-pro', {
    input: {
      prompt,
      image_prompt: formatDataUrl(colorImage),
      image_prompt_strength: imagePromptStrength,
      steps,
      guidance,
      output_format: 'jpg',
      safety_tolerance: 2,
      prompt_upsampling: false,
    },
  });

  console.log('✓ FLUX.1.1 Pro img2img completed:', typeof output.url === 'function' ? output.url() : output);
  return fileOutputToBase64(output);
}

/**
 * FPS / INSIDER VIEW: FLUX Kontext Pro
 * Purpose-built to edit an image while keeping layout locked.
 */
async function callFluxKontextPro({ colorImage, prompt, steps = 40, guidance = 2.5 }) {
  if (!replicate) throw new Error('REPLICATE_API_TOKEN not configured in .env file');

  console.log('→ Calling FLUX Kontext Pro (img2img) — layout-locked enhancement...');

  const output = await replicate.run('black-forest-labs/flux-kontext-pro', {
    input: {
      input_image: formatDataUrl(colorImage),
      prompt,
      steps,
      guidance,
      prompt_upsampling: false,
      output_format: 'jpg',
      safety_tolerance: 2,
    },
  });

  console.log('✓ FLUX Kontext Pro completed:', typeof output.url === 'function' ? output.url() : output);
  return fileOutputToBase64(output);
}

/**
 * Generate interior using the best available method.
 *
 * RESEARCH-BACKED MODEL SELECTION (2024–2025 best practices):
 *
 * ┌─────────────────────┬───────────────────────────────────────────────────────┐
 * │  View Type          │  Model & Why                                         │
 * ├─────────────────────┼───────────────────────────────────────────────────────┤
 * │  INSIDER (FPS)      │  FLUX.1.1 Pro img2img — COLOR screenshot is input.   │
 * │                     │  imagePromptStrength = 0.45 (sweet spot: preserves   │
 * │                     │  full layout/composition, AI replaces 3D textures    │
 * │                     │  with photorealistic materials).                     │
 * │                     │  ❌ Depth Pro: generates RANDOM rooms from depth map │
 * │                     │  because interior depth maps are too uniform/shallow  │
 * │                     │  for structural guidance.                            │
 * ├─────────────────────┼───────────────────────────────────────────────────────┤
 * │  PERSPECTIVE/OTHER  │  FLUX.1 Depth Pro — depth maps from elevated cameras │
 * │                     │  have clear contrast (near floor vs far walls).      │
 * │                     │  Generates fully new photorealistic images guided by │
 * │                     │  spatial structure.                                  │
 * └─────────────────────┴───────────────────────────────────────────────────────┘
 */
async function generateWithControlNet({
  colorImage,
  depthImage,
  prompt,
  negativePrompt,
  controlnetType = 'depth',
  strength = 0.85,
  viewType = 'perspective',
}) {
  // Replicate does not support negative_prompt; inject layout lock and avoid-list into main prompt
  const layoutPrompt = buildLayoutPreservingPrompt(prompt, negativePrompt);

  if (viewType === 'insider') {
    if (colorImage) {
      console.log('Mode: FLUX Kontext Pro — FPS insider: converting 3D to photorealistic while locking layout');
      return await callFluxKontextPro({ colorImage, prompt: layoutPrompt, steps: 50, guidance: 7.5 });
    }
    console.log('Mode: FLUX.1 Pro text-to-image — FPS insider but no images captured');
    return await callFluxTextToImage({ prompt: layoutPrompt, steps: 28, guidance: 3.5 });
  }

  // Prefer color-based img2img so we enhance the exact 3D render — do not use Depth Pro when color exists
  if (colorImage) {
    console.log(`Mode: FLUX Kontext Pro — ${viewType} view: restyling while preserving layout (no new items)`);
    return await callFluxKontextPro({ colorImage, prompt: layoutPrompt, steps: 45, guidance: 6.5 });
  }

  if (depthImage) {
    console.log(`Mode: FLUX.1 Depth Pro — ${viewType} view: photorealism from depth structure only (strict layout)`);
    return await callFluxDepthPro({ depthImage, prompt: layoutPrompt, guidance: 18, steps: 50 });
  }

  // Fallback: text-to-image if no image reference available
  console.log('Mode: FLUX.1 Pro — text-to-image (no image reference available)');
  return await callFluxTextToImage({ prompt: layoutPrompt, steps: 28, guidance: 3.5 });
}

/**
 * Convert base64 image to buffer
 */
function base64ToBuffer(base64String) {
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  return Buffer.from(base64Data, 'base64');
}

/**
 * Upload image to temporary hosting and get URL
 * For Replicate, we need to provide image URLs
 */
async function uploadImageToTemp(base64Image) {
  // For now, we'll use data URIs directly with Replicate
  // In production, you might want to upload to S3 or similar
  return base64Image;
}



/**
 * Generate interior using img2img with ControlNet
 * Fallback method using RunPod or similar service
 */
async function generateWithImg2Img({
  colorImage,
  prompt,
  negativePrompt,
  strength = 0.6,
}) {
  if (!RUNPOD_URL) {
    throw new Error('RUNPOD_URL not configured for img2img generation');
  }

  const base64Image = colorImage.replace(/^data:image\/\w+;base64,/, '');

  const formData = new FormData();
  formData.append('prompt', prompt);
  formData.append('negative_prompt', negativePrompt);
  formData.append('image', base64Image);
  formData.append('strength', strength.toString());
  formData.append('steps', '30');
  formData.append('guidance_scale', '9');

  const response = await fetch(RUNPOD_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`RunPod API error: ${error}`);
  }

  const result = await response.json();
  return result;
}

/**
 * Generate interior using RunPod API with FLUX and enhanced ControlNet
 * Sends prompt, color image, and depth map for precise layout preservation
 */
async function generateWithRunPod({
  prompt,
  negativePrompt,
  colorImage,
  depthImage,  // Depth map for layout guidance
  width = 1024,
  height = 1024,
  steps = 30,
  guidance = 3.5,
  strength = 0.75,
}) {
  console.log('Using RunPod API:', RUNPOD_URL);
  console.log('Color image provided:', !!colorImage);
  console.log('Depth image provided:', !!depthImage);

  // Enhanced request body with ControlNet parameters for better layout preservation
  const requestBody = {
    prompt: prompt,
    width: width,
    height: height,
    steps: steps,
    guidance: guidance,
    strength: strength,
    // ControlNet depth conditioning for precise layout preservation
    controlnet: 'depth',
    controlnet_conditioning_scale: 0.85, // Strong layout guidance
    controlnet_guidance_start: 0.0,
    controlnet_guidance_end: 1.0,
  };

  // Add color image (main input for img2img)
  if (colorImage) {
    const base64Image = colorImage.replace(/^data:image\/\w+;base64,/, '');
    requestBody.image = base64Image;
  }

  // Add depth map for layout preservation (recommended for architectural accuracy)
  if (depthImage) {
    const base64Depth = depthImage.replace(/^data:image\/\w+;base64,/, '');
    requestBody.depth_image = base64Depth;
    requestBody.control_depth_strength = 0.9; // Strong depth influence
  }

  // Add negative prompt if provided
  if (negativePrompt) {
    requestBody.negative_prompt = negativePrompt;
  }

  const response = await fetch(RUNPOD_URL, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`RunPod API error (${response.status}): ${errorText}`);
  }

  // RunPod returns the image directly as PNG
  const imageBuffer = await response.arrayBuffer();
  const imageBase64 = Buffer.from(imageBuffer).toString('base64');

  return imageBase64;
}

/**
 * Generate interior using RunPod with ControlNet Depth
 * This provides precise layout preservation using depth conditioning
 */
async function generateWithRunPodControlNet({
  prompt,
  negativePrompt,
  colorImage,
  depthImage,
  width = 1024,
  height = 1024,
  steps = 30,
  guidance = 3.5,
  controlnetScale = 0.9,
}) {
  console.log('Using RunPod ControlNet API:', RUNPOD_URL);

  // Prepare the request body with ControlNet parameters
  const requestBody = {
    prompt: prompt,
    width: width,
    height: height,
    steps: steps,
    guidance: guidance,
    controlnet: 'depth',  // Specify ControlNet type
    controlnet_scale: controlnetScale,
  };

  // Add color image as base (optional, for img2img + ControlNet)
  if (colorImage) {
    const base64Image = colorImage.replace(/^data:image\/\w+;base64,/, '');
    requestBody.image = base64Image;
    requestBody.strength = 0.7;  // Balance between preserving structure and generating new content
  }

  // Add depth map for ControlNet conditioning
  if (depthImage) {
    const base64Depth = depthImage.replace(/^data:image\/\w+;base64,/, '');
    requestBody.control_image = base64Depth;
  }

  // Add negative prompt if provided
  if (negativePrompt) {
    requestBody.negative_prompt = negativePrompt;
  }

  const response = await fetch(RUNPOD_URL, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`RunPod ControlNet API error (${response.status}): ${errorText}`);
  }

  // RunPod returns the image directly as PNG
  const imageBuffer = await response.arrayBuffer();
  const imageBase64 = Buffer.from(imageBuffer).toString('base64');

  return imageBase64;
}

/**
 * Main function to generate interior render
 * @param {Object} params - Generation parameters
 * @returns {Promise<string>} Base64 encoded image
 */
async function generateInteriorRender(params) {
  const {
    colorImage,
    depthImage,
    segmentationImage,
    planData,
    style = 'modern',
    roomType = 'auto',
    styleId = 'modern',
    viewType = 'perspective',
    width = 1024,
    height = 1024,
    steps = 30,
    guidance = 3.5,
    selectedArea = null,
  } = params;

  try {
    // Enhance prompt with selected area information
    let enhancedPlanData = planData;
    let enhancedStyle = style;

    if (selectedArea) {
      console.log('Enhancing for selected area:', selectedArea.name);

      // Add area-specific instructions to the prompt
      const areaInstructions = `

FOCUS AREA SPECIFICATION:
- Primary focus: ${selectedArea.name}
- Area bounds: (${selectedArea.bounds.minX}, ${selectedArea.bounds.minY}) to (${selectedArea.bounds.maxX}, ${selectedArea.bounds.maxY})
- Furniture in focus area: ${selectedArea.items ? selectedArea.items.length : 0} items
- Enhance this area with maximum detail and quality
- Ensure this area is the visual centerpiece of the render
- Other areas should complement but not distract from the focus area`;

      enhancedStyle = style + areaInstructions;

      // Mark the selected area in planData for prompt generator
      enhancedPlanData = {
        ...planData,
        selectedArea: selectedArea,
      };
    }

    // Generate structured prompt with view type
    const promptData = generateInteriorPrompt(enhancedPlanData, enhancedStyle, roomType, viewType, styleId);

    console.log('Generated prompt:', promptData.mainPrompt.substring(0, 200) + '...');
    console.log('Style:', style);
    console.log('Room type:', roomType);

    let imageBase64;

    // PRIMARY: Replicate FLUX.1.1 Pro img2img (preserves exact 3D layout)
    // SECONDARY: FLUX.1 Depth Pro  (no color reference, uses depth only)
    // TERTIARY: RunPod (legacy fallback)
    if (REPLICATE_API_TOKEN) {
      console.log('Using Replicate API — viewType:', viewType);
      // For insider FPS: use lower strength so AI can freely add photorealism
      // (0.94 was too faithful — it kept copying the plastic/3D-model appearance)
      // For perspective: slightly higher keeps architectural layout more intact.
      const imageStrength = viewType === 'insider' ? 0.75 : 0.85;
      imageBase64 = await generateWithControlNet({
        colorImage,
        depthImage,
        prompt: promptData.mainPrompt,
        negativePrompt: promptData.negativePrompt,
        controlnetType: params.controlnetType || 'depth',
        strength: imageStrength,
        viewType, // ← key: routes insider through img2img, others through Depth Pro
      });
    } else if (RUNPOD_URL) {
      // Legacy RunPod fallback — less reliable, lower quality
      console.warn('REPLICATE_API_TOKEN not set — falling back to RunPod (lower quality)');
      imageBase64 = await generateWithRunPod({
        prompt: promptData.mainPrompt,
        negativePrompt: promptData.negativePrompt,
        colorImage,
        depthImage,
        width,
        height,
        steps: 35,
        guidance: 4.0,
        strength: 0.6,
      });
    } else {
      throw new Error(
        'No AI rendering service configured. Add REPLICATE_API_TOKEN to your .env file to use FLUX.1 Depth Pro.'
      );
    }

    return {
      imageBase64,
      prompt: promptData.mainPrompt,
      selectedArea: selectedArea,
      style,
      roomType,
      controlnetType: params.controlnetType,
    };

  } catch (error) {
    console.error('AI Render Service Error:', error);
    throw error;
  }
}

/**
 * Generate multiple variations of the interior
 */
async function generateInteriorVariations(params, count = 3) {
  const variations = [];

  for (let i = 0; i < count; i++) {
    try {
      const result = await generateInteriorRender({
        ...params,
        seed: Math.floor(Math.random() * 1000000),
      });
      variations.push(result);
    } catch (error) {
      console.warn(`Variation ${i + 1} failed:`, error.message);
    }
  }

  return variations;
}

/**
 * Generate interior from text-only description (no image)
 * Uses floor plan structure data to create prompt
 */
async function generateInteriorFromText({
  planData,
  style = 'modern',
  roomType = 'auto',
  width = 1024,
  height = 1024,
  steps = 30,
  guidance = 3.5,
}) {
  try {
    // Generate text-only prompt from floor plan structure
    const promptData = generateTextOnlyPrompt(planData, style, roomType);

    if (!promptData) {
      throw new Error('Failed to generate prompt from floor plan data');
    }

    console.log('Generated text prompt:', promptData.prompt.substring(0, 100) + '...');
    console.log('Structure:', {
      walls: promptData.structure.totalWalls,
      rooms: promptData.structure.totalRooms,
      dimensions: promptData.structure.planDimensions
    });

    // Use FLUX.1 text-to-image for insider view (Replicate primary, RunPod fallback)
    let imageBase64;
    if (REPLICATE_API_TOKEN) {
      console.log('Generating insider view via FLUX.1 Pro text-to-image (Replicate)');
      // callFluxTextToImage returns base64 directly via SDK
      imageBase64 = await callFluxTextToImage({
        prompt: promptData.prompt,
        steps: 28,
        guidance: 3.5,
      });
    } else if (RUNPOD_URL) {
      // Legacy RunPod fallback
      console.warn('No REPLICATE_API_TOKEN — falling back to RunPod for insider view');
      imageBase64 = await generateWithRunPod({
        prompt: promptData.prompt,
        negativePrompt: 'cartoon, anime, illustration, low quality, blurry, distorted, deformed, ugly, watermark, text, logo',
        width,
        height,
        steps,
        guidance,
      });
    } else {
      throw new Error('No AI service configured. Add REPLICATE_API_TOKEN to .env file.');
    }

    return {
      imageBase64,
      prompt: promptData.prompt,
      structure: promptData.structure,
      style,
      roomType,
    };

  } catch (error) {
    console.error('Text-only generation error:', error);
    throw error;
  }
}

/**
 * Generate interior renders for ALL rooms in floor plan
 * Generates multiple renders simultaneously - one per room with DIFFERENT camera angles
 */
async function generateAllRoomRenders({
  planData,
  style = 'modern',
  width = 1024,
  height = 1024,
  steps = 30,
  guidance = 3.5,
}) {
  try {
    console.log('=== GENERATING ALL ROOM RENDERS WITH DIFFERENT ANGLES ===');

    // Get floor plan structure
    const structure = generateFloorPlanStructure(planData);
    if (!structure || !structure.rooms || structure.rooms.length === 0) {
      throw new Error('No rooms detected in floor plan');
    }

    const totalRooms = structure.rooms.length;
    console.log(`Detected ${totalRooms} rooms to render`);

    // Camera angle variations for different perspectives
    const viewTypes = [
      'insider',           // Eye-level from inside
      'perspective',       // 3D angled view
      'corner-view',       // From corner of room
      'wide-angle'         // Wide panoramic view
    ];

    // Generate renders for each room in parallel with DIFFERENT angles
    const renderPromises = structure.rooms.map(async (room, index) => {
      try {
        // Cycle through different view types for variety
        const viewType = viewTypes[index % viewTypes.length];

        console.log(`\n--- Generating Room ${index + 1}/${totalRooms}: ${room.name} (${viewType}) ---`);

        // Create single-room plan data with specific view type
        const singleRoomPlan = {
          ...planData,
          items: room.items,
          viewType: viewType,
        };

        // Generate text-only prompt for this room with specific view
        const promptData = generateTextOnlyPrompt(singleRoomPlan, style, room.type);

        if (!promptData) {
          throw new Error(`Failed to generate prompt for room ${room.name}`);
        }

        console.log(`Generating ${viewType} render for ${room.name} with ${room.itemCount} items`);

        // Use Replicate FLUX.1 Pro — the only configured AI service.
        // (generateWithRunPod is legacy and not configured.)
        let imageBase64;
        if (REPLICATE_API_TOKEN) {
          imageBase64 = await callFluxTextToImage({
            prompt: promptData.prompt,
            steps: 28,
            guidance: 3.5,
          });
        } else if (RUNPOD_URL) {
          imageBase64 = await generateWithRunPod({
            prompt: promptData.prompt,
            negativePrompt: 'cartoon, anime, illustration, low quality, blurry, distorted, deformed, ugly, watermark, text, logo, extra furniture, added objects',
            width,
            height,
            steps,
            guidance,
          });
        } else {
          throw new Error('No AI service configured. Add REPLICATE_API_TOKEN to .env file.');
        }

        return {
          roomId: room.id,
          roomName: room.name,
          roomType: room.type,
          itemCount: room.itemCount,
          dimensions: room.dimensions,
          viewType: viewType,
          imageBase64,
          prompt: promptData.prompt,
        };

      } catch (error) {
        console.error(`Error generating room ${room.name}:`, error.message);
        return {
          roomId: room.id,
          roomName: room.name,
          roomType: room.type,
          error: error.message,
        };
      }
    });

    // Wait for all renders to complete
    const renders = await Promise.all(renderPromises);

    const successfulRenders = renders.filter(r => r.imageBase64);
    const failedRenders = renders.filter(r => r.error);

    console.log(`\n=== BATCH GENERATION COMPLETE ===`);
    console.log(`Total rooms: ${totalRooms}`);
    console.log(`Successful: ${successfulRenders.length}`);
    console.log(`Failed: ${failedRenders.length}`);
    console.log(`View types used: ${renders.map(r => r.viewType || 'N/A').join(', ')}`);

    return {
      renders,
      totalRooms,
      successfulCount: successfulRenders.length,
      failedCount: failedRenders.length,
    };

  } catch (error) {
    console.error('Batch generation error:', error);
    throw error;
  }
}

/**
 * Get floor plan structure data
 */
function getFloorPlanStructure(planData) {
  return generateFloorPlanStructure(planData);
}

/**
 * Get available styles
 */
function getAvailableStyles() {
  return [
    { id: 'modern', name: 'Modern', description: 'Clean lines, minimal decor' },
    { id: 'luxury', name: 'Luxury', description: 'High-end materials, elegant' },
    { id: 'minimalist', name: 'Minimalist', description: 'Simple, functional' },
    { id: 'scandinavian', name: 'Scandinavian', description: 'Light woods, cozy' },
    { id: 'industrial', name: 'Industrial', description: 'Raw materials, urban' },
    { id: 'contemporary', name: 'Contemporary', description: 'Current trends' },
    { id: 'traditional', name: 'Traditional', description: 'Classic, timeless' },
    { id: 'bohemian', name: 'Bohemian', description: 'Eclectic, artistic' },
  ];
}

/**
 * Check if AI service is configured and available
 */
function isServiceAvailable() {
  // PRIMARY: Replicate API (FLUX.1 Depth Pro + text-to-image)
  // FALLBACK: RunPod (only if explicitly configured)
  return !!REPLICATE_API_TOKEN || !!RUNPOD_URL;
}

module.exports = {
  generateInteriorRender,
  generateInteriorVariations,
  generateInteriorFromText,
  generateAllRoomRenders, // NEW: Batch generation for all rooms
  getFloorPlanStructure,
  getAvailableStyles,
  isServiceAvailable,
  generatePlanSummary,
  generateWithRunPodControlNet,
};
