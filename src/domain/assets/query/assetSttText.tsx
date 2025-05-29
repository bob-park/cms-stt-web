import { getAssetSttText } from '@/domain/assets/api/assetSttText';

import { useQuery } from '@tanstack/react-query';

export function useAssetSttText({
  assetId,
  jobId,
  params,
}: {
  assetId: number;
  jobId: string;
  params: SearchPageParams;
}) {
  const { data, isLoading } = useQuery<Page<AssetSttText>>({
    queryKey: ['assets', assetId, 'stt', 'jobs', jobId, 'texts'],
    queryFn: () => getAssetSttText({ assetId, jobId, params }),
  });

  return { texts: data, isLoading };
}
