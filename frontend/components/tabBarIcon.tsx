import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Dimensions, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface tabBarIconProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  page: string;
  color: string;
  focused: boolean;
}

const TabBarIcon = ({ icon, page, color, focused }: tabBarIconProps) => {
  return (
    <View style={{ width: width / 3 }} className="items-center">
      <MaterialIcons name={icon} size={24} color={color} />
      <Text
        style={{ color: color }}
        className={`pt-1 text-md ${
          focused == true ? 'font-bold' : 'font-normal'
        }`}
      >
        {page}
      </Text>
    </View>
  );
};

export default TabBarIcon;
