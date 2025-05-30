'use client';

import { useContext, useEffect } from 'react';

import { SttContentsContext } from '@/app/jobs/[jobId]/_components/SttContentsProvider';

import { TimeCode } from '@/domain/timecode/model/timecode';

import cx from 'classnames';

const ID_STT_CONTAINER = 'stt_contents_container';
const DEFAULT_ITEM_HEIGHT = 101;

export default function SttContents() {
  // context
  const { contents, current } = useContext(SttContentsContext);

  // useEffect
  useEffect(() => {
    const container = document.getElementById(ID_STT_CONTAINER) as HTMLUListElement;

    const index = contents.findIndex((item) => item.id === current?.id);

    if (index < 0) {
      return;
    }

    container.scroll({
      top: DEFAULT_ITEM_HEIGHT * index,
    });
  }, [current]);

  return (
    <div className="bg-base-200 flex size-full flex-col items-center justify-center rounded-2xl p-3 shadow-md">
      <ul id={ID_STT_CONTAINER} className="list bg-base-100 rounded-box relative m-3 size-full overflow-auto shadow-md">
        <li className="sticky top-0 z-100 bg-white p-4 pb-2 text-xs tracking-wide">자막</li>

        {contents?.map((content) => (
          <li
            key={`asset-stt-text-item-${content.id}`}
            className={cx('list-row hover:bg-base-200 cursor-pointer', content.id === current?.id && 'bg-base-300')}
          >
            <div className="w-full">
              <div className="font-semibold text-gray-400">
                {content.speaker?.speakerName || content.speaker?.speaker || 'Unknown'}
              </div>
              <div className="text-xs font-semibold text-pretty break-keep opacity-60">{content.text}</div>
            </div>
            <p className="list-col-wrap text-xs">
              <span className="">{new TimeCode(content.startTime).toString()}</span>
              <span className=""> - </span>
              <span className="">{new TimeCode(content.endTime).toString()}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
