import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common'
import { IpOfHeader } from '../decorators/ip-of-header.decorator'
import { CodedError, ErrorCode } from '../error/CodedError'

@Controller('/demo')
export class DemoController {
  @Get('/coded-error')
  codedError () {
    throw new CodedError('This is a demo coded-exception, with code 1001 and status 500', ErrorCode.noAuth)
  }

  @Get('/coded-error-using-status')
  codedErrorUsingStatus () {
    throw new CodedError('This is a demo coded-exception, with code 418 and status 418', HttpStatus.I_AM_A_TEAPOT)
  }

  @Get('/coded-error-with-different-status')
  codedErrorWithDifferentStatus () {
    throw new CodedError('This is a demo coded-exception, with code 1001 and status 401', ErrorCode.noAuth, HttpStatus.UNAUTHORIZED)
  }

  @Get('/exception')
  exception () {
    throw new HttpException('This is a demo exception', 410)
  }

  @Get('/error')
  error () {
    throw new Error('This is a demo error')
  }

  @Get('/ip')
  ip (@IpOfHeader() ip: string) {
    console.log(ip)
    return ip
  }
}
