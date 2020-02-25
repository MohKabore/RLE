import { User } from './user';

export class TrainingClass {
  id: number;
  name: string;
  regionId: number;
  trainingId: number;
  regionName: string;
  departmentId: number;
  departmentName: string;
  startDate: string;
  endDate: string;
  cityId: number;
  cityName; string;
  totalTrainers: number;
  totalParticipants: number;
  trainers: User[];
  participants: User[];
  trainerIds: [];
}
