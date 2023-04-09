import { MailerService } from '@nestjs-modules/mailer'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { User } from 'src/resources/users/schemas/user.schema'
import { APP_NAME } from './../common/utils/constants/app.constant'
import { ActivityLog } from './../resources/activity-logs/schemas/activity-logs.schema'

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService, private configService: ConfigService) {}

  newActivity(activityLog: ActivityLog) {
    const {
      user,
      deviceInfo: {
        ip,
        geolocationInfo: { geolocation, message: geolocationMessage },
      },
    } = activityLog
    const name = !!user ? user.profile.fullName : 'unknown'
    const mapLink = `https://www.google.com/maps/search/?api=1&query=${geolocation?.lat}, ${geolocation?.long}`
    return this.mailerService.sendMail({
      to: process.env.MAIL_USERNAME,
      subject: `New Activity - ${name}`,
      html: `
            <p>Hi bro,</p>
            <p><strong>Viewer information</strong></p>
            <p>ip: ${ip}</p>
            ${!!user ? `<p>Name : ${user?.profile.fullName}</p>` : ''}
            ${!!user ? `<p>Email: ${user?.email}</p>` : ''}
            <p><strong>Geolocation</strong></p>
            <p>latitude: ${geolocation?.lat}</p>
            <p>longitude: ${geolocation?.long}</p>
            ${!!geolocation ? `<p><a href="${mapLink}">View user position (Map)</a></p>` : ''}
            ${geolocationMessage ? `<p>message: ${geolocationMessage}</p>` : ''}
            `,
    })
  }

  sendMail(user: User) {
    return this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Online Courses!',
      template: `signup`,
    })
  }

  signUp(user: User) {
    const link = `${this.configService.get('domain.api')}/auth/verify-email?code=${user.permissionCode}`
    return this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Online Courses!',
      context: {
        domain: this.configService.get('domain.client'),
        app_name: APP_NAME,
        permission_code: user.permissionCode,
        link,
      },
      template: 'signup',
    })
  }

  forgotPassword(user: User) {
    const link = `${this.configService.get('domain.client')}/join/reset-password/?token=${user.permissionCode}`
    return this.mailerService.sendMail({
      to: user.email,
      subject: 'Reset password',
      context: {
        domain: this.configService.get('domain.client'),
        app_name: APP_NAME,
        link,
      },
      template: 'forgot-password',
    })
  }
}
