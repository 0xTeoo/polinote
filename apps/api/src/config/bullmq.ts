import { BullModule } from "@nestjs/bullmq";
import { ConfigService } from "@nestjs/config";

export const BullMQConfig = BullModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    connection: {
      host: configService.getOrThrow<string>('bullmq.host'),
      port: configService.getOrThrow<number>('bullmq.port'),
    },
  }),
})