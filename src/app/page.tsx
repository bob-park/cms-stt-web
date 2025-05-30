'use client';

import { FaPlay, FaRegHeart } from 'react-icons/fa';

import { useRouter } from 'next/navigation';

import { useAssetSttJob } from '@/domain/assets/query/assetSttJob';

export default function Home() {
  // hooks
  const router = useRouter();

  // query
  const { jobs } = useAssetSttJob({ assetId: 1, params: { page: 0, size: 25 } });

  // handle
  const handleClick = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  return (
    <div className="flex size-full flex-col items-center justify-center gap-3 p-3">
      {/* contents */}
      <div className="w-full max-w-[600px]">
        <ul className="list bg-base-100 rounded-box shadow-md">
          <li className="p-4 pb-2 text-xs tracking-wide opacity-60">Most played videos this week</li>

          {jobs?.content.map((item) => (
            <li
              key={`asset-stt-job-${item.id}`}
              className="list-row hover:bg-base-200 cursor-pointer"
              onClick={() => handleClick(item.id)}
            >
              <div>
                <img
                  className="rounded-box size-10"
                  src="https://img.daisyui.com/images/profile/demo/1@94.webp"
                  alt="img"
                />
              </div>
              <div>
                <div>{item.sourcePath}</div>
                <div className="text-xs font-semibold uppercase opacity-60">{item.id}</div>
              </div>
              <button className="btn btn-square btn-ghost">
                <FaPlay className="size-6" />
              </button>
              <button className="btn btn-square btn-ghost">
                <FaRegHeart className="size-6" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
