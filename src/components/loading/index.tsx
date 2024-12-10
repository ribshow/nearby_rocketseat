import { ActivityIndicator } from "react-native";
import { styles } from "./styles";
import { colors } from "@/styles/theme";

export function Loading() {
  return (
    // definindo a cor verde básica, e os estilos ele pega do container definido no arquivo styles.ts
    // ActivityIndicator retorna um loading animado
    <ActivityIndicator color={colors.green.base} style={styles.container} />
  );
}
