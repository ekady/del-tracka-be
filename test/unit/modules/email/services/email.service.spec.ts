import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { EmailService } from 'src/modules/email/services/email.service';

jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn(),
  }),
}));

jest.mock('pug', () => ({
  renderFile: jest.fn().mockReturnValue('<html>Test</html>'),
}));

describe('EmailService', () => {
  let service: EmailService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    mockConfigService.get.mockImplementation((key: string) => {
      const config: Record<string, string> = {
        EMAIL_HOST: 'smtp.test.com',
        EMAIL_PORT: '587',
        EMAIL_USERNAME: 'test@test.com',
        EMAIL_PASSWORD: 'password',
        EMAIL_IDENTITY: 'noreply@test.com',
      };
      return config[key];
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendMail', () => {
    it('should send email successfully', async () => {
      const sendMailOptions = {
        to: 'recipient@test.com',
        subject: 'Test Subject',
        templateName: 'welcome',
        name: 'John',
        url: 'https://test.com',
      };

      const transporter = require('nodemailer').createTransport();
      transporter.sendMail.mockResolvedValue({});

      await service.sendMail(sendMailOptions);

      expect(transporter.sendMail).toHaveBeenCalled();
    });
  });
});
