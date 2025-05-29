import { VideoContents } from './_components/VideoContents';

export default async function JobPage({ params }: { params: Promise<{ jobId: string }> }) {
  const jobId = (await params).jobId;

  return (
    <div className="flex size-full flex-col items-center gap-3 lg:flex-row">
      {/*  contents  */}
      <div className="flex-1">
        <VideoContents jobId={jobId} />
      </div>

      <div className="bg-base-300 w-full lg:w-[450px] lg:flex-none">
        <div>text</div>
      </div>
    </div>
  );
}
