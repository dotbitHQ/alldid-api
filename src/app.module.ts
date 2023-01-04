import { Module, CacheModule } from '@nestjs/common'
import { AppController } from './app.controller'
@Module({
  imports: [
    CacheModule.register({
      ttl: 300,
      max: 100,
    })
  ],
  controllers: [
    AppController,
  ],
  providers: [],
  exports: [
  ]
})
export class ApplicationModule {
}
