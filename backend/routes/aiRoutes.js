const express = require('express');
const authenticateToken = require('../middleware/authMiddleware');
const aiRenderService = require('../services/aiRenderService');

const router = express.Router();

const RUNPOD_URL =
  process.env.RUNPOD_URL ||
  'https://k5dduro5bqi3sh-8000.proxy.runpod.net/generate';

/**
 * LEGACY: Original realistic render endpoint
 * Kept for backward compatibility
 */
router.post('/realistic-render', authenticateToken, async (req, res) => {
  try {
    const { planSummary, style, initialImage } = req.body || {};

    const baseStyle =
      style ||
      'modern, cozy residential interior with realistic materials, natural lighting and detailed decor';

    const layoutDescription =
      planSummary ||
      'generic floor plan with living room, kitchen, bedroom and bathroom.';

    const prompt =
      'Photorealistic interior render of this exact 3D layout. Style: ' +
      baseStyle +
      '. Layout description: ' +
      layoutDescription +
      '. Analyze the floor, walls, openings and all existing objects (bed, sofa, tv, table, windows, doors) and keep their positions and proportions fixed. Convert this into a modern interior design with realistic materials, floor finishes, wall finishes, lighting and detailed decor, without changing the room layout. DSLR architectural photography, ultra realistic, 4k, physically based lighting.';

    if (!initialImage) {
      return res.status(400).json({ message: 'initialImage is required' });
    }

    const base64Image = initialImage.replace(
      /^data:image\/\w+;base64,/,
      ''
    );

    const buffer = Buffer.from(base64Image, 'base64');
    const blob = new Blob([buffer], { type: 'image/png' });

    const formData = new FormData();
    formData.set('prompt', prompt);
    formData.set('image', blob, 'floorplan.png');
    formData.set('strength', '0.1');

    const response = await fetch(RUNPOD_URL, {
      method: 'POST',
      body: formData
    });

    const raw = await response.text();

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      data = raw;
    }

    if (!response.ok) {
      console.error('RunPod AI error:', response.status, data);
      return res.status(500).json({
        message: 'RunPod AI request failed',
        status: response.status,
        error: (data && data.detail) || (data && data.error) || null
      });
    }

    const imageBase64 =
      (typeof data === 'string' && data) ||
      (data && data.imageBase64) ||
      (data && data.image) ||
      (data && data.output) ||
      null;

    if (!imageBase64) {
      return res
        .status(500)
        .json({ message: 'No image returned from RunPod AI' });
    }

    res.json({ imageBase64 });
  } catch (error) {
    console.error('AI realistic render error:', error);
    res.status(500).json({ message: 'AI render failed', error: error.message });
  }
});

/**
 * NEW: Enhanced interior render with RunPod AI
 * Uses structured prompts for generating photorealistic interiors
 */
router.post('/enhance-interior', authenticateToken, async (req, res) => {
  try {
    const {
      colorImage,
      depthImage,
      segmentationImage,
      planData,
      style = 'modern',
      roomType = 'auto',
      styleId = 'modern',
      width = 1024,
      height = 1024,
      steps = 30,
      guidance = 3.5,
      selectedArea = null,
      controlnetType = 'depth',
      viewType = 'perspective', // 'insider' | 'perspective' | 'wallNorth' etc.
    } = req.body || {};

    // Validate required fields
    if (!colorImage) {
      return res.status(400).json({
        message: 'colorImage is required (base64 encoded 3D render)'
      });
    }

    if (!planData) {
      return res.status(400).json({
        message: 'planData is required for room detection and prompt generation'
      });
    }

    if (!aiRenderService.isServiceAvailable()) {
      return res.status(503).json({
        message: 'AI service not configured. Please set REPLICATE_API_TOKEN in your .env file.',
      });
    }

    console.log('Generating interior render...');
    console.log('Style:', styleId);
    console.log('Room type:', roomType);
    console.log('ControlNet:', controlnetType);
    console.log('Resolution:', width, 'x', height);
    if (selectedArea) {
      console.log('Selected area:', selectedArea.name, 'at', selectedArea.bounds);
    }

    // Generate the interior render
    const result = await aiRenderService.generateInteriorRender({
      colorImage,
      depthImage,
      segmentationImage,
      planData,
      style,
      roomType,
      styleId,
      width,
      height,
      steps,
      guidance,
      selectedArea,
      controlnetType,
      viewType, // pass through so insider FPS uses img2img not depth-pro
    });

    res.json({
      success: true,
      imageBase64: result.imageBase64,
      prompt: result.prompt,
      style: result.style,
      roomType: result.roomType,
      selectedArea: result.selectedArea,
    });

  } catch (error) {
    console.error('AI interior enhancement error:', error);
    res.status(500).json({
      message: 'AI interior enhancement failed',
      error: error.message,
    });
  }
});

/**
 * NEW: Generate multiple interior variations
 */
