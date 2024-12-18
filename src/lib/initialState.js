export const initialState = {
  // Quote Information Page
  quoteNumber: '',
  revNumber: 0,
  customerName: '',
  contactName: '',
  customerAddress: '',
  customerCity: '',
  customerState: '',
  customerZip: '',
  customerPhone: '',
  customerFax: '',
  customerCell: '',
  customerEmail: '',
  projectName: '',
  projectFor: '',
  projectAddress: '',
  projectCity: '',
  projectState: '',
  projectZip: '',
  projectCounty: '',
  projectMileage: '',
  buildingUse: '',
  projectLatitude: '',
  projectLongitude: '',
  projectElevation: '',
  seismicSite: 'D',
  seismicFactor: 1,
  seismicDeflection: 65,
  snowFactor: 1.0,
  // Design Code Page
  buildingCode: 'ibc18',
  riskCategory: 'II',
  collateralLoad: 1.0,
  liveLoad: 20.0,
  deadLoad: 2.5,
  windLoad: 0.0,
  exposure: 'C',
  windEnclosure: 'C',
  groundSnowLoad: 0,
  roofSnowLoad: 0,
  thermalFactor: 1,
  seismicCategory: 'D',
  seismicSs: '',
  seismicS1: '',
  seismicSms: '',
  seismicSm1: '',
  seismicFa: '',
  seismicFv: '',
  seismicSds: '',
  seismicSd1: '',
  // Accessories
  monoSlabDesign: false,
  pierFootingDesign: false,
  standardWarranty: false,
  singleSourceWarranty: false,
  willCall: false,
  skylight4x4: 0,
  ridgeVent10ft: 0,
  canopyKit2x2x6: 0,
  canopyKit2x2x9: 0,
  notes: [],
  mandoors: [],
  noteCMUWallByOthers: false,
  notePlywoodLinerByOthers: false,
  noteMezzanineByOthers: false,
  noteFirewallByOthers: false,
  noteExtBldgDisclaimer: false,
  noteRoofPitchDisclaimer: false,
  noteSeismicGapDisclaimer: false,
  noteWaterPondingDisclaimer: false,
  noteBldgSpecsDisclaimer: false,
  addItemExtBldg: false,
  addItemPartWalls: false,
  addItemRoofOpenings: false,
  addItemStepElev: false,
  addItemHorizPanels: false,
  addItemParapetWalls: false,
  addItemFaciaWalls: false,
  addItemBumpoutWalls: false,
  addItemCupolas: false,
  addItemClearstory: false,
  addItemHipValley: false,
  addItemGambrelRoof: false,
  addItemTiltUpWalls: false,
  mezzSimple: false,
  mezzLShape: false,
  mezzNotAligned: false,
  craneStepCols: false,
  craneJib: false,
  tHangar: false,
  otherBldgSpecs: false,
  otherNonStdSpecs: false,
  otherCarrierBms: false,
  otherPortalCarrier: false,
  otherNonStdCarrier: false,
  otherBarJoists: false,
  otherWeakAxis: false,
  otherSkewedEndwall: false,
  otherSkewedSidewall: false,
  otherBulkStorageSeeds: false,
  otherBulkStorage: false,
  otherLoadsByOthers: false,
  // Building Project Page
  boltFinish: '',
  buildings: [
    {
      width: '',
      length: '',
      offsetX: 0,
      offsetY: 0,
      rotation: 0,
      commonWall: '',
      // Building - Layout
      steelFinish: 'NC',
      shape: 'symmetrical',
      backPeakOffset: '',
      backEaveHeight: '',
      frontEaveHeight: '',
      backRoofPitch: '',
      frontRoofPitch: '',
      roofBaySpacing: '',
      frontBaySpacing: '',
      backBaySpacing: '',
      leftBaySpacing: '',
      rightBaySpacing: '',
      collateralLoad: 1.0,
      liveLoad: 20.0,
      deadLoad: 2.5,
      windEnclosure: 'C',
      roofSnowLoad: 0.0,
      thermalFactor: 1,
      frameType: 'rigidFrame',
      intColSpacing: '',
      straightExtColumns: false,
      noFlangeBraces: false,
      leftFrame: 'postAndBeam',
      leftEndwallInset: '',
      leftIntColSpacing: '',
      rightFrame: 'postAndBeam',
      rightEndwallInset: '',
      rightIntColSpacing: '',
      frontBracingType: 'xBrace',
      frontBracingHeight: '',
      backBracingType: 'xBrace',
      backBracingHeight: '',
      leftBracingType: 'xBrace',
      leftBracingHeight: '',
      rightBracingType: 'xBrace',
      rightBracingHeight: '',
      interiorBracingType: 'none',
      interiorBracingHeight: '',
      frontBracedBays: '',
      backBracedBays: '',
      leftBracedBays: '',
      rightBracedBays: '',
      roofBracedBays: '',
      roofBreakPoints: 'left',
      frontGirtType: 'bipass',
      backGirtType: 'bipass',
      outerLeftGirtType: 'bipass',
      leftGirtType: 'bipass',
      rightGirtType: 'bipass',
      outerRightGirtType: 'bipass',
      frontGirtSpacing: 'default',
      backGirtSpacing: 'default',
      outerLeftGirtSpacing: 'default',
      leftGirtSpacing: 'default',
      rightGirtSpacing: 'default',
      outerRightGirtSpacing: 'default',
      frontBaseCondition: 'angle',
      backBaseCondition: 'angle',
      leftBaseCondition: 'angle',
      outerLeftBaseCondition: 'angle',
      rightBaseCondition: 'angle',
      outerRightBaseCondition: 'angle',
      purlinSpacing: 'default',
      roofPanelType: 'pbr',
      roofPanelGauge: 26,
      roofPanelFinish: 'painted',
      roofPanelColor: 'NC',
      wallPanelType: 'pbr',
      wallPanelGauge: 26,
      wallPanelFinish: 'painted',
      wallPanelColor: 'NC',
      allWallsSame: true,
      frontWallPanelType: 'pbr',
      frontWallPanelGauge: 26,
      frontWallPanelFinish: 'painted',
      frontWallPanelColor: 'NC',
      backWallPanelType: 'pbr',
      backWallPanelGauge: 26,
      backWallPanelFinish: 'painted',
      backWallPanelColor: 'NC',
      outerLeftWallPanelType: 'pbr',
      outerLeftWallPanelGauge: 26,
      outerLeftWallPanelFinish: 'painted',
      outerLeftWallPanelColor: 'NC',
      leftWallPanelType: 'pbr',
      leftWallPanelGauge: 26,
      leftWallPanelFinish: 'painted',
      leftWallPanelColor: 'NC',
      rightWallPanelType: 'pbr',
      rightWallPanelGauge: 26,
      rightWallPanelFinish: 'painted',
      rightWallPanelColor: 'NC',
      outerRightWallPanelType: 'pbr',
      outerRightWallPanelGauge: 26,
      outerRightWallPanelFinish: 'painted',
      outerRightWallPanelColor: 'NC',
      includeGutters: true,
      roofInsulation: 'none',
      roofInsulationOthers: false,
      wallInsulation: 'none',
      wallInsulationOthers: false,
      frontWallInsulation: 'none',
      backWallInsulation: 'none',
      outerLeftWallInsulation: 'none',
      leftWallInsulation: 'none',
      rightWallInsulation: 'none',
      outerRightWallInsulation: 'none',
      // Building - Extensions
      frontExtensionWidth: 0,
      backExtensionWidth: 0,
      leftExtensionWidth: 0,
      rightExtensionWidth: 0,
      frontExtensionBays: '',
      frontExtensionColumns: false,
      backExtensionBays: '',
      backExtensionColumns: false,
      extensionInsulation: true,
      soffitPanelType: 'pbr',
      soffitPanelGauge: 26,
      soffitPanelFinish: 'painted',
      soffitPanelColor: 'NC',
      roofTrim: {
        gable: { vendor: 'PBS', gauge: 26, color: 'NC' },
        eave: { vendor: 'PBS', gauge: 26, color: 'NC' },
        gutter: { vendor: 'PBS', gauge: 26, color: 'NC' },
        downspout: { vendor: 'PBS', gauge: 26, color: 'NC' },
      },
      wallTrim: {
        corner: { vendor: 'PBS', gauge: 26, color: 'NC' },
        jamb: { vendor: 'PBS', gauge: 26, color: 'NC' },
        base: { vendor: 'PBS', gauge: 26, color: 'NC' },
      },

      // roofPanel: { type: 'pbr', gauge: 26, finish: 'painted', color: 'NC' },
      // wallPanel: { type: 'pbr', gauge: 26, finish: 'painted', color: 'NC' },
      // soffitPanel: { type: 'pbr', gauge: 26, finish: 'painted', color: 'NC' },
      // roofGableTrim: { vendor: 'PBS', gauge: 26, color: 'NC' },
      // roofEaveTrim: { vendor: 'PBS', gauge: 26, color: 'NC' },
      // roofGutterTrim: { vendor: 'PBS', gauge: 26, color: 'NC' },
      // roofDownspoutTrim: { vendor: 'PBS', gauge: 26, color: 'NC' },
      // wallCornerTrim: { vendor: 'PBS', gauge: 26, color: 'NC' },
      // wallJambTrim: { vendor: 'PBS', gauge: 26, color: 'NC' },
      // wallBaseTrim: { vendor: 'PBS', gauge: 26, color: 'NC' },

      canopies: [],
      partitions: [],
      wallLinerPanels: [],
      roofLinerPanels: [],
      wainscots: [],
      partialWalls: [],
      wallSkirts: [],
      wallRelites: [],
      roofRelites: [],
      openings: {
        front: [],
        back: [],
        left: [],
        right: [],
      },
    },
  ],
};

