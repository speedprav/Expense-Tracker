import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generatePDFReport = (expenses, profile, timeframe) => {
  const doc = new jsPDF();
  const currency = profile.currency || '₹';
  
  // Calculate date ranges based on timeframe
  const now = new Date();
  let startDate = new Date();
  
  switch(timeframe) {
    case 'weekly':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'monthly':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'quarterly':
      startDate.setMonth(now.getMonth() - 3);
      break;
    case 'yearly':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      startDate.setDate(now.getDate() - 30);
  }

  // Filter expenses
  const filteredExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate >= startDate && expDate <= now;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  // Calculations
  const totalSpent = filteredExpenses.filter(e => e.type === 'expense').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalEarned = filteredExpenses.filter(e => e.type === 'income').reduce((acc, curr) => acc + Number(curr.amount), 0);
  const net = totalEarned - totalSpent;

  // Document Title and Header
  doc.setFontSize(22);
  doc.setTextColor(40, 40, 40);
  doc.text(`Expense Tracker - ${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Report`, 14, 20);
  
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${now.toLocaleDateString()}`, 14, 28);
  doc.text(`Period: ${startDate.toLocaleDateString()} to ${now.toLocaleDateString()}`, 14, 34);
  
  // Profile Info
  doc.text(`Account Name: ${profile.name || 'User'}`, 14, 42);
  doc.text(`Account Mode: ${profile.mode === 'business' ? 'Business' : 'Personal'}`, 14, 48);
  if (profile.mode === 'business' && profile.businessName) {
    doc.text(`Business Name: ${profile.businessName}`, 14, 54);
  }

  // Summary Section
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Financial Summary', 14, 65);
  
  autoTable(doc, {
    startY: 70,
    head: [['Total Income', 'Total Expenses', 'Net Balance']],
    body: [
      [`${currency}${totalEarned.toLocaleString('en-IN')}`, `${currency}${totalSpent.toLocaleString('en-IN')}`, `${currency}${net.toLocaleString('en-IN')}`]
    ],
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
    alternateRowStyles: { fillColor: [245, 245, 245] }
  });

  // Transactions Table
  const finalY = doc.lastAutoTable.finalY || 90;
  
  doc.setFontSize(14);
  doc.text('Transaction Details', 14, finalY + 15);
  
  const tableData = filteredExpenses.map(exp => [
    new Date(exp.date).toLocaleDateString(),
    exp.description,
    exp.category,
    exp.type === 'income' ? 'Income' : 'Expense',
    `${exp.type === 'expense' ? '-' : '+'}${currency}${Number(exp.amount).toLocaleString('en-IN')}`
  ]);

  if (tableData.length > 0) {
    autoTable(doc, {
      startY: finalY + 20,
      head: [['Date', 'Description', 'Category', 'Type', 'Amount']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [212, 175, 55] }, // Updated to gold
      styles: { fontSize: 10 },
      didParseCell: function(data) {
        if (data.section === 'body' && data.column.index === 4) {
          if (data.cell.raw.includes('-')) {
            data.cell.styles.textColor = [239, 68, 68]; // Red for expenses
          } else {
            data.cell.styles.textColor = [16, 185, 129]; // Green for income
          }
        }
      }
    });
  } else {
    doc.setFontSize(12);
    doc.setTextColor(150, 150, 150);
    doc.text('No transactions found in this period.', 14, finalY + 30);
  }

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
  }

  // Save the PDF
  doc.save(`Expense_Report_${timeframe}_${now.toISOString().split('T')[0]}.pdf`);
};
