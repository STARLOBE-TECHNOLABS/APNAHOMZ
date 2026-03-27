import React from 'react'

/**
 * 2D Window — Architectural floor plan style
 *
 * Standard representation used in real architectural drawings:
 * - Two thick parallel lines = outer wall edges of the window opening
 * - Three thin parallel lines inside = glass pane(s) / glazing bars
 * - Centre glazing line divides the two lights (panes)
 * - Thin sill line on exterior side
 *
 * The long axis of the window runs left-to-right (90 units wide).
 * The short axis represents wall thickness (10 units deep shown from above).
 */
const Window = ({ item }) => {

  // Palette
  const wallColor = '#374151'; // dark charcoal — wall line
  const glassColor = '#BAD9F2'; // pale sky-blue fill for glass zone
  const paneColor = '#6B8FA8'; // muted blue-gray for glazing bars
  const sillColor = '#5C3D1E'; // brown — exterior sill edge

  // Dimensions (viewed from top/plan)
  const w = 90; // width of window opening
  const wt = 10; // wall thickness (top-to-bottom in plan view)
  const y0 = 1;  // top edge

  return (
    <g transform={`translate(0, 2)`}>

      {/* ── Glass pane fill (between the two wall lines) ─────────── */}
      <rect
        x={0} y={y0}
        width={w} height={wt}
        fill={glassColor}
        opacity={0.55}
      />

      {/* ── Outer wall line — interior face ──────────────────────── */}
      <line x1={0} y1={y0} x2={w} y2={y0}
        stroke={wallColor} strokeWidth={1.8} />

      {/* ── Outer wall line — exterior face ──────────────────────── */}
      <line x1={0} y1={y0 + wt} x2={w} y2={y0 + wt}
        stroke={wallColor} strokeWidth={1.8} />

      {/* ── Interior glass edge line (thin) ──────────────────────── */}
      <line x1={0} y1={y0 + 2.5} x2={w} y2={y0 + 2.5}
        stroke={paneColor} strokeWidth={0.7} />

      {/* ── Exterior glass edge line (thin) ──────────────────────── */}
      <line x1={0} y1={y0 + 7.5} x2={w} y2={y0 + 7.5}
        stroke={paneColor} strokeWidth={0.7} />

      {/* ── Centre glazing bar (vertical divider) ────────────────── */}
      <line x1={w / 2} y1={y0} x2={w / 2} y2={y0 + wt}
        stroke={paneColor} strokeWidth={0.8} strokeDasharray="1.5,1" />

      {/* ── Additional pane dividers (at 1/4 and 3/4 widths) ─────── */}
      <line x1={w * 0.25} y1={y0 + 2.5} x2={w * 0.25} y2={y0 + 7.5}
        stroke={paneColor} strokeWidth={0.5} opacity={0.6} />
      <line x1={w * 0.75} y1={y0 + 2.5} x2={w * 0.75} y2={y0 + 7.5}
        stroke={paneColor} strokeWidth={0.5} opacity={0.6} />

      {/* ── Exterior sill line (slightly beyond wall face) ───────── */}
      <line x1={-1} y1={y0 + wt + 1.5} x2={w + 1} y2={y0 + wt + 1.5}
        stroke={sillColor} strokeWidth={1.2} />

      {/* ── End caps (jamb marks) ────────────────────────────────── */}
      <line x1={0} y1={y0} x2={0} y2={y0 + wt}
        stroke={wallColor} strokeWidth={1.5} />
      <line x1={w} y1={y0} x2={w} y2={y0 + wt}
        stroke={wallColor} strokeWidth={1.5} />

    </g>
  )
}

export default Window