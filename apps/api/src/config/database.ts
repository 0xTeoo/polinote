import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Video,
  Transcript,
  TranscriptSegment,
  Summary,
} from '@polinote/entities';
import * as path from "path";
import * as fs from "fs";

const entities = [Video, Transcript, TranscriptSegment, Summary];

export const PostgresDataSource = TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    database: configService.getOrThrow<string>('database.name'),
    host: configService.getOrThrow<string>('database.host'),
    port: configService.getOrThrow<number>('database.port'),
    username: configService.getOrThrow<string>('database.username'),
    password: configService.getOrThrow<string>('database.password'),
    logging: !configService.getOrThrow<boolean>('isProduction'),
    synchronize: !configService.getOrThrow<boolean>('isProduction'),
    entities,
    ...(configService.getOrThrow<boolean>("isProduction")
      ? {
        ssl: {
          ca: fs.readFileSync(
            path.join(process.cwd(), "ap-northeast-2-bundle.pem")
          ),
        },
      }
      : {}),
  }),
});
