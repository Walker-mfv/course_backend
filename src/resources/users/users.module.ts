import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CaslModule } from 'src/casl/casl.module'
import { MomoService } from 'src/common/shared/services/momo.service'
import { SharedModule } from 'src/common/shared/shared.module'
import { StatisticModule } from 'src/features/statistic/statistic.module'
import { CoursesModule } from '../courses/courses.module'
import { NotificationsModule } from '../notifications/notifications.module'
import { PaymentsModule } from '../payments/payments.module'
import { TransactionsModule } from '../transactions/transactions.module'
import { UserCourseModule } from '../user-course/user-course.module'
import { ReviewsModule } from './../reviews/reviews.module'
import { RolesModule } from './../roles/roles.module'
import { UserCartController } from './controllers/user-cart.controller'
import { UserInstructorController } from './controllers/user-instructor.controller'
import { UserLearningController } from './controllers/user-learning.controller'
import { UsersMeController } from './controllers/user-me.controller'
import { UserMyCoursesController } from './controllers/user-my-courses.controller'
import { UserPaymentsController } from './controllers/user-payment.controller'
import { UsersController } from './controllers/users.controller'
import { User, UserSchema } from './schemas/user.schema'
import { UserMeService } from './services/user-me.service'
import { UserPaymentService } from './services/user-payment.service'
import { UsersService } from './users.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    CoursesModule,
    UserCourseModule,
    ReviewsModule,
    SharedModule,
    CaslModule,
    PaymentsModule,
    TransactionsModule,
    RolesModule,
    StatisticModule,
    NotificationsModule,
  ],
  controllers: [
    UserCartController,
    UserLearningController,
    UserMyCoursesController,
    UserInstructorController,
    UsersMeController,
    UserPaymentsController,
    UsersController,
  ],
  providers: [UsersService, UserPaymentService, UserMeService, MomoService],
  exports: [UsersService],
})
export class UsersModule {}
