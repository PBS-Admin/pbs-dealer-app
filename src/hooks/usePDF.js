// import { useSession } from 'next-auth/react';
import { useState, useCallback } from 'react';
import { PDFDocument, PageSizes, StandardFonts } from 'pdf-lib';
// import fs from 'fs/promises';
import Image from 'next/image';
import logo from '../../public/images/pbslogo.png';
import {
  shapes,
  frames,
  FrameOptions,
  steelFinish,
  buildingCodes,
  riskCategories,
  enclosure,
  thermalFactor,
  SidewallBracingType,
  EndwallBracingType,
  purlinSpacing,
  girtTypes,
  girtSpacing,
  baseCondition,
  topOfWall,
  roofPanels,
  roofGauge,
  roofFinish,
  wallPanels,
  wallGauge,
  wallFinish,
  soffitPanels,
  soffitGauge,
  soffitFinish,
  panelOptions,
  masterColorList,
  polycarbRoofSize,
  polycarbRoofColor,
  polycarbWallSize,
  polycarbWallColor,
  roofInsulation,
  wallInsulation,
  hangarDoorInsulation,
  openingTypes,
  roofs,
  singleSlopeRoofs,
  walls,
  wallsOuterLeft,
  wallsOuterRight,
  wallsOuterBoth,
} from '../util/dropdownOptions';
import { jsx } from 'react/jsx-runtime';
import { useUserContext } from '@/contexts/UserContext';

