import { ApiProperty } from '@nestjs/swagger'
import { IsDefined, IsNumber, IsOptional, IsString } from 'class-validator'
import { NotificationType } from '../schemas/user.schema'

export class CreateCalendarDto {
  @ApiProperty()
  @IsString()
  @IsDefined()
  summary: string

  @ApiProperty()
  @IsString()
  @IsDefined()
  start_time: string

  @ApiProperty()
  @IsString()
  @IsDefined()
  end_time: string

  @ApiProperty()
  @IsString()
  @IsDefined()
  notification_method: NotificationType

  @ApiProperty()
  @IsNumber()
  @IsDefined()
  notification_time_before?: number

  @ApiProperty()
  @IsOptional()
  @IsString()
  course_title?: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  course_url?: string

  @ApiProperty()
  @IsString()
  @IsDefined()
  frequency: string

  @ApiProperty()
  @IsOptional()
  @IsString()
  until?: string
}
