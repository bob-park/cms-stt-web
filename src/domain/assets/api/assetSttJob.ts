import api from '@/shared/api';

export async function getAssetSttJobs(assetId: number, params: SearchPageParams) {
  return api.get(`/api/v1/assets/${assetId}/stt/jobs`, { searchParams: params }).json<Page<AssetSttJob>>();
}