export const buildingTemplate = {
  width: '',
  length: '',
  offsetX: 0,
  offsetY: 0,
  rotation: 0,
  commonWall: '',
  steelFinish: 'NC',
  shape: 'symmetrical',
  backPeakOffset: '',
  backEaveHeight: '',
  frontEaveHeight: '',
  backRoofPitch: '',
  frontRoofPitch: '',
  roofBaySpacing: '',
  frontBaySpacing: '',
  backBaySpacing: '',
  leftBaySpacing: '',
  rightBaySpacing: '',
  collateralLoad: 1.0,
  liveLoad: 20.0,
  deadLoad: 2.5,
  windEnclosure: 'C',
  roofSnowLoad: 0.0,
  thermalFactor: 1,
  frameType: 'rigidFrame',
  intColSpacing: '',
  straightExtColumns: false,
  noFlangeBraces: false,
  leftFrame: 'postAndBeam',
  leftEndwallInset: '',
  leftIntColSpacing: '',
  rightFrame: 'postAndBeam',
  rightEndwallInset: '',
  rightIntColSpacing: '',
  frontBracingType: 'xBrace',
  frontBracingHeight: '',
  backBracingType: 'xBrace',
  backBracingHeight: '',
  leftBracingType: 'xBrace',
  leftBracingHeight: '',
  rightBracingType: 'xBrace',
  rightBracingHeight: '',
  interiorBracingType: 'xBrace',
  interiorBracingHeight: '',
  frontBracedBays: '',
  backBracedBays: '',
  leftBracedBays: '',
  rightBracedBays: '',
  roofBracedBays: '',
  roofBreakPoints: 'left',
  frontGirtType: 'bipass',
  backGirtType: 'bipass',
  outerLeftGirtType: 'bipass',
  leftGirtType: 'bipass',
  rightGirtType: 'bipass',
  outerRightGirtType: 'bipass',
  frontGirtSpacing: 'default',
  backGirtSpacing: 'default',
  outerLeftGirtSpacing: 'default',
  leftGirtSpacing: 'default',
  rightGirtSpacing: 'default',
  outerRightGirtSpacing: 'default',
  frontBaseCondition: 'angle',
  backBaseCondition: 'angle',
  leftBaseCondition: 'angle',
  outerLeftBaseCondition: 'angle',
  rightBaseCondition: 'angle',
  outerRightBaseCondition: 'angle',
  purlinSpacing: 'default',
  roofPanelType: 'pbr',
  roofPanelGauge: 26,
  roofPanelFinish: 'painted',
  roofPanelColor: 'NC',
  wallPanelType: 'pbr',
  wallPanelGauge: 26,
  wallPanelFinish: 'painted',
  wallPanelColor: 'NC',
  allWallsSame: true,
  frontWallPanelType: 'pbr',
  frontWallPanelGauge: 26,
  frontWallPanelFinish: 'painted',
  frontWallPanelColor: 'NC',
  backWallPanelType: 'pbr',
  backWallPanelGauge: 26,
  backWallPanelFinish: 'painted',
  backWallPanelColor: 'NC',
  outerLeftWallPanelType: 'pbr',
  outerLeftWallPanelGauge: 26,
  outerLeftWallPanelFinish: 'painted',
  outerLeftWallPanelColor: 'NC',
  leftWallPanelType: 'pbr',
  leftWallPanelGauge: 26,
  leftWallPanelFinish: 'painted',
  leftWallPanelColor: 'NC',
  rightWallPanelType: 'pbr',
  rightWallPanelGauge: 26,
  rightWallPanelFinish: 'painted',
  rightWallPanelColor: 'NC',
  outerRightWallPanelType: 'pbr',
  outerRightWallPanelGauge: 26,
  outerRightWallPanelFinish: 'painted',
  outerRightWallPanelColor: 'NC',
  includeGutters: true,
  roofInsulation: 'none',
  roofInsulationOthers: false,
  wallInsulation: 'none',
  wallInsulationOthers: false,
  frontWallInsulation: 'none',
  backWallInsulation: 'none',
  outerLeftWallInsulation: 'none',
  leftWallInsulation: 'none',
  rightWallInsulation: 'none',
  outerRightWallInsulation: 'none',
  // Building - Extensions
  frontExtensionWidth: 0,
  backExtensionWidth: 0,
  leftExtensionWidth: 0,
  rightExtensionWidth: 0,
  frontExtensionBays: '',
  frontExtensionColumns: false,
  backExtensionBays: '',
  backExtensionColumns: false,
  extensionInsulation: true,
  soffitPanelType: 'pbr',
  soffitPanelGauge: 26,
  soffitPanelFinish: 'painted',
  soffitPanelColor: 'NC',
  roofTrim: {
    gable: { vendor: 'PBS', gauge: 26, color: 'NC' },
    eave: { vendor: 'PBS', gauge: 26, color: 'NC' },
    gutter: { vendor: 'PBS', gauge: 26, color: 'NC' },
    downspout: { vendor: 'PBS', gauge: 26, color: 'NC' },
  },
  wallTrim: {
    corner: { vendor: 'PBS', gauge: 26, color: 'NC' },
    jamb: { vendor: 'PBS', gauge: 26, color: 'NC' },
    base: { vendor: 'PBS', gauge: 26, color: 'NC' },
  },
  canopies: [],
  partitions: [],
  wallLinerPanels: [],
  roofLinerPanels: [],
  wainscots: [],
  partialWalls: [],
  wallSkirts: [],
  wallRelites: [],
  roofRelites: [],
  openings: {
    front: [],
    back: [],
    left: [],
    right: [],
  },
};

