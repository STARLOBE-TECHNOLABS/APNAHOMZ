import React, { useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { BiBrush, BiX, BiDownload, BiRefresh, BiCheck, BiGridAlt } from 'react-icons/bi';
import { aiService } from '../../services/aiService';

/**
 * AI Interior Style Options
 */
export const INTERIOR_STYLES = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean lines, minimal decor, neutral colors',
    preview: '/styles/modern.png',
    prompt: 'modern interior design, clean lines, minimalist furniture, neutral color palette, contemporary style',
  },
  {
    id: 'luxury',
    name: 'Luxury',
    description: 'High-end materials, elegant finishes, sophisticated',
    preview: '/styles/luxury.png',
    prompt: 'luxury interior design, clean lines, minimalist furniture, high-end materials, marble floors, elegant lighting, sophisticated decor, premium finishes',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Simple, functional, clutter-free spaces',
    preview: '/styles/minimalist.png',
    prompt: 'minimalist interior design, clean lines, minimalist furniture, simple furniture, functional spaces, clutter-free, white and beige tones',
  },
  {
    id: 'scandinavian',
    name: 'Scandinavian',
    description: 'Light woods, cozy textures, hygge comfort',
    preview: '/styles/scandinavian.png',
    prompt: 'scandinavian interior design, clean lines, minimalist furniture, light wood furniture, cozy textiles, hygge style, natural light, white walls',
  },
  {
    id: 'industrial',
    name: 'Industrial',
    description: 'Raw materials, exposed elements, urban feel',
    preview: '/styles/industrial.png',
    prompt: 'industrial interior design, clean lines, minimalist furniture, exposed brick, metal fixtures, concrete floors, urban loft style, raw materials',
  },
  {
    id: 'contemporary',
    name: 'Contemporary',
    description: 'Current trends, bold accents, artistic touches',
    preview: '/styles/contemporary.png',
    prompt: 'contemporary interior design, clean lines, minimalist furniture, current trends, bold accent colors, artistic decor, sleek furniture',
  },
  {
    id: 'traditional',
    name: 'Traditional',
    description: 'Classic furniture, rich colors, timeless elegance',
    preview: '/styles/traditional.png',
    prompt: 'traditional interior design, clean lines, minimalist furniture, classic furniture, rich wood tones, elegant drapery, timeless decor, warm colors',
  },
  {
    id: 'bohemian',
    name: 'Bohemian',
    description: 'Eclectic mix, vibrant colors, artistic vibe',
    preview: '/styles/bohemian.png',
    prompt: 'bohemian interior design, clean lines, minimalist furniture, eclectic furniture, vibrant colors, plants, artistic decor, mixed patterns, cozy atmosphere',
  },
];


/**
 * AI Style Selector Modal
 */
