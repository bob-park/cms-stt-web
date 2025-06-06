'use client';

import { createContext, use, useEffect, useMemo, useState } from 'react';

import { useAssetSttText } from '@/domain/assets/query/assetSttText';

interface SttContentsContextState {
  contents: AssetSttText[];
  current?: AssetSttText;
  onUpdateCurrent?: (id?: string) => void;
}

export const SttContentsContext = createContext<SttContentsContextState>({
  contents: [],
});

interface SttContentsProviderProps {
  children: React.ReactNode;
  assetId: number;
  jobId: string;
}

export default function SttContentsProvider({ children, assetId, jobId }: SttContentsProviderProps) {
  // state
  const [current, setCurrent] = useState<AssetSttText>();

  // query
  const { texts } = useAssetSttText({ assetId, jobId, params: { page: 0, size: 1_000 } });

  // memorize
  const memoContextValue = useMemo<SttContentsContextState>(
    () => ({
      contents: texts?.content || [],
      current,
      onUpdateCurrent: (id?: string) => {
        if (!id) {
          setCurrent(undefined);
          return;
        }

        const contents = texts?.content || [];

        const content = contents.find((item) => item.id === id);

        setCurrent(content);
      },
    }),
    [texts, current],
  );

  return <SttContentsContext.Provider value={memoContextValue}>{children}</SttContentsContext.Provider>;
}
