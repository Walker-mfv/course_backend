import { CreateFileDto } from 'src/resources/files/dto/create-file.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsArray, IsMongoId, IsOptional, IsString, ValidateNested } from 'class-validator'
import { File } from 'src/resources/files/schemas/file.schema'
import { HistoryTimestampProp } from 'src/common/shared/dtos/shared.dto'
import { IsLectureTitle } from './lecture.vld'

export class CreateLectureDto {
  @ApiProperty()
  @IsLectureTitle({ required: true })
  title: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  video?: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsMongoId()
  thumbnail?: string

  @ApiProperty({
    required: false,
    isArray: true,
    type: File,
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateFileDto)
  resources?: CreateFileDto[]

  // @ApiProperty({ required: false })
  // @IsOptional()
  // @IsMongoId({ each: true })
  // comments?: string[]

  @ApiProperty()
  @IsOptional()
  @ValidateNested()
  @Type(() => HistoryTimestampProp)
  history?: HistoryTimestampProp
}
