import { Module, NestModule, MiddlewareConsumer, CacheModule } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { AppController } from './app.controller'
import { DemoModule } from './demo/demo.module'
@Module({
  imports: [
    ScheduleModule.forRoot(),
    DemoModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
  ],
  exports: [
  ]
})
export class ApplicationModule {
}
