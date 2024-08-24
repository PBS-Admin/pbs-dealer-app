import {
  pbr,
  ssr,
  ms200,
  doubleLok,
  ultraDek,
  hr34,
  blank,
  pbrRev,
  corrugated,
  tuffRib,
  flatSoffit,
} from '../../../../public/images';

export const shapes = [
  { id: 'symmetrical', label: 'Symmetrical' },
  { id: 'singleSlope', label: 'Single Slope' },
  { id: 'leanTo', label: 'Lean-to' },
  { id: 'nonSymmetrical', label: 'Non-Symmetrical' },
];

export const frames = [
  { id: 'rigidFrame', label: 'Rigid Frame' },
  { id: 'multiSpan', label: 'Multi Span' },
];

export const FrameOptions = [
  { id: 'postAndBeam', label: 'Post and Beam' },
  { id: 'halfLoadedRF', label: 'Half-Loaded Rigid Frame' },
  { id: 'fullLoadedRF', label: 'Full-Loaded Rigid Frame' },
  { id: 'expandableRF', label: 'Expandable Rigid Frame' },
  { id: 'insetRF', label: 'Rigid Frame Inset' },
];

export const SidewallBracingType = [
  { id: 'xBrace', label: 'X-Bracing' },
  { id: 'angle', label: 'Angle Bracing' },
  { id: 'portal', label: 'Portal Frame' },
  { id: 'torsional', label: 'Torsional' },
  { id: 'tier', label: 'Tier Bracing' },
  { id: 'none', label: 'None' },
];

export const EndwallBracingType = [
  { id: 'xBrace', label: 'X-Bracing' },
  { id: 'angle', label: 'Angle Bracing' },
  { id: 'none', label: 'None' },
];

export const breakPoints = [
  { id: 'left', label: 'Left Endwall' },
  { id: 'right', label: 'Right Endwall' },
];

export const girtTypes = [
  { id: 'bipass', label: 'Bi-Pass' },
  { id: 'flush', label: 'Flush' },
  { id: 'projected', label: '1" Projected' },
  { id: 'open', label: 'Open' },
];

export const girtSpacing = [
  { id: 'default', label: 'Default Girt Spacing' },
  { id: 'twoFoot', label: 'Girts Spaced 2\'-0" on Center' },
  { id: 'fourFoot', label: 'Girts Spaced 4\'-0" on Center' },
  { id: 'eightPly', label: 'For 8\'-0" High Plywood Liner' },
  { id: 'fullPly', label: 'For Full Height Plywood Liner' },
];

export const baseCondition = [
  { id: 'none', label: 'None' },
  { id: 'angle', label: 'Base Angle' },
  { id: 'cee', label: 'Base Cee' },
  { id: 'six', label: 'First Girt at 6" - No Base Trim' },
];

export const purlinSpacing = [
  { id: 'default', label: 'Default Purlin Spacing' },
  { id: 'fourFoot', label: 'Purlin Spaced 4\'-0" on Center' },
  { id: 'threeFoot', label: 'Purlin Spaced 3\'-0" on Center' },
  { id: 'twoFoot', label: 'Purlin Spaced 2\'-0" on Center' },
];

export const roofPanels = [
  { id: 'pbr', label: 'PBR', image: pbr },
  { id: 'pbrDrip', label: 'PBR with Drip Stop', image: pbr },
  { id: 'ssq', label: 'SSQ-275 Standing Seam', image: ssr },
  { id: 'ms200', label: 'MS-200 Standing Seam', image: ms200 },
  { id: 'doubleLok', label: 'Double-Lok Standing Seam', image: doubleLok },
  { id: 'ultraDek', label: 'Ultra-Dek Standing Seam', image: ultraDek },
  { id: 'battenLok', label: 'BattenLok HS Standing Seam', image: ms200 },
  { id: 'superLok', label: 'SuperLok Standing Seam', image: ms200 },
  { id: 'hr34', label: 'HR-34', image: hr34 },
  {
    id: 'kingSeam',
    label: 'Kingspan Insulated Panels - KingSeam',
    image: blank,
  },
  { id: 'kingRib', label: 'Kingspan Insulated Panels - KingRib', image: blank },
  {
    id: 'sr2',
    label: 'All Weather Insulated Panels - Standing Seam (SR2)',
    image: blank,
  },
  {
    id: 'hr3',
    label: 'All Weather Insulated Panels - HR Series (HR3)',
    image: blank,
  },
  { id: 'insulated', label: 'Insulated Panels (See Notes)', image: blank },
  { id: 'insulatedOthers', label: 'Insulated Panels - By Others' },
  { id: 'ssOthers', label: 'Standing Seam Panels - By Others', image: blank },
  { id: 'screwdownOthers', label: 'Screwdown Panels - By Others' },
];

