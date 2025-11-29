import { Activities, Activity } from './activities';

export type User = {
  id: number;
  name: string;
  image: string;
  description: string;
  activities: Activity[];
};

export const users: User[] = [
  {
    id: 1,
    name: 'Uzytkownik 1',
    description:
      'Lorem ipsum dolor sit amet consecteur Lorem ipsum dolor sit amet consecteur',
    image: require('@/assets/images/woman.jpg'),
    activities: [
      { id: 4, name: 'Rysowanie' },
      { id: 5, name: 'Malowanie' }
    ]
  },
  {
    id: 2,
    name: 'Uzytkownik 2',
    description:
      'Lorem ipsum dolor sit amet consecteur Lorem ipsum dolor sit amet consecteur',
    image: require('@/assets/images/man.jpg'),
    activities: [Activities[3], Activities[5]]
  },
  {
    id: 3,
    name: 'Uzytkownik 3',
    description:
      'Lorem ipsum dolor sit amet consecteurconsecteurconsecteurconsecteurconsecteurconsecteurconsecteurconsecteurconsecteurconsecteurconsecteurconsecteurconsecteurconsecteur Lorem ipsum dolor sit amet consecteur',
    image: require('@/assets/images/woman.jpg'),
    activities: [Activities[7], Activities[8], Activities[5]]
  },
  {
    id: 4,
    name: 'Uzytkownik 4',
    description:
      'Lorem ipsum dolor sit amet consecteur Lorem ipsum dolor sit amet consecteur',
    image: require('@/assets/images/man.jpg'),
    activities: [Activities[3], Activities[5]]
  }
];