export const partitionTemplate = {
  orientation: 't',
  start: '',
  end: '',
  offset: '',
  height: '',
  baySpacing: '',
  insulation: 'none',
  partitionLeftPanelType: 'pbr',
  partitionLeftPanelGauge: 26,
  partitionLeftPanelFinish: 'painted',
  partitionLeftPanelColor: 'NC',
  partitionLeftTrim: {
    corner: { vendor: 'PBS', gauge: 26, color: 'NC' },
    jamb: { vendor: 'PBS', gauge: 26, color: 'NC' },
    top: { vendor: 'PBS', gauge: 26, color: 'NC' },
    base: { vendor: 'PBS', gauge: 26, color: 'NC' },
  },
  partitionRightPanelType: 'pbr',
  partitionRightPanelGauge: 26,
  partitionRightPanelFinish: 'painted',
  partitionRightPanelColor: 'NC',
  partitionRightTrim: {
    corner: { vendor: 'PBS', gauge: 26, color: 'NC' },
    jamb: { vendor: 'PBS', gauge: 26, color: 'NC' },
    top: { vendor: 'PBS', gauge: 26, color: 'NC' },
    base: { vendor: 'PBS', gauge: 26, color: 'NC' },
  },
};

export const roofLinerTemplate = {
  wall: 'roof',
  start: '',
  end: '',
  height: '',
  roofLinerPanelType: 'pbr',
  roofLinerPanelGauge: 26,
  roofLinerPanelFinish: 'painted',
  roofLinerPanelColor: 'NC',
  roofLinerTrim: {
    trim: { vendor: 'PBS', gauge: 26, color: 'NC' },
  },
};

