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
} from '../../public/images';

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
  { id: '26', label: '26', validFor: ['pbr', 'pbrDrip', 'hr34'] },
  {
    id: '24',
    label: '24',
    validFor: [
      'pbr',
      'pbrDrip',
      'ssq',
      'ms200',
      'doubleLok',
      'ultraDek',
      'battenLok',
      'superLok',
      'hr34',
    ],
  },
];

export const roofFinish = [
  { id: 'painted', label: 'Painted', validFor: ['26'] },
  { id: 'kynar', label: 'Kynar', validFor: ['24'] },
  { id: 'galv', label: 'Galvalume', validFor: ['26', '24'] },
];

export const wallPanels = [
  { id: 'pbr', label: 'PBR', image: pbr },
  { id: 'pbrDrip', label: 'PBR with Drip Stop', image: pbr },
  { id: 'pbrRev', label: 'Reverse Rolled PBR', image: pbrRev },
  { id: 'hr34', label: 'HR-34', image: hr34 },
  { id: 'corr', label: 'Classic 7/8" Corrugated', image: corrugated },
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
  {
    id: '26',
    label: '26',
    validFor: ['pbr', 'pbrDrip', 'pbrRev', 'hr34', 'corr'],
  },
  {
    id: '24',
    label: '24',
    validFor: ['pbr', 'pbrDrip', 'pbrRev', 'hr34', 'corr'],
  },
];

export const wallFinish = [
  { id: 'painted', label: 'Painted', validFor: ['26'] },
  { id: 'kynar', label: 'Kynar', validFor: ['24'] },
  { id: 'galv', label: 'Galvalume', validFor: ['26', '24'] },
];

export const soffitPanels = [
  { id: 'pbr', label: 'PBR', image: pbr },
  { id: 'pbrRev', label: 'Reverse Rolled PBR', image: pbrRev },
  { id: 'flat', label: 'Flat Soffit', image: flatSoffit },
  { id: 'tuff', label: 'Tuff Rib', image: tuffRib },
  { id: 'hr34', label: 'HR-34', image: hr34 },
  { id: 'none', label: 'None', image: blank },
];

export const soffitGauge = [
  { id: '29', label: '29', validFor: ['tuff'] },
  { id: '26', label: '26', validFor: ['pbr', 'pbrRev', 'flat', 'hr34'] },
  { id: '24', label: '24', validFor: ['pbr', 'pbrRev', 'flat', 'hr34'] },
];

export const soffitFinish = [
  { id: 'painted', label: 'Painted', validFor: ['26', '29'] },
  { id: 'kynar', label: 'Kynar', validFor: ['24'] },
  { id: 'galv', label: 'Galvalume', validFor: ['26', '24', '29'] },
];

export const roofInsulation = [
  { id: 'none', label: 'None', validFor: [] },
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
  { id: 'front', label: 'Front Sidewall' },
  { id: 'back', label: 'Back Sidewall' },
  { id: 'left', label: 'Left Endwall' },
  { id: 'right', label: 'Right Endwall' },
];

export const orientations = [
  { id: 't', label: 'Transverse' },
  { id: 'l', label: 'Longitudinal' },
];

export const panelOptions = [
  { id: 'break', label: 'Break Panel' },
  { id: 'lap', label: 'Lap Panel' },
];

export const topOfWall = [
  { id: 'ba', label: 'Base Angle' },
  { id: 'bc', label: 'Base Channel' },
  { id: 'cg', label: 'Cee Girt' },
  { id: 'hrc', label: 'Hot Rolled Channel' },
  { id: 'hrb', label: 'Hot Rolled Beam' },
];

export const polycarbWallSize = [
  { id: '3', label: '3\'-0"' },
  { id: '4', label: '4\'-0"' },
  { id: '5', label: '5\'-0"' },
];

export const polycarbWallColor = [
  { id: 'clear', label: 'Clear' },
  { id: 'white', label: 'White' },
];

export const polycarbRoofSize = [{ id: '10', label: '10\'-0"' }];

export const polycarbRoofColor = [
  { id: 'clear', label: 'Clear' },
  { id: 'white', label: 'White' },
];

export const openingTypes = [
  { id: 'overhead', label: 'Overhead Door' },
  { id: 'PBSdoor', label: 'PBS provided Breakdown Door' },
  { id: 'PBSprehung', label: 'PBS provided Pre-Hung Door' },
  { id: 'canister', label: 'Canister Door' },
  { id: 'sliding', label: 'Sliding Door' },
  { id: 'bipass', label: 'Bi-Pass Sliding Door' },
  { id: 'biparting', label: 'Bi-Parting Sliding Door' },
  { id: 'window', label: 'Window' },
  { id: 'entry', label: 'Opening for Entry Door' },
  { id: 'recessed', label: 'Recessed Opening' },
  { id: 'commercialwindow', label: 'Commercial Storefront Window' },
  { id: 'commercialentry', label: 'Commercial Storefront Entry' },
  { id: 'louver', label: 'Louver' },
  { id: 'openbay', label: 'Open Bay' },
];

export const buildingCodes = [
  { id: 'ibc18', label: 'IBC18 (International Building Code 2018)' },
  { id: 'ibc21', label: 'IBC21 (International Building Code 2021)' },
  { id: 'ossc22', label: 'OSSC22 (Oregon Structural Specialty Code 2022)' },
  { id: 'cbc22', label: 'CBC22 (California Building Code 2022)' },
];

export const riskCategories = [
  { id: 'I', label: 'I - Agricultural' },
  { id: 'II', label: 'II - Standard Occupancy' },
  { id: 'III', label: 'III - Substantial Facility' },
  { id: 'IV', label: 'IV - Essential Facility' },
];

export const exposure = [
  { id: 'B', label: 'B' },
  { id: 'C', label: 'C' },
  { id: 'D', label: 'D' },
];

export const enclosure = [
  { id: 'closed', label: 'Closed' },
  { id: 'partial', label: 'Partial' },
  { id: 'open', label: 'Open' },
];

export const thermalFactor = [
  { id: 'greenhouse', label: 'Greenhouse' },
  { id: 'heated', label: 'Heated' },
  { id: 'insulated', label: 'Unheated w/ Insulation' },
  { id: 'uninsulated', label: 'Unheated w/o Insulation' },
  { id: 'freezing', label: 'Kept below freezing' },
];

export const seismicCategory = [
  { id: 'A', label: 'A' },
  { id: 'B', label: 'B' },
  { id: 'C', label: 'C' },
  { id: 'D', label: 'D' },
  { id: 'E', label: 'E' },
  { id: 'F', label: 'F' },
];
