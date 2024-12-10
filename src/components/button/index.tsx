import {
  TouchableOpacity,
  TouchableOpacityProps,
  Text,
  TextProps,
  ActivityIndicator,
} from "react-native";
import { styles } from "./styles";
import { colors } from "@/styles/theme";
import { IconProps as TablerIconProps } from "@tabler/icons-react-native";

type ButtonProps = TouchableOpacityProps & {
  isLoading?: boolean;
};

function Button({ children, style, isLoading = false, ...rest }: ButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      activeOpacity={0.7}
      disabled={isLoading}
      {...rest}
    >
      {/* If ternário, se loading for true exibe o loading se não exibe o text */}
      {isLoading ? (
        <ActivityIndicator size="small" color={colors.gray[100]} />
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

// tipo para o button
type IconProps = {
  icon: React.ComponentType<TablerIconProps>;
};

// icone para o button
function Icon({ icon: Icon }: IconProps) {
  return <Icon size={24} color={colors.gray[100]} />;
}

function Title({ children }: TextProps) {
  return <Text style={styles.title}>{children}</Text>;
}

// criando uma propriedade title para o botão e dizendo que ela recebe title
Button.Title = Title;
Button.Icon = Icon;

export { Button };
