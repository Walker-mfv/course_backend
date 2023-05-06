import { IsMongoId } from 'class-validator'
import { IsDefined } from 'class-validator'
import { IsNumber } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class DeleteCourseUnitDto {
  @ApiProperty()
  @IsDefined()
  @IsNumber()
  sectionIndex: number

  @ApiProperty()
  @IsDefined()
  @IsMongoId()
  unitId: string
}
