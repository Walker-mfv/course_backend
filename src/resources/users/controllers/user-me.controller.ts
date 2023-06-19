import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { GetAccessTokenResponse } from 'googleapis-common/node_modules/google-auth-library/build/src/auth/oauth2client'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { ACCESS_TOKEN_KEY } from 'src/common/utils/constants/app.constant'
import ControllerHelper from 'src/common/utils/helpers/ControllerHelper'
import { CreateCalendarDto } from '../dto/create-calendar.dto'
import { UpdateProfileDto } from '../dto/update-profile.dto'
import { UsersService } from '../users.service'
import { SystemNotificationsService } from './../../notifications/services/system-notifications.service'
import { UserMeService } from './../services/user-me.service'

@ApiTags('users/me')
@Controller('users/me')
export class UsersMeController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userMeService: UserMeService,
    private systemNotificationsService: SystemNotificationsService
  ) {}

  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth(ACCESS_TOKEN_KEY)
  updateProfile(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.userMeService.updateById(req.user._id, updateProfileDto)
  }

  @Patch('switch-to-instructor')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth(ACCESS_TOKEN_KEY)
  async switchToInstructor(@Req() req) {
    const result = await this.userMeService.switchToInstructor(req.user._id)
    this.systemNotificationsService.switchToInstructor(req.user)
    return ControllerHelper.handleUpdateResult(result)
  }

  @Get('google/calendar')
  async getGoogleCalendar(@Res({ passthrough: true }) res: Response) {
    const url = await this.usersService.loginGoogleCalendar()
    if (url) return res.redirect(url)
  }

  @Get('google/calendar/redirect')
  async getGoogleCalendarRedirect(@Req() req, @Res() res: Response) {
    const code = req.query.code
    const oAuth2Client = await this.usersService.getOAuth2ClientCalendar()
    const { tokens } = await oAuth2Client.getToken(code as string)
    // Modify the expiry_date property
    const expiresInMs = Date.now() + 5 * 60 * 1000
    tokens.expiry_date = expiresInMs

    oAuth2Client.setCredentials(tokens)

    const htmlContent = `
      <html>
        <head>
          <style>
            /* Custom styles for the loading page */
            .loading-container {
              display: flex;
              flex-flow: column;
              justify-content: center;
              align-items: center;
              margin-top: 30px;
            }
            .loading-spinner {
              border: 7px solid #805AD5;
              border-top: 7px solid #fff;
              border-radius: 50%;
              width: 80px;
              height: 80px;
              animation: spin 0.8s linear infinite;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </head>
        <body>
          <div class="loading-container">
            <div class="loading-spinner"></div>
            <p>Vui lòng chờ giây lát...</p>
          </div>
        </body>
      </html>
    `

    res.send(htmlContent)
  }

  @Get('google/calendar/check-auth')
  async checkAuthCalendar(): Promise<boolean> {
    let token: GetAccessTokenResponse = null
    const oAuth2Client = await this.usersService.getOAuth2ClientCalendar()
    try {
      token = await oAuth2Client.getAccessToken()
    } catch (err) {
      return false
    }
    if (token) return true
    else return false
  }

  @Get('google/calendar/logout')
  async logoutCalendar() {
    const oAuth2Client = await this.usersService.getOAuth2ClientCalendar()
    try {
      await oAuth2Client.revokeCredentials()
      return true
    } catch (err) {
      return false
    }
  }

  @Post('google/calendar/create-event')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth(ACCESS_TOKEN_KEY)
  async createEvent(@Req() req, @Body() event: CreateCalendarDto) {
    try {
      const res = await this.usersService.createEventCalendar(event)
      if (!res) return new BadRequestException('Error')
      const data = res.data

      return this.usersService.addCalendarEvent(req.user._id, {
        id: data.id,
        summary: data.summary,
        start_time: data.start.dateTime,
        end_time: data.end.dateTime,
        frequency: event.frequency,
        notification_method: event.notification_method,
        notification_time_before: event.notification_time_before,
        course_title: event.course_title || null,
        course_url: event.course_url || null,
        sequence: data.sequence,
        until: event.until || null,
        createdAt: data.created,
      })
    } catch (err) {
      throw new BadRequestException(err)
    }
  }

  @Get('google/calendar/events')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth(ACCESS_TOKEN_KEY)
  cart(@Req() req) {
    return this.usersService.fetchCalender(req.user._id)
  }

  @Delete('google/calendar/events/:eventId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth(ACCESS_TOKEN_KEY)
  deleteEvent(@Req() req, @Param('eventId') eventId: string) {
    if (this.checkAuthCalendar()) return new UnauthorizedException()
    return this.usersService.deleteCalendarEvent(req.user._id, eventId)
  }
}
