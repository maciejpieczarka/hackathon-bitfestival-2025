import { Activity } from '@/constants/activities';
import type { User } from '@/constants/users';
import { Box } from './ui/box';
import { Button, ButtonIcon, ButtonText } from './ui/button';
import { Heading } from './ui/heading';
import { ArrowRightIcon } from './ui/icon';
import { Image } from './ui/image';
import { Text } from './ui/text';

const UserCard = ({ id, name, activities, image, description }: User) => {
  return (
    <Box className="my-4 w-full bg-white shadow-sm flex items-start p-2 rounded-3xl">
      <Image
        className="object-top rounded-3xl object-fill w-full top-0"
        size="2xl"
        source={image}
        alt={name}
      />
      <Box className="px-4">
        <Heading size="md" className="text-left my-2">
          {name}
        </Heading>
        <Text>{description.substring(0, 90) + '...'}</Text>
        <Box className="mt-4 flex flex-col justify-start">
          <Heading size="sm">Aktywności</Heading>
          <Box className="flex flex-row gap-2 py-1 flex-wrap">
            {activities.map(({ id, name }: Activity) => {
              return (
                <Box
                  key={id}
                  className="border-info-500 border-2 rounded-lg px-2 bg-info-50/50"
                >
                  <Text>{name}</Text>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>

      <Box className="w-full flex px-4 ">
        <Button action="positive" variant="solid" className="my-4 rounded-2xl">
          <ButtonText>Zobacz Profil</ButtonText>
          <ButtonIcon as={ArrowRightIcon} />
        </Button>
      </Box>
    </Box>
  );
};

export default UserCard;
