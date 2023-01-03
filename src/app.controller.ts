import { Get, Controller, Req, Ip, Query, BadRequestException, HttpStatus, CacheInterceptor, UseInterceptors, ExecutionContext, CacheTTL, Session, UseGuards } from '@nestjs/common'

@Controller()
export class AppController {
  @Get('/')
  root (): string {
    return 'Hello World!'
  }
}
