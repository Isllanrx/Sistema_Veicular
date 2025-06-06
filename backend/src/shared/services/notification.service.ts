import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NotificationService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'localhost',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER || '',
                pass: process.env.SMTP_PASS || '',
            },
        });
    }

    async sendEmail(to: string, subject: string, text: string, html?: string) {
        return this.transporter.sendMail({
            from: process.env.SMTP_FROM || 'noreply@example.com',
            to,
            subject,
            text,
            html,
        });
    }

    async sendAlert(subject: string, message: string) {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
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