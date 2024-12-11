// Hooks
import { useEffect, useState, useRef } from "react";
import { router, useLocalSearchParams, Redirect } from "expo-router";
import { useCameraPermissions, CameraView } from "expo-camera";
// Components nativos
import { View, Alert, ScrollView, Modal, StatusBar } from "react-native";

// Api
import { api } from "@/service/api";

// Components
import { Loading } from "@/components/loading";
import { Cover } from "@/components/market/cover";
import { Details } from "@/components/market/details";
import { Coupon } from "@/components/market/coupon";
import { Button } from "@/components/button";

// Tipagem
import { PropsDetails } from "@/components/market/details";

type DataProps = PropsDetails & {
  cover: string;
};

export default function Market() {
  const [data, setData] = useState<DataProps>();
  const [coupon, setCoupon] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [couponIsFetching, setCouponIsFetching] = useState(false);
  const [isVisibleCameraModal, setIsVisibleCameraModal] = useState(false);

  const [permission, requestPermission] = useCameraPermissions();
  const params = useLocalSearchParams<{ id: string }>();

  const qrLock = useRef(false);

  async function fetchMarket() {
    try {
      const { data } = await api.get(`/markets/${params.id}`);
      setData(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Não foi possível os dados", [
        { text: "Ok", onPress: () => router.back }, // volta para tela anterior em caso de erro
      ]);
    }
  }
  // função para abrir câmera
  async function handleOpenCamera() {
    try {
      const { granted } = await requestPermission();
      if (!granted) {
        return Alert.alert("Câmera", "Você precisa habilitar o uso da câmera");
      }

      qrLock.current = false;
      setIsVisibleCameraModal(true);
    } catch (error) {
      console.log(error);
      Alert.alert("Câmera", "Não foi possível utilizar a câmera");
    }
  }

  async function getCoupon(id: string) {
    try {
      setCouponIsFetching(true);
      const { data } = await api.patch("coupons/" + id);

      Alert.alert("Cupom", data.coupon);
      setCoupon(data.coupon);
    } catch (error) {
      console.log(error);
      Alert.alert("Erro", "Não foi possível utilizar o cupom");
    } finally {
    }
  }

  function handleUseCoupon(id: string) {
    setIsVisibleCameraModal(false);
    Alert.alert(
      "Cupom",
      "Não é possível reutilizar um cupom resgatado, deseja realmente resgatar o cupom?",
      [
        { style: "cancel", text: "Não" },
        { text: "Sim", onPress: () => getCoupon(id) },
      ]
    );
  }

  // fazendo a chamada da função que consome a api injetando dependência, ela depende de params.id
  useEffect(() => {
    fetchMarket();
  }, [params.id, coupon]);

  // verificando se os dados já foram carregados
  if (isLoading) {
    return <Loading />;
  }

  // se não houver dados volta para a home
  if (!data) {
    return <Redirect href="/home" />;
  }
  return (
    <View style={{ flex: 1, overflow: "scroll" }}>
      <StatusBar barStyle="light-content" hidden={isVisibleCameraModal} />
      {/* ScrollView ajuda para criar barras de rolagem em telas menores */}
      <ScrollView>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Cover uri={data.cover} />
          <Details data={data} />
          {coupon && <Coupon code={coupon} />}
        </ScrollView>

        <View style={{ padding: 32 }}>
          {/* Abre a câmera para ler o qrcode */}
          <Button onPress={handleOpenCamera}>
            <Button.Title>Ler QR Code</Button.Title>
          </Button>
        </View>
        {/* Verifica o estado do botão, para abrir ou não a câmera */}
        <Modal style={{ flex: 1 }} visible={isVisibleCameraModal}>
          <CameraView
            style={{ flex: 1 }}
            facing="back"
            onBarcodeScanned={({ data }) => {
              // Para que a leitura ocorra apenas uma vez
              if (data && !qrLock.current) {
                qrLock.current = true;
                setTimeout(() => handleUseCoupon(data), 500);
              }
            }}
          />
          <View
            style={{ position: "absolute", bottom: 32, left: 32, right: 32 }}
          >
            <Button
              onPress={() => setIsVisibleCameraModal(false)}
              isLoading={couponIsFetching}
            >
              <Button.Title>Voltar</Button.Title>
            </Button>
          </View>
        </Modal>
      </ScrollView>
    </View>
  );
}
