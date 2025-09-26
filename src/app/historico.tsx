import { useFocusEffect } from "@react-navigation/native";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

import LisHistorico from "@/components/lisHistorico";
import { api } from "@/server/api";

type historicoProps = { 
  conId: string; 
  conData: string; 
  conHora: string; 
  conUsrId: number; 
  conPrdId: number; 
  conPrdQtd: number; 
  conPrdVlr: number; 
  conStatus: string;
  proDescricao: string;
  proReferencia: string;
  proAvatar: string;
}

type props = {
  idUsr: string;
}    

export default function Historico({ idUsr }: props) {
  const [historico, setHistorico] = useState<Array<historicoProps>>([]);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const router = useRouter();
  const { id, name } = useLocalSearchParams();

  const fetchHistorico = async () => {
    try {
      setLoading(true);
      const resp = await api.get(`historico/${idUsr}`);
      setHistorico(resp.data);
    } catch (error) {
      alert("Falha no acesso histórico! Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Atualiza sempre que a tela voltar ao foco
  useFocusEffect(
    useCallback(() => {
      fetchHistorico();
    }, [idUsr])
  );

  return (
    <View style={styles.container}>            
      <View style={styles.boxTitle}>
        <Text style={styles.txtTitle}>Histórico</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={historico}
          horizontal={false}
          numColumns={1}
          renderItem={({item}) => <LisHistorico data={item} />}
          keyExtractor={(item) => item.conId}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20 }}>Nenhum registro encontrado.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,          
  },
  boxTitle: {
    width: "100%",
    height: 35,
  },
  txtTitle: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 10,
  },
});
