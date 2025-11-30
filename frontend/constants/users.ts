import { Activity } from './activities';

export type User = {
  id: number;
  username: string;
  description: string;
  activities: Activity[];
};