export const AIStyleSelector = ({ isOpen, onClose, onSelect, selectedStyle, selectedRoom, plan, originalImage, onModalStateChange }) => {
  const [localStyle, setLocalStyle] = useState(selectedStyle || 'modern');
  const [selectedArea, setSelectedArea] = useState(null);
  const [showAreaSelector, setShowAreaSelector] = useState(false);

  // Notify parent of modal state
  React.useEffect(() => {
    onModalStateChange?.(isOpen);
  }, [isOpen, onModalStateChange]);

  // Extract rooms from plan data for area selection
  const detectedRooms = React.useMemo(() => {
    if (!plan || !plan.items) return [];

    // Complete item-type → room-type mapping (mirrors backend roomDetector.js)
    const roomMap = {
      // Bedroom
      bad: 'bedroom', singleBad: 'bedroom', kingBed: 'bedroom',
      guestDoubleBed: 'bedroom', guestSingleBed: 'bedroom', bunkBed: 'bedroom',
      wordrobe: 'bedroom', wardrobeSliding: 'bedroom', wardrobeHinged: 'bedroom',
      walkInCloset: 'bedroom', guestWardrobe: 'bedroom', dresser: 'bedroom',
      chestOfDrawers: 'bedroom', vanityTable: 'bedroom', headboard: 'bedroom',
      bedsideTable: 'bedroom', guestBedsideTable: 'bedroom',
      luggageRack: 'bedroom', accentChair: 'bedroom',
      toyStorage: 'bedroom', toyStorageUnit: 'bedroom',
      // Living room
      sofa: 'living', lShapeSofa: 'living', armchair: 'living',
      reclinerChair: 'living', ottoman: 'living', beanBag: 'living',
      coffeeTable: 'living', sideTable: 'living', tv: 'living',
      bookshelf: 'living', rug: 'living', lamp: 'living', curtains: 'living',
      // Kitchen
      worktop: 'kitchen', stove: 'kitchen', sink: 'kitchen',
      refrigerator: 'kitchen', baseCabinet: 'kitchen', wallCabinet: 'kitchen',
      tallPantryUnit: 'kitchen', kitchenIsland: 'kitchen',
      breakfastCounter: 'kitchen', barStool: 'kitchen',
      spiceRack: 'kitchen', pullOutBasket: 'kitchen', plateRack: 'kitchen',
      // Dining
      table: 'dining', table2: 'dining', roundTable: 'dining',
      // Bathroom
      bath: 'bathroom', toilet: 'bathroom', showerEnclosure: 'bathroom',
      mirrorCabinet: 'bathroom', towelRack: 'bathroom',
      medicineCabinet: 'bathroom', laundryBasket: 'bathroom',
      washingMachine: 'bathroom', washingMachineBase: 'bathroom',
      // Office
      officeDesk: 'office', executiveDesk: 'office', studyDesk: 'office',
      studyTable: 'office', studyTableOffice: 'office',
      ergonomicChair: 'office', visitorChair: 'office', studyChair: 'office',
      filingCabinet: 'office', wallShelves: 'office', deskLamp: 'office',
      whiteboard: 'office', desktopLaptop: 'office', pinBoard: 'office',
      // Entryway
      consoleTable: 'entryway', shoeRack: 'entryway', shoeCabinet: 'entryway',
      entrywayBench: 'entryway', coatRack: 'entryway',
      umbrellaStand: 'entryway', wallHook: 'entryway',
      // Laundry
      dryerStand: 'laundry', ironingBoardCabinet: 'laundry',
      utilitySink: 'laundry', storageRack: 'laundry',
      // Outdoor
      outdoorChair: 'outdoor', outdoorSofa: 'outdoor', swingChair: 'outdoor',
      planter: 'outdoor', storageBench: 'outdoor', barbecueStation: 'outdoor',
      // Garage
      toolCabinet: 'garage', workbench: 'garage', bicycleStand: 'garage',
    };

    // Group items by detected room type
    const roomGroups = {};
    plan.items.forEach(item => {
      const rt = roomMap[item.type];
      if (!rt) return;
      if (!roomGroups[rt]) {
        roomGroups[rt] = {
          id: rt,
          name: {
            bedroom: 'Bedroom', living: 'Living Room', kitchen: 'Kitchen',
            dining: 'Dining Room', bathroom: 'Bathroom', office: 'Home Office',
            entryway: 'Entryway', laundry: 'Laundry Room',
            outdoor: 'Outdoor', garage: 'Garage',
          }[rt] || rt.charAt(0).toUpperCase() + rt.slice(1),
          items: [],
          itemCount: 0,
          bounds: { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity },
        };
      }
      roomGroups[rt].items.push(item);
      roomGroups[rt].itemCount++;
      roomGroups[rt].bounds.minX = Math.min(roomGroups[rt].bounds.minX, item.x);
      roomGroups[rt].bounds.minY = Math.min(roomGroups[rt].bounds.minY, item.y);
      roomGroups[rt].bounds.maxX = Math.max(roomGroups[rt].bounds.maxX, item.x + (item.width || 0));
      roomGroups[rt].bounds.maxY = Math.max(roomGroups[rt].bounds.maxY, item.y + (item.height || 0));
    });

    return Object.values(roomGroups);
  }, [plan]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onSelect({
      style: INTERIOR_STYLES.find(s => s.id === localStyle),
      roomType: { id: 'auto', name: 'Auto Detect' },
      selectedArea: selectedArea,
      viewType: 'insider', // Fallback, actual viewType comes from capturedMaps
      controlnetType: 'depth',
    });
    onClose();
  };

  const handleAreaSelect = (room) => {
    setSelectedArea(room);
    setShowAreaSelector(false);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Extra safety for the modal content itself
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Interior Enhancement</h2>
            <p className="text-gray-500 text-sm mt-1">Choose a style to transform your 3D floor plan into a photorealistic interior</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <BiX size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Style Selection */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
              Interior Style
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {INTERIOR_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setLocalStyle(style.id)}
                  className={`p-2 rounded-xl border-2 transition-all text-left group ${localStyle === style.id
                    ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-100'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                    }`}
                >
                  <div className="relative w-full h-24 rounded-lg mb-2 overflow-hidden bg-gray-100">
                    <img
                      src={style.preview}
                      alt={style.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-purple-600/10 transition-opacity ${localStyle === style.id ? 'opacity-100' : 'opacity-0'}`} />
                  </div>
                  <p className="font-bold text-gray-900 text-sm flex items-center justify-between">
                    {style.name}
                    {localStyle === style.id && <BiCheck className="text-purple-600" size={16} />}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-tight line-clamp-2">
                    {style.description}
                  </p>
                </button>
              ))}
            </div>
          </div>




          {/* Area/Region Selection - Commented out as requested
          {detectedRooms.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                Select Specific Room (Optional)
              </h3>

              {!showAreaSelector ? (
                <div className="space-y-3">
                  {selectedArea ? (
                    <div className="p-4 bg-purple-50 border-2 border-purple-500 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-purple-900">{selectedArea.name}</p>
                          <p className="text-sm text-purple-700">
                            {selectedArea.itemCount} furniture items •
                            Bounds: ({Math.round(selectedArea.bounds.minX)}, {Math.round(selectedArea.bounds.minY)})
                            to ({Math.round(selectedArea.bounds.maxX)}, {Math.round(selectedArea.bounds.maxY)})
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedArea(null)}
                          className="p-2 hover:bg-purple-200 rounded-full transition-colors"
                        >
                          <BiX size={20} className="text-purple-600" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowAreaSelector(true)}
                        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-400 hover:bg-purple-50 transition-all text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <BiBrush size={20} className="text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">Select Specific Area</p>
                            <p className="text-sm text-gray-500">
                              Click to choose a specific room or area to enhance
                            </p>
                          </div>
                        </div>
                      </button>

                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 mb-2">
                    Select a detected room area:
                  </p>
                  {detectedRooms.map((room) => (
                    <button
                      key={room.id}
                      onClick={() => handleAreaSelect(room)}
                      className="w-full p-3 border border-gray-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{room.name}</p>
                          <p className="text-sm text-gray-500">
                            {room.itemCount} items • Position: ({Math.round(room.bounds.minX)}, {Math.round(room.bounds.minY)})
                          </p>
                        </div>
                        <BiCheck size={20} className="text-purple-600 opacity-0 group-hover:opacity-100" />
                      </div>
                    </button>
                  ))}
                  <button
                    onClick={() => setShowAreaSelector(false)}
                    className="w-full py-2 text-sm text-gray-500 hover:text-gray-700"
                  >
                    Cancel selection
                  </button>
                </div>
              )}

              {selectedArea && (
                <p className="text-xs text-purple-600 mt-2">
                  AI will focus on enhancing the {selectedArea.name} area while preserving the overall layout.
                </p>
              )}
            </div>
          )}
          */}

          {/* Info Box - Commented out as requested
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BiBrush className="text-blue-600" size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-blue-900">How it works</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Our AI analyzes your 3D floor plan layout, preserves wall positions and furniture placement,
                  then generates a photorealistic interior with your chosen style. The process takes 10-30 seconds.
                </p>
              </div>
            </div>
          </div>
          */}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 flex justify-end gap-3 z-40">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2.5 rounded-xl font-medium bg-[#142725] text-white hover:bg-[#1a3332] transition-colors flex items-center gap-2"
          >
            <BiBrush size={18} />
            Generate Interior
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

/**
 * AI Result Modal - Shows original vs enhanced comparison
 */
export const AIResultModal = ({ isOpen, onClose, originalImage, enhancedImage, onDownload, onDownloadAll, onRegenerate, isLoading, batchRenders }) => {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm"
      style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-600 rounded-lg">
              <BiBrush size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold">AI Interior Render</h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onRegenerate}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
            >
              <BiRefresh size={18} />
              <span className="hidden sm:inline">Regenerate</span>
            </button>
            {batchRenders && batchRenders.renders && (
              <button
                onClick={() => onDownloadAll && onDownloadAll(batchRenders)}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <BiDownload size={18} />
                <span className="hidden sm:inline">Download All ({batchRenders.successfulCount})</span>
              </button>
            )}
            <button
              onClick={() => onDownload(enhancedImage)}
              disabled={isLoading || !enhancedImage}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50"
            >
              <BiDownload size={18} />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors ml-2"
            >
              <BiX size={24} />
            </button>
          </div>
        </div>

        {/* Content - Asymmetric Side by Side */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* Main Images */}
          <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-6 shrink-0 lg:h-[70vh] items-stretch">
            {/* Original - Smaller Column */}
            <div className="lg:col-span-4 bg-gray-50/80 rounded-2xl p-4 border border-gray-100 flex flex-col items-center overflow-y-auto">
              <div className="flex items-center justify-between w-full mb-3">
                <h3 className="font-semibold text-gray-700">Original 3D View</h3>
                <span className="text-xs bg-gray-200 text-gray-600 px-2.5 py-1 rounded-full font-medium">Input</span>
              </div>
              <div className="relative rounded-xl overflow-hidden bg-white shadow-inner aspect-[4/3] w-full border border-gray-200">
                {originalImage ? (
                  <img
                    src={originalImage}
                    alt="Original 3D"
                    className="w-full h-full object-cover opacity-90"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No original image
                  </div>
                )}
              </div>
              <p className="mt-4 text-xs text-gray-500 text-center px-4">
                The AI uses this 3D layout as a strict geometric reference while generating photorealistic materials and lighting.
              </p>
            </div>

            {/* Enhanced - Larger Column */}
            <div className="lg:col-span-8 bg-purple-50/50 rounded-2xl p-5 border border-purple-100 shadow-sm flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-8 bg-purple-500 rounded-full"></div>
                  <h3 className="text-xl font-bold text-purple-900 tracking-tight">AI Enhanced Interior</h3>
                </div>
                <span className="text-xs font-bold uppercase tracking-wider bg-purple-200 text-purple-800 px-3 py-1.5 rounded-full">AI Generated</span>
              </div>

              <div className="relative rounded-xl overflow-hidden bg-white shadow-md w-full border border-purple-100 flex-grow lg:min-h-0 min-h-[400px]">
                {isLoading ? (
                  <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center bg-white/50 backdrop-blur-sm">
                    <div className="relative w-20 h-20 mb-6">
                      <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
                      <BiBrush className="absolute inset-0 m-auto text-purple-600 animate-pulse" size={24} />
                    </div>
                    <h4 className="text-xl font-bold text-purple-800 mb-2">Generating Masterpiece</h4>
                    <p className="text-purple-600 font-medium">Rendering photorealistic lighting & textures...</p>
                    <p className="text-purple-400 text-sm mt-1">This usually takes 10-30 seconds</p>
                  </div>
                ) : enhancedImage ? (
                  <img
                    src={enhancedImage}
                    alt="AI Enhanced"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full min-h-[400px] flex items-center justify-center text-gray-400 bg-gray-50">
                    Failed to generate. Please try again.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Batch Renders Gallery */}
          {batchRenders && batchRenders.renders && batchRenders.renders.length > 0 && (
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-900">
                  All Room Renders ({batchRenders.totalRooms} rooms)
                </h3>
                <span className="text-sm text-gray-600">
                  Success: {batchRenders.successfulCount}/{batchRenders.totalRooms}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {batchRenders.renders.map((render, index) => (
                  <div key={render.roomId || index} className="bg-white rounded-xl overflow-hidden shadow-lg">
                    <div className="aspect-video relative bg-gray-100">
                      {render.imageBase64 ? (
                        <img
                          src={`data:image/png;base64,${render.imageBase64}`}
                          alt={render.roomName || `Room ${index + 1}`}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          Failed
                        </div>
                      )}
                      {render.viewType && (
                        <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                          {render.viewType}
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">{render.roomName || `Room ${index + 1}`}</p>
                          <p className="text-xs text-gray-500">
                            {render.itemCount} items • {render.roomType || 'auto'}
                          </p>
                        </div>
                        {render.imageBase64 && (
                          <button
                            onClick={() => onDownload(`data:image/png;base64,${render.imageBase64}`, render, index)}
                            className="p-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                            title="Download this room"
                          >
                            <BiDownload size={16} className="text-green-600" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

/**
 * Main AI Enhance Button Component
 */
const AIEnhanceButton = ({
  onCapture,
  onCaptureAll360,
  onCaptureCustomGroup,
  plan,
  disabled = false,
  className = '',
  onModalStateChange
}) => {
  const [showStyleSelector, setShowStyleSelector] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [originalImage, setOriginalImage] = useState(null);
  const [enhancedImage, setEnhancedImage] = useState(null);
  const [error, setError] = useState(null);
  const [capturedMaps, setCapturedMaps] = useState(null);
  const [batchRenders, setBatchRenders] = useState(null); // NEW: Store batch render results

  // Notify parent of any open modal
  React.useEffect(() => {
    onModalStateChange?.(showStyleSelector || showResult || isGenerating);
  }, [showStyleSelector, showResult, isGenerating, onModalStateChange]);

  const handleEnhanceClick = async (e) => {
    if (e) e.stopPropagation();
    try {
      // Capture the current 3D view with all control maps
      const captured = await onCapture();
      if (captured) {
        setOriginalImage(captured.colorImage);
        setCapturedMaps(captured); // Store all maps including depth
        setShowStyleSelector(true);
      }
    } catch (err) {
      console.error('Failed to capture:', err);
      setError('Failed to capture 3D view. Please try again.');
    }
  };

  // Function to crop image to selected area
  const cropImageToArea = async (imageDataUrl, area) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // Get image dimensions
        const imgWidth = img.width;
        const imgHeight = img.height;

        // Calculate crop area based on room bounds relative to floor plan
        const planBounds = calculatePlanBounds(plan);
        if (!planBounds || !area.bounds) {
          resolve(imageDataUrl); // Return original if can't calculate
          return;
        }

        // Calculate relative position of the room within the floor plan
        const planWidth = planBounds.maxX - planBounds.minX;
        const planHeight = planBounds.maxY - planBounds.minY;

        const roomX = area.bounds.minX - planBounds.minX;
        const roomY = area.bounds.minY - planBounds.minY;
        const roomWidth = area.bounds.maxX - area.bounds.minX;
        const roomHeight = area.bounds.maxY - area.bounds.minY;

        // Convert to image coordinates (normalize to 0-1 then scale to image size)
        const padding = 0.15; // 15% padding around the room

        let cropX = ((roomX / planWidth) - padding) * imgWidth;
        let cropY = ((roomY / planHeight) - padding) * imgHeight;
        let cropWidth = (roomWidth / planWidth) * imgWidth * (1 + padding * 2);
        let cropHeight = (roomHeight / planHeight) * imgHeight * (1 + padding * 2);

        // Ensure crop stays within image bounds
        cropX = Math.max(0, Math.min(cropX, imgWidth - 100));
        cropY = Math.max(0, Math.min(cropY, imgHeight - 100));
        cropWidth = Math.min(cropWidth, imgWidth - cropX);
        cropHeight = Math.min(cropHeight, imgHeight - cropY);

        // Set canvas size to crop dimensions
        canvas.width = Math.floor(cropWidth);
        canvas.height = Math.floor(cropHeight);

        // Draw cropped portion
        ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);

        console.log('Cropped image:', { cropX, cropY, cropWidth, cropHeight, imgWidth, imgHeight });

        // Convert to data URL
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
      img.src = imageDataUrl;
    });
  };

  // Calculate overall plan bounds
  const calculatePlanBounds = (planData) => {
    if (!planData || !planData.walls) return null;

    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;

    planData.walls.forEach(group => {
      if (group.walls) {
        group.walls.forEach(wall => {
          minX = Math.min(minX, wall.x1, wall.x2);
          maxX = Math.max(maxX, wall.x1, wall.x2);
          minY = Math.min(minY, wall.y1, wall.y2);
          maxY = Math.max(maxY, wall.y1, wall.y2);
        });
      }
    });

    return { minX, maxX, minY, maxY };
  };

  const handleStyleSelect = async ({ style, roomType, selectedArea, customGroup, generateAll = false, is360All = false }) => {
    setShowStyleSelector(false);
    setShowResult(true);
    setIsGenerating(true);
    setError(null);

    const viewType = capturedMaps?.viewType || 'insider';
    const controlnetType = 'depth';

    try {
      if (customGroup && onCaptureCustomGroup) {
        console.log('=== GENERATING CUSTOM 3D SELECTION ===');
        const viewMap = await onCaptureCustomGroup(customGroup.selectedItems, customGroup.viewAngle);

        const enhancedPlanData = {
          ...plan,
          selectedArea: {
            roomType: roomType.id,
            name: `Custom 3D Area (${customGroup.selectedItems.length} items)`,
            bounds: { minX: 0, maxX: 0, minY: 0, maxY: 0 },
            items: customGroup.selectedItems
          },
          viewType: 'insider'
        };

        const result = await aiService.generateInteriorRender({
          colorImage: viewMap.colorImage,
          depthImage: viewMap.depthImage,
          planData: enhancedPlanData,
          style: style.id,
          roomType: roomType.id,
          styleId: style.id,
          selectedArea: { items: customGroup.selectedItems, name: 'Custom Selection' },
          viewType: 'insider',
          controlnetType: controlnetType,
        });

        setEnhancedImage(`data:image/png;base64,${result.imageBase64}`);
        setOriginalImage(viewMap.colorImage);

      } else if (generateAll && is360All && onCaptureAll360) {
        console.log('=== GENERATING 360 VIEWS FOR ALL ROOMS ===');

        // Use detected rooms or fallback to a single 'whole house' room
        const currentRooms = plan.items ? Object.values(plan.items.reduce((acc, item) => {
          // Complete item → room type mapping (matches detectedRooms useMemo above)
          const roomMap = {
            bad: 'bedroom', singleBad: 'bedroom', kingBed: 'bedroom',
            guestDoubleBed: 'bedroom', guestSingleBed: 'bedroom', bunkBed: 'bedroom',
            wordrobe: 'bedroom', wardrobeSliding: 'bedroom', wardrobeHinged: 'bedroom',
            walkInCloset: 'bedroom', guestWardrobe: 'bedroom', dresser: 'bedroom',
            chestOfDrawers: 'bedroom', vanityTable: 'bedroom', headboard: 'bedroom',
            bedsideTable: 'bedroom', guestBedsideTable: 'bedroom', luggageRack: 'bedroom',
            accentChair: 'bedroom', toyStorage: 'bedroom', toyStorageUnit: 'bedroom',
            sofa: 'living', lShapeSofa: 'living', armchair: 'living',
            reclinerChair: 'living', ottoman: 'living', beanBag: 'living',
            coffeeTable: 'living', sideTable: 'living', tv: 'living',
            bookshelf: 'living', rug: 'living', lamp: 'living', curtains: 'living',
            worktop: 'kitchen', stove: 'kitchen', sink: 'kitchen',
            refrigerator: 'kitchen', baseCabinet: 'kitchen', wallCabinet: 'kitchen',
            tallPantryUnit: 'kitchen', kitchenIsland: 'kitchen',
            breakfastCounter: 'kitchen', barStool: 'kitchen',
            spiceRack: 'kitchen', pullOutBasket: 'kitchen', plateRack: 'kitchen',
            table: 'dining', table2: 'dining', roundTable: 'dining',
            bath: 'bathroom', toilet: 'bathroom', showerEnclosure: 'bathroom',
            mirrorCabinet: 'bathroom', towelRack: 'bathroom',
            medicineCabinet: 'bathroom', laundryBasket: 'bathroom',
            washingMachine: 'bathroom', washingMachineBase: 'bathroom',
            officeDesk: 'office', executiveDesk: 'office', studyDesk: 'office',
            studyTable: 'office', studyTableOffice: 'office',
            ergonomicChair: 'office', visitorChair: 'office', studyChair: 'office',
            filingCabinet: 'office', wallShelves: 'office', deskLamp: 'office',
            whiteboard: 'office', desktopLaptop: 'office', pinBoard: 'office',
            consoleTable: 'entryway', shoeRack: 'entryway', shoeCabinet: 'entryway',
            entrywayBench: 'entryway', coatRack: 'entryway', umbrellaStand: 'entryway', wallHook: 'entryway',
            dryerStand: 'laundry', ironingBoardCabinet: 'laundry', utilitySink: 'laundry', storageRack: 'laundry',
            outdoorChair: 'outdoor', outdoorSofa: 'outdoor', swingChair: 'outdoor',
            planter: 'outdoor', storageBench: 'outdoor', barbecueStation: 'outdoor',
            toolCabinet: 'garage', workbench: 'garage', bicycleStand: 'garage',
          };
          const ROOM_NAMES = {
            bedroom: 'Bedroom', living: 'Living Room', kitchen: 'Kitchen',
            dining: 'Dining Room', bathroom: 'Bathroom', office: 'Home Office',
            entryway: 'Entryway', laundry: 'Laundry Room', outdoor: 'Outdoor', garage: 'Garage',
          };
          const type = roomMap[item.type];
          if (type) {
            if (!acc[type]) acc[type] = { id: type, name: ROOM_NAMES[type] || type, items: [], itemCount: 0, bounds: { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity } };
            acc[type].items.push(item);
            acc[type].itemCount++;
            acc[type].bounds.minX = Math.min(acc[type].bounds.minX, item.x);
            acc[type].bounds.minY = Math.min(acc[type].bounds.minY, item.y);
            acc[type].bounds.maxX = Math.max(acc[type].bounds.maxX, item.x + (item.width || 0));
            acc[type].bounds.maxY = Math.max(acc[type].bounds.maxY, item.y + (item.height || 0));
          }
          return acc;
        }, {})) : [];


        // If no rooms detected, just capture the geometrical center of the house
        if (currentRooms.length === 0) {
          const pBounds = calculatePlanBounds(plan);
          if (pBounds) {
            currentRooms.push({
              id: 'main', name: 'Main Area', itemCount: 0, items: [], bounds: pBounds
            });
          }
        }

        const directionalMaps = await onCaptureAll360(currentRooms);

        const renders = [];
        const dirMapEntries = Object.values(directionalMaps);

        // Process sequentially to avoid Replicate 429 Too Many Requests rate limits
        for (let i = 0; i < dirMapEntries.length; i++) {
          const dirMap = dirMapEntries[i];
          console.log(`Generating view ${i + 1} of ${dirMapEntries.length}: ${dirMap.roomName} (${dirMap.dirName})`);

          try {
            const currentRoom = currentRooms.find(r => r.id === dirMap.roomId);
            const enhancedPlanData = {
              ...plan,
              selectedArea: {
                roomType: currentRoom.id,
                name: currentRoom.name,
                bounds: currentRoom.bounds,
                items: currentRoom.items,
              },
              viewType: 'insider',
            };

            const result = await aiService.generateInteriorRender({
              colorImage: dirMap.colorImage,
              depthImage: dirMap.depthImage,
              planData: enhancedPlanData,
              style: style.id,
              roomType: currentRoom.id,
              styleId: style.id,
              selectedArea: currentRoom,
              viewType: 'insider',
              controlnetType: controlnetType,
            });

            renders.push({
              roomId: `${dirMap.roomId}-${dirMap.dirName}`,
              roomName: `${dirMap.roomName} (${dirMap.dirName})`,
              roomType: currentRoom.id,
              itemCount: currentRoom.itemCount,
              viewType: 'insider',
              imageBase64: result.imageBase64,
              prompt: result.prompt
            });
          } catch (error) {
            console.error(`Failed to generate ${dirMap.roomName} - ${dirMap.dirName}:`, error);

            // If we hit a 429 Rate Limit, we should stop and wait, or gracefully fail this one
            const isRateLimit = error.message && error.message.includes('429');
            renders.push({
              roomId: `${dirMap.roomId}-${dirMap.dirName}`,
              roomName: `${dirMap.roomName} (${dirMap.dirName})`,
              roomType: dirMap.roomId,
              error: isRateLimit ? 'Rate limit exceeded. Waiting...' : error.message
            });

            if (isRateLimit) {
              console.log('Rate limit hit. Adding a 10 second backoff before next request...');
              await new Promise(resolve => setTimeout(resolve, 10000));
            }
          }

          // Update UI incrementally if possible
          setBatchRenders({
            renders: [...renders],
            totalRooms: dirMapEntries.length,
            successfulCount: renders.filter(r => r.imageBase64).length,
            failedCount: renders.filter(r => r.error).length,
          });

          // Add a 3 second delay between normal requests to spread them out
          if (i < dirMapEntries.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
        }

        const successfulRenders = renders.filter(r => r.imageBase64);
        const failedRenders = renders.filter(r => r.error);

        const batchResult = {
          renders,
          totalRooms: renders.length,
          successfulCount: successfulRenders.length,
          failedCount: failedRenders.length,
        };

        setBatchRenders(batchResult);

        // Preview the first successful image
        if (successfulRenders.length > 0) {
          setEnhancedImage(`data:image/png;base64,${successfulRenders[0].imageBase64}`);
          setOriginalImage(directionalMaps[Object.keys(directionalMaps)[0]].colorImage);
        }

      } else if (generateAll) {
        // ... existing handleGenerateAllRooms behavior
        handleGenerateAllRooms(style, roomType);
      } else {
        // ── Single generation path ──────────────────────────────────────
        // Both view types (insider + perspective) use FLUX.1 Depth Pro.
        // The key difference is purely in the prompt (eye-level vs elevated view).
        // "insider" view previously called text-only generation (ignoring the
        // captured depth + color images entirely) — that was Bug #2.  Fixed:
        // we now always send depthImage + colorImage to the enhance endpoint.
        const enhancedPlanData = {
          ...plan,
          selectedArea: selectedArea ? {
            roomType: selectedArea.id,
            name: selectedArea.name,
            bounds: selectedArea.bounds,
            items: selectedArea.items,
          } : null,
          viewType: viewType,
        };

        const result = await aiService.generateInteriorRender({
          // BUG FIX: Use capturedMaps.colorImage not `originalImage` — React state
          // setter is async, capturedMaps holds the synchronous captured reference.
          colorImage: capturedMaps?.colorImage,
          depthImage: capturedMaps?.depthImage,
          segmentationImage: capturedMaps?.segmentationImage,
          planData: enhancedPlanData,
          // BUG FIX: Send style.id ('modern') not style.prompt (full sentence).
          // Backend STYLE_ENHANCEMENTS map expects the short id key, not a sentence.
          style: style.id,
          roomType: roomType.id,
          styleId: style.id,
          selectedArea: selectedArea || null,
          viewType: viewType,
          controlnetType: controlnetType,
        });

        setEnhancedImage(`data:image/png;base64,${result.imageBase64}`);
        setBatchRenders(null);
      }
    } catch (err) {
      console.error('AI generation failed:', err);
      setError(err.message || 'Failed to generate interior. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = (imageData) => {
    if (!imageData) return;

    const link = document.createElement('a');
    link.href = imageData;
    link.download = `ai_interior_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // NEW: Download all batch renders
  const handleDownloadAllBatch = async () => {
    if (!batchRenders || !batchRenders.renders || batchRenders.renders.length === 0) {
      alert('No renders to download');
      return;
    }

    try {
      console.log('Downloading all renders...');

      for (let i = 0; i < batchRenders.renders.length; i++) {
        const render = batchRenders.renders[i];

        if (render.imageBase64) {
          const link = document.createElement('a');
          link.href = `data:image/png;base64,${render.imageBase64}`;
          link.download = `${render.roomName || `room-${i + 1}`}-${render.viewType || 'view'}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Small delay between downloads
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }

      alert(`Downloaded ${batchRenders.successfulCount} room renders!`);

    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download some images. Please try again.');
    }
  };

  // NEW: Download individual render from batch
  const handleDownloadBatchSingle = (render, index) => {
    if (!render.imageBase64) return;

    const link = document.createElement('a');
    link.href = `data:image/png;base64,${render.imageBase64}`;
    link.download = `${render.roomName || `room-${index + 1}`}-${render.viewType || 'view'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRegenerate = () => {
    setShowResult(false);
    setShowStyleSelector(true);
    setEnhancedImage(null);
  };

  // NEW: Handle batch generation for all rooms
  const handleGenerateAllRooms = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      console.log('=== GENERATING ALL ROOMS ===');

      // Get plan data
      const enhancedPlanData = {
        ...plan,
        viewType: 'insider',
      };

      // Call batch generation API
      const result = await aiService.generateAllRoomRenders({
        planData: enhancedPlanData,
        style: 'modern',
      });

      console.log(`Generated ${result.renders.length} room renders`);

      // Store results for gallery view
      setBatchRenders(result);

      // Show first successful render in main view
      const firstSuccessful = result.renders.find(r => r.imageBase64);
      if (firstSuccessful) {
        setEnhancedImage(`data:image/png;base64,${firstSuccessful.imageBase64}`);
        setOriginalImage(null);
        setShowResult(true);
      }

      alert(`Generated ${result.successfulCount}/${result.totalRooms} room renders! View and download all in the gallery below.`);

    } catch (err) {
      console.error('Batch generation failed:', err);
      setError(err.message || 'Failed to generate all rooms. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // NEW: Handle batch generation from inside modal
  const handleGenerateAllRoomsFromModal = () => {
    onClose();
    handleGenerateAllRooms();
  };

  return (
    <>
      {/* Main Button */}
      <button
        onClick={handleEnhanceClick}
        disabled={disabled}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
          bg-[#5A745F] hover:bg-[#4d6552] text-white shadow-lg
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
      >
        <BiBrush size={18} />
        <span>AI Enhance</span>
      </button>

      {/* Error Toast */}
      {error && createPortal(
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg shadow-lg z-[10000]">
          <div className="flex items-center gap-2">
            <BiX size={20} />
            <span>{error}</span>
          </div>
        </div>,
        document.body
      )}

      {/* Modals */}
      <AIStyleSelector
        isOpen={showStyleSelector}
        onClose={() => setShowStyleSelector(false)}
        onSelect={handleStyleSelect}
        plan={plan}
        originalImage={originalImage}
        onModalStateChange={onModalStateChange}
      />

      <AIResultModal
        isOpen={showResult}
        onClose={() => setShowResult(false)}
        originalImage={originalImage}
        enhancedImage={enhancedImage}
        onDownload={handleDownload}
        onDownloadAll={handleDownloadAllBatch}
        onRegenerate={handleRegenerate}
        isLoading={isGenerating}
        batchRenders={batchRenders}
      />
    </>
  );
};

export default AIEnhanceButton;