export const roofReliteTemplate = {
  roof: 'back',
  size: '10',
  color: 'clear',
  qty: '',
  location: '',
  offset: '',
  cutPanels: false,
};

export const wallLinerTemplate = {
  wall: 'front',
  start: '',
  end: '',
  height: '',
  wallLinerPanelType: 'pbr',
  wallLinerPanelGauge: 26,
  wallLinerPanelFinish: 'painted',
  wallLinerPanelColor: 'NC',
  wallLinerTrim: {
    trim: { vendor: 'PBS', gauge: 26, color: 'NC' },
  },
};

export const wainscotTemplate = {
  wall: 'front',
  start: '',
  end: '',
  height: '',
  panelOption: 'break',
  wainscotPanelType: 'pbr',
  wainscotPanelGauge: 26,
  wainscotPanelFinish: 'painted',
  wainscotPanelColor: 'NC',
  wainscotTrim: {
    base: { vendor: 'PBS', gauge: 26, color: 'NC' },
    leftEnd: { vendor: 'PBS', gauge: 26, color: 'NC' },
    rightEnd: { vendor: 'PBS', gauge: 26, color: 'NC' },
    top: { vendor: 'PBS', gauge: 26, color: 'NC' },
    jamb: { vendor: 'PBS', gauge: 26, color: 'NC' },
  },
};

