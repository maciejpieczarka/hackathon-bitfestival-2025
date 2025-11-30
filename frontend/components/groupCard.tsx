import { Group } from '@/constants/groups';
import { Box } from './ui/box';
import { Button, ButtonIcon, ButtonText } from './ui/button';
import { Heading } from './ui/heading';
import { ArrowRightIcon } from './ui/icon';
import { Text } from './ui/text';

const GroupCard = ({
  id,
  group_name,
  group_category,
  group_description,
  users
}: Group) => {
  console.log(users);
  return (
    <Box className="my-4 w-full bg-white shadow-sm flex items-start p-2 rounded-3xl">
      <Box className="px-4">
        <Heading size="md" className="text-left my-2">
          {group_name}
        </Heading>
        <Text>
          {group_description ? group_description.substring(0, 90) : '...'}
        </Text>
        <Box className="mt-4 flex flex-col justify-start">
          <Heading size="sm">Aktywności</Heading>
          <Box className="flex flex-row gap-2 py-1 flex-wrap">
            {users.map(({ email, id, username }: any) => {
              return (
                <Box
                  key={id}
                  className="border-info-500 border-2 rounded-lg px-2 bg-info-50/50"
                >
                  <Text>{username}</Text>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>

      <Box className="w-full flex px-4 ">
        <Button action="positive" variant="solid" className="my-4 rounded-2xl">
          <ButtonText>Dołącz do grupy</ButtonText>
          <ButtonIcon as={ArrowRightIcon} />
        </Button>
      </Box>
    </Box>
  );
};

export default GroupCard;
