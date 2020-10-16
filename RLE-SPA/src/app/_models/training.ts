import { TrainingClass } from './trainingClass';

export class Training {
  id: number;
  regionId: number;
  name: string;
  strTrainingDate: string;
  regionName: string;
  description: string;
  totalClasses: number;
  totalClosed: number;
  totalSummarized: number;
  totalTrainers: number;
  totalParticipants: number;
  trainingDate: Date;
  totalTrained: number;
  trainingClasses: TrainingClass[];
}
