import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import getAllTrackers from '@/lib/queries/getAllTrackers'; 
import { getAllTrackerType } from '@/lib/queries/getAllTrackerType';
import { getAllEmployee } from '@/lib/queries/getAllemployee';

export async function exportToExcel(year = 2023) {
  try {
    // Fetch data using your query
    const tracker = await getAllTrackers();
    const trackertype=await getAllTrackerType();
    const employee=await getAllEmployee();

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Employee Leave Tracker');

    // Set title and year
    worksheet.mergeCells('A1:H1');
    worksheet.getCell('A1').value = 'Employee Leave Tracker';
    worksheet.getCell('A1').font = { size: 16, bold: true };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    worksheet.mergeCells('A2:H2');
    worksheet.getCell('A2').value = 'Year';
    worksheet.getCell('A2').font = { bold: true };

    worksheet.getCell('B2').value = year;
    worksheet.getCell('B2').font = { bold: true };

    // Leave summary table headers (Row 4)
    const alphabet = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
        'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
    ];
    let alphabetcount=0;


    worksheet.getCell(`${alphabet[alphabetcount]}4`).value = 'Employee Names';
    // Add name below the coloumn name Employee name data starting from row 5
    const columnNameEmployee = alphabet[alphabetcount];
    employee.map((data) => {
      worksheet.getCell(`${columnNameEmployee}${4+1}`).value= `${data.name}`;

    });

    {
        for (let i=0;trackertype.length<=i;i++){
            alphabetcount++;
            worksheet.getCell(`${alphabet[alphabetcount]}4`).value = trackertype[i].name;
            tracker.map((data)=>{
                const value = worksheet.getCell(`${columnNameEmployee}${4+1}`).value;
                if(value == data.name && data.type == trackertype[i].name){
                    worksheet.getCell(`${alphabet[alphabetcount]}${4+1}`).value= 1;

                }

            })
        }
    }
    worksheet.getCell(`${alphabet[alphabetcount+1]}4`).value = 'TOTAL';

    worksheet.getRow(4).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFADD8E6' }, // Light blue background
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.alignment = { horizontal: 'center' };
    });


    

    

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Save the file
    saveAs(blob, `employee_leave_tracker_${year}.xlsx`);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    throw error;
  }
}