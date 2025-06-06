import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { CustomLoggerService } from './logger.service';

@Injectable()
export class NotificationService {
    private transporter: nodemailer.Transporter;

    constructor(
        private configService: ConfigService,
        private logger: CustomLoggerService
    ) {
        this.transporter = nodemailer.createTransport({
            host: this.configService.get('email.host'),
            port: this.configService.get('email.port'),
            secure: this.configService.get('email.secure'),
            auth: {
                user: this.configService.get('email.user'),
                pass: this.configService.get('email.password'),
            },
        });
    }

    async sendEmail(to: string, subject: string, content: string) {
        try {
            const mailOptions = {
                from: this.configService.get('email.from'),
                to,
                subject,
                html: content,
            };

            await this.transporter.sendMail(mailOptions);
            this.logger.log(`Email enviado com sucesso para ${to}`);
        } catch (error) {
            this.logger.error(`Erro ao enviar email: ${error.message}`);
            throw error;
        }
    }

    async sendAlert(subject: string, message: string) {
        const adminEmail = this.configService.get('email.admin');
        await this.sendEmail(adminEmail, `[ALERTA] ${subject}`, message);
    }

    async sendMaintenanceNotification(vehicleId: string, maintenanceDetails: any) {
        const subject = 'Manutenção Programada';
        const content = `
            <h2>Manutenção Programada</h2>
            <p>Veículo: ${maintenanceDetails.vehicle}</p>
            <p>Data: ${maintenanceDetails.date}</p>
            <p>Descrição: ${maintenanceDetails.description}</p>
        `;

        await this.sendEmail(maintenanceDetails.clientEmail, subject, content);
    }

    async sendPaymentReminder(transactionId: string, paymentDetails: any) {
        const subject = 'Lembrete de Pagamento';
        const content = `
            <h2>Lembrete de Pagamento</h2>
            <p>Valor: R$ ${paymentDetails.amount}</p>
            <p>Vencimento: ${paymentDetails.dueDate}</p>
            <p>Detalhes: ${paymentDetails.description}</p>
        `;

        await this.sendEmail(paymentDetails.clientEmail, subject, content);
    }
} 