import { City } from './city';
import { User } from './user';

export class TrainingClass {
  id: number;
  name: string;
  regionId: number;
  trainingId: number;
  sessionName: string;

  regionName: string;
  departmentId: number;
  departmentName: string;
  startDate: string;
  endDate: string;
  cityId: number;
  status: number;
  Active: boolean;
  cityName; string;
  totalTrainers: number;
  totalParticipants: number;
  trainers: User[];
  cities: City[];
  participants: User[];
  trainerIds: [];
  trainingDate: Date;
  totalTrained: number;
  totalPhotos: number;
  summarized: boolean;
}
