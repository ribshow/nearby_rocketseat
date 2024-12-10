// permite que criemos um componente de estilo
import { StyleSheet } from "react-native";
import { colors } from "@/styles/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1, // usar todo espaço disponível em tela
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.gray[100],
  },
});
