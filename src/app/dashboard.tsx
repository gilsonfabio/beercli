import Header from "@/components/header";
import { api } from "@/server/api";
import { useFocusEffect } from "@react-navigation/native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import Historico from "./historico";

type paramsProps = {
  idUsr: string;
  name: string;
  title: string;
  saldo: string;
};

export default function Dashboard() {
  const { idUsr, name, title, saldo } = useLocalSearchParams<paramsProps>();
  const router = useRouter();

  const [usrSaldo, setUsrSaldo] = useState(Number(saldo));
  const [loading, setLoading] = useState(false);

  const fetchSaldo = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/busUser/${idUsr}`);
      // supondo que a API retorna { saldo: number }
      setUsrSaldo(Number(res.data.saldo));
    } catch (err) {
      console.log("Erro ao buscar saldo:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Atualiza sempre que a tela volta para foco
  useFocusEffect(
    useCallback(() => {
      fetchSaldo();
    }, [idUsr])
  );

  return (
    <View style={styles.container}>
      <Header user={idUsr} nomUser={name} sysTitle={title} />

      <View style={styles.box}>
        <View style={styles.boxSaldo}>
          <Text style={styles.txtSld}>Saldo Atual</Text>
          {loading ? (
            <ActivityIndicator size="small" color="#000" style={{ marginTop: 10 }} />
          ) : (
            <Text style={styles.infSld}>
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(usrSaldo)}
            </Text>
          )}
        </View>

        <View style={styles.boxRecarga}>
          <Link
            href={{ pathname: "./recarga", params: { idUsr, name, title, saldo: usrSaldo } }}
            asChild
          >
            <Pressable style={styles.button}>
              <Text style={styles.txtButton}>RECARGA</Text>
            </Pressable>
          </Link>
        </View>
      </View>

      <View style={styles.boxInfo}>
        <Link
          href={{ pathname: "./gerQRCode", params: { idUsr, name, title, saldo: usrSaldo } }}
          asChild
        >
          <Pressable style={styles.btnQRCode}>
            <Text style={styles.txtButton}>Gera QRCode</Text>
          </Pressable>
        </Link>
      </View>

      <Historico idUsr={idUsr} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  box: {
    flexDirection: "row",
    width: "90%",
    height: 120,
    backgroundColor: "#CCC",
    borderRadius: 10,
    alignItems: "center",
    padding: 10,
    marginLeft: 20,
    marginTop: 10,
  },
  boxSaldo: {
    flexDirection: "column",
    width: "50%",
    height: 90,
    backgroundColor: "#FFF",
    borderRadius: 10,
    alignItems: "center",
    padding: 10,
    marginRight: 55,
  },
  txtSld: {
    fontSize: 14,
    fontWeight: "500",
  },
  infSld: {
    fontSize: 28,
    marginTop: 5,
  },
  boxRecarga: {},
  txtContainer: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#facc15",
  },
  button: {
    width: 100,
    height: 90,
    backgroundColor: "#facc15",
    borderRadius: 12,
    justifyContent: "center",
  },
  btnQRCode: {
    width: 320,
    height: 90,
    backgroundColor: "#facc15",
    borderRadius: 12,
    justifyContent: "center",
  },
  txtButton: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  boxInfo: {
    flexDirection: "row",
    width: "90%",
    height: 150,
    backgroundColor: "#CCC",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginLeft: 20,
    marginTop: 10,
  },
});
