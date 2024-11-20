import {
  avp,
  battenLok,
  bDeck,
  boxRib,
  corrugated,
  doubleLok,
  flatSoffit,
  hr34,
  hr36,
  lsdb,
  lsfp,
  lspp,
  lssb,
  marionR,
  ms200,
  pbc,
  pbd,
  pbr,
  marionRRev,
  pbrRev,
  ssq,
  ssr,
  superLok,
  tuffRib,
  ultraDek,
  blank,
} from '../../public/images';

export const shapes = [
  { id: 'symmetrical', label: 'Symmetrical' },
  { id: 'singleSlope', label: 'Single Slope' },
  { id: 'leanTo', label: 'Lean-to' },
  { id: 'nonSymmetrical', label: 'Non-Symmetrical' },
];

export const steelFinish = [
  { id: 'NC', label: 'Standard Enamel Color' },
  { id: 'CM', label: 'Custom Enamel Color' },
  { id: 'GZ', label: 'Hot Dip Galvanized' },
  { id: 'PC', label: 'Powder Coat' },
  { id: 'PL', label: 'Unfinished Steel' },
  { id: 'BK', label: 'Black', optionGroup: 'Standard Enamel Colors' },
  { id: 'GN', label: 'Green', optionGroup: 'Standard Enamel Colors' },
  { id: 'GY', label: 'Gray', optionGroup: 'Standard Enamel Colors' },
  { id: 'RD', label: 'Red', optionGroup: 'Standard Enamel Colors' },
  { id: 'WH', label: 'White', optionGroup: 'Standard Enamel Colors' },
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
  { id: 'ssq', label: 'SSQ-275 Standing Seam', image: ssq },
  { id: 'ms200', label: 'MS-200 Standing Seam', image: ms200 },
  { id: 'doubleLok', label: 'Double-Lok Standing Seam', image: doubleLok },
  { id: 'ultraDek', label: 'Ultra-Dek Standing Seam', image: ultraDek },
  { id: 'battenLok', label: 'BattenLok HS Standing Seam', image: battenLok },
  { id: 'superLok', label: 'SuperLok Standing Seam', image: superLok },
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
  { id: 'ssOthers', label: 'Standing Seam Panels - By Others' },
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

export const hangarDoorInsulation = [
  { id: 'none', label: 'None' },
  { id: 'vrr2', label: '2" VRR (R-7)' },
  { id: 'vrr3', label: '3" VRR (R-10)' },
  { id: 'vrr4', label: '4" VRR (R-13)' },
];

export const walls = [
  { id: 'front', label: 'Front Sidewall' },
  { id: 'back', label: 'Back Sidewall' },
  { id: 'left', label: 'Left Endwall' },
  { id: 'right', label: 'Right Endwall' },
];

export const wallsOuterLeft = [
  { id: 'front', label: 'Front Sidewall' },
  { id: 'back', label: 'Back Sidewall' },
  { id: 'outerLeft', label: 'Outer Left Endwall' },
  { id: 'left', label: 'Left Endwall' },
  { id: 'right', label: 'Right Endwall' },
];

export const wallsOuterRight = [
  { id: 'front', label: 'Front Sidewall' },
  { id: 'back', label: 'Back Sidewall' },
  { id: 'left', label: 'Left Endwall' },
  { id: 'right', label: 'Right Endwall' },
  { id: 'outerRight', label: 'Outer Right Endwall' },
];

export const wallsOuterBoth = [
  { id: 'front', label: 'Front Sidewall' },
  { id: 'back', label: 'Back Sidewall' },
  { id: 'outerLeft', label: 'Outer Left Endwall' },
  { id: 'left', label: 'Left Endwall' },
  { id: 'right', label: 'Right Endwall' },
  { id: 'outerRight', label: 'Outer Right Endwall' },
];

export const roof = [{ id: 'roof', label: 'Roof' }];

export const roofs = [
  { id: 'back', label: 'Back Roof' },
  { id: 'front', label: 'Front Roof' },
];

export const singleSlopeRoofs = [{ id: 'back', label: 'Back Roof' }];

export const orientations = [
  { id: 't', label: 'Transverse' },
  { id: 'l', label: 'Longitudinal' },
];

export const panelOptions = [
  { id: 'break', label: 'Break Panel' },
  { id: 'lap', label: 'Lap Panel' },
];

export const topOfWall = [
  { id: 'A', label: 'Base Angle' },
  { id: 'B', label: 'Base Channel' },
  { id: 'C', label: 'Cee Girt' },
  { id: 'U', label: 'Hot Rolled Channel' },
  { id: 'R', label: 'Hot Rolled Beam' },
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
  { id: 'C', label: 'Closed' },
  { id: 'P', label: 'Partial' },
  { id: 'O', label: 'Open' },
];

export const thermalFactor = [
  { id: 0.85, label: 'Greenhouse' },
  { id: 1, label: 'Heated' },
  { id: 1.1, label: 'Unheated w/ Insulation' },
  { id: 1.2, label: 'Unheated w/o Insulation' },
  { id: 1.3, label: 'Kept below freezing' },
];

export const seismicCategory = [
  { id: 'A', label: 'A' },
  { id: 'B', label: 'B' },
  { id: 'C', label: 'C' },
  { id: 'D', label: 'D' },
  { id: 'E', label: 'E' },
  { id: 'F', label: 'F' },
];

// todo: correct values to match current program
export const mandoors = [
  { id: '3070', label: 'Breakdown 3070' },
  { id: '4070', label: 'Breakdown 4070' },
  { id: '6070', label: 'Breakdown 6070' },
  { id: '3070P', label: 'Pre-Hung 3070' },
  { id: '4070P', label: 'Pre-Hung 4070' },
  { id: '6070P', label: 'Pre-Hung 6070' },
];

export const mandoorGlass = [
  { id: 'none', label: 'None' },
  { id: 'half', label: 'With Half Glass' },
  { id: 'narrow', label: 'With Narrow Lite' },
];

export const panels_pbr_26 = [
  // {
  //   id: 'GV',
  //   color: 'ada49b',
  //   label: 'Galvalume',
  //   optionGroup: 'Category Colors',
  // },
  {
    id: 'NC',
    color: 'ada49b',
    label: 'Standard Color',
    optionGroup: 'Category Colors',
  },
  {
    id: 'CM',
    color: 'ada49b',
    label: 'Premium Color',
    optionGroup: 'Category Colors',
  },
  { id: 'AS', color: '808585', label: 'Ashland Gray' },
  { id: 'BB', color: '33302d', label: 'Baker Brown' },
  { id: 'BN', color: 'b09f8d', label: 'Benton Beige' },
  { id: 'BT', color: '090a0b', label: 'Black Butte' },
  { id: 'DE', color: '104a63', label: 'Deschutes Blue' },
  { id: 'GG', color: '67795e', label: 'Gilliam Green' },
  { id: 'GH', color: '4f4c52', label: 'Grays Harbor' },
  { id: 'JC', color: '4b483e', label: 'Jackson Copper' },
  { id: 'MH', color: 'ebeeed', label: 'Mt Hood White' },
  { id: 'OC', color: '5e413b', label: 'Ochoco Brown' },
  { id: 'PP', color: 'd5ddd2', label: 'Pasco Parchment' },
  { id: 'RE', color: '882628', label: 'Redmond Red' },
  { id: 'SV', color: 'c9c8be', label: 'Silverton Stone' },
  { id: 'SR', color: '9d9187', label: 'Smith Rock Hickory' },
  { id: 'WA', color: '2a3c3b', label: 'Washington Evergreen' },
  { id: 'WG', color: '254943', label: 'Willamette Green' },
  {
    id: 'DN',
    color: '91886b',
    label: 'Desert Brown',
    optionGroup: 'Premium Colors',
  },
  { id: 'IV', color: 'd9d5b2', label: 'Ivory', optionGroup: 'Premium Colors' },
  {
    id: 'SD',
    color: 'af914f',
    label: 'Sand Gold',
    optionGroup: 'Premium Colors',
  },
  {
    id: 'TB',
    color: '344455',
    label: 'Tahoe Blue',
    optionGroup: 'Premium Colors',
  },
];

export const panels_flat_26 = [
  { id: 'MH', color: 'ebeeed', label: 'Mt Hood White' },
];

export const panels_ssq_24 = [
  { id: 'DK', color: '655845', label: 'Dark Bronze' },
  { id: 'MH', color: 'ebeeed', label: 'Mt Hood White' },
  { id: 'SL', color: '858f88', label: 'Slate Gray' },
];

export const panels_pbrDrip_26 = [
  { id: 'CG', color: '424443', label: 'Charcoal Grey' },
  { id: 'CA', color: '674b3e', label: 'Cocoa Brown' },
  { id: 'DN', color: '91886b', label: 'Desert Brown' },
  { id: 'FG', color: '2e3f35', label: 'Forest Green' },
  { id: 'GW', color: 'd3d4ca', label: 'Glacier White' },
  { id: 'HY', color: '89826e', label: 'Hickory' },
  { id: 'IV', color: 'd9d5b2', label: 'Ivory' },
  { id: 'KB', color: '535149', label: 'Kodiak Brown' },
  { id: 'LS', color: 'cbc29e', label: 'Light Stone' },
  { id: 'PB', color: '273b43', label: 'Pacific Blue' },
  { id: 'PG', color: '2d3831', label: 'Pine Green' },
  { id: 'SA', color: '7d8b68', label: 'Sage Green' },
  { id: 'SD', color: 'af914f', label: 'Sand Gold' },
  { id: 'SS', color: 'a09773', label: 'Sandstone' },
  { id: 'SG', color: '7a7b74', label: 'Sterling Grey' },
  { id: 'SE', color: 'bebfab', label: 'Stone White' },
  { id: 'TB', color: '344455', label: 'Tahoe Blue' },
  { id: 'TR', color: '723226', label: 'Tile Red' },
  { id: 'WC', color: '5e5b4c', label: 'Weathered Copper' },
];

export const panels_pbrDrip_24 = [
  { id: 'BK', color: '161719', label: 'Black' },
  { id: 'BO', color: '888372', label: 'Bonderized' },
  { id: 'CG', color: '424443', label: 'Charcoal Grey' },
  { id: 'CD', color: '6f3f37', label: 'Colonial Red' },
  { id: 'DK', color: '655845', label: 'Dark Bronze' },
  { id: 'FG', color: '2e3f35', label: 'Forest Green' },
  { id: 'GW', color: 'd3d4ca', label: 'Glacier White' },
  { id: 'HM', color: '5a6a5f', label: 'Hemlock Green' },
  { id: 'MU', color: '241f1f', label: 'Musket' },
  { id: 'PB', color: '273b43', label: 'Pacific Blue' },
  { id: 'PA', color: '9c9680', label: 'Parchment' },
  { id: 'PG', color: '2d3831', label: 'Pine Green' },
  { id: 'RR', color: 'a53937', label: 'Retro Red' },
  { id: 'ST', color: '4e4436', label: 'Saddle Tan' },
  { id: 'SI', color: '9a8a71', label: 'Sierra Tan' },
  { id: 'SG', color: '7a7b74', label: 'Sterling Grey' },
  { id: 'TB', color: '344455', label: 'Tahoe Blue' },
  { id: 'TR', color: '723226', label: 'Tile Red' },
  { id: 'ZG', color: '6f6b62', label: 'Zinc Grey' },
  {
    id: 'AP',
    color: '615944',
    label: 'Antique Patina',
    optionGroup: 'Premium Colors',
  },
  {
    id: 'CH',
    color: '988660',
    label: 'Champagne',
    optionGroup: 'Premium Colors',
  },
  {
    id: 'CP',
    color: '9d693a',
    label: 'Copper Penny',
    optionGroup: 'Premium Colors',
  },
  {
    id: 'MS',
    color: '8f9088',
    label: 'Metallic Silver',
    optionGroup: 'Premium Colors',
  },
  {
    id: 'WZ',
    color: '787b7a',
    label: 'Weathered Zinc',
    optionGroup: 'Premium Colors',
  },
];

export const panelColors = [
  { id: 'GV', color: 'ada49b', label: 'Galvalume' },
  { id: 'NC', color: 'ada49b', label: 'Standard Color' },
  { id: 'CM', color: 'ada49b', label: 'Premium Color' },
  { id: 'NA', color: 'ada49b', label: 'Not Applicable' },
  { id: 'GA', color: 'ada49b', label: 'Galvanized' },
  { id: 'PL', color: 'ada49b', label: 'Plain' },
  { id: 'PT', color: 'ada49b', label: 'Plated' },
  { id: 'CL', color: 'c6e2e3', label: 'Clear' },
  { id: 'AL', color: 'e4dfcc', label: 'Almond' },
  { id: 'AP', color: '615944', label: 'Antique Patina' },
  { id: 'AG', color: '948e7e', label: 'Ash Gray' },
  { id: 'AS', color: '808585', label: 'Ashland Gray' },
  { id: 'BB', color: '33302d', label: 'Baker Brown' },
  { id: 'BN', color: 'b09f8d', label: 'Benton Beige' },
  { id: 'BK', color: '161719', label: 'Black' },
  { id: 'BT', color: '090a0b', label: 'Black Butte' },
  { id: 'BO', color: '888372', label: 'Bonderized' },
  { id: 'BW', color: 'f8f7f2', label: 'Bone White' },
  { id: 'BD', color: '86373c', label: 'Brick Red' },
  { id: 'BR', color: '71292a', label: 'Brite Red' },
  { id: 'BZ', color: '373830', label: 'Bronze' },
  { id: 'BE', color: '81705a', label: 'Brownstone' },
  { id: 'BC', color: '876951', label: 'Buckskin' },
  { id: 'BU', color: '322424', label: 'Burgundy' },
  { id: 'BS', color: '423f34', label: 'Burnished Slate' },
  { id: 'CH', color: '988660', label: 'Champagne' },
  { id: 'CE', color: '837b61', label: 'Champagne Metallic' },
  { id: 'CC', color: '525751', label: 'Charcoal' },
  { id: 'CG', color: '424443', label: 'Charcoal Grey' },
  { id: 'CN', color: '124945', label: 'Classic Green' },
  { id: 'CY', color: 'a19e8f', label: 'Clay' },
  { id: 'CK', color: '161719', label: 'Coal Black' },
  { id: 'CB', color: '333f4b', label: 'Cobalt Blue' },
  { id: 'CA', color: '674b3e', label: 'Cocoa Brown' },
  { id: 'CD', color: '6f3f37', label: 'Colonial Red' },
  { id: 'CU', color: 'de7c2e', label: 'Copper' },
  { id: 'CT', color: '9e6245', label: 'Copper Metallic' },
  { id: 'CP', color: '9d693a', label: 'Copper Penny' },
  { id: 'CR', color: '8e3934', label: 'Crimson Red' },
  { id: 'DK', color: '655845', label: 'Dark Bronze' },
  { id: 'DB', color: '32312e', label: 'Dark Brown' },
  { id: 'DU', color: '1e3f60', label: 'Dark Blue' },
  { id: 'DR', color: '804236', label: 'Dark Red' },
  { id: 'DE', color: '104a63', label: 'Deschutes Blue' },
  { id: 'DN', color: '91886b', label: 'Desert Brown' },
  { id: 'DS', color: '91886b', label: 'Desert Sand' },
  { id: 'EV', color: '3a716b', label: 'Everglade' },
  { id: 'EG', color: '303f32', label: 'Evergreen' },
  { id: 'FN', color: '3d4337', label: 'Fern Green' },
  { id: 'FG', color: '2e3f35', label: 'Forest Green' },
  { id: 'GG', color: '67795e', label: 'Gilliam Green' },
  { id: 'GW', color: 'd3d4ca', label: 'Glacier White' },
  { id: 'GB', color: '121717', label: 'Graphite Black' },
  { id: 'GR', color: '878c82', label: 'Gray' },
  { id: 'GH', color: '4f4c52', label: 'Grays Harbor' },
  { id: 'HB', color: '06435c', label: 'Harbor Blue' },
  { id: 'HG', color: '304741', label: 'Hartford Green' },
  { id: 'HI', color: '435560', label: 'Hawaiian Blue' },
  { id: 'HM', color: '5a6a5f', label: 'Hemlock Green' },
  { id: 'HY', color: '89826e', label: 'Hickory' },
  { id: 'HN', color: '1e3931', label: 'Hunter Green' },
  { id: 'IV', color: 'd9d5b2', label: 'Ivory' },
  { id: 'IG', color: '2b4c3b', label: 'Ivy Green' },
  { id: 'JC', color: '4b483e', label: 'Jackson Copper' },
  { id: 'KB', color: '535149', label: 'Kodiak Brown' },
  { id: 'KO', color: '564637', label: 'Koko Brown' },
  { id: 'LB', color: '474033', label: 'Light Bronze' },
  { id: 'LS', color: 'cbc29e', label: 'Light Stone' },
  { id: 'MT', color: '000000', label: 'Matte Black' },
  { id: 'MD', color: '3f3d31', label: 'Medium Bronze' },
  { id: 'MS', color: '8f9088', label: 'Metallic Silver' },
  { id: 'MN', color: '2f3433', label: 'Midnight Bronze' },
  { id: 'MO', color: '322d29', label: 'Mocha' },
  { id: 'MH', color: 'ebeeed', label: 'Mt Hood White' },
  { id: 'MU', color: '241f1f', label: 'Musket' },
  { id: 'NP', color: '94b490', label: 'Natural Patina' },
  { id: 'OC', color: '5e413b', label: 'Ochoco Brown' },
  { id: 'OT', color: '727374', label: 'Old Town Gray' },
  { id: 'OZ', color: '666662', label: 'Old Zinc Gray' },
  { id: 'PB', color: '273b43', label: 'Pacific Blue' },
  { id: 'PA', color: '9c9680', label: 'Parchment' },
  { id: 'PP', color: 'd5ddd2', label: 'Pasco Parchment' },
  { id: 'PG', color: '2d3831', label: 'Pine Green' },
  { id: 'PW', color: 'bfbfb2', label: 'Polar White' },
  { id: 'RA', color: 'a5131e', label: 'Radiant Red' },
  { id: 'RE', color: '882628', label: 'Redmond Red' },
  { id: 'RB', color: '00234e', label: 'Regal Blue' },
  { id: 'RW', color: 'f4f3ea', label: 'Regal White' },
  { id: 'RR', color: 'a53937', label: 'Retro Red' },
  { id: 'RL', color: '543e32', label: 'Rusteel' },
  { id: 'RU', color: '7f4439', label: 'Rustic Red' },
  { id: 'ST', color: '4e4436', label: 'Saddle Tan' },
  { id: 'SA', color: '7d8b68', label: 'Sage Green' },
  { id: 'SD', color: 'af914f', label: 'Sand Gold' },
  { id: 'SS', color: 'a09773', label: 'Sandstone' },
  { id: 'SI', color: '9a8a71', label: 'Sierra Tan' },
  { id: 'SM', color: 'c8c4c4', label: 'Silver Metallic' },
  { id: 'SV', color: 'c9c8be', label: 'Silverton Stone' },
  { id: 'SB', color: '4b708b', label: 'Slate Blue' },
  { id: 'SL', color: '858f88', label: 'Slate Gray' },
  { id: 'SR', color: '9d9187', label: 'Smith Rock Hickory' },
  { id: 'SN', color: 'bbbdab', label: 'Snow White' },
  { id: 'SW', color: 'd5d3c7', label: 'Solar White' },
  { id: 'SP', color: '59867c', label: 'Spruce' },
  { id: 'SG', color: '7a7b74', label: 'Sterling Grey' },
  { id: 'SE', color: 'bebfab', label: 'Stone White' },
  { id: 'TB', color: '344455', label: 'Tahoe Blue' },
  { id: 'TC', color: '7b4636', label: 'Terra Cotta' },
  { id: 'TR', color: '723226', label: 'Tile Red' },
  { id: 'TU', color: '949ea3', label: 'Tundra' },
  { id: 'TW', color: '424d59', label: 'Twilight Blue' },
  { id: 'VI', color: '524b40', label: 'Vintage' },
  { id: 'VW', color: 'c4c4bc', label: 'Vintage White' },
  { id: 'WA', color: '2a3c3b', label: 'Washington Evergreen' },
  { id: 'WC', color: '5e5b4c', label: 'Weathered Copper' },
  { id: 'WZ', color: '787b7a', label: 'Weathered Zinc' },
  { id: 'WG', color: '254943', label: 'Willamette Green' },
  { id: 'WH', color: 'dee0d8', label: 'White' },
  { id: 'ZG', color: '6f6b62', label: 'Zinc Grey' },
];
