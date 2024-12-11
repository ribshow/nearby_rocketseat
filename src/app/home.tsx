import { useEffect, useState } from "react";
import { View, Text, Alert, ScrollView } from "react-native";
// biblioteca de maps
import MapView, { Callout, Marker } from "react-native-maps";
import * as Location from "expo-location";
import { router } from "expo-router";

// serviço de api
import { api } from "@/service/api";

// components
import { Categories, CategoriesProps } from "@/components/categories";
import { PlaceProps } from "@/components/place";
import { Places } from "@/components/places";
import { colors, fontFamily } from "@/styles/theme";

// extendendo a interface de placeprops
type MarketsProps = PlaceProps & {
  latitude: number;
  longitude: number;
};

const currentLocation = {
  latitude: -23.561187293883442,
  longitude: -46.656451388116494,
};

export default function Home() {
  const [categories, setCategories] = useState<CategoriesProps>([]);
  const [category, setCategory] = useState("");
  const [markets, setMarkets] = useState<MarketsProps[]>([]);
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );

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
    } catch (error) {
      console.log(error);
      Alert.alert("Places", "Não foi possível carregar os lugares");
    }
  }

  // função que pega a localização atual do usuário
  async function getCurrentLocation() {
    try {
      // perdindo permissão para acessar a localização do usuário
      const { granted } = await Location.requestForegroundPermissionsAsync();

      if (granted) {
        const location = await Location.getCurrentPositionAsync({});
        setLocation(location);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // sempre que a página é recarregada ele carrega as categorias
  useEffect(() => {
    getCurrentLocation();
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
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        {/* Adicionando um marcador para a posição de referência(atual) */}
        <Marker
          identifier="current"
          coordinate={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
          }}
          image={require("@/assets/location.png")}
        />
        {markets.map((item) => (
          <Marker
            key={item.id}
            identifier={item.id}
            coordinate={{
              latitude: item.latitude,
              longitude: item.longitude,
            }}
            image={require("@/assets/pin.png")}
          >
            {/* Ao clicar no balão deve ir para página de detalhes */}
            <Callout onPress={() => router.navigate(`/market/${item.id}`)}>
              <View>
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.gray[600],
                    fontFamily: fontFamily.medium,
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{
                    width: 40,
                    fontSize: 12,
                    color: colors.gray[600],
                    fontFamily: fontFamily.regular,
                  }}
                >
                  {item.address}
                </Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <Places data={markets} />
    </View>
  );
}
