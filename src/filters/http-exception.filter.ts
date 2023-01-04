import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { Response, Request } from 'express'
import { CodedError } from '../error/CodedError'

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
  catch (exception: HttpException | CodedError| Error, host: ArgumentsHost): void {
    this.handler(exception, host)
  }

  response (
    status: number,
    code: string | number,
    exception: HttpException | CodedError| Error,
    host: ArgumentsHost
  ): void {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    response
        .status(status)
        .json({
          code,
          msg: exception.message,
          ts: new Date().toISOString(),
          url: request.url,
        })
  }

  handler (exception: HttpException | CodedError| Error, host: ArgumentsHost): void {
    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const code = (exception as CodedError).code || status
      this.response(status, code, exception, host)
    }
    else {
      this.response(HttpStatus.INTERNAL_SERVER_ERROR, HttpStatus.INTERNAL_SERVER_ERROR, exception, host)
    }
  }
}