export const partialWallTemplate = {
  wall: 'front',
  start: '',
  end: '',
  height: '',
  topOfWall: 'B',
};

export const wallSkirtTemplate = {
  wall: 'front',
  startBay: '',
  endBay: '',
  height: '',
  cutColumns: false,
};

export const canopyTemplate = {
  wall: 'front',
  width: '',
  slope: '',
  startBay: '',
  endBay: '',
  elevation: '',
  addColumns: false,
  canopyRoofPanelType: 'pbr',
  canopyRoofPanelGauge: 26,
  canopyRoofPanelFinish: 'painted',
  canopyRoofPanelColor: 'NC',
  canopySoffitPanelType: 'pbr',
  canopySoffitPanelGauge: 26,
  canopySoffitPanelFinish: 'painted',
  canopySoffitPanelColor: 'NC',
};

export const wallReliteTemplate = {
  wall: 'front',
  size: '3',
  color: 'clear',
  qty: '',
  location: '',
  offset: '',
  cutPanels: false,
};

export const openingTemplate = {
  bay: '',
  openType: 'overhead',
  width: '',
  height: '',
  sill: '',
  offset: '',
};

export const mandoorTemplate = {
  qty: 1,
  size: '3070',
  glass: 'none',
  leverLockset: true,
  deadBolt: true,
  panic: false,
  closer: false,
  kickPlate: false,
  mullion: false,
};

export const noteTemplate = {
  building: 'Project',
  text: '',
};

