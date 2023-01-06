import { ArgumentsHost, Catch } from '@nestjs/common'
import { CodedError } from '../error/CodedError'
import {
  UnregisteredError,
  UnsupportedError,
  RecordNotFoundError,
  UnknownError,
  UnsupportedMethodError
} from '../error/AllDIDError'
import { HttpExceptionFilter } from './http-exception.filter'
import {
  AllDIDError as AllDIDException,
  AllDIDErrorCode as AllDIDExceptionCode
} from 'alldid'

@Catch(AllDIDException)
export class AllDIDExceptionFilter extends HttpExceptionFilter {
  catch (exception: AllDIDException, host: ArgumentsHost): void {
    let alldidException: CodedError
    switch (exception.code) {
      case AllDIDExceptionCode.DidIsNotSupported: alldidException = new UnsupportedError(); break
      case AllDIDExceptionCode.UnsupportedMethod: alldidException = new UnsupportedMethodError(); break
      case AllDIDExceptionCode.UnregisteredName: alldidException = new UnregisteredError(); break
      case AllDIDExceptionCode.RecordIsNotFound: alldidException = new RecordNotFoundError(); break
      default: alldidException = new UnknownError(exception.message)
    }
    const status = alldidException.getStatus()
    const code = alldidException?.code || status
    this.response(status, code, alldidException, host)
  }
}
