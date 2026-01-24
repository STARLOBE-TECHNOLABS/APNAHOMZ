export const clamp = (value, min, max) => {
  return Math.max(min, Math.min(max, value));
}

export const findMinMaxXY = (data) => {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  data.forEach(obj => {
    minX = Math.min(minX, obj.x1, obj.x2);
    maxX = Math.max(maxX, obj.x1, obj.x2);

    minY = Math.min(minY, obj.y1, obj.y2);
    maxY = Math.max(maxY, obj.y1, obj.y2);
  });

  return {
    minX: minX,
    maxX: maxX,
    minY: minY,
    maxY: maxY
  };
}

export const findBoundingBoxCenter = (segments) => {
  if (segments.length === 0) {
    // Handle the case where segments array is empty
    return { x: 0, y: 0, dx: 0, dy: 0  };
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;

  segments.forEach(segment => {
      // Update min and max x and y values
      minX = Math.min(minX, segment.x1, segment.x2);
      maxX = Math.max(maxX, segment.x1, segment.x2);
      minY = Math.min(minY, segment.y1, segment.y2);
      maxY = Math.max(maxY, segment.y1, segment.y2);
  });

  // Calculate the center of the bounding box
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;

  return { x: centerX, y: centerY, dx: maxX - minX, dy: maxY-minY };
}


export const convertToUnit = (value, unit) => {

  const conversionFactors = {
    cm: 1, // 1 pixel value represent 1 cm
    inch: 2.54,
    feet: 30.48
  };

  if (!conversionFactors[unit]) return 100 // if no supported unit return in base unit 100 pixels === 100 cm

  return value / conversionFactors[unit]
}