// Add complexity rules as a constant in the BuildingContext.js file
export const complexityRules = [
  // * Complexity 2 Rules
  {
    id: 'risk3',
    condition: (state) => state.riskCategory == 'III',
    desc: 'Risk Category is III',
    complexity: 2,
    engAdd: 0,
    detAdd: 0,
  },
  {
    id: 'width80',
    condition: (state) => state.buildings.some((b) => b.width > 80),
    desc: `Building is wider than 80'`,
    complexity: 2,
    engAdd: 0,
    detAdd: 0,
  },
  {
    id: 'eave24',
    condition: (state) =>
      state.buildings.some(
        (b) => b.backEaveHeight > 24 || b.frontEaveHeight > 24
      ),
    desc: `Eave height is greater than 24'`,
    complexity: 2,
    engAdd: 0,
    detAdd: 0,
  },
  {
    id: 'roofPitch3',
    condition: (state) =>
      state.buildings.some((b) => b.backRoofPitch > 3 || b.frontRoofPitch > 3),
    desc: 'Roof pitch is greater than 3:12',
    complexity: 2,
    engAdd: 0,
    detAdd: 0,
  },
  {
    id: 'roofSnow25',
    condition: (state) =>
      state.roofSnowLoad > 25 ||
      state.buildings.some((b) => b.roofSnowLoad > 25),
    desc: 'Roof snow load is greater than 25psf',
    complexity: 2,
    engAdd: 0,
    detAdd: 0,
  },
  {
    id: 'wind110',
    condition: (state) => state.windLoad > 110,
    desc: 'Wind speed is greater than 110mph',
    complexity: 2,
    engAdd: 0,
    detAdd: 0,
  },
  {
    id: 'collateral5',
    condition: (state) =>
      state.collateralLoad > 5 ||
      state.buildings.some((b) => b.collateralLoad > 5),
    desc: 'Collateral Load is greater than 5psf',
    complexity: 2,
    engAdd: 0,
    detAdd: 0,
  },
  {
    id: 'baySpacing25',
    condition: (state) =>
      state.buildings.some(
        (b) =>
          Math.max(...b.frontBaySpacing) > 25 ||
          Math.max(...b.backBaySpacing) > 25
      ),
    desc: `Bay Spacing is greater than 25'`,
    complexity: 2,
    engAdd: 0,
    detAdd: 0,
  },
  {
    id: 'extension4',
    condition: (state) =>
      state.buildings.some(
        (b) =>
          b.frontExtensionWidth > 4 ||
          b.backExtensionWidth > 4 ||
          b.leftExtensionWidth > 4 ||
          b.rightExtensionWidth > 4
      ),
    desc: `Extensions are greater than 4'`,
    complexity: 2,
    engAdd: 0,
    detAdd: 0,
  },
  {
    id: 'canopy4',
    condition: (state) =>
      state.buildings.some((b) => b.canopies.some((c) => c.width > 4)),
    desc: `Canopies are greater than 4'`,
    complexity: 2,
    engAdd: 0,
    detAdd: 0,
  },
  {
    id: 'torsional',
    condition: (state) =>
      state.buildings.some(
        (b) =>
          b.frontBracingType == 'torsional' || b.backBracingType == 'torsional'
      ),
    desc: `Building includes torsional bracing`,
    complexity: 2,
    engAdd: 0,
    detAdd: 0,
  },
  {
    id: 'wainscot',
    condition: (state) => state.buildings.some((b) => b.wainscots.length > 0),
    desc: `Building includes wainscot`,
    complexity: 2,
    engAdd: 0,
    detAdd: 0,
  },
  {
    id: 'linerPanels',
    condition: (state) => {
      const totalLinerPanels = state.buildings.reduce((sum, building) => {
        return (
          sum +
          building.wallLinerPanels.length +
          building.roofLinerPanels.length
        );
      }, 0);
      return totalLinerPanels > 0;
    },
    getCount: (state) => {
      return state.buildings.reduce((sum, building) => {
        return (
          sum +
          building.wallLinerPanels.length +
          building.roofLinerPanels.length
        );
      }, 0);
    },
    desc: 'Has liner panels',
    complexity: 2,
    engAdd: 0,
    detAdd: 0,
  },
  {
    id: 'partitions',
    condition: (state) => state.buildings.some((b) => b.partitions.length > 0),
    desc: `Building includes partition walls`,
    complexity: 2,
    engAdd: 0,
    detAdd: 0,
  },
  {
    id: 'nonsymmetrical',
    condition: (state) =>
      state.buildings.some((b) => b.shape == 'nonSymmetrical'),
    desc: `Building has nonsymmetrical frames`,
    complexity: 2,
  },
  {
    id: 'standardAcc',
    condition: (state) =>
      state.skylight4x4 > 0 ||
      state.ridgeVent10ft > 0 ||
      state.canopyKit2x2x6 > 0 ||
      state.canopyKit2x2x9 > 0,
    desc: `Building includes standard buy out items`,
    complexity: 2,
    engAdd: 0,
    detAdd: 0,
  },
  // * Complexity 3 Rules
  {
    id: 'risk4',
    condition: (state) => state.riskCategory == 'IV',
    desc: 'Risk Category is IV',
    complexity: 3,
    engAdd: 0,
    detAdd: 0,
  },
  {
    id: 'width120',
    condition: (state) => state.buildings.some((b) => b.width > 120),
    desc: `Building is wider than 120'`,
    complexity: 3,
    engAdd: 0,
    detAdd: 0,
  },
  {
    id: 'eave30',
    condition: (state) =>
      state.buildings.some(
        (b) => b.backEaveHeight > 30 || b.frontEaveHeight > 30
      ),
    desc: `Eave height is greater than 30'`,
    complexity: 3,
    engAdd: 0,
    detAdd: 0,
  },
  {
    id: 'roofPitch6',
    condition: (state) =>
      state.buildings.some((b) => b.backRoofPitch > 6 || b.frontRoofPitch > 6),
    desc: 'Roof pitch is greater than 6:12',
    complexity: 3,
    engAdd: 0,
    detAdd: 0,
  },
  {
    id: 'roofSnow40',
    condition: (state) =>
      state.roofSnowLoad > 40 ||
      state.buildings.some((b) => b.roofSnowLoad > 40),
    desc: 'Roof snow load is greater than 40psf',
    complexity: 3,
    engAdd: 0,
    detAdd: 0,
  },
  {
    id: 'wind135',
    condition: (state) => state.windLoad > 135,
    desc: 'Wind speed is greater than 135mph',
    complexity: 3,
    engAdd: 0,
    detAdd: 0,
  },
  {
    id: 'collateral9',
    condition: (state) =>
      state.collateralLoad > 9 ||
      state.buildings.some((b) => b.collateralLoad > 9),
    desc: 'Collateral Load is greater than 9psf',
    complexity: 3,
    engAdd: 0,
    detAdd: 0,
  },
  {
    id: 'baySpacing25',
    condition: (state) =>
      state.buildings.some(
        (b) =>
          Math.max(...b.frontBaySpacing) > 25 ||
          Math.max(...b.backBaySpacing) > 25
      ),
    desc: `Bay Spacing is greater than 25'`,
    complexity: 2,
    engAdd: 0,
    detAdd: 0,
  },
  {
    id: 'extension6',
    condition: (state) =>
      state.buildings.some(
        (b) =>
          b.frontExtensionWidth > 6 ||
          b.backExtensionWidth > 6 ||
          b.leftExtensionWidth > 6 ||
          b.rightExtensionWidth > 6 ||
          (b.soffitPanelType != 'pbr' && b.soffitPanelType != 'tuff')
      ),
    desc: `Extensions are greater than 6' or have a special soffit`,
    complexity: 3,
    engAdd: 0,
    detAdd: 0,
  },
  {
    id: 'canopy6',
    condition: (state) =>
      state.buildings.some((b) =>
        b.canopies.some(
          (c) =>
            c.width > 6 ||
            (c.canopySoffitPanelType != 'pbr' &&
              c.canopySoffitPanelType != 'tuff')
        )
      ),
    desc: `Canopies are greater than 6' or have a special soffit`,
    complexity: 3,
    engAdd: 0,
    detAdd: 0,
  },
  {
    id: 'project',
    condition: (state) => state.buildings.length > 1,
    desc: `Quote contains multiple buildings`,
    complexity: 3,
    engAdd: 0,
    detAdd: 0,
  },
];

