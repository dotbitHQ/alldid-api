import { HttpStatus } from '@nestjs/common'
import { CodedError, ErrorCode } from './CodedError'

export class UnknownError extends CodedError {
  constructor (message: string) {
    super(message, ErrorCode.Unknown, HttpStatus.BAD_REQUEST)
  }
}
export class UnregisteredError extends CodedError {
  constructor () {
    super('Unregistered domain name', ErrorCode.UnregisteredName, HttpStatus.BAD_REQUEST)
  }
}

export class UnsupportedError extends CodedError {
  constructor () {
    super('Unsupported domain name', ErrorCode.Unsupported, HttpStatus.NOT_ACCEPTABLE)
  }
}

export class RecordNotFoundError extends CodedError {
  constructor () {
    super('Record is not found', ErrorCode.RecordIsNotFound, HttpStatus.BAD_REQUEST)
  }
}

export class UnsupportedMethodError extends CodedError {
  constructor () {
    super('Unsupported method', ErrorCode.Unsupported, HttpStatus.FORBIDDEN)
  }
}
