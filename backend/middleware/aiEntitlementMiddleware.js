const billingService = require('../services/billingService');

function getRequestedCreditCount(req) {
  if (req.path.includes('enhance-interior-variations')) {
    return Math.max(1, Math.min(Number(req.body?.count) || 3, 15));
  }

  if (req.path.includes('generate-all-rooms')) {
    const itemTypes = new Set();
    const roomMap = {
      bad: 'bedroom', singleBad: 'bedroom', kingBed: 'bedroom',
      guestDoubleBed: 'bedroom', guestSingleBed: 'bedroom', bunkBed: 'bedroom',
      wordrobe: 'bedroom', wardrobeSliding: 'bedroom', wardrobeHinged: 'bedroom',
      walkInCloset: 'bedroom', guestWardrobe: 'bedroom', dresser: 'bedroom',
      sofa: 'living', lShapeSofa: 'living', armchair: 'living',
      reclinerChair: 'living', ottoman: 'living', beanBag: 'living',
      worktop: 'kitchen', stove: 'kitchen', sink: 'kitchen',
      refrigerator: 'kitchen', baseCabinet: 'kitchen', wallCabinet: 'kitchen',
      table: 'dining', table2: 'dining', roundTable: 'dining',
      bath: 'bathroom', toilet: 'bathroom', showerEnclosure: 'bathroom',
      officeDesk: 'office', executiveDesk: 'office', studyDesk: 'office',
      consoleTable: 'entryway', shoeRack: 'entryway', shoeCabinet: 'entryway',
      dryerStand: 'laundry', ironingBoardCabinet: 'laundry',
      outdoorChair: 'outdoor', outdoorSofa: 'outdoor', swingChair: 'outdoor',
      toolCabinet: 'garage', workbench: 'garage',
    };

    (req.body?.planData?.items || []).forEach((item) => {
      const roomType = roomMap[item.type];
      if (roomType) itemTypes.add(roomType);
    });

    return Math.max(1, itemTypes.size || 1);
  }

  return 1;
}

function requireAiCredits(endpoint) {
  return async (req, res, next) => {
    try {
      const styleId = billingService.getStyleId(req);
      const count = getRequestedCreditCount(req);
      const reservation = await billingService.reserveRenderCredits({
        userId: req.user.id,
        styleId,
        endpoint,
        count,
      });

      req.aiCreditJob = reservation;
      next();
    } catch (error) {
      res.status(error.status || 500).json({
        message: error.message || 'AI render entitlement check failed',
        allowedStyleIds: error.allowedStyleIds,
        renderRemaining: error.renderRemaining,
      });
    }
  };
}

async function finishAiCredits(req, successCount, failureReason = null) {
  if (!req.aiCreditJob) return;
  try {
    await billingService.finishRenderJob({
      jobId: req.aiCreditJob.jobId,
      userId: req.user.id,
      successCount,
      failureReason,
    });
  } catch (error) {
    console.error('Failed to finish AI credit job:', error);
  }
}

module.exports = {
  requireAiCredits,
  finishAiCredits,
};
