import { StyleSheet } from "react-native";
import { colors } from "@/styles/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: 36,
    position: "absolute",
    zIndex: 1,
    top: 20,
  },
  content: {
    gap: 8,
    paddingHorizontal: 24,
  },
});
