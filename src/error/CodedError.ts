import { HttpException, HttpStatus } from '@nestjs/common'

export class CodedError extends HttpException {
  code: number | string

  constructor (message: string, code: HttpStatus | ErrorCode = HttpStatus.INTERNAL_SERVER_ERROR, status?: HttpStatus) {
    if (!status) {
      if (code >= 100 && code <= 999) {
        status = code as HttpStatus
      }
      else {
        status = HttpStatus.INTERNAL_SERVER_ERROR
      }
    }
    super({
      statusCode: code,
      message,
    }, status)

    this.code = code
  }
}

export class InvalidParameterError extends CodedError {
  constructor () {
    super('Invalid parameter', ErrorCode.InvalidParameter, HttpStatus.BAD_REQUEST)
  }
}

// The code can not smaller than 1000, as hundreds are designed for http code
export enum ErrorCode {
  // account
  noAuth = 1001,

  InvalidParameter = 4000,

  UnregisteredName = 4001,
  RecordIsNotFound = 4002,
  Unsupported = 4003,

  Unknown = 5000,
}
