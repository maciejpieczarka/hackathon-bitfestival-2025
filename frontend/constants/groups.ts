import { Activities, Activity } from './activities';
import { User } from './users';

export type Group = {
  id: number;
  group_name: string;
  group_description: string;
  group_category: Activity['name'];
  users: User[];
};

export const Groups: Group[] = [
  {
    id: 1,
    group_name: 'Klub milosnikow piwa',
    group_description: 'lorem ipsum dolor sit amet',
    group_category: Activities[3].name,
    users: [
      {
        id: 1,
        username: 'uzytkownik1',
        description: 'asd',
        activities: [Activities[3]]
      }
    ]
  }
];
