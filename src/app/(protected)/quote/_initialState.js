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
      roofPanelGauge: '26',
      roofPanelFinish: 'painted',
      roofPanelColor: 'NC',
      wallPanelType: 'pbr',
      wallPanelGauge: '26',
      wallPanelFinish: 'painted',
      wallPanelColor: 'NC',
      allWallsSame: true,
      frontWallPanelType: 'pbr',
      frontWallPanelGauge: '26',
      frontWallPanelFinish: 'painted',
      frontWallPanelColor: 'NC',
      backWallPanelType: 'pbr',
      backWallPanelGauge: '26',
      backWallPanelFinish: 'painted',
      backWallPanelColor: 'NC',
      outerLeftWallPanelType: 'pbr',
      outerLeftWallPanelGauge: '26',
      outerLeftWallPanelFinish: 'painted',
      outerLeftWallPanelColor: 'NC',
      leftWallPanelType: 'pbr',
      leftWallPanelGauge: '26',
      leftWallPanelFinish: 'painted',
      leftWallPanelColor: 'NC',
      rightWallPanelType: 'pbr',
      rightWallPanelGauge: '26',
      rightWallPanelFinish: 'painted',
      rightWallPanelColor: 'NC',
      outerRightWallPanelType: 'pbr',
      outerRightWallPanelGauge: '26',
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
      soffitPanelGauge: '26',
      soffitPanelFinish: 'painted',
      soffitPanelColor: 'NC',
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