export function usePDF() {
  const { getNameById } = useUserContext();

  const formatFeetInches = (decimal) => {
    const feet = parseInt(decimal);
    const inches = Math.abs(Math.round((decimal - feet) * 12 * 10000) / 10000); //round to 4 decimal places

    let ft = feet;
    let inch = Math.floor(inches);
    let numerator = Math.round((inches - inch) * 16);
    let denominator = 0;

    if (numerator > 15) {
      numerator = 0;
      inch += inch;
    }
    if (inch > 11) {
      inch = 0;
      ft += 1;
    }

    if (numerator % 8 == 0) {
      numerator = Math.floor(numerator / 8);
      denominator = 2;
    } else if (numerator % 4 == 0) {
      numerator = Math.floor(numerator / 4);
      denominator = 4;
    } else if (numerator % 2 == 0) {
      numerator = Math.floor(numerator / 2);
      denominator = 8;
    } else {
      denominator = 16;
    }

    if (isNaN(feet) || isNaN(inches)) {
      return `0'-0"`;
    } else if (numerator > 0) {
      return `${ft}'-${inch} ${numerator}/${denominator}"`;
    } else {
      return `${ft}'-${inch}"`;
    }
  };

  const formatBaySpacing = (bayArray) => {
    let formated = '';
    let formatedArray = [];

    if (bayArray.length > 0) {
      let sameDim = { qty: 1, size: formatFeetInches(bayArray[0]) };

      for (let i = 1; i < bayArray.length; i++) {
        if (formatFeetInches(bayArray[i]) == sameDim.size) {
          sameDim.qty++;
        } else {
          formatedArray.push(
            (sameDim.qty > 1 ? '(' + sameDim.qty + ') @ ' : '') + sameDim.size
          );
          sameDim.qty = 1;
          sameDim.size = formatFeetInches(bayArray[i]);
        }
      }
      formatedArray.push(
        (sameDim.qty > 1 ? '(' + sameDim.qty + ') @ ' : '') + sameDim.size
      );
    }

    if (formatedArray.length > 1) {
      for (let i = 0; i < formatedArray.length; i++) {
        formated += (i > 0 ? ', ' : '') + formatedArray[i];
      }
    } else if (formatedArray.length == 1) {
      formated = formatedArray[0];
    }

    return formated;
  };

  const formatBaySelected = (bayArray) => {
    let formated = '';

    if (bayArray.length > 1) {
      for (let i = 0; i < bayArray.length; i++) {
        formated += (i > 0 ? ', ' : '') + bayArray[i];
      }
    } else {
      formated = bayArray.toString();
    }

    return formated;
  };

  const formatDollar = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  const getItemsByWall = (items, key, value) => {
    const foundItems = items.filter((wall) => wall[key] === value);
    return foundItems ? foundItems : null;
  };

  function wrapText(text, width, font, fontSize) {
    const lines = [];
    let currentLine = '';

    if (text.includes('\n')) {
      text.split('\n').forEach((line) => {
        // lines.push(line);
        lines.push(...wrapText(line, width, font, fontSize));
      });
    } else {
      text.split(' ').forEach((word) => {
        const testLine = currentLine + word + ' ';
        const testWidth = font.widthOfTextAtSize(testLine, fontSize);

        if (testWidth > width) {
          lines.push(currentLine);
          currentLine = word + ' ';
        } else {
          currentLine = testLine;
        }
      });

      lines.push(currentLine);
    }
    return lines;
  }

  // const createContract = useCallback(async (state) => {
  const createContract = useCallback(async (contractData) => {
    const {
      companyId,
      companyName,
      companyAddress,
      companyCityStateZip,
      terms,
      initials,
      line1,
      line2,
      line3,
      line4,
      line5,
      line6,
      line7,
      line8,
      complexity,
      contractPrice,
      contractWeight,
      salesPerson,
      ...state
    } = contractData;

    const pdfDoc = await PDFDocument.create();
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
    const stdFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const specialFont = await pdfDoc.embedFont(StandardFonts.ZapfDingbats);
    let pages = pdfDoc.getPages();
    let currentPage = -1;
    let pageTitle = '';
    let bldgPageNums = Array.from(Array(state.buildings.length), () => {
      return { currentPage: 0, currentLine: 0, pageStart: 0, pageEnd: 0 };
    });
    let bldgItems = [];

    const accessories = [
      {
        name: 'skylight4x4',
        text: '4\'-0" x 4\'-0" insulated double dome skylight with curb',
      },
      {
        name: 'ridgeVent10ft',
        text: '12" x 10\'-0" ridge vent with bird screens and dampers with chain operator',
      },
      {
        name: 'canopyKit2x2x6',
        text: '2\'-0" x 2\'-0" x 6\'-0" long light weight canopy with 26 gauge painted PBR sheeting (no gutters)',
      },
      {
        name: 'canopyKit2x2x9',
        text: '2\'-0" x 2\'-0" x 9\'-0" long light weight canopy with 26 gauge painted PBR sheeting (no gutters)',
      },
    ];

    const walkDoors = [
      {
        name: '3070',
        text: '3070 insulated walk door',
      },
      {
        name: '4070',
        text: '3070 insulated walk door',
      },
      {
        name: '6070',
        text: '6070 insulated walk door',
      },
      {
        name: '3070P',
        text: '3070 insulated pre-hung walk door',
      },
      {
        name: '4070P',
        text: '4070 insulated pre-hung walk door',
      },
      {
        name: '6070P',
        text: '6070 insulated pre-hung walk door',
      },
    ];

    const stdNotes = [
      {
        name: 'monoSlabDesign',
        type: 'checkbox',
        text: 'Monolithic slab foundation design included in this contract. Foundation design to be released after building engineered plans have been completed. Foundation design excludes: retaining wall, stem wall, and/or pits.',
      },
      {
        name: 'pierFootingDesign',
        type: 'checkbox',
        text: 'Pier footing foundation design included in this contract. Foundation design to be released after building engineered plans have been completed. Foundation design excludes: retaining wall, stem wall, and/or pits.',
      },
      {
        name: 'standardWarranty',
        type: 'checkbox',
        text: 'Includes 20 year Standard II weather tightness warranty. See MBCI.com for more information. The roofing contractor is responsible for properly installing the roof and must provide a roof that is weathertight for 24 consecutive months. During this period, if a claim is filed against the warranty, the roofing contractor is obligated, under the terms of the warranty, to make the roof repairs. PBS takes no responsibility of installation of the product, PBS will only provide material and warranty.',
      },
      {
        name: 'singleSourceWarranty',
        type: 'checkbox',
        text: 'Includes 20 year Single Source III weather tightness warranty. See MBCI.com for more information. Customer must provide correct installation documentation prior to weather tight warranty issuances as a certified installer of the roof material. Special inspection of roof installation from vendor will be required during the installation process, customer agrees to work with vendor during the installation process for warranty. Vendor requirements must be adhered to during installation. PBS takes no responsibility of installation of the product, PBS will only provide material and warranty. Any costs associated to the weather tight warranty approval during erection will be covered by customer.',
      },
      {
        name: 'willCall',
        type: 'checkbox',
        text: "F.O.B. manufacturer's shop in Woodburn, Oregon. Manufacturer does not hot load trailers. Trailers required 2 days prior to loading.",
      },
      {
        name: 'noteCMUWallByOthers',
        type: 'checkbox',
        text: 'CMU wall by others.',
      },
      {
        name: 'notePlywoodLinerByOthers',
        type: 'checkbox',
        text: 'Plywood liner by others. Weight not to exceed 5 psf.',
      },
      {
        name: 'noteMezzanineByOthers',
        type: 'checkbox',
        text: 'Mezzanine by others to be independent and self-supporting.',
      },
      {
        name: 'noteFirewallByOthers',
        type: 'checkbox',
        text: 'Firewall design and material by others. Firewall design required prior to building design.',
      },
      {
        name: 'noteExtBldgDisclaimer',
        type: 'checkbox',
        text: 'PBS is not responsible for retrofitting / evaluation of the structural integrity of the existing building due to extra loads such as snow drift caused by this building addition.',
      },
      {
        name: 'noteRoofPitchDisclaimer',
        type: 'checkbox',
        text: 'PBR roofing is not recommended for a 1/2:12 roof pitch.',
      },
      {
        name: 'noteSeismicGapDisclaimer',
        type: 'checkbox',
        text: 'Due to unknown horizontal deflection of the existing building, it is difficult for PBS to determine an accurate seismic gap. PBS assumes 6" is adequate. It is the customer\'s responsibility to verify that the seismic gap is sufficient.',
      },
      {
        name: 'noteWaterPondingDisclaimer',
        type: 'checkbox',
        text: "Building not designed for water ponding load. It is the customer's responsibility to efficiently drain water to avoid water ponding.",
      },
      {
        name: 'noteBldgSpecsDisclaimer',
        type: 'checkbox',
        text: 'Any specifications not specifically addressed in this contract are to be considered excluded.',
      },
      // { name: '', type: 'occurrence', text: '' },
    ];

    const largeFont = 12;
    const stdFontSize = 10;
    const smallFont = 8;
    const thinLine = 0.075;
    const stdLine = 0.75;
    const thickLine = 1.44;

    const lineHt = 12.5;
    const termsLineHt = 9.375;
    const textOffsetY = 2.625;
    const pageStartX = 18; //left margin
    const pageEndX = 594; //right margin
    const pageStartY = 758.5; //top margin
    const pageEndY = 33.5; //bottom margin
    let startY = pageStartY;
    let currentY = startY;
    let wallsInBldg = [];
    let wallBracingType = [];
    let mandoorIncludes = [];
    let mandoorDesc = '';
    let i = 0;
    let j = 0;
    let k = 0;

    //THESE ARE TEMP
    const tempPrice = contractPrice || 0;
    const tempWeight = contractWeight || 0;
    const tempEngOnly = false;
    const tempComp = complexity || 0;

    const drawCheckBox = (page, text, x, y, check = false) => {
      page.drawRectangle({
        x: x,
        y: y - 0.5,
        width: 8,
        height: 8,
        opacity: 0,
        borderWidth: thinLine,
        borderOpacity: 1,
      });
      textSmallLeft(page, text, x + 12, y + 0.5);
      if (check) {
        page.drawText('\u2713', {
          x: x + 1,
          y: y + 1,
          size: largeFont,
          font: specialFont,
        });
      }
      return page;
    };

    const setTextLeft = (font, size) => {
      return (page, text, x, y, max = undefined) => {
        const textWidth = font.widthOfTextAtSize(text, size);
        const scale = textWidth > max ? max / textWidth : 1;
        const props = {
          x: x,
          y: y,
          size: size * scale,
          font: font,
          // maxWidth: max,
        };
        page.drawText(text, props);
      };
    };

    const setTextCenter = (font, size) => {
      return (page, text, x, y, max = undefined) => {
        const textWidth = font.widthOfTextAtSize(text, size);
        const scale = textWidth > max ? max / textWidth : 1;
        const props = {
          x: x - (textWidth * scale) / 2,
          y: y,
          size: size * scale,
          font: font,
        };
        page.drawText(text, props);
      };
    };

    const setTextRight = (font, size) => {
      return (page, text, x, y, max = undefined) => {
        const textWidth = font.widthOfTextAtSize(text, size);
        const scale = textWidth > max ? max / textWidth : 1;
        const props = {
          x: x - textWidth * scale,
          y: y,
          size: size * scale,
          font: font,
        };
        page.drawText(text, props);
      };
    };

    const setLine = (thickness) => {
      return (page, x1, y1, x2, y2) => {
        if (thickness == thinLine) {
          page.drawLine({
            start: { x: x1, y: y1 },
            end: { x: x2, y: y2 },
            thickness: thickness,
            dashArray: [0.5, 0.5],
          });
        } else {
          page.drawLine({
            start: { x: x1, y: y1 },
            end: { x: x2, y: y2 },
            thickness: thickness,
          });
        }
      };
    };

    const setSection = (x, w, h) => {
      return (page, y) => {
        page.drawRectangle({
          x: x,
          y: y,
          width: w,
          height: h,
          opacity: 0.15,
          borderWidth: 0,
          borderOpacity: 0,
        });
      };
    };

    const textSmallLeft = setTextLeft(stdFont, smallFont);
    const textSmallCenter = setTextCenter(stdFont, smallFont);
    const textSmallRight = setTextRight(stdFont, smallFont);

    const textLeft = setTextLeft(stdFont, stdFontSize);
    const textCenter = setTextCenter(stdFont, stdFontSize);
    const textRight = setTextRight(stdFont, stdFontSize);

    const textLargeLeft = setTextLeft(stdFont, largeFont);
    const textLargeCenter = setTextCenter(stdFont, largeFont);
    const textLargeRight = setTextRight(stdFont, largeFont);

    const textSmallBoldLeft = setTextLeft(boldFont, smallFont);
    const textSmallBoldCenter = setTextCenter(boldFont, smallFont);
    const textSmallBoldRight = setTextRight(boldFont, smallFont);

    const textBoldLeft = setTextLeft(boldFont, stdFontSize);
    const textBoldCenter = setTextCenter(boldFont, stdFontSize);
    const textBoldRight = setTextRight(boldFont, stdFontSize);

    const textLargeBoldLeft = setTextLeft(boldFont, largeFont);
    const textLargeBoldCenter = setTextCenter(boldFont, largeFont);
    const textLargeBoldRight = setTextRight(boldFont, largeFont);

    const textSmallItalicLeft = setTextLeft(italicFont, smallFont);
    const textSmallItalicCenter = setTextCenter(italicFont, smallFont);
    const textSmallItalicRight = setTextRight(italicFont, smallFont);

    const textItalicLeft = setTextLeft(italicFont, stdFontSize);
    const textItalicCenter = setTextCenter(italicFont, stdFontSize);
    const textItalicRight = setTextRight(italicFont, stdFontSize);

    const textLargeItalicLeft = setTextLeft(italicFont, largeFont);
    const textLargeItalicCenter = setTextCenter(italicFont, largeFont);
    const textLargeItalicRight = setTextRight(italicFont, largeFont);

    const lineThin = setLine(thinLine);
    const line = setLine(stdLine);
    const lineThick = setLine(thickLine);

    const addSection = setSection(18, 576, lineHt);

    const addPage = (titleLeft, titleCenter, sectionTitle = '') => {
      const page = pdfDoc.addPage(PageSizes.Letter); // 612 x 792 (1" = 72)
      page.setFont(stdFont);
      page.setFontSize(stdFontSize);
      page.setLineHeight(lineHt);

      page.drawRectangle({
        x: 18,
        y: 33.5,
        width: 576,
        height: 725,
        opacity: 0,
        borderWidth: thickLine,
        borderOpacity: 1,
      });
      textBoldLeft(page, titleLeft, 24, 762.5);
      textBoldCenter(page, titleCenter, 306, 762.5);
      currentPage++;
      startY = pageStartY;
      currentY = startY - lineHt;

      if (sectionTitle != '') {
        addSection(page, currentY);
        textBoldLeft(page, sectionTitle, 22, currentY + textOffsetY);
        line(page, pageStartX, currentY, pageEndX, currentY);
        currentY -= lineHt;
      }

      return page;
    };

    let whatInBldg = (bldg) => {
      let items = [];
      if (
        bldg.frontExtensionWidth > 0 ||
        bldg.backExtensionWidth > 0 ||
        bldg.leftExtensionWidth > 0 ||
        bldg.rightExtensionWidth > 0
      ) {
        if (bldg.soffitPanelType != 'none') {
          items.push('Roof Extension with Soffit');
        } else {
          items.push('Roof Extension without Soffit');
        }
      }
      if (bldg.roofLinerPanels.length > 0) {
        items.push('Roof Liner Panels');
      }
      if (bldg.wallLinerPanels.length > 0) {
        items.push('Wall Liner Panels');
      }
      if (bldg.canopies.length > 0) {
        items.push('Canopies');
      }
      if (bldg.partitions.length > 0) {
        items.push('Partition Walls');
      }
      if (bldg.partialWalls.length > 0) {
        items.push('Partial Walls');
      }
      if (bldg.wallSkirts.length > 0) {
        items.push('Wall Skirts');
      }
      if (bldg.wainscots.length > 0) {
        items.push('Wainscot Panels');
      }
      if (bldg.roofRelites.length > 0) {
        items.push('Roof Relites');
      }
      if (bldg.wallRelites.length > 0) {
        items.push('Wall Relites');
      }
      if (
        bldg.openings.front.length > 0 ||
        bldg.openings.back.length > 0 ||
        bldg.openings.outerLeft?.length > 0 ||
        bldg.openings.left.length > 0 ||
        bldg.openings.right.length > 0 ||
        bldg.openings.outerRight?.length > 0 ||
        bldg.openings.partition?.length > 0
      ) {
        items.push('Framed Openings');
      }
      if (bldg.openings.roof?.length > 0) {
        items.push('Roof Framed Openings');
      }

      return items;
    };

    // Add Main Page
    let page = addPage('QUOTE / CONTRACT', '');
    const quoteNum =
      state.quoteNumber + (state.revNumber > 0 ? ' R' + state.revNumber : '');

    /* Company Information */
    const logoUrl =
      '/api/auth/logos?filename=' +
      encodeURIComponent('contract-logo.png') +
      '&company=' +
      companyId;
    const logoBytes = await fetch(logoUrl).then((res) => res.arrayBuffer());
    // const logoImage = await pdfDoc.embedJpg(logoBytes);
    const logoImage = await pdfDoc.embedPng(logoBytes);

    page.drawImage(logoImage, {
      x: 22,
      y: 700,
      width: 120,
      height: 54,
    });
    textCenter(page, line1, 202, 742.375, 118);
    textCenter(page, line2, 202, 729.875, 118);
    textCenter(page, line3, 202, 717.375, 118);
    textCenter(page, line4, 202, 704.875, 118);

    textCenter(page, line5, 326, 742.375, 118);
    textCenter(page, line6, 326, 729.875, 118);
    textCenter(page, line7, 326, 717.375, 118);
    textCenter(page, line8, 326, 704.875, 118);

    textSmallItalicRight(page, 'Comp: ' + tempComp, 590, 749);
    textLargeLeft(page, 'Job Number:', 394, 736.125);
    textLeft(page, 'Quote Number:', 394, 720.5);
    textLeft(page, 'Salesperson:', 394, 704.875);

    textLargeBoldLeft(page, '', 470, 736.125, 120);
    textBoldLeft(page, quoteNum, 470, 720.5, 120);
    textBoldLeft(page, getNameById(salesPerson).name, 470, 704.875, 120);

    currentY = 696;
    lineThick(page, 390, 758.5, 390, 696);
    lineThick(page, pageStartX, currentY, pageEndX, currentY);

    /* Customer & Project Info */
    currentY -= lineHt;
    addSection(page, currentY);
    textBoldLeft(page, 'CUSTOMER INFORMATION:', 22, currentY + textOffsetY);
    textBoldLeft(page, 'PROJECT INFORMATION:', 310, currentY + textOffsetY);
    line(page, pageStartX, currentY, pageEndX, currentY);
    currentY -= lineHt;

    textLeft(page, 'Customer:', 22, currentY + textOffsetY);
    textLeft(page, 'Project Name:', 310, currentY + textOffsetY);
    textBoldLeft(page, state.customerName, 72, currentY + textOffsetY, 232);
    textBoldLeft(page, state.projectName, 376, currentY + textOffsetY, 216);
    lineThin(page, pageStartX, currentY, pageEndX, currentY);
    currentY -= lineHt;

    textLeft(page, 'Contact:', 22, currentY + textOffsetY);
    textLeft(page, 'Project For:', 310, currentY + textOffsetY);
    textBoldLeft(page, state.contactName, 72, currentY + textOffsetY, 232);
    textBoldLeft(page, state.projectFor, 376, currentY + textOffsetY, 216);
    lineThin(page, pageStartX, currentY, pageEndX, currentY);
    currentY -= lineHt;

    textLeft(page, 'Address:', 22, currentY + textOffsetY);
    textLeft(page, 'Address:', 310, currentY + textOffsetY);
    textBoldLeft(page, state.customerAddress, 72, currentY + textOffsetY, 232);
    textBoldLeft(page, state.projectAddress, 376, currentY + textOffsetY, 216);
    lineThin(page, pageStartX, currentY, pageEndX, currentY);
    currentY -= lineHt;

    textLeft(page, 'City:', 22, currentY + textOffsetY);
    textLeft(page, 'State:', 171, currentY + textOffsetY);
    textLeft(page, 'Zip:', 234, currentY + textOffsetY);
    textLeft(page, 'City:', 310, currentY + textOffsetY);
    textLeft(page, 'State:', 459, currentY + textOffsetY);
    textLeft(page, 'Zip:', 522, currentY + textOffsetY);
    textBoldLeft(page, state.customerCity, 58, currentY + textOffsetY, 111);
    textBoldLeft(page, state.customerState, 204, currentY + textOffsetY, 28);
    textBoldLeft(page, state.customerZip, 256, currentY + textOffsetY, 48);
    textBoldLeft(page, state.projectCity, 346, currentY + textOffsetY, 111);
    textBoldLeft(page, state.projectState, 492, currentY + textOffsetY, 28);
    textBoldLeft(page, state.projectZip, 544, currentY + textOffsetY, 48);
    lineThin(page, pageStartX, currentY, pageEndX, currentY);
    currentY -= lineHt;

    textLeft(page, 'Phone:', 22, currentY + textOffsetY);
    textLeft(page, 'Fax:', 164, currentY + textOffsetY);
    textLeft(page, 'County:', 310, currentY + textOffsetY);
    textBoldLeft(page, state.customerPhone, 58, currentY + textOffsetY, 104);
    textBoldLeft(page, state.customerFax, 200, currentY + textOffsetY, 104);
    textBoldLeft(page, state.projectCounty, 346, currentY + textOffsetY, 246);
    lineThin(page, pageStartX, currentY, pageEndX, currentY);
    currentY -= lineHt;

    textLeft(page, 'Cell:', 22, currentY + textOffsetY);
    textLeft(page, 'Email:', 164, currentY + textOffsetY);
    textBoldLeft(page, state.customerCell, 58, currentY + textOffsetY, 104);
    textBoldLeft(page, state.customerEmail, 200, currentY + textOffsetY, 104);
    lineThick(page, pageStartX, currentY, pageEndX, currentY);
    lineThick(page, 306, 696, 306, currentY);
    startY = currentY;

    /* Design Codes */
    currentY = startY - lineHt;
    addSection(page, currentY);
    textBoldLeft(page, 'DESIGN CODES:', 22, currentY + textOffsetY);
    textSmallBoldLeft(
      page,
      'Note: It is the builder/contractor responsibility to verity building codes and loadings with the lcoal building department.',
      110,
      currentY + textOffsetY
    );
    line(page, pageStartX, currentY, pageEndX, currentY);
    currentY -= lineHt;

    textItalicRight(page, 'Governing Code', 96, currentY + textOffsetY);
    textLeft(page, 'Building Code:', 104, currentY + textOffsetY);
    textLeft(page, 'Risk Category:', 428, currentY + textOffsetY);
    textBoldLeft(
      page,
      buildingCodes.find((item) => item.id === state.buildingCode).label,
      178,
      currentY + textOffsetY,
      248
    );
    textBoldLeft(
      page,
      riskCategories.find((item) => item.id === state.riskCategory).label,
      500,
      currentY + textOffsetY,
      92
    );
    lineThin(page, pageStartX, currentY, pageEndX, currentY);
    currentY -= lineHt;

    textItalicRight(page, 'Roof Code', 96, currentY + textOffsetY);
    textLeft(page, 'Collateral Load:', 104, currentY + textOffsetY);
    textLeft(page, 'Live Load:', 266, currentY + textOffsetY);
    textLeft(page, 'Dead Load:', 428, currentY + textOffsetY);
    textBoldLeft(
      page,
      state.collateralLoad + ' psf',
      178,
      currentY + textOffsetY,
      86
    );
    textBoldLeft(
      page,
      state.liveLoad + ' psf',
      330,
      currentY + textOffsetY,
      96
    );
    textBoldLeft(
      page,
      state.deadLoad + ' psf',
      500,
      currentY + textOffsetY,
      92
    );
    lineThin(page, pageStartX, currentY, pageEndX, currentY);
    currentY -= lineHt;

    textItalicRight(page, 'Wind Load', 96, currentY + textOffsetY);
    textLeft(page, 'Wind Speed:', 104, currentY + textOffsetY);
    textLeft(page, 'Exposure:', 266, currentY + textOffsetY);
    textLeft(page, 'Enclosure:', 428, currentY + textOffsetY);
    textBoldLeft(
      page,
      state.windLoad + ' mph',
      178,
      currentY + textOffsetY,
      86
    );
    textBoldLeft(page, state.exposure, 330, currentY + textOffsetY, 96);
    textBoldLeft(
      page,
      enclosure.find((item) => item.id === state.windEnclosure).label,
      500,
      currentY + textOffsetY,
      92
    );
    lineThin(page, pageStartX, currentY, pageEndX, currentY);
    currentY -= lineHt;

    textItalicRight(page, 'Snow Load', 96, currentY + textOffsetY);
    textLeft(page, 'Ground Snow:', 104, currentY + textOffsetY);
    textLeft(page, 'Roof Snow:', 266, currentY + textOffsetY);
    textLeft(page, 'Thermal Factor:', 428, currentY + textOffsetY);
    textBoldLeft(
      page,
      state.groundSnowLoad + ' psf',
      178,
      currentY + textOffsetY,
      86
    );
    textBoldLeft(
      page,
      state.roofSnowLoad + ' psf',
      330,
      currentY + textOffsetY,
      96
    );
    textBoldLeft(
      page,
      thermalFactor.find((item) => item.id === state.thermalFactor).label,
      500,
      currentY + textOffsetY,
      92
    );
    lineThin(page, pageStartX, currentY, pageEndX, currentY);
    currentY -= lineHt;

    textItalicRight(page, 'Seismic Data', 96, currentY + textOffsetY);
    textLeft(page, 'Seismic Design Category:', 104, currentY + textOffsetY);
    textLeft(page, 'Ss:', 266, currentY + textOffsetY);
    textLeft(page, 'S  :', 348, currentY + textOffsetY);
    textSmallLeft(page, '1', 355, currentY + textOffsetY);
    textLeft(page, 'Sms:', 428, currentY + textOffsetY);
    textLeft(page, 'Sm  :', 510, currentY + textOffsetY);
    textSmallLeft(page, '1', 525, currentY + textOffsetY);
    textBoldLeft(page, state.seismicCategory, 228, currentY + textOffsetY, 36);
    textBoldLeft(
      page,
      state.seismicSs.toString(),
      292,
      currentY + textOffsetY,
      48
    );
    textBoldLeft(
      page,
      state.seismicS1.toString(),
      374,
      currentY + textOffsetY,
      48
    );
    textBoldLeft(
      page,
      state.seismicSms.toString(),
      460,
      currentY + textOffsetY,
      48
    );
    textBoldLeft(
      page,
      state.seismicSm1.toString(),
      542,
      currentY + textOffsetY,
      48
    );
    lineThick(page, pageStartX, currentY, pageEndX, currentY);
    line(page, 100, startY - lineHt, 100, currentY);
    startY = currentY;

    /* Building Layout */
    for (i = 0; i < state.buildings.length; i++) {
      bldgItems = whatInBldg(state.buildings[i]);
      // Add to next page if section does not fit on page
      if (startY < pageEndY + lineHt * (6 + Math.ceil(bldgItems.length / 3))) {
        page = addPage('', 'Project Information (cont.)');
      }

      currentY = startY - lineHt;
      addSection(page, currentY);
      if (state.buildings.length > 1) {
        textBoldLeft(
          page,
          'BUILDING ' + String.fromCharCode(i + 65) + ':',
          22,
          currentY + textOffsetY
        );
      } else {
        textBoldLeft(page, 'BASIC BUILDING:', 22, currentY + textOffsetY);
      }
      line(page, pageStartX, currentY, pageEndX, currentY);
      bldgPageNums[i].currentPage = currentPage;
      bldgPageNums[i].currentLine = currentY;
      currentY -= lineHt;

      textLeft(page, 'Building Type:', 22, currentY + textOffsetY);
      textBoldLeft(
        page,
        shapes.find((item) => item.id === state.buildings[i].shape).label,
        96,
        currentY + textOffsetY,
        232
      );
      if (state.buildings[i].shape == 'nonSymmetrical') {
        textLeft(page, 'Peak Offset:', 404, currentY + textOffsetY);
        textBoldLeft(
          page,
          formatFeetInches(state.buildings[i].backPeakOffset),
          470,
          currentY + textOffsetY,
          122
        );
      }
      lineThin(page, pageStartX, currentY, pageEndX, currentY);
      currentY -= lineHt;

      textLeft(page, 'Width:', 22, currentY + textOffsetY);
      textLeft(page, 'Length:', 116, currentY + textOffsetY);
      textLeft(page, 'Back Sidewall Eave Height:', 216, currentY + textOffsetY);
      textLeft(
        page,
        'Front Sidewall Eave Height:',
        404,
        currentY + textOffsetY
      );
      textBoldLeft(
        page,
        formatFeetInches(state.buildings[i].width),
        60,
        currentY + textOffsetY,
        54
      );
      textBoldLeft(
        page,
        formatFeetInches(state.buildings[i].length),
        156,
        currentY + textOffsetY,
        54
      );
      textBoldLeft(
        page,
        formatFeetInches(state.buildings[i].backEaveHeight),
        348,
        currentY + textOffsetY,
        54
      );
      textBoldLeft(
        page,
        formatFeetInches(state.buildings[i].frontEaveHeight),
        538,
        currentY + textOffsetY,
        54
      );
      lineThin(page, pageStartX, currentY, pageEndX, currentY);
      currentY -= lineHt;

      textLeft(page, 'Back Roof Pitch:', 22, currentY + textOffsetY);
      textBoldLeft(
        page,
        state.buildings[i].backRoofPitch + ':12',
        106,
        currentY + textOffsetY,
        108
      );
      if (state.buildings[i].shape == 'nonSymmetrical') {
        textLeft(page, 'Front Roof Pitch:', 216, currentY + textOffsetY);
        textBoldLeft(
          page,
          state.buildings[i].frontRoofPitch + ':12',
          300,
          currentY + textOffsetY,
          108
        );
      }

      if (i > 0) {
        lineThin(page, pageStartX, currentY, pageEndX, currentY);
        currentY -= lineHt;

        textLeft(page, 'Location:', 22, currentY + textOffsetY);
        textLeft(page, 'Common Wall:', 404, currentY + textOffsetY);
        textBoldLeft(
          page,
          'Building ' +
            (state.buildings[i].rotation > 0
              ? 'rotated ' + state.buildings[i].rotation + '° & '
              : '') +
            'moved ' +
            (state.buildings[i].offsetX != 0
              ? (state.buildings[i].offsetX < 0 ? 'left ' : 'right ') +
                formatFeetInches(Math.abs(state.buildings[i].offsetX))
              : '') +
            (state.buildings[i].offsetX != 0 && state.buildings[i].offsetY != 0
              ? ' & '
              : '') +
            (state.buildings[i].offsetY != 0
              ? (state.buildings[i].offsetY < 0 ? 'down ' : 'up ') +
                formatFeetInches(Math.abs(state.buildings[i].offsetY))
              : ''),
          68,
          currentY + textOffsetY,
          334
        );
        textBoldLeft(
          page,
          state.buildings[i].commanWall + '',
          476,
          currentY + textOffsetY,
          116
        );
      }

      if (state.buildings.length > 1) {
        lineThin(page, pageStartX, currentY, pageEndX, currentY);
        currentY -= lineHt;

        textLeft(page, 'Building Includes:', 22, currentY + textOffsetY);
        currentY -= lineHt;
        for (j = 0; j < bldgItems.length; j++) {
          textLeft(
            page,
            '• ' + bldgItems[j],
            (j % 3) * 170 + 50,
            currentY + textOffsetY,
            168
          );
          currentY = j % 3 == 2 ? currentY - lineHt : currentY;
        }
      }

      lineThick(page, pageStartX, currentY, pageEndX, currentY);
      startY = currentY;
    }

    /* Accessories */
    if (startY < pageEndY + lineHt * 2) {
      page = addPage('', '');
    }

    currentY -= lineHt;
    addSection(page, currentY);
    textBoldLeft(page, 'ACCESSORIES:', 22, currentY + textOffsetY);
    line(page, pageStartX, currentY, pageEndX, currentY);
    currentY -= lineHt;

    i = 0;
    // Accessories
    accessories
      .filter((accessories) => state[accessories.name])
      .map((acc) => {
        ++i;
        textLeft(page, 'Qty:', 22, currentY + textOffsetY);
        textBoldCenter(
          page,
          state[acc.name].toString(),
          54,
          currentY + textOffsetY
        );

        let lines = wrapText(acc.text, 520, stdFont, stdFontSize);
        let numLines = 0;
        for (const line of lines) {
          page.drawText(line, {
            x: 70,
            y: currentY + textOffsetY,
            size: stdFontSize,
            font: stdFont,
          });
          numLines++;
          lineThin(page, pageStartX, currentY, pageEndX, currentY);
          currentY -= lineHt;

          if (currentY < pageEndY) {
            page = addPage('', '', 'ACCESSORIES (cont.)');
            numLines = 0;
          }
        }
      });

    // Man Doors
    state.mandoors.map((door) => {
      ++i;
      textLeft(page, 'Qty:', 22, currentY + textOffsetY);
      textBoldCenter(page, door.qty.toString(), 54, currentY + textOffsetY);
      mandoorIncludes = [];
      if (door.glass == 'half') mandoorIncludes.push('half glass');
      if (door.glass == 'narrow') mandoorIncludes.push('narrow lite');
      if (door.leverLockset) mandoorIncludes.push('lever-lockset');
      if (door.deadBolt) mandoorIncludes.push('deadbolt');
      if (door.panic) mandoorIncludes.push('panic hardware');
      if (door.mullion) mandoorIncludes.push('removable mullion');
      if (door.closer) mandoorIncludes.push('closers');
      if (door.kickPlate) {
        if (door.size == '6070' || door.size == '6070P') {
          mandoorIncludes.push('kick plates');
        } else {
          mandoorIncludes.push('kick plate');
        }
      }
      mandoorDesc = ' with ';
      for (j = 0; j < mandoorIncludes.length; j++) {
        mandoorDesc +=
          j == 0
            ? mandoorIncludes[j]
            : mandoorIncludes.length == 2
              ? ' and ' + mandoorIncludes[j]
              : j + 1 == mandoorIncludes.length
                ? ', and ' + mandoorIncludes[j]
                : ', ' + mandoorIncludes[j];
      }

      walkDoors
        .filter((doorType) => doorType.name == door.size)
        .map((size) => {
          let lines = wrapText(
            size.text + mandoorDesc,
            520,
            stdFont,
            stdFontSize
          );
          let numLines = 0;
          for (const line of lines) {
            page.drawText(line, {
              x: 70,
              y: currentY + textOffsetY,
              size: stdFontSize,
              font: stdFont,
            });
            numLines++;
            lineThin(page, pageStartX, currentY, pageEndX, currentY);
            currentY -= lineHt;

            if (currentY < pageEndY) {
              page = addPage('', '', 'ACCESSORIES (cont.)');
              numLines = 0;
            }
          }
        });
    });

    if (i == 0) {
      textBoldLeft(page, 'None', 50, currentY + textOffsetY);
    } else {
      currentY += lineHt;
    }
    lineThick(page, pageStartX, currentY, pageEndX, currentY);

    /* Project Notes */
    if (startY < pageEndY + lineHt * 2) {
      page = addPage('', '');
    }

    currentY -= lineHt;
    addSection(page, currentY);
    textBoldLeft(page, 'PROJECT NOTES:', 22, currentY + textOffsetY);
    line(page, pageStartX, currentY, pageEndX, currentY);
    currentY -= lineHt;

    i = 0;
    // Custom Notes
    if (state.buildings.length == 1) {
      state.notes
        .filter((notes) => notes.building === 'Building A')
        .map((note) => {
          textCenter(page, (++i).toString() + '.', 34, currentY + textOffsetY);

          let lines = wrapText(note.text, 548, stdFont, stdFontSize);
          let numLines = 0;
          for (const line of lines) {
            page.drawText(line, {
              x: 46,
              y: currentY + textOffsetY,
              size: stdFontSize,
              font: stdFont,
            });
            numLines++;
            lineThin(page, pageStartX, currentY, pageEndX, currentY);
            currentY -= lineHt;

            if (currentY < pageEndY) {
              page = addPage('', '', 'PROJECT NOTES (cont.)');
              numLines = 0;
            }
          }
        });
    }

    state.notes
      .filter((notes) => notes.building === 'Project')
      .map((note) => {
        textCenter(page, (++i).toString() + '.', 34, currentY + textOffsetY);

        let lines = wrapText(note.text, 548, stdFont, stdFontSize);
        let numLines = 0;
        for (const line of lines) {
          page.drawText(line, {
            x: 46,
            y: currentY + textOffsetY,
            size: stdFontSize,
            font: stdFont,
          });
          numLines++;
          lineThin(page, pageStartX, currentY, pageEndX, currentY);
          currentY -= lineHt;

          if (currentY < pageEndY) {
            page = addPage('', '', 'PROJECT NOTES (cont.)');
            numLines = 0;
          }
        }
      });

    // Standard Notes
    stdNotes
      .filter((notes) => notes.type === 'checkbox' && state[notes.name])
      .map((note) => {
        textCenter(page, (++i).toString() + '.', 34, currentY + textOffsetY);

        let lines = wrapText(note.text, 548, stdFont, stdFontSize);
        let numLines = 0;
        for (const line of lines) {
          page.drawText(line, {
            x: 46,
            y: currentY + textOffsetY,
            size: stdFontSize,
            font: stdFont,
          });
          numLines++;
          lineThin(page, pageStartX, currentY, pageEndX, currentY);
          currentY -= lineHt;

          if (currentY < pageEndY) {
            page = addPage('', '', 'PROJECT NOTES (cont.)');
            numLines = 0;
          }
        }
      });

    // Fill blank area with lines
    if (currentY < pageEndY + lineHt * 13) {
      for (currentY; currentY > pageEndY; currentY -= lineHt) {
        lineThin(page, pageStartX, currentY, pageEndX, currentY);
      }
      page = addPage('', '');
      //add a page of lines???
      currentY = pageEndY + lineHt * 13;
      lineThick(page, pageStartX, currentY, pageEndX, currentY);
      currentY -= lineHt;
      startY = currentY;
    } else {
      for (currentY; currentY > pageEndY + lineHt * 13; currentY -= lineHt) {
        lineThin(page, pageStartX, currentY, pageEndX, currentY);
      }
      lineThick(page, pageStartX, currentY, pageEndX, currentY);
      currentY -= lineHt;
      startY = currentY;
    }

    /* Price and Signature Section */
    addSection(page, currentY);
    textBoldLeft(page, 'CONTRACT AMOUNT:', 22, currentY + textOffsetY);
    line(page, pageStartX, currentY, pageEndX, currentY);
    currentY -= lineHt * 1.25;

    textItalicLeft(page, 'Price:', 22, currentY + textOffsetY);
    textItalicLeft(page, 'Weight:', 480, currentY + textOffsetY);
    textCenter(
      page,
      state.willCall
        ? "Building Package F.O.B. Manufacturer's Shop"
        : state.projectState == 'AK' || state.projectState == 'HI'
          ? 'Building Package F.O.B. Seattle Docks'
          : 'Building Package F.O.B. Job Site',
      306,
      currentY + textOffsetY,
      340
    );
    textLargeBoldLeft(
      page,
      formatDollar(tempPrice),
      56,
      currentY + textOffsetY,
      76
    );
    textBoldLeft(
      page,
      tempWeight.toLocaleString() + ' lbs.',
      520,
      currentY + textOffsetY,
      72
    );
    lineThin(page, pageStartX, currentY, pageEndX, currentY);
    currentY -= lineHt;

    textItalicLeft(page, 'Terms:', 22, currentY + textOffsetY);
    textSmallLeft(
      page,
      tempEngOnly
        ? 'Purchaser will pay a 50% down payment at time of order.'
        : tempPrice < 250000
          ? 'Purchaser will pay a 20% down payment at time of order.'
          : 'Purchaser will pay a 20% down payment at time of order and 40% of the contract price prior to fabrication.',
      60,
      currentY + textOffsetY,
      530
    );
    currentY -= lineHt * 0.75;

    textSmallLeft(
      page,
      tempEngOnly
        ? 'The balance is due upon delivery of stamped engineered drawings and calculations.'
        : tempPrice < 250000
          ? 'The balance is due prior to delivery of the first load/shipment.'
          : 'The balance is due prior to delivery of the first load/shipment.',
      60,
      currentY + textOffsetY,
      530
    );
    currentY -= lineHt * 0.75;

    textSmallCenter(
      page,
      state.monoSlabDesign || state.pierFootingDesign
        ? '• Sales tax and anchor bolts are not included.  • Bid is good for 7 days.  • Contract price is good for 21 days.'
        : '• Sales tax, anchor bolts, and concrete design are not included.  • Bid is good for 7 days.  • Contract price is good for 21 days.',
      306,
      currentY + textOffsetY
    );
    lineThick(page, pageStartX, currentY, pageEndX, currentY);
    startY = currentY;
    currentY -= lineHt;

    addSection(page, currentY);
    textBoldLeft(
      page,
      companyId == 1 ? 'PBS SIGNATURE:' : 'SUPPLIERS SIGNATURE:',
      22,
      currentY + textOffsetY
    );
    textBoldLeft(page, 'PURCHASER SIGNATURE:', 310, currentY + textOffsetY);
    line(page, pageStartX, currentY, pageEndX, currentY);
    currentY -= lineHt * 1.25;

    textLeft(
      page,
      companyId == 1 ? 'Manufatured by:' : 'Provided by:',
      22,
      currentY + textOffsetY
    );
    textRight(page, "Buyer's Signature:", 400, currentY + textOffsetY);
    line(page, 404, currentY, 580, currentY);
    currentY -= lineHt;

    textLeft(page, companyName, 44, currentY + textOffsetY);
    textRight(page, "Buyer's Name:", 400, currentY + textOffsetY);
    line(page, 404, currentY, 580, currentY);
    currentY -= lineHt;

    textLeft(page, companyAddress, 44, currentY + textOffsetY);
    textRight(page, 'Billing Address:', 400, currentY + textOffsetY);
    line(page, 404, currentY, 580, currentY);
    currentY -= lineHt;

    textLeft(page, companyCityStateZip, 44, currentY + textOffsetY);
    textRight(page, 'Accounts Payable Email:', 430, currentY + textOffsetY);
    line(page, 434, currentY, 580, currentY);
    currentY -= lineHt;

    textRight(page, 'Reseller Permit #:', 430, currentY + textOffsetY);
    line(page, 434, currentY, 580, currentY);
    currentY -= lineHt;

    textLeft(page, 'By:', 22, currentY + textOffsetY);
    line(page, 40, currentY, 296, currentY);
    textRight(page, 'Date:', 344, currentY + textOffsetY);
    line(page, 348, currentY, 448, currentY);
    textRight(page, 'PO #:', 476, currentY + textOffsetY);
    line(page, 480, currentY, 580, currentY);
    currentY -= lineHt;

    textLeft(page, 'Authorized Signature', 44, currentY + textOffsetY);
    textLeft(page, 'Title', 220, currentY + textOffsetY);
    lineThick(page, 306, startY, 306, currentY);
    currentY -= lineHt;

    /* Each Building */
    for (i = 0; i < state.buildings.length; i++) {
      bldgPageNums[i].pageStart = currentPage + 2; //Still on the previous page
      pageTitle =
        state.buildings.length > 1
          ? 'Building ' + String.fromCharCode(i + 65)
          : '';

      page = addPage(pageTitle, 'Building Information', '');

      /* Building Code Override per Building */
      if (
        state.collateralLoad != state.buildings[i].collateralLoad ||
        state.liveLoad != state.buildings[i].liveLoad ||
        state.deadLoad != state.buildings[i].deadLoad ||
        state.windEnclosure != state.buildings[i].windEnclosure ||
        state.roofSnowLoad != state.buildings[i].roofSnowLoad ||
        state.thermalFactor != state.buildings[i].thermalFactor
      ) {
        addSection(page, currentY);
        textBoldLeft(page, 'DESIGN CODES:', 22, currentY + textOffsetY);
        textSmallBoldLeft(
          page,
          'Note: The below load adjustments apply to this building only.',
          110,
          currentY + textOffsetY
        );
        line(page, pageStartX, currentY, pageEndX, currentY);
        startY = currentY;
        currentY -= lineHt;

        if (
          state.collateralLoad != state.buildings[i].collateralLoad ||
          state.liveLoad != state.buildings[i].liveLoad ||
          state.deadLoad != state.buildings[i].deadLoad
        ) {
          textItalicRight(page, 'Roof Code', 96, currentY + textOffsetY);

          if (state.collateralLoad != state.buildings[i].collateralLoad) {
            textLeft(page, 'Collateral Load:', 104, currentY + textOffsetY);
            textBoldLeft(
              page,
              state.buildings[i].collateralLoad + ' psf',
              178,
              currentY + textOffsetY,
              86
            );
          }

          if (state.liveLoad != state.buildings[i].liveLoad) {
            textLeft(page, 'Live Load:', 266, currentY + textOffsetY);
            textBoldLeft(
              page,
              state.buildings[i].liveLoad + ' psf',
              330,
              currentY + textOffsetY,
              96
            );
          }

          if (state.deadLoad != state.buildings[i].deadLoad) {
            textLeft(page, 'Dead Load:', 428, currentY + textOffsetY);
            textBoldLeft(
              page,
              state.buildings[i].deadLoad + ' psf',
              500,
              currentY + textOffsetY,
              92
            );
          }

          lineThin(page, pageStartX, currentY, pageEndX, currentY);
          currentY -= lineHt;
        }

        if (state.windEnclosure != state.buildings[i].windEnclosure) {
          textItalicRight(page, 'Wind Load', 96, currentY + textOffsetY);

          if (state.windEnclosure != state.buildings[i].windEnclosure) {
            textLeft(page, 'Enclosure:', 428, currentY + textOffsetY);
            textBoldLeft(
              page,
              enclosure.find(
                (item) => item.id === state.buildings[i].windEnclosure
              ).label,
              500,
              currentY + textOffsetY,
              92
            );
          }

          lineThin(page, pageStartX, currentY, pageEndX, currentY);
          currentY -= lineHt;
        }

        if (
          state.roofSnowLoad != state.buildings[i].roofSnowLoad ||
          state.thermalFactor != state.buildings[i].thermalFactor
        ) {
          textItalicRight(page, 'Snow Load', 96, currentY + textOffsetY);

          if (state.roofSnowLoad != state.buildings[i].roofSnowLoad) {
            textLeft(page, 'Roof Snow:', 266, currentY + textOffsetY);
            textBoldLeft(
              page,
              state.buildings[i].roofSnowLoad + ' psf',
              330,
              currentY + textOffsetY,
              96
            );
          }

          if (state.thermalFactor != state.buildings[i].thermalFactor) {
            textLeft(page, 'Thermal Factor:', 428, currentY + textOffsetY);
            textBoldLeft(
              page,
              thermalFactor.find(
                (item) => item.id === state.buildings[i].thermalFactor
              ).label,
              500,
              currentY + textOffsetY,
              92
            );
          }

          lineThin(page, pageStartX, currentY, pageEndX, currentY);
          currentY -= lineHt;
        }

        currentY += lineHt;
        lineThick(page, pageStartX, currentY, pageEndX, currentY);
        line(page, 100, startY, 100, currentY);
        currentY -= lineHt;
        startY = currentY;
      }

      /* Frame Section */
      addSection(page, currentY);
      textBoldLeft(page, 'FRAMING DATA:', 22, currentY + textOffsetY);
      line(page, pageStartX, currentY, pageEndX, currentY);
      currentY -= lineHt;

      textLeft(page, 'Frame Type:', 22, currentY + textOffsetY);
      if (state.buildings[i].frameType == 'multiSpan') {
        textBoldLeft(
          page,
          frames.find((item) => item.id === state.buildings[i].frameType).label,
          90,
          currentY + textOffsetY,
          124
        );
        textLeft(page, 'Interior Col Spacing:', 216, currentY + textOffsetY);
        textBoldLeft(
          page,
          formatBaySpacing(state.buildings[i].intColSpacing),
          320,
          currentY + textOffsetY,
          124
        );
      } else {
        textBoldLeft(
          page,
          frames.find((item) => item.id === state.buildings[i].frameType).label,
          90,
          currentY + textOffsetY,
          354
        );
      }
      textLeft(page, 'Finish:', 446, currentY + textOffsetY);
      textBoldLeft(
        page,
        steelFinish.find((item) => item.id === state.buildings[i].steelFinish)
          .label,
        486,
        currentY + textOffsetY,
        104
      );
      // lineThin(page, pageStartX, currentY, pageEndX, currentY);
      currentY -= lineHt;

      drawCheckBox(
        page,
        'Straight Exterior Columns',
        120,
        currentY + textOffsetY,
        state.buildings[i].noFlangeBraces
      );
      drawCheckBox(
        page,
        'No Flange Braces on Columns',
        250,
        currentY + textOffsetY,
        state.buildings[i].noFlangeBraces
      );
      lineThin(page, pageStartX, currentY, pageEndX, currentY);
      currentY -= lineHt;

      textLeft(page, 'Left Endwall Frame:', 22, currentY + textOffsetY);
      textBoldLeft(
        page,
        FrameOptions.find((item) => item.id === state.buildings[i].leftFrame)
          .label,
        120,
        currentY + textOffsetY,
        194
      );
      if (state.buildings[i].leftFrame == 'insetRF') {
        textLeft(page, 'Number of Bays:', 316, currentY + textOffsetY);
        textBoldLeft(
          page,
          state.buildings[i].leftEndwallInset.toString(),
          400,
          currentY + textOffsetY,
          192
        );
      }
      lineThin(page, pageStartX, currentY, pageEndX, currentY);
      currentY -= lineHt;

      textLeft(page, 'Right Endwall Frame:', 22, currentY + textOffsetY);
      textBoldLeft(
        page,
        FrameOptions.find((item) => item.id === state.buildings[i].rightFrame)
          .label,
        120,
        currentY + textOffsetY,
        124
      );
      if (state.buildings[i].rightFrame == 'insetRF') {
        textLeft(page, 'Number of Bays:', 316, currentY + textOffsetY);
        textBoldLeft(
          page,
          state.buildings[i].rightEndwallInset.toString(),
          400,
          currentY + textOffsetY,
          192
        );
      }
      lineThick(page, pageStartX, currentY, pageEndX, currentY);
      currentY -= lineHt;

      /* Custom Building Notes */
      j = 0;
      startY = currentY;
      if (state.buildings.length > 1) {
        state.notes
          .filter((notes) => notes.building === pageTitle)
          .map((note) => {
            currentY -= j == 0 ? lineHt : 0;
            textCenter(
              page,
              (++j).toString() + '.',
              34,
              currentY + textOffsetY
            );

            let lines = wrapText(note.text, 548, stdFont, stdFontSize);
            let numLines = 0;
            for (const line of lines) {
              page.drawText(line, {
                x: 46,
                y: currentY + textOffsetY,
                size: stdFontSize,
                font: stdFont,
              });
              numLines++;
              lineThin(page, pageStartX, currentY, pageEndX, currentY);
              currentY -= lineHt;

              if (currentY < pageEndY) {
                page = addPage('', '', 'BUILDING NOTES (cont.)');
                numLines = 0;
              }
            }
          });
        if (j > 0) {
          addSection(page, startY);
          textBoldLeft(page, 'BUILDING NOTES:', 22, startY + textOffsetY);
          line(page, pageStartX, startY, pageEndX, startY);

          currentY += lineHt;
          lineThick(page, pageStartX, currentY, pageEndX, currentY);
          currentY -= lineHt;
          startY = currentY;
        }
      }

      /* Roof Section */
      wallsInBldg =
        state.buildings[i].shape == 'singleSlope' ||
        state.buildings[i].shape == 'leanTo'
          ? singleSlopeRoofs
          : roofs;

      if (currentY < pageEndY + lineHt * 8) {
        page = addPage(pageTitle, 'Roof', '');
      } else {
        currentY -= lineHt;
        textBoldCenter(page, 'Roof', 306, currentY + textOffsetY);
        lineThick(page, pageStartX, currentY, pageEndX, currentY);
        currentY -= lineHt;
      }

      addSection(page, currentY);
      textBoldLeft(page, 'BASIC INFORMATION:', 22, currentY + textOffsetY);
      line(page, pageStartX, currentY, pageEndX, currentY);
      currentY -= lineHt;
      // page = addPage(pageTitle, 'Roof', 'BASIC INFORMATION:');

      textLeft(page, 'Bay Spacing:', 22, currentY + textOffsetY);
      textBoldLeft(
        page,
        formatBaySpacing(state.buildings[i].roofBaySpacing),
        90,
        currentY + textOffsetY,
        504
      );
      lineThin(page, pageStartX, currentY, pageEndX, currentY);
      currentY -= lineHt;

      textLeft(page, 'Bracing Type:', 22, currentY + textOffsetY);
      textBoldLeft(page, 'X-Bracing', 90, currentY + textOffsetY, 124);
      textLeft(page, 'Braced Bays:', 216, currentY + textOffsetY);
      textBoldLeft(
        page,
        formatBaySelected(state.buildings[i].roofBracedBays),
        286,
        currentY + textOffsetY,
        306
      );
      lineThin(page, pageStartX, currentY, pageEndX, currentY);
      currentY -= lineHt;

      textLeft(page, 'Purlin Type:', 22, currentY + textOffsetY);
      textLeft(page, 'Special Purlin Spacing:', 216, currentY + textOffsetY);
      textBoldLeft(page, 'Bi-Pass', 90, currentY + textOffsetY, 124);
      textBoldLeft(
        page,
        purlinSpacing.find(
          (item) => item.id === state.buildings[i].purlinSpacing
        ).label,
        320,
        currentY + textOffsetY,
        124
      );
      lineThin(page, pageStartX, currentY, pageEndX, currentY);
      currentY -= lineHt;

      textLeft(page, 'Roof Panels:', 22, currentY + textOffsetY);
      textLeft(page, 'Gauge:', 216, currentY + textOffsetY);
      textLeft(page, 'Finish:', 316, currentY + textOffsetY);
      textLeft(page, 'Color:', 446, currentY + textOffsetY);
      textBoldLeft(
        page,
        roofPanels.find((item) => item.id === state.buildings[i].roofPanelType)
          .label,
        90,
        currentY + textOffsetY,
        124
      );
      textBoldLeft(
        page,
        roofGauge.find(
          (item) => parseInt(item.id) === state.buildings[i].roofPanelGauge
        ).label,
        260,
        currentY + textOffsetY,
        54
      );
      // textBoldLeft(
      //   page,
      //   roofFinish.find(
      //     (item) => item.id === state.buildings[i].roofPanelFinish
      //   ).label,
      //   356,
      //   currentY + textOffsetY,
      //   88
      // );
      textBoldLeft(
        page,
        masterColorList.find(
          (item) => item.id === state.buildings[i].roofPanelColor
        ).label,
        486,
        currentY + textOffsetY,
        106
      );
      if (
        state.buildings[i].roofPanelType == 'ssq' ||
        state.buildings[i].roofPanelType == 'ms200' ||
        state.buildings[i].roofPanelType == 'doubleLok' ||
        state.buildings[i].roofPanelType == 'battenLok'
      ) {
        currentY -= lineHt;
        textSmallLeft(
          page,
          '***Standing Seam Note: Standing Seam panels require the rental of seaming equipment not included in price.',
          100,
          currentY + textOffsetY
        );
      }
      lineThin(page, pageStartX, currentY, pageEndX, currentY);
      currentY -= lineHt;

      textLeft(page, 'Insulation:', 22, currentY + textOffsetY);
      textBoldLeft(
        page,
        roofInsulation.find(
          (item) => item.id === state.buildings[i].roofInsulation
        ).label +
          (state.buildings[i].roofInsulationOthers &&
          state.buildings[i].roofInsulation != 'none'
            ? ' - By Others'
            : ''),
        90,
        currentY + textOffsetY,
        502
      );
      lineThin(page, pageStartX, currentY, pageEndX, currentY);
      currentY -= lineHt;

      textLeft(page, 'Eave Trim:', 22, currentY + textOffsetY);
      textBoldLeft(
        page,
        state.buildings[i].includeGutters
          ? 'Gutters and Downspouts'
          : 'Standard Eave Trim (No Gutters)',
        90,
        currentY + textOffsetY,
        502
      );

      lineThick(page, pageStartX, currentY, pageEndX, currentY);
      currentY -= lineHt;

      /* Roof Extensions */
      if (
        state.buildings[i].frontExtensionWidth > 0 ||
        state.buildings[i].backExtensionWidth > 0 ||
        state.buildings[i].leftExtensionWidth > 0 ||
        state.buildings[i].rightExtensionWidth > 0
      ) {
        addSection(page, currentY);
        textBoldLeft(page, 'ROOF EXTENSIONS:', 22, currentY + textOffsetY);
        line(page, pageStartX, currentY, pageEndX, currentY);
        currentY -= lineHt;

        wallsInBldg = walls;

        for (j = 0; j < wallsInBldg.length; j++) {
          if (state.buildings[i][`${wallsInBldg[j].id}ExtensionWidth`]) {
            textLeft(page, 'Location:', 22, currentY + textOffsetY);
            textLeft(page, 'Width:', 216, currentY + textOffsetY);
            textBoldLeft(
              page,
              wallsInBldg[j].label,
              70,
              currentY + textOffsetY,
              84
            );
            textBoldLeft(
              page,
              formatFeetInches(
                state.buildings[i][`${wallsInBldg[j].id}ExtensionWidth`]
              ),
              260,
              currentY + textOffsetY,
              54
            );
            if (wallsInBldg[j].id == 'front' || wallsInBldg[j].id == 'back') {
              textLeft(page, 'Bays:', 316, currentY + textOffsetY);
              textBoldLeft(
                page,
                state.buildings[i][
                  `${wallsInBldg[j].id}ExtensionBays`
                ].toString(),
                356,
                currentY + textOffsetY,
                128
              );
              drawCheckBox(
                page,
                'Add Columns',
                486,
                currentY + textOffsetY,
                state.buildings[i][`${wallsInBldg[j].id}ExtensionColumns`]
              );
            }

            lineThin(page, pageStartX, currentY, pageEndX, currentY);
            currentY -= lineHt;
          }
        }

        textLeft(page, 'Soffit Panels:', 22, currentY + textOffsetY);
        textLeft(page, 'Gauge:', 216, currentY + textOffsetY);
        textLeft(page, 'Finish:', 316, currentY + textOffsetY);
        textLeft(page, 'Color:', 446, currentY + textOffsetY);
        textBoldLeft(
          page,
          soffitPanels.find(
            (item) => item.id === state.buildings[i].soffitPanelType
          ).label,
          90,
          currentY + textOffsetY,
          124
        );
        textBoldLeft(
          page,
          soffitGauge.find(
            (item) => parseInt(item.id) === state.buildings[i].soffitPanelGauge
          ).label,
          260,
          currentY + textOffsetY,
          54
        );
        // textBoldLeft(
        //   page,
        //   soffitFinish.find(
        //     (item) => item.id === state.buildings[i].soffitPanelFinish
        //   ).label,
        //   356,
        //   currentY + textOffsetY,
        //   88
        // );
        textBoldLeft(
          page,
          masterColorList.find(
            (item) => item.id === state.buildings[i].soffitPanelColor
          ).label,
          486,
          currentY + textOffsetY,
          106
        );
        lineThick(page, pageStartX, currentY, pageEndX, currentY);
        currentY -= lineHt;
      }

      /* Roof Liner Panels */
      bldgItems = getItemsByWall(
        state.buildings[i].roofLinerPanels,
        'wall',
        'roof'
      );
      if (bldgItems.length > 0) {
        if (currentY < pageEndY + lineHt * 2) {
          page = addPage(pageTitle, 'Roof' + ' (cont.)');
        }

        addSection(page, currentY);
        textBoldLeft(page, 'LINER PANELS:', 22, currentY + textOffsetY);
        line(page, pageStartX, currentY, pageEndX, currentY);
        currentY -= lineHt;

        for (k = 0; k < bldgItems.length; k++) {
          textLeft(page, 'Start:', 22, currentY + textOffsetY);
          textLeft(page, 'End:', 156, currentY + textOffsetY);
          textBoldLeft(
            page,
            formatFeetInches(bldgItems[k].start),
            70,
            currentY + textOffsetY,
            84
          );
          textBoldLeft(
            page,
            formatFeetInches(bldgItems[k].end),
            200,
            currentY + textOffsetY,
            114
          );

          lineThin(page, pageStartX, currentY, pageEndX, currentY);
          currentY -= lineHt;

          textLeft(page, 'Liner Panels:', 22, currentY + textOffsetY);
          textLeft(page, 'Gauge:', 216, currentY + textOffsetY);
          textLeft(page, 'Finish:', 316, currentY + textOffsetY);
          textLeft(page, 'Color:', 446, currentY + textOffsetY);
          textBoldLeft(
            page,
            soffitPanels.find(
              (item) => item.id === bldgItems[k].roofLinerPanelType
            ).label,
            90,
            currentY + textOffsetY,
            124
          );
          textBoldLeft(
            page,
            soffitGauge.find(
              (item) => parseInt(item.id) === bldgItems[k].roofLinerPanelGauge
            ).label,
            260,
            currentY + textOffsetY,
            54
          );
          // textBoldLeft(
          //   page,
          //   soffitFinish.find(
          //     (item) => item.id === bldgItems[k].roofLinerPanelFinish
          //   ).label,
          //   356,
          //   currentY + textOffsetY,
          //   88
          // );
          textBoldLeft(
            page,
            masterColorList.find(
              (item) => item.id === bldgItems[k].roofLinerPanelColor
            ).label,
            486,
            currentY + textOffsetY,
            106
          );
          if (k + 1 < bldgItems.length) {
            line(page, pageStartX, currentY, pageEndX, currentY);
            currentY -= lineHt;
          }

          if (currentY < pageEndY + lineHt * 1) {
            page = addPage(pageTitle, 'Roof (cont.)', 'LINER PANELS: (cont.)');
          }
        }
        lineThick(page, pageStartX, currentY, pageEndX, currentY);
        currentY -= lineHt;
      }

      /* Roof Relite Panels */
      if (state.buildings[i].roofRelites.length > 0) {
        if (currentY < pageEndY + lineHt * 2) {
          page = addPage(pageTitle, 'Roof (cont.)');
        }

        addSection(page, currentY);
        textBoldLeft(page, 'ROOF RELITES:', 22, currentY + textOffsetY);
        line(page, pageStartX, currentY, pageEndX, currentY);
        currentY -= lineHt;

        for (j = 0; j < wallsInBldg.length; j++) {
          bldgItems = getItemsByWall(
            state.buildings[i].roofRelites,
            'roof',
            wallsInBldg[j].id
          );
          if (bldgItems.length > 0) {
            for (k = 0; k < bldgItems.length; k++) {
              textLeft(page, 'Qty:', 22, currentY + textOffsetY);
              textLeft(page, 'Size:', 156, currentY + textOffsetY);
              textLeft(page, 'Color:', 316, currentY + textOffsetY);
              textBoldLeft(
                page,
                bldgItems[k].qty.toString(),
                70,
                currentY + textOffsetY,
                84
              );
              textBoldLeft(
                page,
                polycarbRoofSize.find((item) => item.id === bldgItems[k].size)
                  .label,
                200,
                currentY + textOffsetY,
                114
              );
              textBoldLeft(
                page,
                polycarbRoofColor.find((item) => item.id === bldgItems[k].color)
                  .label,
                356,
                currentY + textOffsetY,
                236
              );
              if (
                state.buildings[i].shape != 'singleSlope' &&
                state.buildings[i].shape != 'leanTo'
              ) {
                textLeft(page, 'Ridge Side:', 446, currentY + textOffsetY);
                textBoldLeft(
                  page,
                  wallsInBldg[j].label,
                  500,
                  currentY + textOffsetY,
                  92
                );
              }
              lineThin(page, pageStartX, currentY, pageEndX, currentY);
              currentY -= lineHt;

              textLeft(page, 'Location:', 22, currentY + textOffsetY);
              textLeft(page, 'Offset:', 316, currentY + textOffsetY);
              textBoldLeft(
                page,
                formatBaySpacing(bldgItems[k].location),
                70,
                currentY + textOffsetY,
                244
              );
              textBoldLeft(
                page,
                formatFeetInches(bldgItems[k].offset),
                356,
                currentY + textOffsetY,
                128
              );
              drawCheckBox(
                page,
                'Cut Panels',
                486,
                currentY + textOffsetY,
                bldgItems[k].cutPanels
              );
              if (k + 1 < bldgItems.length) {
                line(page, pageStartX, currentY, pageEndX, currentY);
                currentY -= lineHt;
              }

              if (currentY < pageEndY + lineHt * 1) {
                page = addPage(
                  pageTitle,
                  'Roof (cont.)',
                  'ROOF RELITES: (cont.)'
                );
              }
            }
            if (j + 1 < wallsInBldg.length) {
              line(page, pageStartX, currentY, pageEndX, currentY);
            } else {
              lineThick(page, pageStartX, currentY, pageEndX, currentY);
            }
            currentY -= lineHt;
          }
        }
      }

      /* Roof Openings */

      /* Wall Sheets */
      wallsInBldg =
        state.buildings[i].leftFrame == 'insetRF' &&
        state.buildings[i].rightFrame == 'insetRF'
          ? wallsOuterBoth
          : state.buildings[i].leftFrame == 'insetRF'
            ? wallsOuterLeft
            : state.buildings[i].rightFrame == 'insetRF'
              ? wallsOuterRight
              : walls;

      for (j = 0; j < wallsInBldg.length; j++) {
        wallBracingType =
          wallsInBldg[j].id == 'front' || wallsInBldg[j].id == 'back'
            ? SidewallBracingType
            : EndwallBracingType;

        if (currentY < pageEndY + lineHt * 7) {
          page = addPage(pageTitle, wallsInBldg[j].label, '');
        } else {
          currentY -= lineHt;
          textBoldCenter(
            page,
            wallsInBldg[j].label,
            306,
            currentY + textOffsetY
          );
          lineThick(page, pageStartX, currentY, pageEndX, currentY);
          currentY -= lineHt;
        }

        addSection(page, currentY);
        textBoldLeft(page, 'BASIC INFORMATION:', 22, currentY + textOffsetY);
        line(page, pageStartX, currentY, pageEndX, currentY);
        currentY -= lineHt;
        // page = addPage(pageTitle, wallsInBldg[j].label, 'BASIC INFORMATION:');

        textLeft(page, 'Bay Spacing:', 22, currentY + textOffsetY);
        textBoldLeft(
          page,
          formatBaySpacing(
            state.buildings[i][`${wallsInBldg[j].id}BaySpacing`]
          ),
          90,
          currentY + textOffsetY,
          504
        );
        lineThin(page, pageStartX, currentY, pageEndX, currentY);
        currentY -= lineHt;

        textLeft(page, 'Bracing Type:', 22, currentY + textOffsetY);
        textBoldLeft(
          page,
          wallsInBldg[j].id == 'outerLeft' || wallsInBldg[j].id == 'outerRight'
            ? 'None'
            : wallBracingType.find(
                (item) =>
                  item.id ===
                  state.buildings[i][`${wallsInBldg[j].id}BracingType`]
              ).label,
          90,
          currentY + textOffsetY,
          124
        );
        if (
          wallsInBldg[j].id != 'outerLeft' &&
          wallsInBldg[j].id != 'outerRight' &&
          state.buildings[i][`${wallsInBldg[j].id}BracingType`] != 'none'
        ) {
          textLeft(page, 'Braced Bays:', 216, currentY + textOffsetY);
          textBoldLeft(
            page,
            formatBaySelected(
              state.buildings[i][`${wallsInBldg[j].id}BracedBays`]
            ),
            286,
            currentY + textOffsetY,
            306
          );
        }
        lineThin(page, pageStartX, currentY, pageEndX, currentY);
        currentY -= lineHt;

        textLeft(page, 'Girt Type:', 22, currentY + textOffsetY);
        textLeft(page, 'Special Girt Spacing:', 216, currentY + textOffsetY);
        textLeft(page, 'Base:', 446, currentY + textOffsetY);
        textBoldLeft(
          page,
          girtTypes.find(
            (item) =>
              item.id === state.buildings[i][`${wallsInBldg[j].id}GirtType`]
          ).label,
          90,
          currentY + textOffsetY,
          124
        );
        textBoldLeft(
          page,
          girtSpacing.find(
            (item) =>
              item.id === state.buildings[i][`${wallsInBldg[j].id}GirtSpacing`]
          ).label,
          320,
          currentY + textOffsetY,
          124
        );
        textBoldLeft(
          page,
          baseCondition.find(
            (item) =>
              item.id ===
              state.buildings[i][`${wallsInBldg[j].id}BaseCondition`]
          ).label,
          486,
          currentY + textOffsetY,
          106
        );
        lineThin(page, pageStartX, currentY, pageEndX, currentY);
        currentY -= lineHt;

        textLeft(page, 'Wall Panels:', 22, currentY + textOffsetY);
        textLeft(page, 'Gauge:', 216, currentY + textOffsetY);
        textLeft(page, 'Finish:', 316, currentY + textOffsetY);
        textLeft(page, 'Color:', 446, currentY + textOffsetY);
        textBoldLeft(
          page,
          wallPanels.find(
            (item) =>
              item.id ===
              state.buildings[i][`${wallsInBldg[j].id}WallPanelType`]
          ).label,
          90,
          currentY + textOffsetY,
          124
        );
        textBoldLeft(
          page,
          wallGauge.find(
            (item) =>
              parseInt(item.id) ===
              state.buildings[i][`${wallsInBldg[j].id}WallPanelGauge`]
          ).label,
          260,
          currentY + textOffsetY,
          54
        );
        // textBoldLeft(
        //   page,
        //   wallFinish.find(
        //     (item) =>
        //       item.id ===
        //       state.buildings[i][`${wallsInBldg[j].id}WallPanelFinish`]
        //   ).label,
        //   356,
        //   currentY + textOffsetY,
        //   88
        // );
        textBoldLeft(
          page,
          masterColorList.find(
            (item) =>
              item.id ===
              state.buildings[i][`${wallsInBldg[j].id}WallPanelColor`]
          ).label,
          486,
          currentY + textOffsetY,
          106
        );
        lineThin(page, pageStartX, currentY, pageEndX, currentY);
        currentY -= lineHt;

        textLeft(page, 'Insulation:', 22, currentY + textOffsetY);
        textBoldLeft(
          page,
          wallInsulation.find(
            (item) =>
              item.id ===
              state.buildings[i][`${wallsInBldg[j].id}WallInsulation`]
          ).label +
            (state.buildings[i].wallInsulationOthers &&
            state.buildings[i][`${wallsInBldg[j].id}WallInsulation`] != 'none'
              ? ' - By Others'
              : ''),
          90,
          currentY + textOffsetY,
          502
        );

        lineThick(page, pageStartX, currentY, pageEndX, currentY);
        currentY -= lineHt;

        /* Wall Liner Panels */
        bldgItems = getItemsByWall(
          state.buildings[i].wallLinerPanels,
          'wall',
          wallsInBldg[j].id
        );
        if (bldgItems.length > 0) {
          if (currentY < pageEndY + lineHt * 2) {
            page = addPage(pageTitle, wallsInBldg[j].label + ' (cont.)');
          }

          addSection(page, currentY);
          textBoldLeft(page, 'LINER PANELS:', 22, currentY + textOffsetY);
          line(page, pageStartX, currentY, pageEndX, currentY);
          currentY -= lineHt;

          for (k = 0; k < bldgItems.length; k++) {
            textLeft(page, 'Start:', 22, currentY + textOffsetY);
            textLeft(page, 'End:', 156, currentY + textOffsetY);
            textLeft(page, 'Height:', 316, currentY + textOffsetY);
            textBoldLeft(
              page,
              formatFeetInches(bldgItems[k].start),
              70,
              currentY + textOffsetY,
              84
            );
            textBoldLeft(
              page,
              formatFeetInches(bldgItems[k].end),
              200,
              currentY + textOffsetY,
              114
            );
            textBoldLeft(
              page,
              bldgItems[k].height > 0
                ? formatFeetInches(bldgItems[k].height)
                : 'Full Height',
              356,
              currentY + textOffsetY,
              236
            );
            lineThin(page, pageStartX, currentY, pageEndX, currentY);
            currentY -= lineHt;

            textLeft(page, 'Liner Panels:', 22, currentY + textOffsetY);
            textLeft(page, 'Gauge:', 216, currentY + textOffsetY);
            textLeft(page, 'Finish:', 316, currentY + textOffsetY);
            textLeft(page, 'Color:', 446, currentY + textOffsetY);
            textBoldLeft(
              page,
              wallPanels.find(
                (item) => item.id === bldgItems[k].wallLinerPanelType
              ).label,
              90,
              currentY + textOffsetY,
              124
            );
            textBoldLeft(
              page,
              wallGauge.find(
                (item) => parseInt(item.id) === bldgItems[k].wallLinerPanelGauge
              ).label,
              260,
              currentY + textOffsetY,
              54
            );
            // textBoldLeft(
            //   page,
            //   wallFinish.find(
            //     (item) => item.id === bldgItems[k].wallLinerPanelFinish
            //   ).label,
            //   356,
            //   currentY + textOffsetY,
            //   88
            // );
            textBoldLeft(
              page,
              masterColorList.find(
                (item) => item.id === bldgItems[k].wallLinerPanelColor
              ).label,
              486,
              currentY + textOffsetY,
              106
            );
            if (k + 1 < bldgItems.length) {
              line(page, pageStartX, currentY, pageEndX, currentY);
              currentY -= lineHt;
            }

            if (currentY < pageEndY + lineHt * 1) {
              page = addPage(
                pageTitle,
                wallsInBldg[j].label + ' (cont.)',
                'LINER PANELS: (cont.)'
              );
            }
          }
          lineThick(page, pageStartX, currentY, pageEndX, currentY);
          currentY -= lineHt;
        }

        /* Canopies */
        bldgItems = getItemsByWall(
          state.buildings[i].canopies,
          'wall',
          wallsInBldg[j].id
        );
        if (bldgItems.length > 0) {
          addSection(page, currentY);
          textBoldLeft(page, 'CANOPIES:', 22, currentY + textOffsetY);
          line(page, pageStartX, currentY, pageEndX, currentY);
          currentY -= lineHt;

          for (k = 0; k < bldgItems.length; k++) {
            if (currentY < pageEndY + lineHt * 4) {
              page = addPage(pageTitle, wallsInBldg[j].label + ' (cont.)');
            }

            textLeft(page, 'Width:', 22, currentY + textOffsetY);
            textLeft(page, 'Slope:', 156, currentY + textOffsetY);
            textBoldLeft(
              page,
              formatFeetInches(bldgItems[k].width),
              70,
              currentY + textOffsetY,
              84
            );
            textBoldLeft(
              page,
              bldgItems[k].slope + ':12',
              200,
              currentY + textOffsetY,
              284
            );
            drawCheckBox(
              page,
              'Add Columns',
              486,
              currentY + textOffsetY,
              bldgItems[k].addColumns
            );
            lineThin(page, pageStartX, currentY, pageEndX, currentY);
            currentY -= lineHt;

            textLeft(page, 'Start Bay:', 22, currentY + textOffsetY);
            textLeft(page, 'End Bay:', 156, currentY + textOffsetY);
            textLeft(page, 'Height:', 316, currentY + textOffsetY);
            textBoldLeft(
              page,
              bldgItems[k].startBay.toString(),
              70,
              currentY + textOffsetY,
              84
            );
            textBoldLeft(
              page,
              bldgItems[k].endBay.toString(),
              200,
              currentY + textOffsetY,
              114
            );
            textBoldLeft(
              page,
              formatFeetInches(bldgItems[k].elevation),
              356,
              currentY + textOffsetY,
              236
            );
            lineThin(page, pageStartX, currentY, pageEndX, currentY);
            currentY -= lineHt;

            textLeft(page, 'Roof Panels:', 22, currentY + textOffsetY);
            textLeft(page, 'Gauge:', 216, currentY + textOffsetY);
            textLeft(page, 'Finish:', 316, currentY + textOffsetY);
            textLeft(page, 'Color:', 446, currentY + textOffsetY);
            textBoldLeft(
              page,
              roofPanels.find(
                (item) => item.id === bldgItems[k].canopyRoofPanelType
              ).label,
              90,
              currentY + textOffsetY,
              124
            );
            textBoldLeft(
              page,
              roofGauge.find(
                (item) =>
                  parseInt(item.id) === bldgItems[k].canopyRoofPanelGauge
              ).label,
              260,
              currentY + textOffsetY,
              54
            );
            // textBoldLeft(
            //   page,
            //   roofFinish.find(
            //     (item) => item.id === bldgItems[k].canopyRoofPanelFinish
            //   ).label,
            //   356,
            //   currentY + textOffsetY,
            //   88
            // );
            textBoldLeft(
              page,
              masterColorList.find(
                (item) => item.id === bldgItems[k].canopyRoofPanelColor
              ).label,
              486,
              currentY + textOffsetY,
              106
            );
            lineThin(page, pageStartX, currentY, pageEndX, currentY);
            currentY -= lineHt;

            textLeft(page, 'Soffit Panels:', 22, currentY + textOffsetY);
            textLeft(page, 'Gauge:', 216, currentY + textOffsetY);
            textLeft(page, 'Finish:', 316, currentY + textOffsetY);
            textLeft(page, 'Color:', 446, currentY + textOffsetY);
            textBoldLeft(
              page,
              soffitPanels.find(
                (item) => item.id === bldgItems[k].canopySoffitPanelType
              ).label,
              90,
              currentY + textOffsetY,
              124
            );
            textBoldLeft(
              page,
              soffitGauge.find(
                (item) =>
                  parseInt(item.id) === bldgItems[k].canopySoffitPanelGauge
              ).label,
              260,
              currentY + textOffsetY,
              54
            );
            // textBoldLeft(
            //   page,
            //   soffitFinish.find(
            //     (item) => item.id === bldgItems[k].canopySoffitPanelFinish
            //   ).label,
            //   356,
            //   currentY + textOffsetY,
            //   88
            // );
            textBoldLeft(
              page,
              masterColorList.find(
                (item) => item.id === bldgItems[k].canopySoffitPanelColor
              ).label,
              486,
              currentY + textOffsetY,
              106
            );
            if (k + 1 < bldgItems.length) {
              line(page, pageStartX, currentY, pageEndX, currentY);
              currentY -= lineHt;
            }

            if (currentY < pageEndY + lineHt * 3) {
              page = addPage(
                pageTitle,
                wallsInBldg[j].label + ' (cont.)',
                'CANOPIES: (cont.)'
              );
            }
          }
          lineThick(page, pageStartX, currentY, pageEndX, currentY);
          currentY -= lineHt;
        }

        /* Partial Walls */
        bldgItems = getItemsByWall(
          state.buildings[i].partialWalls,
          'wall',
          wallsInBldg[j].id
        );
        if (bldgItems.length > 0) {
          if (currentY < pageEndY + lineHt * 1) {
            page = addPage(pageTitle, wallsInBldg[j].label + ' (cont.)');
          }

          addSection(page, currentY);
          textBoldLeft(page, 'PARTIAL WALLS:', 22, currentY + textOffsetY);
          line(page, pageStartX, currentY, pageEndX, currentY);
          currentY -= lineHt;

          for (k = 0; k < bldgItems.length; k++) {
            textLeft(page, 'Start:', 22, currentY + textOffsetY);
            textLeft(page, 'End:', 156, currentY + textOffsetY);
            textLeft(page, 'Height:', 316, currentY + textOffsetY);
            textLeft(page, 'Top of Wall:', 446, currentY + textOffsetY);
            textBoldLeft(
              page,
              formatFeetInches(bldgItems[k].start),
              70,
              currentY + textOffsetY,
              84
            );
            textBoldLeft(
              page,
              formatFeetInches(bldgItems[k].end),
              200,
              currentY + textOffsetY,
              114
            );
            textBoldLeft(
              page,
              bldgItems[k].height > 0
                ? formatFeetInches(bldgItems[k].height)
                : 'Full Height',
              356,
              currentY + textOffsetY,
              88
            );
            textBoldLeft(
              page,
              topOfWall.find((item) => item.id === bldgItems[k].topOfWall)
                .label,
              504,
              currentY + textOffsetY,
              88
            );
            if (k + 1 < bldgItems.length) {
              line(page, pageStartX, currentY, pageEndX, currentY);
              currentY -= lineHt;
            }

            if (currentY < pageEndY + lineHt * 0) {
              page = addPage(
                pageTitle,
                wallsInBldg[j].label + ' (cont.)',
                'PARTIAL WALLS: (cont.)'
              );
            }
          }
          lineThick(page, pageStartX, currentY, pageEndX, currentY);
          currentY -= lineHt;
        }

        /* Wall Skirts */
        bldgItems = getItemsByWall(
          state.buildings[i].wallSkirts,
          'wall',
          wallsInBldg[j].id
        );
        if (bldgItems.length > 0) {
          if (currentY < pageEndY + lineHt * 1) {
            page = addPage(pageTitle, wallsInBldg[j].label + ' (cont.)');
          }

          addSection(page, currentY);
          textBoldLeft(page, 'WALL SKIRTS:', 22, currentY + textOffsetY);
          line(page, pageStartX, currentY, pageEndX, currentY);
          currentY -= lineHt;

          for (k = 0; k < bldgItems.length; k++) {
            textLeft(page, 'Start Bay:', 22, currentY + textOffsetY);
            textLeft(page, 'End Bay:', 156, currentY + textOffsetY);
            textLeft(page, 'Height:', 316, currentY + textOffsetY);
            textBoldLeft(
              page,
              bldgItems[k].startBay.toString(),
              70,
              currentY + textOffsetY,
              84
            );
            textBoldLeft(
              page,
              bldgItems[k].endBay.toString(),
              200,
              currentY + textOffsetY,
              114
            );
            textBoldLeft(
              page,
              formatFeetInches(bldgItems[k].height),
              356,
              currentY + textOffsetY,
              128
            );
            drawCheckBox(
              page,
              'Cut Columns',
              486,
              currentY + textOffsetY,
              bldgItems[k].cutColumns
            );
            if (k + 1 < bldgItems.length) {
              line(page, pageStartX, currentY, pageEndX, currentY);
              currentY -= lineHt;
            }

            if (currentY < pageEndY + lineHt * 0) {
              page = addPage(
                pageTitle,
                wallsInBldg[j].label + ' (cont.)',
                'WALL SKIRTS: (cont.)'
              );
            }
          }
          lineThick(page, pageStartX, currentY, pageEndX, currentY);
          currentY -= lineHt;
        }

        /* Wainscots */
        bldgItems = getItemsByWall(
          state.buildings[i].wainscots,
          'wall',
          wallsInBldg[j].id
        );
        if (bldgItems.length > 0) {
          if (currentY < pageEndY + lineHt * 2) {
            page = addPage(pageTitle, wallsInBldg[j].label + ' (cont.)');
          }

          addSection(page, currentY);
          textBoldLeft(page, 'WAINSCOT PANELS:', 22, currentY + textOffsetY);
          line(page, pageStartX, currentY, pageEndX, currentY);
          currentY -= lineHt;

          for (k = 0; k < bldgItems.length; k++) {
            textLeft(page, 'Start:', 22, currentY + textOffsetY);
            textLeft(page, 'End:', 156, currentY + textOffsetY);
            textLeft(page, 'Height:', 316, currentY + textOffsetY);
            textLeft(page, 'Lap Option:', 446, currentY + textOffsetY);
            textBoldLeft(
              page,
              formatFeetInches(bldgItems[k].start),
              70,
              currentY + textOffsetY,
              84
            );
            textBoldLeft(
              page,
              formatFeetInches(bldgItems[k].end),
              200,
              currentY + textOffsetY,
              114
            );
            textBoldLeft(
              page,
              formatFeetInches(bldgItems[k].height),
              356,
              currentY + textOffsetY,
              88
            );
            textBoldLeft(
              page,
              panelOptions.find((item) => item.id === bldgItems[k].panelOption)
                .label,
              504,
              currentY + textOffsetY,
              88
            );
            lineThin(page, pageStartX, currentY, pageEndX, currentY);
            currentY -= lineHt;

            textLeft(page, 'Wall Panels:', 22, currentY + textOffsetY);
            textLeft(page, 'Gauge:', 216, currentY + textOffsetY);
            textLeft(page, 'Finish:', 316, currentY + textOffsetY);
            textLeft(page, 'Color:', 446, currentY + textOffsetY);
            textBoldLeft(
              page,
              wallPanels.find(
                (item) => item.id === bldgItems[k].wainscotPanelType
              ).label,
              90,
              currentY + textOffsetY,
              124
            );
            textBoldLeft(
              page,
              wallGauge.find(
                (item) => parseInt(item.id) === bldgItems[k].wainscotPanelGauge
              ).label,
              260,
              currentY + textOffsetY,
              54
            );
            // textBoldLeft(
            //   page,
            //   wallFinish.find(
            //     (item) => item.id === bldgItems[k].wainscotPanelFinish
            //   ).label,
            //   356,
            //   currentY + textOffsetY,
            //   88
            // );
            textBoldLeft(
              page,
              masterColorList.find(
                (item) => item.id === bldgItems[k].wainscotPanelColor
              ).label,
              486,
              currentY + textOffsetY,
              106
            );
            if (k + 1 < bldgItems.length) {
              line(page, pageStartX, currentY, pageEndX, currentY);
              currentY -= lineHt;
            }

            if (currentY < pageEndY + lineHt * 1) {
              page = addPage(
                pageTitle,
                wallsInBldg[j].label + ' (cont.)',
                'WAINSCOT PANELS: (cont.)'
              );
            }
          }
          lineThick(page, pageStartX, currentY, pageEndX, currentY);
          currentY -= lineHt;
        }

        /* Wall Relite Panels */
        bldgItems = getItemsByWall(
          state.buildings[i].wallRelites,
          'wall',
          wallsInBldg[j].id
        );
        if (bldgItems.length > 0) {
          if (currentY < pageEndY + lineHt * 2) {
            page = addPage(pageTitle, wallsInBldg[j].label + ' (cont.)');
          }

          addSection(page, currentY);
          textBoldLeft(page, 'WALL RELITES:', 22, currentY + textOffsetY);
          line(page, pageStartX, currentY, pageEndX, currentY);
          currentY -= lineHt;

          for (k = 0; k < bldgItems.length; k++) {
            textLeft(page, 'Qty:', 22, currentY + textOffsetY);
            textLeft(page, 'Size:', 156, currentY + textOffsetY);
            textLeft(page, 'Color:', 316, currentY + textOffsetY);
            textBoldLeft(
              page,
              bldgItems[k].qty.toString(),
              70,
              currentY + textOffsetY,
              84
            );
            textBoldLeft(
              page,
              polycarbWallSize.find((item) => item.id === bldgItems[k].size)
                .label,
              200,
              currentY + textOffsetY,
              114
            );
            textBoldLeft(
              page,
              polycarbWallColor.find((item) => item.id === bldgItems[k].color)
                .label,
              356,
              currentY + textOffsetY,
              236
            );
            lineThin(page, pageStartX, currentY, pageEndX, currentY);
            currentY -= lineHt;

            textLeft(page, 'Location:', 22, currentY + textOffsetY);
            textLeft(page, 'Offset:', 316, currentY + textOffsetY);
            textBoldLeft(
              page,
              formatBaySpacing(bldgItems[k].location),
              70,
              currentY + textOffsetY,
              244
            );
            textBoldLeft(
              page,
              formatFeetInches(bldgItems[k].offset),
              356,
              currentY + textOffsetY,
              128
            );
            drawCheckBox(
              page,
              'Cut Panels',
              486,
              currentY + textOffsetY,
              bldgItems[k].cutPanels
            );
            if (k + 1 < bldgItems.length) {
              line(page, pageStartX, currentY, pageEndX, currentY);
              currentY -= lineHt;
            }

            if (currentY < pageEndY + lineHt * 1) {
              page = addPage(
                pageTitle,
                wallsInBldg[j].label + ' (cont.)',
                'WALL RELITES: (cont.)'
              );
            }
          }
          lineThick(page, pageStartX, currentY, pageEndX, currentY);
          currentY -= lineHt;
        }

        /* Openings */
        if (
          wallsInBldg[j].id != 'outerLeft' &&
          wallsInBldg[j].id != 'outerRight'
        ) {
          //THIS IS TEMP
          if (state.buildings[i].openings[`${wallsInBldg[j].id}`].length > 0) {
            if (currentY < pageEndY + lineHt * 2) {
              page = addPage(pageTitle, wallsInBldg[j].label + ' (cont.)');
            }

            addSection(page, currentY);
            textBoldLeft(page, 'FRAMED OPENINGS:', 22, currentY + textOffsetY);
            line(page, pageStartX, currentY, pageEndX, currentY);
            currentY -= lineHt;

            textLeft(page, 'Bay:', 32, currentY + textOffsetY);
            textLeft(page, 'Type:', 80, currentY + textOffsetY);
            textLeft(page, 'Offset:', 228, currentY + textOffsetY);
            textLeft(page, 'Width:', 316, currentY + textOffsetY);
            textLeft(page, 'Height:', 404, currentY + textOffsetY);
            textLeft(page, 'Sill:', 492, currentY + textOffsetY);
            lineThin(page, pageStartX + 12, currentY, pageEndX - 12, currentY);
            currentY -= lineHt;

            for (
              k = 0;
              k < state.buildings[i].openings[`${wallsInBldg[j].id}`].length;
              k++
            ) {
              textBoldLeft(
                page,
                state.buildings[i].openings[`${wallsInBldg[j].id}`][
                  k
                ].bay.toString(),
                38,
                currentY + textOffsetY,
                40
              );
              textBoldLeft(
                page,
                openingTypes.find(
                  (item) =>
                    item.id ===
                    state.buildings[i].openings[`${wallsInBldg[j].id}`][k]
                      .openType
                ).label,
                80,
                currentY + textOffsetY,
                146
              );
              if (
                state.buildings[i].openings[`${wallsInBldg[j].id}`][k]
                  .openType != 'openbay'
              ) {
                textBoldLeft(
                  page,
                  formatFeetInches(
                    state.buildings[i].openings[`${wallsInBldg[j].id}`][k]
                      .offset
                  ),
                  228,
                  currentY + textOffsetY,
                  86
                );
                textBoldLeft(
                  page,
                  formatFeetInches(
                    state.buildings[i].openings[`${wallsInBldg[j].id}`][k].width
                  ),
                  316,
                  currentY + textOffsetY,
                  86
                );
                textBoldLeft(
                  page,
                  formatFeetInches(
                    state.buildings[i].openings[`${wallsInBldg[j].id}`][k]
                      .height
                  ),
                  404,
                  currentY + textOffsetY,
                  86
                );
                textBoldLeft(
                  page,
                  state.buildings[i].openings[`${wallsInBldg[j].id}`][k].sill >
                    0 ||
                    state.buildings[i].openings[`${wallsInBldg[j].id}`][k]
                      .openType == 'window' ||
                    state.buildings[i].openings[`${wallsInBldg[j].id}`][k]
                      .openType == 'commericalwindow' ||
                    state.buildings[i].openings[`${wallsInBldg[j].id}`][k]
                      .openType == 'louver'
                    ? formatFeetInches(
                        state.buildings[i].openings[`${wallsInBldg[j].id}`][k]
                          .sill
                      )
                    : '',
                  492,
                  currentY + textOffsetY,
                  86
                );
              }
              if (
                k + 1 <
                state.buildings[i].openings[`${wallsInBldg[j].id}`].length
              ) {
                lineThin(
                  page,
                  pageStartX + 12,
                  currentY,
                  pageEndX - 12,
                  currentY
                );
                currentY -= lineHt;
              }

              if (currentY < pageEndY + lineHt * 0) {
                page = addPage(
                  pageTitle,
                  wallsInBldg[j].label + ' (cont.)',
                  'FRAMED OPENINGS: (cont.)'
                );

                textLeft(page, 'Bay:', 32, currentY + textOffsetY);
                textLeft(page, 'Type:', 80, currentY + textOffsetY);
                textLeft(page, 'Offset:', 228, currentY + textOffsetY);
                textLeft(page, 'Width:', 316, currentY + textOffsetY);
                textLeft(page, 'Height:', 404, currentY + textOffsetY);
                textLeft(page, 'Sill:', 492, currentY + textOffsetY);
                lineThin(
                  page,
                  pageStartX + 12,
                  currentY,
                  pageEndX - 12,
                  currentY
                );
                currentY -= lineHt;
              }
            }
            lineThick(page, pageStartX, currentY, pageEndX, currentY);
            currentY -= lineHt;
          }
        } //THIS IS TEMP
      }

      bldgPageNums[i].pageEnd = currentPage + 1; //On current page
    }

    /* Add Terms and Conditions */
    if (terms?.length > 0) {
      page = addPage('TERMS AND CONDITIONS', '');
      terms.map((terms) => {
        addSection(page, currentY);
        textBoldLeft(page, terms.Title, 22, currentY + textOffsetY);
        line(page, pageStartX, currentY, pageEndX, currentY);
        currentY -= lineHt;

        let lines = wrapText(terms.Term, 566, stdFont, smallFont);
        let numLines = 0;
        for (const line of lines) {
          page.drawText(line, {
            x: 22,
            y: currentY + textOffsetY,
            size: smallFont,
            font: stdFont,
          });
          numLines++;
          currentY -= termsLineHt;

          if (currentY < pageEndY) {
            page = addPage(
              'TERMS AND CONDITIONS',
              '',
              terms.Title + ' (cont.)'
            );
            numLines = 0;
          }
        }

        currentY +=
          Math.ceil((numLines * (lineHt - termsLineHt)) / lineHt) * lineHt -
          numLines * (lineHt - termsLineHt);

        lineThick(page, pageStartX, currentY, pageEndX, currentY);
        currentY -= lineHt;
      });
    }

    /* Add Date, Footer, & Page Numbers to each page */
    pages = pdfDoc.getPages();
    if (pages.length > 0) {
      textBoldCenter(pages[0], 'TOTAL PAGES: ' + pages.length, 306, 762.5);

      if (state.buildings.length > 1) {
        for (i = 0; i < bldgPageNums.length; i++) {
          if (bldgPageNums[i].pageStart == bldgPageNums[i].pageEnd) {
            textSmallBoldLeft(
              pages[bldgPageNums[i].currentPage],
              'Information for Building ' +
                String.fromCharCode(i + 65) +
                ' is found on page ' +
                bldgPageNums[i].pageStart,
              90,
              bldgPageNums[i].currentLine + textOffsetY
            );
          } else {
            textSmallBoldLeft(
              pages[bldgPageNums[i].currentPage],
              'Information for Building ' +
                String.fromCharCode(i + 65) +
                ' is found on pages ' +
                bldgPageNums[i].pageStart +
                ' to ' +
                bldgPageNums[i].pageEnd,
              90,
              bldgPageNums[i].currentLine + textOffsetY
            );
          }
        }
      }

      for (i = 0; i < pages.length; i++) {
        textBoldRight(pages[i], 'Date: ' + today, 588, 762.5);
        textSmallLeft(pages[i], 'Quote# ' + quoteNum, 24, 21.5);
        textSmallCenter(pages[i], companyName, 306, 21.5);
        textSmallRight(
          pages[i],
          'Page ' + (i + 1) + ' of ' + pages.length,
          588,
          21.5
        );
      }
    }

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  }, []);

  return {
    createContract,
  };
}
