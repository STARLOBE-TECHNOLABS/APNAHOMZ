import React from 'react'

/**
 * 2D Door — Architectural floor plan style
 *
 * Standard representation:
 * - Brown door leaf (panel) shown as rectangle
 * - Quarter-circle swing arc showing door clearance zone
 * - Door frame/jambs on both sides (wall thickness lines)
 * - Lever handle on the door panel
 * - Hinge side shown with small rectangles
 */
const Door = ({ item }) => {
  const flip = item?.flip || false;

  // Colors — warm wood brown palette
  const doorColor = '#8B5E3C'; // warm brown door panel
  const frameColor = '#5C3D1E'; // darker brown frame/jamb
  const arcColor = '#A07040'; // lighter for swing arc
  const handleColor = '#2C2C2C'; // near-black handle
  const glassColor = '#D4E8F5'; // light blue for any glass
  const arcFill = 'rgba(164, 128, 92, 0.08)'; // very faint swept area

  return (
    <g transform={flip ? 'translate(60, 0) scale(-1, 1)' : ''}>

      {/* ── Wall jambs (frame sides embedded in wall) ─────────────── */}
      {/* Left jamb */}
      <rect x={0} y={48} width={4} height={12} fill={frameColor} rx={0.5} />
      {/* Right jamb (hinge side) */}
      <rect x={56} y={48} width={4} height={12} fill={frameColor} rx={0.5} />

      {/* ── Swept / swing zone (very faint fill) ─────────────────── */}
      <path
        d="M 57 2 A 55 55 0 0 0 2 54"
        fill={arcFill}
      />

      {/* ── Swing arc (dashed quarter-circle) ─────────────────────── */}
      <path
        d="M 57 2 A 55 55 0 0 0 2 54"
        fill="none"
        stroke={arcColor}
        strokeWidth={1.2}
        strokeDasharray="5,2"
      />

      {/* ── Door leaf / panel ─────────────────────────────────────── */}
      {/* The door panel sits along the hinge side */}
      <rect
        x={55.5}
        y={1}
        width={4}
        height={53}
        rx={0.5}
        fill={doorColor}
        stroke={frameColor}
        strokeWidth={0.6}
      />

      {/* Panel groove — upper inset rectangle (decorative detail) */}
      <rect x={56.2} y={5} width={2.6} height={18} rx={0.4}
        fill="none" stroke={frameColor} strokeWidth={0.5} opacity={0.7} />
      {/* Panel groove — lower inset rectangle */}
      <rect x={56.2} y={27} width={2.6} height={22} rx={0.4}
        fill="none" stroke={frameColor} strokeWidth={0.5} opacity={0.7} />

      {/* ── Hinges (small rectangles on hinge side) ───────────────── */}
      <rect x={55.2} y={6} width={1.6} height={3} rx={0.3} fill={handleColor} opacity={0.8} />
      <rect x={55.2} y={23} width={1.6} height={3} rx={0.3} fill={handleColor} opacity={0.8} />
      <rect x={55.2} y={43} width={1.6} height={3} rx={0.3} fill={handleColor} opacity={0.8} />

      {/* ── Door handle (lever, on latch side = far from hinge) ───── */}
      {/* Back plate */}
      <rect x={56.1} y={30} width={2.8} height={1.2} rx={0.3} fill={handleColor} />
      {/* Lever arm */}
      <rect x={56.1} y={31.2} width={2} height={0.7} rx={0.3} fill={handleColor} />
      {/* Knob circle */}
      <circle cx={56.6} cy={30.6} r={0.9} fill={handleColor} />

      {/* ── Threshold line (opening width) ────────────────────────── */}
      <line x1={0} y1={59} x2={60} y2={59}
        stroke={frameColor} strokeWidth={2} />
    </g>
  )
}

export default Door