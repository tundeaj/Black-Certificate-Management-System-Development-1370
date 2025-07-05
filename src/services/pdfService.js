import jsPDF from 'jspdf';

class PDFService {
  constructor() {
    this.defaultOptions = {
      format: 'a4',
      orientation: 'landscape',
      unit: 'mm',
      compress: true
    };
  }

  // Generate PDF from certificate data
  async generateCertificatePDF(certificate, template = null) {
    try {
      const pdf = new jsPDF({
        orientation: template?.orientation || 'landscape',
        unit: 'mm',
        format: template?.size || 'a4'
      });

      // Set document properties
      pdf.setProperties({
        title: `Certificate - ${certificate.attendeeName}`,
        subject: certificate.eventTitle,
        author: 'Certificate Management System',
        creator: 'CertifyPro'
      });

      // Add certificate content
      await this.addCertificateContent(pdf, certificate, template);

      // Return PDF as buffer
      return pdf.output('arraybuffer');
    } catch (error) {
      console.error('PDF generation failed:', error);
      throw error;
    }
  }

  // Add certificate content to PDF
  async addCertificateContent(pdf, certificate, template) {
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Add background color
    if (template?.background?.color) {
      pdf.setFillColor(template.background.color);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    } else {
      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pageWidth, pageHeight, 'F');
    }

    // Add border
    pdf.setLineWidth(3);
    pdf.setDrawColor(0, 0, 0);
    pdf.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Add inner border
    pdf.setLineWidth(1);
    pdf.rect(15, 15, pageWidth - 30, pageHeight - 30);

    // Add title
    pdf.setFontSize(32);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CERTIFICATE', pageWidth / 2, 40, { align: 'center' });

    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'normal');
    pdf.text('OF COMPLETION', pageWidth / 2, 55, { align: 'center' });

    // Add decorative line
    pdf.setLineWidth(2);
    pdf.setDrawColor(229, 9, 20); // Netflix red
    pdf.line(pageWidth / 2 - 30, 65, pageWidth / 2 + 30, 65);

    // Add main content
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(0, 0, 0);
    pdf.text('This is to certify that', pageWidth / 2, 85, { align: 'center' });

    // Attendee name
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.text(certificate.attendeeName, pageWidth / 2, 105, { align: 'center' });

    // Add underline for name
    const nameWidth = pdf.getTextWidth(certificate.attendeeName);
    pdf.setLineWidth(1);
    pdf.line(pageWidth / 2 - nameWidth / 2, 108, pageWidth / 2 + nameWidth / 2, 108);

    // Event details
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    pdf.text('has successfully completed', pageWidth / 2, 125, { align: 'center' });

    pdf.setFontSize(22);
    pdf.setFont('helvetica', 'bold');
    pdf.text(certificate.eventTitle, pageWidth / 2, 145, { align: 'center' });

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    const completionDate = new Date(certificate.completionDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    pdf.text(`on ${completionDate}`, pageWidth / 2, 165, { align: 'center' });

    // Add signature section
    const signatureY = pageHeight - 50;
    
    // Signing authority
    if (certificate.signingAuthority?.name) {
      pdf.setLineWidth(1);
      pdf.setDrawColor(0, 0, 0);
      pdf.line(40, signatureY, 100, signatureY);
      
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text(certificate.signingAuthority.name, 70, signatureY + 8, { align: 'center' });
      
      if (certificate.signingAuthority.title) {
        pdf.setFont('helvetica', 'normal');
        pdf.text(certificate.signingAuthority.title, 70, signatureY + 16, { align: 'center' });
      }
    }

    // Certificate ID
    pdf.line(pageWidth - 100, signatureY, pageWidth - 40, signatureY);
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Certificate ID', pageWidth - 70, signatureY + 8, { align: 'center' });
    pdf.setFont('helvetica', 'bold');
    pdf.text(certificate.certificateId, pageWidth - 70, signatureY + 16, { align: 'center' });

    // Add decorative elements
    this.addDecorativeElements(pdf, pageWidth, pageHeight);
  }

  // Add decorative elements to certificate
  addDecorativeElements(pdf, pageWidth, pageHeight) {
    // Add corner decorations
    const cornerSize = 20;
    pdf.setFillColor(229, 9, 20); // Netflix red
    
    // Top-left corner
    pdf.rect(20, 20, cornerSize, 5, 'F');
    pdf.rect(20, 20, 5, cornerSize, 'F');
    
    // Top-right corner
    pdf.rect(pageWidth - 40, 20, cornerSize, 5, 'F');
    pdf.rect(pageWidth - 25, 20, 5, cornerSize, 'F');
    
    // Bottom-left corner
    pdf.rect(20, pageHeight - 25, cornerSize, 5, 'F');
    pdf.rect(20, pageHeight - 40, 5, cornerSize, 'F');
    
    // Bottom-right corner
    pdf.rect(pageWidth - 40, pageHeight - 25, cornerSize, 5, 'F');
    pdf.rect(pageWidth - 25, pageHeight - 40, 5, cornerSize, 'F');
  }
}

export const generateCertificatePDF = async (certificate, template = null) => {
  const pdfService = new PDFService();
  return await pdfService.generateCertificatePDF(certificate, template);
};

export { PDFService };