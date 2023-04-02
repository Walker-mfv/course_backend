import { IsDefined } from 'class-validator'
import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class VerifyRecaptchaDto {
  @ApiProperty()
  @IsDefined()
  @IsString()
  secret: string

  @ApiProperty()
  @IsDefined()
  @IsString()
  response: string
}
