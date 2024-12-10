import { View, Text } from "react-native";
import { Welcome } from "@/components/welcome";
import { Steps } from "@/components/steps";

export default function Index() {
  return (
    <View style={{ flex: 1, padding: 20, gap: 20 }}>
      <Welcome />
      <Steps />
    </View>
  );
}
