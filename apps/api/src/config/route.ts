import { RouterModule } from "@nestjs/core";
import { SummaryModule } from "src/summary/summary.module";
import { TranscriptSegmentModule } from "src/transcript-segment/transcript-segment.module";
import { TranscriptModule } from "src/transcript/transcript.module";
import { VideoModule } from "src/video/video.module";

export const Routes = RouterModule.register([
  {
    path: 'api',
    children: [
      {
        path: "v1",
        children: [
          {
            path: "videos",
            module: VideoModule,
          },
        ]
      }
    ]
  }
]);

export const NestModules = [
  VideoModule,
  TranscriptModule,
  TranscriptSegmentModule,
  SummaryModule
]