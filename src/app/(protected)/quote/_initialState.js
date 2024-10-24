export const initialState = {
  // Quote Information Page
  quoteNumber: '',
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
  mandoors: [],
  // Building Project Page
  steelFinish: '',
  boltFinish: '',
  buildings: [
    {
      width: '',
      length: '',
      offsetX: '0',
      offsetY: '0',
      rotation: '0',
      commonWall: '',
      // Building - Layout
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
      leftGirtType: 'bipass',
      rightGirtType: 'bipass',
      frontGirtSpacing: 'default',
      backGirtSpacing: 'default',
      leftGirtSpacing: 'default',
      rightGirtSpacing: 'default',
      leftBaseCondition: 'angle',
      rightBaseCondition: 'angle',
      frontBaseCondition: 'angle',
      backBaseCondition: 'angle',
      purlinSpacing: '',
      roofPanelType: 'pbr',
      roofPanelGauge: '26',
      roofPanelFinish: 'painted',
      wallPanelType: 'pbr',
      wallPanelGauge: '26',
      wallPanelFinish: 'painted',
      includeGutters: false,
      roofInsulation: 'none',
      roofInsulationOthers: false,
      wallInsulation: 'none',
      wallInsulationOthers: false,
      // Building - Extensions
      frontExtensionWidth: 0,
      backExtensionWidth: 0,
      leftExtensionWidth: 0,
      rightExtensionWidth: 0,
      frontExtensionBays: '',
      frontExtensionColumns: false,
      backExtensionBays: '',
      backExtensionColumns: false,
      extensionInsulation: 'none',
      soffitPanelType: 'pbr',
      soffitPanelGauge: '26',
      soffitPanelFinish: 'painted',
      canopies: [],
      partitions: [],
      linerPanels: [],
      wainscots: [],
      partialWalls: [],
      wallSkirts: [],
      frontPolySize: '3',
      frontPolyColor: 'clear',
      frontPolyQty: '',
      backPolySize: '3',
      backPolyColor: 'clear',
      backPolyQty: '',
      leftPolySize: '3',
      leftPolyColor: 'clear',
      leftPolyQty: '',
      rightPolySize: '3',
      rightPolyColor: 'clear',
      rightPolyQty: '',
      backRoofPolySize: '10',
      backRoofPolyColor: 'clear',
      backRoofPolyQty: '',
      frontRoofPolySize: '10',
      frontRoofPolyColor: 'clear',
      frontRoofPolyQty: '',
      openings: {
        front: [],
        back: [],
        left: [],
        right: [],
      },
    },
  ],
};
