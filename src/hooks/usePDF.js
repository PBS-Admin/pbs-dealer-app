// import { useSession } from 'next-auth/react';
import { useState, useCallback } from 'react';
import { PDFDocument, PageSizes, StandardFonts } from 'pdf-lib';
// import fs from 'fs/promises';
import Image from 'next/image';
import logo from '../../public/images/pbslogo.png';
import {
  shapes,
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
  polycarbRoofSize,
  polycarbRoofColor,
  polycarbWallSize,
  polycarbWallColor,
  roofInsulation,
  wallInsulation,
  hangarDoorInsulation,
  openingTypes,
  walls,
  wallsOuterLeft,
  wallsOuterRight,
  wallsOuterBoth,
} from '../util/dropdownOptions';

export function usePDF() {
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

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

  const getItemsByWall = (items, key, value) => {
    const foundItems = items.filter((wall) => wall[key] === value);
    return foundItems ? foundItems : null;
  };

  const createContract = useCallback(async (values) => {
    const pdfDoc = await PDFDocument.create();
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
    const stdFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    let pages = pdfDoc.getPages();
    let currentPage = -1;
    let pageTitle = '';
    let bldgPageNums = Array.from(Array(values.buildings.length), () => {
      return { currentPage: 0, currentLine: 0, pageStart: 0, pageEnd: 0 };
    });
    let bldgItems = [];

    const largeFont = 12;
    const stdFontSize = 10;
    const smallFont = 8;
    const thinLine = 0.075;
    const stdLine = 0.75;
    const thickLine = 1.44;

    const lineHt = 12.5;
    const textOffsetY = 2.625;
    const pageStartX = 18; //left margin
    const pageEndX = 594; //right margin
    const pageStartY = 758.5; //top margin
    const pageEndY = 33.5; //bottom margin
    let startY = pageStartY;
    let currentY = startY;
    let wallsInBldg = [];
    let wallBracingType = [];
    let i = 0;
    let j = 0;
    let k = 0;

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
        bldg.openings.left.length > 0 ||
        bldg.openings.right.length > 0
      ) {
        items.push('Framed Openings');
      }

      return items;
    };

    // Add Main Page
    let page = addPage('QUOTE / CONTRACT', '');

    const quoteNum =
      values.quoteNumber +
      (values.revNumber > 0 ? ' R' + values.revNumber : '');

    /* Company Information */
    const logoUrl = 'https://pdf-lib.js.org/assets/cat_riding_unicorn.jpg';
    // const logoUrl = 'https://tools.pbsbuildings.com/files/PBS-Logo.jpg';
    const logoBytes = await fetch(logoUrl).then((res) => res.arrayBuffer());

    // const logoBytes = await fs.readFile(logo);

    const logoImage = await pdfDoc.embedJpg(logoBytes);
    // const logoImage = await pdfDoc.embedPng(logoBytes);

    const companyName = 'Pacific Building Systems';
    const companyText0 = '2100 N Pacific Hwy';
    const companyText1 = 'Woodburn, OR 97071';
    const companyText2 = 'www.pbsbuildings.com';
    const companyText3 = '503-981-9581';
    const companyText4 = '';
    const companyText5 = '';
    const companyText6 = '';
    const companyText7 = '';

    page.drawImage(logoImage, {
      x: 22,
      y: 700,
      width: 120,
      height: 54,
    });
    textCenter(page, companyText0, 202, 742.375, 118);
    textCenter(page, companyText1, 202, 729.875, 118);
    textCenter(page, companyText2, 202, 717.375, 118);
    textCenter(page, companyText3, 202, 704.875, 118);

    textCenter(page, companyText4, 326, 742.375, 118);
    textCenter(page, companyText5, 326, 729.875, 118);
    textCenter(page, companyText6, 326, 717.375, 118);
    textCenter(page, companyText7, 326, 704.875, 118);

    textLargeLeft(page, 'Job Number:', 394, 736.125);
    textLeft(page, 'Quote Number:', 394, 720.5);
    textLeft(page, 'Salesperson:', 394, 704.875);

    textLargeBoldLeft(page, '', 470, 736.125, 120);
    textBoldLeft(page, quoteNum, 470, 720.5, 120);
    textBoldLeft(page, '', 470, 704.875, 120);

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
    textBoldLeft(page, values.customerName, 72, currentY + textOffsetY, 232);
    textBoldLeft(page, values.projectName, 376, currentY + textOffsetY, 216);
    lineThin(page, pageStartX, currentY, pageEndX, currentY);
    currentY -= lineHt;

    textLeft(page, 'Contact:', 22, currentY + textOffsetY);
    textLeft(page, 'Project For:', 310, currentY + textOffsetY);
    textBoldLeft(page, values.contactName, 72, currentY + textOffsetY, 232);
    textBoldLeft(page, values.projectFor, 376, currentY + textOffsetY, 216);
    lineThin(page, pageStartX, currentY, pageEndX, currentY);
    currentY -= lineHt;

    textLeft(page, 'Address:', 22, currentY + textOffsetY);
    textLeft(page, 'Address:', 310, currentY + textOffsetY);
    textBoldLeft(page, values.customerAddress, 72, currentY + textOffsetY, 232);
    textBoldLeft(page, values.projectAddress, 376, currentY + textOffsetY, 216);
    lineThin(page, pageStartX, currentY, pageEndX, currentY);
    currentY -= lineHt;

    textLeft(page, 'City:', 22, currentY + textOffsetY);
    textLeft(page, 'State:', 171, currentY + textOffsetY);
    textLeft(page, 'Zip:', 234, currentY + textOffsetY);
    textLeft(page, 'City:', 310, currentY + textOffsetY);
    textLeft(page, 'State:', 459, currentY + textOffsetY);
    textLeft(page, 'Zip:', 522, currentY + textOffsetY);
    textBoldLeft(page, values.customerCity, 58, currentY + textOffsetY, 111);
    textBoldLeft(page, values.customerState, 204, currentY + textOffsetY, 28);
    textBoldLeft(page, values.customerZip, 256, currentY + textOffsetY, 48);
    textBoldLeft(page, values.projectCity, 346, currentY + textOffsetY, 111);
    textBoldLeft(page, values.projectState, 492, currentY + textOffsetY, 28);
    textBoldLeft(page, values.projectZip, 544, currentY + textOffsetY, 48);
    lineThin(page, pageStartX, currentY, pageEndX, currentY);
    currentY -= lineHt;

    textLeft(page, 'Phone:', 22, currentY + textOffsetY);
    textLeft(page, 'Fax:', 164, currentY + textOffsetY);
    textLeft(page, 'County:', 310, currentY + textOffsetY);
    textBoldLeft(page, values.customerPhone, 58, currentY + textOffsetY, 104);
    textBoldLeft(page, values.customerFax, 200, currentY + textOffsetY, 104);
    textBoldLeft(page, values.projectCounty, 346, currentY + textOffsetY, 246);
    lineThin(page, pageStartX, currentY, pageEndX, currentY);
    currentY -= lineHt;

    textLeft(page, 'Cell:', 22, currentY + textOffsetY);
    textLeft(page, 'Email:', 164, currentY + textOffsetY);
    textBoldLeft(page, values.customerCell, 58, currentY + textOffsetY, 104);
    textBoldLeft(page, values.customerEmail, 200, currentY + textOffsetY, 104);
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
      buildingCodes.find((item) => item.id === values.buildingCode).label,
      178,
      currentY + textOffsetY,
      248
    );
    textBoldLeft(
      page,
      riskCategories.find((item) => item.id === values.riskCategory).label,
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
      values.collateralLoad + ' psf',
      178,
      currentY + textOffsetY,
      86
    );
    textBoldLeft(
      page,
      values.liveLoad + ' psf',
      330,
      currentY + textOffsetY,
      96
    );
    textBoldLeft(
      page,
      values.deadLoad + ' psf',
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
      values.windLoad + ' mph',
      178,
      currentY + textOffsetY,
      86
    );
    textBoldLeft(page, values.exposure, 330, currentY + textOffsetY, 96);
    textBoldLeft(
      page,
      enclosure.find((item) => item.id === values.windEnclosure).label,
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
      values.groundSnowLoad + ' psf',
      178,
      currentY + textOffsetY,
      86
    );
    textBoldLeft(
      page,
      values.roofSnowLoad + ' psf',
      330,
      currentY + textOffsetY,
      96
    );
    textBoldLeft(
      page,
      thermalFactor.find((item) => item.id === values.thermalFactor).label,
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
    textBoldLeft(page, values.seismicCategory, 228, currentY + textOffsetY, 36);
    textBoldLeft(
      page,
      values.seismicSs.toString(),
      292,
      currentY + textOffsetY,
      48
    );
    textBoldLeft(
      page,
      values.seismicS1.toString(),
      374,
      currentY + textOffsetY,
      48
    );
    textBoldLeft(
      page,
      values.seismicSms.toString(),
      460,
      currentY + textOffsetY,
      48
    );
    textBoldLeft(
      page,
      values.seismicSm1.toString(),
      542,
      currentY + textOffsetY,
      48
    );
    lineThick(page, pageStartX, currentY, pageEndX, currentY);
    line(page, 100, startY - lineHt, 100, currentY);
    startY = currentY;

    /* Building Layout */
    for (i = 0; i < values.buildings.length; i++) {
      bldgItems = whatInBldg(values.buildings[i]);
      // Add to next page if section does not fit on page
      if (startY < pageEndY + lineHt * (6 + Math.ceil(bldgItems.length / 3))) {
        page = addPage('', 'Project Definition (cont.)');
      }

      currentY = startY - lineHt;
      addSection(page, currentY);
      if (values.buildings.length > 1) {
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
        shapes.find((item) => item.id === values.buildings[i].shape).label,
        96,
        currentY + textOffsetY,
        232
      );
      if (values.buildings[i].shape == 'nonSymmetrical') {
        textLeft(page, 'Peak Offset:', 404, currentY + textOffsetY);
        textBoldLeft(
          page,
          formatFeetInches(values.buildings[i].backPeakOffset),
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
        formatFeetInches(values.buildings[i].width),
        60,
        currentY + textOffsetY,
        54
      );
      textBoldLeft(
        page,
        formatFeetInches(values.buildings[i].length),
        156,
        currentY + textOffsetY,
        54
      );
      textBoldLeft(
        page,
        formatFeetInches(values.buildings[i].backEaveHeight),
        348,
        currentY + textOffsetY,
        54
      );
      textBoldLeft(
        page,
        formatFeetInches(values.buildings[i].frontEaveHeight),
        538,
        currentY + textOffsetY,
        54
      );
      lineThin(page, pageStartX, currentY, pageEndX, currentY);
      currentY -= lineHt;

      textLeft(page, 'Back Roof Pitch:', 22, currentY + textOffsetY);
      textBoldLeft(
        page,
        values.buildings[i].backRoofPitch + ':12',
        106,
        currentY + textOffsetY,
        108
      );
      if (values.buildings[i].shape == 'nonSymmetrical') {
        textLeft(page, 'Front Roof Pitch:', 216, currentY + textOffsetY);
        textBoldLeft(
          page,
          values.buildings[i].frontRoofPitch + ':12',
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
            (values.buildings[i].rotation > 0
              ? 'rotated ' + values.buildings[i].rotation + '° & '
              : '') +
            'moved ' +
            (values.buildings[i].offsetX != 0
              ? (values.buildings[i].offsetX < 0 ? 'left ' : 'right ') +
                formatFeetInches(Math.abs(values.buildings[i].offsetX))
              : '') +
            (values.buildings[i].offsetX != 0 &&
            values.buildings[i].offsetY != 0
              ? ' & '
              : '') +
            (values.buildings[i].offsetY != 0
              ? (values.buildings[i].offsetY < 0 ? 'down ' : 'up ') +
                formatFeetInches(Math.abs(values.buildings[i].offsetY))
              : ''),
          68,
          currentY + textOffsetY,
          334
        );
        textBoldLeft(
          page,
          values.buildings[i].commanWall + '',
          476,
          currentY + textOffsetY,
          116
        );
      }

      if (values.buildings.length > 1) {
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

    // if (startY < pageEndY + lineHt * (6 + Math.ceil(bldgItems.length / 3))) {
    //   page = addPage('', 'Project Definition )cont.)');
    // }

    /* Each Building */
    for (i = 0; i < values.buildings.length; i++) {
      bldgPageNums[i].pageStart = currentPage + 2; //Still on the previous page
      pageTitle =
        values.buildings.length > 1
          ? 'Building ' + String.fromCharCode(i + 65)
          : '';

      /* Wall Sheets */
      wallsInBldg =
        values.buildings[i].leftFrame == 'insetRF' &&
        values.buildings[i].rightFrame == 'insetRF'
          ? wallsOuterBoth
          : values.buildings[i].leftFrame == 'insetRF'
            ? wallsOuterLeft
            : values.buildings[i].rightFrame == 'insetRF'
              ? wallsOuterRight
              : walls;

      for (j = 0; j < wallsInBldg.length; j++) {
        wallBracingType =
          wallsInBldg[j].id == 'front' || wallsInBldg[j].id == 'back'
            ? SidewallBracingType
            : EndwallBracingType;

        page = addPage(pageTitle, wallsInBldg[j].label, 'BASIC INFORMATION:');
        textLeft(page, 'Bay Spacing:', 22, currentY + textOffsetY);
        textBoldLeft(
          page,
          formatBaySpacing(
            values.buildings[i][`${wallsInBldg[j].id}BaySpacing`]
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
          wallBracingType.find(
            (item) =>
              item.id === values.buildings[i][`${wallsInBldg[j].id}BracingType`]
          ).label,
          90,
          currentY + textOffsetY,
          124
        );
        if (values.buildings[i][`${wallsInBldg[j].id}BracingType`] != 'none') {
          textLeft(page, 'Braced Bays:', 216, currentY + textOffsetY);
          textBoldLeft(
            page,
            formatBaySelected(
              values.buildings[i][`${wallsInBldg[j].id}BracedBays`]
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
              item.id === values.buildings[i][`${wallsInBldg[j].id}GirtType`]
          ).label,
          90,
          currentY + textOffsetY,
          124
        );
        textBoldLeft(
          page,
          girtSpacing.find(
            (item) =>
              item.id === values.buildings[i][`${wallsInBldg[j].id}GirtSpacing`]
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
              values.buildings[i][`${wallsInBldg[j].id}BaseCondition`]
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
              values.buildings[i][`${wallsInBldg[j].id}WallPanelType`]
          ).label,
          90,
          currentY + textOffsetY,
          124
        );
        textBoldLeft(
          page,
          wallGauge.find(
            (item) =>
              item.id ===
              values.buildings[i][`${wallsInBldg[j].id}WallPanelGauge`]
          ).label,
          260,
          currentY + textOffsetY,
          54
        );
        textBoldLeft(
          page,
          wallFinish.find(
            (item) =>
              item.id ===
              values.buildings[i][`${wallsInBldg[j].id}WallPanelFinish`]
          ).label,
          356,
          currentY + textOffsetY,
          88
        );
        textBoldLeft(
          page,
          wallFinish.find(
            (item) =>
              item.id ===
              values.buildings[i][`${wallsInBldg[j].id}WallPanelFinish`]
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
              values.buildings[i][`${wallsInBldg[j].id}WallInsulation`]
          ).label,
          90,
          currentY + textOffsetY,
          502
        );

        lineThick(page, pageStartX, currentY, pageEndX, currentY);
        currentY -= lineHt;

        /* Wall Liner Panels */
        bldgItems = getItemsByWall(
          values.buildings[i].wallLinerPanels,
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
                (item) => item.id === bldgItems[k].wallLinerPanelGauge
              ).label,
              260,
              currentY + textOffsetY,
              54
            );
            textBoldLeft(
              page,
              wallFinish.find(
                (item) => item.id === bldgItems[k].wallLinerPanelFinish
              ).label,
              356,
              currentY + textOffsetY,
              88
            );
            textBoldLeft(
              page,
              wallFinish.find(
                (item) => item.id === bldgItems[k].wallLinerPanelFinish
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
          values.buildings[i].canopies,
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
            textLeft(page, 'Columns:', 316, currentY + textOffsetY);
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
              114
            );
            textBoldLeft(
              page,
              bldgItems[k].addColumns.toString(),
              366,
              currentY + textOffsetY,
              236
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
              roofPanels.find((item) => item.id === bldgItems[k].roofPanelType)
                .label,
              90,
              currentY + textOffsetY,
              124
            );
            textBoldLeft(
              page,
              roofGauge.find((item) => item.id === bldgItems[k].roofPanelGauge)
                .label,
              260,
              currentY + textOffsetY,
              54
            );
            textBoldLeft(
              page,
              roofFinish.find(
                (item) => item.id === bldgItems[k].roofPanelFinish
              ).label,
              356,
              currentY + textOffsetY,
              88
            );
            textBoldLeft(
              page,
              roofFinish.find(
                (item) => item.id === bldgItems[k].roofPanelFinish
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
                (item) => item.id === bldgItems[k].soffitPanelType
              ).label,
              90,
              currentY + textOffsetY,
              124
            );
            textBoldLeft(
              page,
              soffitGauge.find(
                (item) => item.id === bldgItems[k].soffitPanelGauge
              ).label,
              260,
              currentY + textOffsetY,
              54
            );
            textBoldLeft(
              page,
              soffitFinish.find(
                (item) => item.id === bldgItems[k].soffitPanelFinish
              ).label,
              356,
              currentY + textOffsetY,
              88
            );
            textBoldLeft(
              page,
              soffitFinish.find(
                (item) => item.id === bldgItems[k].soffitPanelFinish
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
          values.buildings[i].partialWalls,
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
          values.buildings[i].wallSkirts,
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
            textLeft(page, 'Cut Columns:', 446, currentY + textOffsetY);
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
              88
            );
            textBoldLeft(
              page,
              bldgItems[k].cutColumns.toString(),
              510,
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
                'WALL SKIRTS: (cont.)'
              );
            }
          }
          lineThick(page, pageStartX, currentY, pageEndX, currentY);
          currentY -= lineHt;
        }

        /* Wainscots */
        bldgItems = getItemsByWall(
          values.buildings[i].wainscots,
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
                (item) => item.id === bldgItems[k].wainscotPanelGauge
              ).label,
              260,
              currentY + textOffsetY,
              54
            );
            textBoldLeft(
              page,
              wallFinish.find(
                (item) => item.id === bldgItems[k].wainscotPanelFinish
              ).label,
              356,
              currentY + textOffsetY,
              88
            );
            textBoldLeft(
              page,
              wallFinish.find(
                (item) => item.id === bldgItems[k].wainscotPanelFinish
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
          values.buildings[i].wallRelites,
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
            textLeft(page, 'Cut Panels:', 446, currentY + textOffsetY);
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
              88
            );
            textBoldLeft(
              page,
              bldgItems[k].cutPanels.toString(),
              500,
              currentY + textOffsetY,
              92
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
        if (values.buildings[i].openings[`${wallsInBldg[j].id}`].length > 0) {
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
            k < values.buildings[i].openings[`${wallsInBldg[j].id}`].length;
            k++
          ) {
            textBoldLeft(
              page,
              values.buildings[i].openings[`${wallsInBldg[j].id}`][
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
                  values.buildings[i].openings[`${wallsInBldg[j].id}`][k]
                    .openType
              ).label,
              80,
              currentY + textOffsetY,
              146
            );
            if (
              values.buildings[i].openings[`${wallsInBldg[j].id}`][k]
                .openType != 'openbay'
            ) {
              textBoldLeft(
                page,
                formatFeetInches(
                  values.buildings[i].openings[`${wallsInBldg[j].id}`][k].offset
                ),
                228,
                currentY + textOffsetY,
                86
              );
              textBoldLeft(
                page,
                formatFeetInches(
                  values.buildings[i].openings[`${wallsInBldg[j].id}`][k].width
                ),
                316,
                currentY + textOffsetY,
                86
              );
              textBoldLeft(
                page,
                formatFeetInches(
                  values.buildings[i].openings[`${wallsInBldg[j].id}`][k].height
                ),
                404,
                currentY + textOffsetY,
                86
              );
              textBoldLeft(
                page,
                values.buildings[i].openings[`${wallsInBldg[j].id}`][k].sill >
                  0 ||
                  values.buildings[i].openings[`${wallsInBldg[j].id}`][k]
                    .openType == 'window' ||
                  values.buildings[i].openings[`${wallsInBldg[j].id}`][k]
                    .openType == 'commericalwindow' ||
                  values.buildings[i].openings[`${wallsInBldg[j].id}`][k]
                    .openType == 'louver'
                  ? formatFeetInches(
                      values.buildings[i].openings[`${wallsInBldg[j].id}`][k]
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
              values.buildings[i].openings[`${wallsInBldg[j].id}`].length
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
      }

      bldgPageNums[i].pageEnd = currentPage + 1; //On current page
    }

    /* Add Date, Footer, & Page Numbers to each page */
    pages = pdfDoc.getPages();
    if (pages.length > 0) {
      textBoldCenter(pages[0], 'TOTAL PAGES: ' + pages.length, 306, 762.5);

      if (values.buildings.length > 1) {
        for (i = 0; i < bldgPageNums.length; i++) {
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
