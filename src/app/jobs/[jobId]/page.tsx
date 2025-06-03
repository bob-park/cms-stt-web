import SttContents from '@/app/jobs/[jobId]/_components/SttContents';
import SttContentsProvider from '@/app/jobs/[jobId]/_components/SttContentsProvider';

import VideoPlayerProvider from '@/shared/components/player/VideoPlayerProvider';

import { VideoContents } from './_components/VideoContents';

export default async function JobPage({ params }: { params: Promise<{ jobId: string }> }) {
  const jobId = (await params).jobId;

  return (
    <SttContentsProvider assetId={1} jobId={jobId}>
      <VideoPlayerProvider>
        <div className="flex size-full flex-col gap-3 lg:flex-row">
          {/*  contents  */}
          <div className="flex flex-col gap-3">
            <div className="">
              <VideoContents jobId={jobId} />
            </div>
            <div className="">화자</div>
          </div>

          <div className="h-[500px] w-full lg:h-[calc(100vh-250px)] lg:w-[450px] lg:flex-none lg:shrink">
            <SttContents />
          </div>
        </div>
      </VideoPlayerProvider>
    </SttContentsProvider>
  );
}