const getBaseHours = (complexity) => {
  switch (complexity) {
    case 2:
      return { engBase: 0, detBase: 20 };
    case 3:
      return { engBase: 2, detBase: 20 };
    case 4:
      return { engBase: 2, detBase: 20 };
    case 5:
      return { engBase: 2, detBase: 20 };
    case 6:
      return { engBase: 3, detBase: 20 };
    case 7:
      return { engBase: 3, detBase: 20 };
    case 8:
      return { engBase: 4, detBase: 20 };
    case 9:
      return { engBase: 4, detBase: 20 };
    case 10:
      return { engBase: 4, detBase: 20 };
    default:
      return { engBase: 0, detBase: 20 }; // Complexity 1 or default
  }
};

export const calculateBuildingMetrics = (state) => {
  let maxComplexity = 1;
  let totalEngHours = 0;
  let totalDetHours = 0;
  const reasonsByComplexity = {};

  complexityRules.forEach((rule) => {
    if (rule.condition(state)) {
      maxComplexity = Math.max(maxComplexity, rule.complexity);

      // Group reasons by complexity
      if (!reasonsByComplexity[rule.complexity]) {
        reasonsByComplexity[rule.complexity] = [];
      }
      reasonsByComplexity[rule.complexity].push(rule.desc);
    }
  });

  // Get base hours from max complexity
  const { engBase, detBase } = getBaseHours(maxComplexity);
  totalEngHours = engBase;
  totalDetHours = detBase;

  complexityRules.forEach((rule) => {
    if (rule.condition(state) && rule.getCount && rule.engAdd !== undefined) {
      const count = rule.getCount(state);
      totalEngHours += (count - 1) * rule.engAdd;
      totalDetHours += (count - 1) * rule.detAdd;
    }
  });

  const sortedReasons = Object.entries(reasonsByComplexity)
    .sort(
      ([complexityA], [complexityB]) =>
        parseInt(complexityB) - parseInt(complexityA)
    )
    .map(([complexity, reasons]) => ({
      complexity: parseInt(complexity),
      reasons,
    }));

  return {
    complexity: maxComplexity,
    engineeringHours: totalEngHours,
    detailingHours: totalDetHours,
    reasonsByComplexity: sortedReasons,
  };
};
