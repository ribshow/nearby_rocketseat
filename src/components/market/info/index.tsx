import { View, Text } from "react-native";

import { IconProps } from "@tabler/icons-react-native";

import { styles } from "./styles";
import { colors } from "@/styles/theme";

type Props = {
  description: string;
  icon: React.ComponentType<IconProps>;
};

export function Info({ icon: Icon, description }: Props) {
  return (
    <View style={styles.container}>
      <Icon size={16} color={colors.red.base} />
      <Text style={styles.text}>{description}</Text>
    </View>
  );
}
