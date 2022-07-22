import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter, SendMailOptions } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(private config: ConfigService) {
    this.transporter = createTransport({
      host: this.config.get('EMAIL_HOST'),
      port: this.config.get('EMAIL_PORT'),
      auth: {
        user: this.config.get('EMAIL_USERNAME'),
        pass: this.config.get('EMAIL_PASSWORD'),
      },
    });
  }

  async sendMail(options: Omit<SendMailOptions, 'from'>): Promise<void> {
    const from = this.config.get('EMAIL_IDENTITY');
    try {
      await this.transporter.sendMail({ from, ...options });
    } catch (error) {
      console.log({ error });
    }
  }
}
