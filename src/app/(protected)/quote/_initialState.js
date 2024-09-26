export const initialState = {
  // Quote Information Page
  customerName: '',
  contactName: '',
  customerStreet: '',
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
  // Design Code Page
  buildingCode: '',
  riskCategory: '',
  collateralLoad: '',
  liveLoad: '',
  deadLoad: '',
  enclosure: '',
  roofLoad: '',
  thermalFactor: '',
  windLoad: '',
  exposure: '',
  groundLoad: '',
  seismicCategory: '',
  seismicSs: '',
  seismicS1: '',
  seismicSms: '',
  seismicSm1: '',
  // Building Project Page
  steelFinish: '',
  buildings: [
    {
      width: '',
      length: '',
      offsetX: '',
      offsetY: '',
      rotation: '',
      commonWall: '',
      // Building - Layout
      shape: 'symmetrical',
      backPeakOffset: '',
      eaveHeight: '',
      lowEaveHeight: '',
      highEaveHeight: '',
      backEaveHeight: '',
      frontEaveHeight: '',
      roofPitch: '',
      backRoofPitch: '',
      frontRoofPitch: '',
      swBaySpacing: '',
      lewBaySpacing: '',
      rewBaySpacing: '',
      collateralLoad: '',
      liveLoad: '',
      deadLoad: '',
      enclosure: '',
      roofLoad: '',
      thermalFactor: '',
      frameType: 'rigidFrame',
      intColSpacing: '',
      straightExtColumns: false,
      noFlangeBraces: false,
      lewFrame: 'postAndBeam',
      leftEndwallInset: '',
      lewIntColSpacing: '',
      rewFrame: 'postAndBeam',
      rightEndwallInset: '',
      rewIntColSpacing: '',
      fswBracingType: 'xbrace',
      fswBracingHeight: '',
      bswBracingType: 'xbrace',
      bswBracingHeight: '',
      lewBracingType: 'xbrace',
      lewBracingHeight: '',
      rewBracingType: 'xbrace',
      rewBracingHeight: '',
      fswBracedBays: '',
      bswBracedBays: '',
      lewBracedBays: '',
      rewBracedBays: '',
      roofBracedBays: '',
      roofBreakPoints: 'left',
      fswGirtType: 'bipass',
      bswGirtType: 'bipass',
      lewGirtType: 'bipass',
      rewGirtType: 'bipass',
      fswGirtSpacing: 'default',
      bswGirtSpacing: 'default',
      lewGirtSpacing: 'default',
      rewGirtSpacing: 'default',
      baseCondition: 'angle',
      purlinSpacing: '',
      roofPanelType: 'pbr',
      roofPanelGauge: '',
      roofPanelFinish: '',
      wallPanelType: 'pbr',
      wallPanelGauge: '',
      wallPanelFinish: '',
      includeGutters: false,
      roofInsulation: '',
      roofInsulationOthers: false,
      wallInsulation: '',
      wallInsulationOthers: false,
      // Building - Extensions
      fswExtensionWidth: '',
      bswExtensionWidth: '',
      lewExtensionWidth: '',
      rewExtensionWidth: '',
      frontExtensionBays: '',
      frontExtensionColumns: false,
      backExtensionBays: '',
      backExtensionColumns: false,
      extensionInsulation: 'none',
      soffitPanelType: 'tuff',
      soffitPanelGauge: '',
      soffitPanelFinish: '',
      canopies: [],
      partitions: [],
      linerPanels: [],
      wainscots: [],
      partialWalls: [],
      wallSkirts: [],
      fswPolySize: '3',
      fswPolyColor: 'clear',
      fswPolyQty: '',
      bswPolySize: '3',
      bswPolyColor: 'clear',
      bswPolyQty: '',
      lewPolySize: '3',
      lewPolyColor: 'clear',
      lewPolyQty: '',
      rewPolySize: '3',
      rewPolyColor: 'clear',
      rewPolyQty: '',
      backRoofPolySize: '10',
      backRoofPolyColor: 'clear',
      backRoofPolyQty: '',
      frontRoofPolySize: '10',
      frontRoofPolyColor: 'clear',
      frontRoofPolyQty: '',
      openings: {
        fsw: [],
        bsw: [],
        lew: [],
        rew: [],
      },
    },
  ],
};
