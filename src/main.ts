import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { HttpStatus, ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
// import session from 'express-session'
// import MysqlSession from 'express-mysql-session'
import { ApplicationModule } from './app.module'
import abcConfig from './config'
import { CodedError } from './error/CodedError'
import { HttpExceptionFilter } from './filters/http-exception.filter'

async function bootstrap () {
  const appOptions = { cors: true }
  const app = await NestFactory.create<NestExpressApplication>(ApplicationModule, appOptions)

  app.setGlobalPrefix('api')
  app.useGlobalFilters(new HttpExceptionFilter())
  // todo: maybe this can use a filter instead.
  app.useGlobalPipes(new ValidationPipe({
    // https://docs.nestjs.com/techniques/validation#disable-detailed-errors
    // disableErrorMessages: true,
    transform: true,
    exceptionFactory (errors) {
      const constraints = errors[0].constraints

      return new CodedError(constraints[Object.keys(constraints)[0]], HttpStatus.BAD_REQUEST)
    }
  }))

  app.set('trust proxy', 'loopback')

  // ------ session start ------
  // const MysqlStore = MysqlSession(session)
  // const mysqlBlockABC = config.mysql.blockabc
  // const sessionStore = new MysqlStore({
  //   host: mysqlBlockABC.host,
  //   port: mysqlBlockABC.port,
  //   user: mysqlBlockABC.username,
  //   password: mysqlBlockABC.password,
  //   database: mysqlBlockABC.database,
  //   connectionLimit: 2,
  // })
  //
  // app.use(
  //   session({
  //     key: 'abcsess',
  //     secret: config.session.secret,
  //     store: sessionStore,
  //     saveUninitialized: false,
  //     resave: false,
  //     cookie: {
  //       maxAge: 1000 * 60 * 60 * 24 * 7,
  //     }
  //   })
  // )
  // ------ session end ------

  // ------ swagger start ------
  const swaggerOptions = new DocumentBuilder()
    .setTitle('NestJS Realworld Example App')
    .setDescription('The Realworld API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, swaggerOptions)
  SwaggerModule.setup('/api/docs', app, document)
  // ------ swagger end ------

  await app.listen(abcConfig.port).then(res => {
    console.log(`app is running on port ${abcConfig.port}`, `http://127.0.0.1:${abcConfig.port}/api`)
  })

  // notify pm2 when server is started
  process.send?.('ready')
}
void bootstrap()
