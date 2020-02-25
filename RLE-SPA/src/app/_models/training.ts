import { TrainingClass } from './trainingClass';

export class Training {
  id: number;
  regionId: number;
  name: string;
  regionName: string;
  description: string;
  totalClasses: number;
  totalTrainers: number;
  totalParticipants: number;
  trainingClasses: TrainingClass[];
}
