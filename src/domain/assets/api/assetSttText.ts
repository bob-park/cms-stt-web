import api from '@/shared/api';

export async function getAssetSttText({
  assetId,
  jobId,
  params,
}: {
  assetId: number;
  jobId: string;
  params: SearchPageParams;
}) {
  return api
    .get(`/api/v1/assets/${assetId}/stt/jobs/${jobId}/texts`, {
      searchParams: params,
    })
    .json<Page<AssetSttText>>();
}