router.post('/enhance-interior-variations', authenticateToken, async (req, res) => {
  try {
    const {
      colorImage,
      planData,
      style = 'modern',
      roomType = 'auto',
      count = 3,
    } = req.body || {};

    if (!colorImage || !planData) {
      return res.status(400).json({
        message: 'colorImage and planData are required',
      });
    }

    if (!aiRenderService.isServiceAvailable()) {
      return res.status(503).json({
        message: 'AI service not configured',
      });
    }

    console.log(`Generating ${count} interior variations...`);

    const variations = await aiRenderService.generateInteriorVariations({
      colorImage,
      planData,
      style,
      roomType,
    }, count);

    res.json({
      success: true,
      variations: variations.map((v, i) => ({
        id: i + 1,
        imageBase64: v.imageBase64,
        prompt: v.prompt,
      })),
    });

  } catch (error) {
    console.error('AI variations error:', error);
    res.status(500).json({
      message: 'Failed to generate variations',
      error: error.message,
    });
  }
});

/**
 * NEW: Get available interior styles
 */
router.get('/interior-styles', authenticateToken, async (req, res) => {
  try {
    const styles = aiRenderService.getAvailableStyles();
    res.json({ styles });
  } catch (error) {
    console.error('Get styles error:', error);
    res.status(500).json({
      message: 'Failed to get styles',
      error: error.message,
    });
  }
});

/**
 * NEW: Text-only generation endpoint (no image required)
 * Uses floor plan structure data to generate interior
 */
router.post('/generate-from-text', authenticateToken, async (req, res) => {
  try {
    const {
      planData,
      style = 'modern',
      roomType = 'auto',
      width = 1024,
      height = 1024,
      steps = 30,
      guidance = 3.5,
    } = req.body || {};

    // DEBUG: Log incoming data
    console.log('=== RECEIVED PLAN DATA ===');
    console.log('Plan data keys:', Object.keys(planData || {}));
    console.log('Items count:', planData?.items?.length || 0);
    console.log('Walls count:', planData?.walls?.length || 0);
    console.log('Items:', planData?.items);
    console.log('Selected area:', planData?.selectedArea);
    console.log('View type:', planData?.viewType);

    if (!planData) {
      return res.status(400).json({
        message: 'planData is required with floor plan structure'
      });
    }

    if (!aiRenderService.isServiceAvailable()) {
      return res.status(503).json({
        message: 'AI service not configured'
      });
    }

    console.log('Generating interior from text description...');
    console.log('Style:', style);
    console.log('Room type:', roomType);

    // Generate interior from text-only description
    const result = await aiRenderService.generateInteriorFromText({
      planData,
      style,
      roomType,
      width,
      height,
      steps,
      guidance,
    });

    res.json({
      success: true,
      imageBase64: result.imageBase64,
      prompt: result.prompt,
      structure: result.structure,
      style,
      roomType,
    });

  } catch (error) {
    console.error('Text-only generation error:', error);
    res.status(500).json({
      message: 'Text-only generation failed',
      error: error.message,
    });
  }
});

/**
 * NEW: Get floor plan structure endpoint
 * Returns structured data about walls, rooms, dimensions
 */
router.post('/analyze-structure', authenticateToken, async (req, res) => {
  try {
    const { planData } = req.body || {};

    if (!planData) {
      return res.status(400).json({
        message: 'planData is required'
      });
    }

    const structure = aiRenderService.getFloorPlanStructure(planData);

    res.json({
      success: true,
      structure,
    });

  } catch (error) {
    console.error('Structure analysis error:', error);
    res.status(500).json({
      message: 'Structure analysis failed',
      error: error.message,
    });
  }
});

/**
 * NEW: Generate interior renders for ALL rooms in floor plan
 * Generates multiple renders - one per room
 */
router.post('/generate-all-rooms', authenticateToken, async (req, res) => {
  try {
    const {
      planData,
      style = 'modern',
      width = 1024,
      height = 1024,
      steps = 30,
      guidance = 3.5,
    } = req.body || {};

    // DEBUG: Log incoming data
    console.log('=== BATCH GENERATION REQUEST ===');
    console.log('Plan data keys:', Object.keys(planData || {}));
    console.log('Items count:', planData?.items?.length || 0);
    console.log('Style:', style);

    if (!planData) {
      return res.status(400).json({
        message: 'planData is required with floor plan structure'
      });
    }

    if (!aiRenderService.isServiceAvailable()) {
      return res.status(503).json({
        message: 'AI service not configured'
      });
    }

    console.log('Generating interior renders for ALL rooms...');

    // Generate interiors for all rooms
    const result = await aiRenderService.generateAllRoomRenders({
      planData,
      style,
      width,
      height,
      steps,
      guidance,
    });

    res.json({
      success: true,
      renders: result.renders,
      totalRooms: result.totalRooms,
      style,
    });

  } catch (error) {
    console.error('Batch generation error:', error);
    res.status(500).json({
      message: 'Batch generation failed',
      error: error.message,
    });
  }
});

/**
 * NEW: Health check endpoint
 */
router.get('/health', async (req, res) => {
  const isAvailable = aiRenderService.isServiceAvailable();
  res.json({
    status: isAvailable ? 'available' : 'unavailable',
    service: 'AI Interior Render',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
