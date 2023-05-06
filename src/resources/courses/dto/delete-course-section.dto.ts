import { IsMongoId } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { IsDefined } from 'class-validator'

export class DeleteCourseSectionDto {
  @ApiProperty()
  @IsDefined()
  @IsMongoId()
  sectionId: string
}
