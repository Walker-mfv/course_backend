import { Test, TestingModule } from '@nestjs/testing'
import { QuizzesController } from './quizzes.controller'
import { QuizzesService } from './quizzes.service'

describe('QuizzesController', () => {
  let controller: QuizzesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizzesController],
      providers: [QuizzesService],
    }).compile()

    controller = module.get<QuizzesController>(QuizzesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
