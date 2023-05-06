import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsDefined, IsNumber, ValidateNested } from 'class-validator'
import { Section } from './create-course.dto'

export class AddCourseSectionDto {
  @ApiProperty()
  @IsDefined()
  @IsNumber()
  sectionIndex: number

  @ApiProperty()
  @IsDefined()
  @ValidateNested()
  @Type(() => Section)
  data: Section
}
