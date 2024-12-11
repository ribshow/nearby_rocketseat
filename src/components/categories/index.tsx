import { View, FlatList, ScrollView } from "react-native";
import { Category } from "../category";
import { styles } from "./styles";

export type CategoriesProps = {
  id: string;
  name: string;
}[]; // dizendo que é uma lista de categorias

type Props = {
  data: CategoriesProps;
  selected: string; // passando quem está selecionado
  onSelect: (id: string) => void; // passando um método que não retorna nada
};

export function Categories({ data, selected, onSelect }: Props) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Category
          name={item.name}
          iconId={item.id}
          onPress={() => onSelect(item.id)}
          isSelected={item.id === selected}
        />
      )}
      horizontal // posiciona os nomes na horizontal
      showsHorizontalScrollIndicator={false} // elimina a barrinha de rolagem
      contentContainerStyle={styles.content}
      style={styles.container}
      scrollEnabled={true} // Habilita o scroll
    />
  );
}
