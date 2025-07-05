import { emailService } from './emailService';
import { generateCertificatePDF } from './pdfService';

class CertificateEmailService {
  constructor() {
    this.emailService = emailService;
  }

  // Send individual certificate email
  async sendCertificateEmail(certificate, settings = {}) {
    try {
      // Generate PDF certificate (simulated)
      const pdfBuffer = await generateCertificatePDF(certificate);
      
      // Generate email template
      const templateData = {
        attendeeName: certificate.attendeeName,
        eventTitle: certificate.eventTitle,
        completionDate: new Date(certificate.completionDate).toLocaleDateString(),
        certificateId: certificate.certificateId,
        organizationName: settings.organizationName || 'Your Organization'
      };

      const emailTemplate = this.emailService.generateCertificateEmailTemplate(templateData);
      
      // Prepare email data
      const emailData = {
        to: certificate.attendeeEmail,
        subject: settings.subject || `Your Certificate for ${certificate.eventTitle}`,
        html: emailTemplate.html,
        text: emailTemplate.text,
        certificateData: {
          certificateId: certificate.certificateId,
          pdfBuffer: pdfBuffer
        }
      };

      // Send email
      const result = await this.emailService.sendCertificateEmail(emailData);
      
      return {
        success: true,
        certificateId: certificate.certificateId,
        email: certificate.attendeeEmail,
        messageId: result.messageId
      };
    } catch (error) {
      console.error('Certificate email sending failed:', error);
      return {
        success: false,
        certificateId: certificate.certificateId,
        email: certificate.attendeeEmail,
        error: error.message
      };
    }
  }

  // Send bulk certificate emails
  async sendBulkCertificateEmails(certificates, settings = {}) {
    const results = [];
    const batchSize = 5; // Smaller batch size for demo
    
    for (let i = 0; i < certificates.length; i += batchSize) {
      const batch = certificates.slice(i, i + batchSize);
      
      const batchPromises = batch.map(certificate => 
        this.sendCertificateEmail(certificate, settings)
      );
      
      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          results.push({
            success: false,
            certificateId: batch[index].certificateId,
            email: batch[index].attendeeEmail,
            error: result.reason?.message || 'Unknown error'
          });
        }
      });
      
      // Add delay between batches
      if (i + batchSize < certificates.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    return {
      total: certificates.length,
      successful: successful.length,
      failed: failed.length,
      results: results,
      successfulEmails: successful,
      failedEmails: failed
    };
  }
}

export const certificateEmailService = new CertificateEmailService();