export const roofGauge = [
  { id: '26', label: '26' },
  { id: '24', label: '24' },
];

export const roofFinish = [
  { id: 'painted', label: 'Painted' },
  { id: 'galv', label: 'Galvalume' },
  { id: 'kynar', label: 'Kynar' },
];

export const wallPanels = [
  { id: 'pbr', label: 'PBR', image: pbr },
  { id: 'pbrDrip', label: 'PBR with Drip Stop', image: pbr },
  { id: 'pbrRev', label: 'Reverse Rolled PBR', image: pbrRev },
  { id: 'hr34', label: 'HR-34', image: hr34 },
  { id: 'corrugated', label: 'Classic 7/8" Corrugated', image: corrugated },
  {
    id: 'kingSeam',
    label: 'Kingspan Insulated Panels - KS Series',
    image: blank,
  },
  {
    id: 'dm40',
    label: 'All Weather Insulated Panels - Mesa(DM40)',
    image: blank,
  },
  { id: 'insulated', label: 'Insulated Panels (See Notes)', image: blank },
  { id: 'insulatedOthers', label: 'Insulated Panels - By Others' },
  { id: 'others', label: 'By Others' },
  { id: 'open', label: 'Open' },
];

export const wallGauge = [
  { id: '26', label: '26' },
  { id: '24', label: '24' },
];

export const wallFinish = [
  { id: 'galv', label: 'Galvalume' },
  { id: 'painted', label: 'Painted' },
  { id: 'kynar', label: 'Kynar' },
];

export const soffitPanels = [
  { id: 'tuff', label: 'Tuff Rib', image: tuffRib },
  { id: 'flat', label: 'Flat Soffit', image: flatSoffit },
  { id: 'pbr', label: 'PBR', image: pbr },
  { id: 'pbrDrip', label: 'PBR with Drip Stop', image: pbr },
  { id: 'pbrRev', label: 'Reverse Rolled PBR', image: pbrRev },
  { id: 'hr34', label: 'HR-34', image: hr34 },
  { id: 'none', label: 'None', image: blank },
];

export const soffitGauge = [
  { id: '29', label: '29' },
  { id: '26', label: '26' },
  { id: '24', label: '24' },
];

export const soffitFinish = [
  { id: 'galv', label: 'Galvalume' },
  { id: 'painted', label: 'Painted' },
  { id: 'kynar', label: 'Kynar' },
];

export const roofInsulation = [
  { id: 'none', label: 'None' },
  { id: 'vrr2', label: '2" VRR (R-7)' },
  { id: 'vrr3', label: '3" VRR (R-10)' },
  { id: 'vrr4', label: '4" VRR (R-13)' },
  { id: 'vrr6', label: '6" VRR (R-19)' },
  { id: 'banded30', label: 'Banded Liner System (R-30)' },
  { id: 'banded32', label: 'Banded Liner System (R-32)' },
  { id: 'banded36', label: 'Banded Liner System (R-36)' },
  { id: 'banded38', label: 'Banded Liner System (R-38)' },
  { id: 'banded40', label: 'Banded Liner System (R-40)' },
  { id: 'banded49', label: 'Banded Liner System (R-49)' },
];

export const wallInsulation = [
  { id: 'none', label: 'None' },
  { id: 'vrr2', label: '2" VRR (R-7)' },
  { id: 'vrr3', label: '3" VRR (R-10)' },
  { id: 'vrr4', label: '4" VRR (R-13)' },
  { id: 'vrr6', label: '6" VRR (R-19)' },
  { id: 'banded25', label: 'Banded Liner System (R-25)' },
  { id: 'banded30', label: 'Banded Liner System (R-30)' },
];

export const extInsulation = [
  { id: 'none', label: 'None' },
  { id: 'extend', label: 'Extend Roof Insulation at Extensions' },
];

export const walls = [
  { id: 'fsw', label: 'Front Sidewall' },
  { id: 'bsw', label: 'Back Sidewall' },
  { id: 'lew', label: 'Left Endwall' },
  { id: 'rew', label: 'Right Endwall' },
];

export const orientations = [
  { id: 't', label: 'Transverse' },
  { id: 'l', label: 'Longitudinal' },
];
