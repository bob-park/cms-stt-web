type Status = 'WAITING' | 'PROCEEDING' | 'SUCCESS' | 'FAILURE';

interface AssetSttJob {
  id: string;
  assetId: number;
  status: Status;
  sourcePath: string;
  createdDate: Date;
  lastModifiedDate?: Date;
}

interface AssetSttSpeaker {
  id: string;
  speaker: string;
  speakerName: string;
  createdDate: Date;
  lastModifiedDate?: Date;
}

interface AssetSttText {
  id: string;
  startTime: number;
  endTime: number;
  speaker?: AssetSttSpeaker;
  text: string;
  createdDate: Date;
  lastModifiedDate?: Date;
}
