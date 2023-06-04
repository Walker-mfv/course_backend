import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { AppAbility } from 'src/casl/casl-ability.factory'
import { BaseController } from 'src/common/shared/base-controller'
import { ClientQueryDto } from 'src/common/shared/dtos/client-query.dto'
import { IdsDto } from 'src/common/shared/dtos/ids.dto'
import { ACCESS_TOKEN_KEY } from 'src/common/utils/constants/app.constant'
import { CheckPolicies, PoliciesGuard } from 'src/guards/policies.guard'
import InstructorCoursesService from 'src/resources/courses/services/instructor-courses.service'
import { CourseReviewsService } from 'src/resources/reviews/services/course-reviews.service'
import { UserCourseService } from 'src/resources/user-course/user-course.service'
import { CreateUserDto } from '../dto/create-user.dto'
import { UpdateUserDto } from '../dto/update-user.dto'
import { User, UserDocument } from '../schemas/user.schema'
import { UsersService } from '../users.service'

@ApiTags('users')
@Controller('users')
export class UsersController extends BaseController<User, UserDocument> {
  constructor(
    private readonly usersService: UsersService,
    private readonly userCourseService: UserCourseService,
    private readonly courseReviewsService: CourseReviewsService,
    private readonly instructorCoursesService: InstructorCoursesService
  ) {
    super(usersService)
  }

  // FETCHES
  @Get()
  @ApiBearerAuth(ACCESS_TOKEN_KEY)
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can('read', 'User'))
  protected async fetchAll(@Query() query: ClientQueryDto): Promise<User[]> {
    return super.findAll(query)
  }

  @Get('count')
  @ApiBearerAuth(ACCESS_TOKEN_KEY)
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can('read', 'User'))
  @UsePipes(new ValidationPipe({ transform: true }))
  async count(@Query() query: ClientQueryDto): Promise<number> {
    return super.count(query)
  }

  @Get(':id')
  @ApiBearerAuth(ACCESS_TOKEN_KEY)
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can('read', 'User'))
  async fetchById(@Param('id') id: string): Promise<User> {
    return super.findById(id)
  }

  @Get('/info/:username')
  async fetchByUsername(
    @Param('username') username: string,
    @Query() query: ClientQueryDto
  ): Promise<Partial<User> & { countStudents: number; countReviews: number; courses: any }> {
    const user = await this.usersService.findByUsername(username)
    const countStudents = await this.userCourseService.countStudents(user._id, query)
    const countReviews = await this.courseReviewsService.countInstructorCourseReviews(user._id, query)

    const courseQuery = new ClientQueryDto()
    courseQuery.status_filter = 'active'
    const courses = await this.instructorCoursesService.fetchCourses(user._id, courseQuery)

    return {
      username: user.username,
      profile: {
        fullName: user.profile.fullName,
        avatar: user.profile.avatar,
        headline: user.profile.headline,
        biography: user.profile.biography,
      },
      role: user.role,
      countStudents,
      countReviews,
      courses,
    }
  }

  // CREATE
  @Post()
  @ApiBearerAuth(ACCESS_TOKEN_KEY)
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can('create', 'User'))
  create(@Body() data: CreateUserDto) {
    return this.usersService.create(data)
  }

  // UPDATE
  @Patch('deactivate/:id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @ApiBearerAuth(ACCESS_TOKEN_KEY)
  @CheckPolicies((ability: AppAbility) => ability.can('update', 'User'))
  async deactivate(@Param('id') id: string): Promise<User> {
    const item = await this.usersService.updateById(id, {
      status: 'inactive',
    })
    if (item) {
      return item
    }
    throw new BadRequestException()
  }

  @Patch('reactivate/:id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @ApiBearerAuth(ACCESS_TOKEN_KEY)
  @CheckPolicies((ability: AppAbility) => ability.can('update', 'User'))
  async reactivate(@Param('id') id: string): Promise<User> {
    const item = await this.usersService.updateById(id, {
      status: 'active',
    })
    if (item) {
      return item
    }
    throw new BadRequestException()
  }

  @Patch(':id')
  @ApiBearerAuth(ACCESS_TOKEN_KEY)
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can('update', 'User'))
  update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.usersService.updateById(id, data)
  }

  // DELETE
  @Delete('records')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @ApiBearerAuth(ACCESS_TOKEN_KEY)
  @CheckPolicies((ability: AppAbility) => ability.can('delete', 'User'))
  async deleteRecords(@Query() ids: IdsDto): Promise<User[]> {
    return super.deleteMany(ids)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PoliciesGuard)
  @ApiBearerAuth(ACCESS_TOKEN_KEY)
  @CheckPolicies((ability: AppAbility) => ability.can('delete', 'User'))
  async deleteRecord(@Param('id') id: string): Promise<User> {
    return super.deleteOne(id)
  }
}
