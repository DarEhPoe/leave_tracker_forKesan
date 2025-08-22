import ExcelJS from 'exceljs';
import { NextResponse } from 'next/server';
import getAllTrackers from '@/lib/queries/getAllTrackers';
import { getAllTrackerType } from '@/lib/queries/getAllTrackerType';
import { getAllEmployee } from '@/lib/queries/getAllemployee';

// Utility function to convert time string (like '1 day', '1 day 4 hours') to hours
function convertToHours(timeStr: string): number {
  const dayPattern = /(\d+)\s*day/i; // Regex for days
  const hourPattern = /(\d+)\s*hour/i; // Regex for hours
  
  let totalHours = 0;

  // Match and convert days to hours
  const dayMatch = timeStr.match(dayPattern);
  if (dayMatch) {
    totalHours += parseInt(dayMatch[1]) * 24; // 1 day = 24 hours
  }

  // Match and add hours
  const hourMatch = timeStr.match(hourPattern);
  if (hourMatch) {
    totalHours += parseInt(hourMatch[1]);
  }

  return totalHours;
}

// Utility function to format hours into days and hours (e.g., 128 hours => 5 days 8 hours)
function formatHoursToDaysAndHours(hours: number): string {
  const days = Math.floor(hours / 24); // Calculate the number of days
  const remainingHours = hours % 24;  // Calculate the remaining hours

  // If there are no days, only show hours
  if (days === 0) {
    return remainingHours === 1 ? `${remainingHours} hour` : `${remainingHours} hours`;
  }

  // If there are days but no hours, show only the days (e.g., "1 day")
  if (remainingHours === 0) {
    return days === 1 ? `${days} day` : `${days} days`;
  }

  // If there are both days and hours, show both (e.g., "2 days 3 hours")
  const daysText = days === 1 ? `${days} day` : `${days} days`;
  const hoursText = remainingHours === 1 ? `${remainingHours} hour` : `${remainingHours} hours`;

  return `${daysText} ${hoursText}`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const year = body.year;

    const alltracker = await getAllTrackers();
    const trackers = alltracker.filter((data) => {
      const trackerYear = new Date(data.trackersDate).getFullYear();
      return (
        trackerYear === year &&
        data.Received_By_Supervisor === "Approved" &&
        data.Approved_By_Executive_Team === "Approved"
      );
    });

    const trackerTypes = await getAllTrackerType();
    const employees = await getAllEmployee();

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Employee Leave Tracker');

    // Define color scheme
    const colors = {
      headerBg: 'FF4F81AF', // Dark blue for headers
      subHeaderBg: 'FFDAEEF3', // Light blue for sub-headers
      totalBg: 'FFF0F8FF', // Very light blue for totals
      border: 'FF000000', // Black for borders
      accent: 'FF4682B4', // Medium blue for accents
    };

    // Style for headers
    const headerStyle = {
      font: { size: 16, bold: true, color: { argb: 'FFFFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.headerBg } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      border: {
        top: { style: 'thin', color: { argb: colors.border } },
        left: { style: 'thin', color: { argb: colors.border } },
        bottom: { style: 'thin', color: { argb: colors.border } },
        right: { style: 'thin', color: { argb: colors.border } },
      },
    };

    const subHeaderStyle = {
      font: { size: 12, bold: true, color: { argb: 'FF000000' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.subHeaderBg } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      border: headerStyle.border,
    };

    const cellStyle = {
      font: { size: 11, color: { argb: 'FF000000' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      border: headerStyle.border,
    };

    const totalStyle = {
      font: { size: 12, bold: true, color: { argb: 'FF000000' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: colors.totalBg } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      border: headerStyle.border,
    };

    // Title row
    worksheet.mergeCells('A1:H1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'Employee Leave Tracker';
    Object.assign(titleCell, headerStyle);
    worksheet.getRow(1).height = 30;

    // Year row
    worksheet.getCell('A2').value = 'Year';
    Object.assign(worksheet.getCell('A2'), subHeaderStyle);
    
    worksheet.getCell('B2').value = `${year}`;
    Object.assign(worksheet.getCell('B2'), subHeaderStyle);
    worksheet.getRow(2).height = 25;

    // Set column widths
    worksheet.getColumn('A').width = 25;
    for (let i = 1; i <= trackerTypes.length + 1; i++) {
      worksheet.getColumn(i + 1).width = 25;  // Increased column width
    }

    const alphabet = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
    let alphabetCount = 0;

    // Employee names header
    const empHeader = worksheet.getCell(`${alphabet[alphabetCount]}4`);
    empHeader.value = 'Employee Names';
    Object.assign(empHeader, subHeaderStyle);

    // Employee names
    employees.forEach((emp, index) => {
      const cell = worksheet.getCell(`${alphabet[0]}${5 + index}`);
      cell.value = emp.name;
      Object.assign(cell, cellStyle);
    });

    const employeeLeaveCounts: number[] = new Array(employees.length).fill(0);
    const trackerTypeCounts: number[] = new Array(trackerTypes.length).fill(0);

    // Tracker types columns
    for (let i = 0; i < trackerTypes.length; i++) {
      alphabetCount++;
      const col = alphabet[alphabetCount];
      const headerCell = worksheet.getCell(`${col}4`);
      headerCell.value = trackerTypes[i].name;
      Object.assign(headerCell, subHeaderStyle);

      employees.forEach((emp, empIndex) => {
        // Filter trackers for the employee and tracker type
        const matches = trackers.filter(
          (t) => t.name === emp.name && t.type === trackerTypes[i].name
        );

        // Sum up the leave times by converting them to hours
        const leaveCount = matches.reduce((sum, t) => sum + convertToHours(t.Total_leaving), 0);

        // Accumulate total leave count per employee
        employeeLeaveCounts[empIndex] += leaveCount;
        trackerTypeCounts[i] += leaveCount;

        // Update the cell with the sum (converted to days and hours)
        const formattedLeaveCount = leaveCount > 0 ? formatHoursToDaysAndHours(leaveCount) : '-';
        const cell = worksheet.getCell(`${col}${5 + empIndex}`);
        cell.value = formattedLeaveCount; // Display in "X days Y hours" format
        Object.assign(cell, cellStyle);
      });
    }

    // TOTAL column
    const totalCol = alphabet[alphabetCount + 1];
    const totalHeader = worksheet.getCell(`${totalCol}4`);
    totalHeader.value = 'TOTAL';
    Object.assign(totalHeader, subHeaderStyle);

    employees.forEach((emp, empIndex) => {
      const totalCount = employeeLeaveCounts[empIndex];
      const formattedTotalCount = totalCount > 0 ? formatHoursToDaysAndHours(totalCount) : '-';
      const cell = worksheet.getCell(`${totalCol}${5 + empIndex}`);
      cell.value = formattedTotalCount;
      Object.assign(cell, totalStyle);
    });

    // Summary row
    const summaryRow = 5 + employees.length;
    const summaryHeader = worksheet.getCell(`A${summaryRow}`);
    summaryHeader.value = 'Total';
    Object.assign(summaryHeader, totalStyle);

    for (let i = 0; i < trackerTypes.length; i++) {
      const col = alphabet[i + 1];
      const totalCount = trackerTypeCounts[i];
      const formattedTotalCount = totalCount > 0 ? formatHoursToDaysAndHours(totalCount) : '-';
      const cell = worksheet.getCell(`${col}${summaryRow}`);
      cell.value = formattedTotalCount;
      Object.assign(cell, totalStyle);
    }

    const totalColSummary = alphabet[alphabetCount + 1];
    const totalAllCount = employeeLeaveCounts.reduce((sum, count) => sum + count, 0);
    const formattedTotalAllCount = totalAllCount > 0 ? formatHoursToDaysAndHours(totalAllCount) : '-';
    const totalSummaryCell = worksheet.getCell(`${totalColSummary}${summaryRow}`);
    totalSummaryCell.value = formattedTotalAllCount;
    Object.assign(totalSummaryCell, totalStyle);

    // Auto-filter
    worksheet.autoFilter = {
      from: 'A4',
      to: `${totalCol}4`,
    };

    // Freeze header rows
    worksheet.views = [{ state: 'frozen', ySplit: 4 }];

    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Disposition': `attachment; filename=employee_leave_tracker_${year}.xlsx`,
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });
  } catch (err) {
    console.error('Excel Export Error:', err);
    return NextResponse.json({ error: 'Failed to export Excel' }, { status: 500 });
  }
}
