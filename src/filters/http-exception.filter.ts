import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { Response, Request } from 'express'
import { CodedError } from '../error/CodedError'

@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
  catch (exception: HttpException | CodedError| Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const code = (exception as CodedError).code || status

      response
        .status(status)
        .json({
          code,
          msg: exception.message,
          ts: new Date().toISOString(),
          url: request.url,
        })
    }
    else {
      response.status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          msg: exception.message,
          ts: new Date().toISOString(),
          url: request.url,
        })
    }
  }
}
