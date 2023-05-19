import { ApiProperty } from '@nestjs/swagger'
import { IsDefined, IsMongoId } from 'class-validator'

export class HandleCartCourseDto {
  @ApiProperty()
  @IsDefined()
  @IsMongoId()
  courseId: string
}
