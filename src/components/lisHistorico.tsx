import { useLocalSearchParams } from "expo-router";
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

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

type paramsProps = {
  idUsr: string;
  name: string;
  title: string;
}

const LisHistorico = ({ data }:any) => {
  
  function handleDetalhes(){
    setTimeout(() => {
      handleGetToken()
    }, 1000)         
  }

  const { idUsr, name, title } = useLocalSearchParams<paramsProps>();
  
  const handleGetToken = async () => {
    //const token = await AsyncStorage.getItem('auth.token');
    
    //if (!token) {
    //    navigation.navigate('SignIn')
    //}else {
    //    navigation.navigate(data.srvLink)
    //}        
  }

  return (
    <View style={styles.container}>
        <View style={styles.box}>
            <View>
                <Image source={{uri: `https://thumbs2.imgbox.com/${data.proAvatar}`}} resizeMode="cover" style={styles.imgLogo} />
                <View style={styles.boxDescricao}>
                    <Text style={styles.txtDescricao}>{data.conData} - {data.conHora}</Text>
                </View>
                <View style={styles.boxDescricao}>
                    <Text style={styles.txtDescricao}>{data.proDescricao}</Text>
                </View>
                <View>
                    <Text>{data.proReferencia}</Text>
                </View>              
            </View>             
        </View>  
    </View>
  );
};
  
export default LisHistorico;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    imgLogo: {
        width: 180,
        height: 200,
        alignItems: 'center',
        borderRadius: 10,      
    },

    box: {
        backgroundColor: "#CCC",
        padding: 4,
        borderRadius: 10,
        marginTop: 5,
        marginRight: 5,
        marginBottom: 5,
    },
    
    boxDescricao: {
        width: "100%",
        height: 40,
    }, 

    txtDescricao: {
        fontSize: 15,
        fontWeight: '500'
    },

    txtPreco: {
      backgroundColor: "#dc2626",
      color: "#FFF",
      borderRadius: 10,
      fontWeight: '500',
      padding: 5,
    },

})