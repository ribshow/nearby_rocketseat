import { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import { api } from "@/service/api";
import { Categories, CategoriesProps } from "@/components/categories";
import { PlaceProps } from "@/components/place";
import { Places } from "@/components/places";

type MarketsProps = PlaceProps;

export default function Home() {
  const [categories, setCategories] = useState<CategoriesProps>([]);
  const [category, setCategory] = useState("");
  const [markets, setMarkets] = useState<MarketsProps[]>([]);

  // consumindo o end point de categories
  async function fetchCategories() {
    try {
      const { data } = await api.get("/categories");
      setCategories(data); // armarzenando a resposta da api em categories
      setCategory(data[0].id); // definindo como padrão a categoria selecionada como a 1 posição do array
    } catch (error) {
      console.log(error);
      Alert.alert("Categories", "Não foi possível carregar as categorias!");
    }
  }

  // consumindo o end point de markets
  async function fetchMarkets() {
    try {
      if (!category) {
        return;
      }
      const { data } = await api.get("/markets/category/" + category);
      setMarkets(data);
      console.log(category);
    } catch (error) {
      console.log(error);
      Alert.alert("Places", "Não foi possível carregar os lugares");
    }
  }

  // sempre que a página é recarregada ele carrega as categorias
  useEffect(() => {
    fetchCategories();
  }, []);

  // aplicando dependência, fetchMarkets, depende de fetchCategories
  useEffect(() => {
    fetchMarkets();
  }, [category]);

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Categories
        data={categories}
        onSelect={setCategory}
        selected={category}
      />
      <Places data={markets} />
    </View>
  );
}
