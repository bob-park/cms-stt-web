import { getAssetSttJobs } from '@/domain/assets/api/assetSttJob';

import { useQuery } from '@tanstack/react-query';

export function useAssetSttJob({ assetId, params }: { assetId: number; params: SearchPageParams }) {
  const { data, isLoading } = useQuery<Page<AssetSttJob>>({
    queryKey: ['assets', assetId, 'stt', 'jobs', params],
    queryFn: () => getAssetSttJobs(assetId, params),
  });

  return { jobs: data, isLoading };
}
