import SttContents from '@/app/jobs/[jobId]/_components/SttContents';
import SttContentsProvider from '@/app/jobs/[jobId]/_components/SttContentsProvider';

import { VideoContents } from './_components/VideoContents';

export default async function JobPage({ params }: { params: Promise<{ jobId: string }> }) {
  const jobId = (await params).jobId;

  return (
    <div className="flex size-full flex-col gap-3 lg:flex-row">
      <SttContentsProvider assetId={1} jobId={jobId}>
        {/*  contents  */}
        <div className="flex-1">
          <VideoContents jobId={jobId} />
        </div>

        <div className="h-[500px] w-full lg:h-[calc(100vh-250px)] lg:w-[450px] lg:flex-none">
          <SttContents />
        </div>
      </SttContentsProvider>
    </div>
  );
}
