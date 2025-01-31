import { CaslModule } from 'src/casl/casl.module'
import { Module } from '@nestjs/common'
import { FilesService } from './files.service'
import { FilesController } from './files.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { FileAsyncModelFactory } from './schemas/file.schema'
import { SharedModule } from 'src/common/shared/shared.module'

@Module({
  imports: [MongooseModule.forFeatureAsync([FileAsyncModelFactory]), SharedModule, CaslModule],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
