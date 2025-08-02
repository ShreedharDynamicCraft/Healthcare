import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Extend jsPDF type to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export const exportToPDF = (data: any[], filename: string, title: string) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.setTextColor(139, 92, 246); // Purple color
  doc.text(title, 20, 20);
  
  // Add subtitle with date
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
  
  // Define columns based on data type
  let columns: any[] = [];
  let rows: any[] = [];
  
  if (data.length > 0) {
    const firstItem = data[0];
    
    // For specialists/doctors
    if ('specialization' in firstItem) {
      columns = [
        { header: 'Name', dataKey: 'name' },
        { header: 'Email', dataKey: 'email' },
        { header: 'Specialization', dataKey: 'specialization' },
        { header: 'Experience', dataKey: 'experience' },
        { header: 'Status', dataKey: 'status' },
      ];
      
      rows = data.map(item => ({
        name: `${item.firstName} ${item.lastName}`,
        email: item.email,
        specialization: item.specialization,
        experience: `${item.experience} years`,
        status: item.isActive ? 'Active' : 'Inactive',
      }));
    }
    
    // For patients
    else if ('dateOfBirth' in firstItem) {
      columns = [
        { header: 'Name', dataKey: 'name' },
        { header: 'Email', dataKey: 'email' },
        { header: 'Phone', dataKey: 'phone' },
        { header: 'Age', dataKey: 'age' },
        { header: 'City', dataKey: 'city' },
        { header: 'Total Visits', dataKey: 'visits' },
        { header: 'Status', dataKey: 'status' },
      ];
      
      rows = data.map(item => {
        const age = calculateAge(item.dateOfBirth);
        return {
          name: `${item.firstName} ${item.lastName}`,
          email: item.email,
          phone: item.phone,
          age: `${age} years`,
          city: item.city,
          visits: item.totalVisits,
          status: item.isActive ? 'Active' : 'Inactive',
        };
      });
    }
    
    // For appointments
    else if ('time' in firstItem) {
      columns = [
        { header: 'Time', dataKey: 'time' },
        { header: 'Patient', dataKey: 'patient' },
        { header: 'Doctor', dataKey: 'doctor' },
        { header: 'Type', dataKey: 'type' },
        { header: 'Status', dataKey: 'status' },
      ];
      
      rows = data.map(item => ({
        time: item.time,
        patient: item.patient,
        doctor: item.doctor,
        type: item.type,
        status: item.status,
      }));
    }
  }
  
  // Add table
  doc.autoTable({
    columns,
    body: rows,
    startY: 40,
    theme: 'grid',
    headStyles: {
      fillColor: [139, 92, 246],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { top: 40 },
  });
  
  // Save the PDF
  doc.save(filename);
};

export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;
  
  let csvContent = '';
  const firstItem = data[0];
  
  // Define headers based on data type
  let headers: string[] = [];
  let processedData: any[] = [];
  
  // For specialists/doctors
  if ('specialization' in firstItem) {
    headers = ['Name', 'Email', 'Phone', 'Specialization', 'Experience', 'Location', 'Rating', 'Status'];
    processedData = data.map(item => [
      `${item.firstName} ${item.lastName}`,
      item.email,
      item.phone,
      item.specialization,
      `${item.experience} years`,
      item.location || '',
      item.rating?.toFixed(1) || '',
      item.isActive ? 'Active' : 'Inactive',
    ]);
  }
  
  // For patients
  else if ('dateOfBirth' in firstItem) {
    headers = ['Name', 'Email', 'Phone', 'Date of Birth', 'Gender', 'City', 'Total Visits', 'Last Visit', 'Status'];
    processedData = data.map(item => [
      `${item.firstName} ${item.lastName}`,
      item.email,
      item.phone,
      item.dateOfBirth,
      item.gender,
      item.city,
      item.totalVisits,
      item.lastVisit || '',
      item.isActive ? 'Active' : 'Inactive',
    ]);
  }
  
  // For appointments
  else if ('time' in firstItem) {
    headers = ['Time', 'Patient', 'Doctor', 'Type', 'Status'];
    processedData = data.map(item => [
      item.time,
      item.patient,
      item.doctor,
      item.type,
      item.status,
    ]);
  }
  
  // Create CSV content
  csvContent = headers.join(',') + '\n';
  processedData.forEach(row => {
    csvContent += row.map((field: any) => `"${field}"`).join(',') + '\n';
  });
  
  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Helper function to calculate age
const calculateAge = (dateOfBirth: string) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};
