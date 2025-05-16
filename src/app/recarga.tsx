import { isAxiosError } from "axios";
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import Header from "@/components/header";
import { api } from '@/server/api';

type userProps = {
    user?: string;
    nomUser?: string;
    sysTitle?: string;
    saldo?: string;
}

type paramsProps = {
    idUsr: string;
    name: string;
    title: string;
    saldo: string;    
}
 
export default function Recarga(){
    const [vlrRec, setVlrRec] = useState('');

    const { idUsr, name, title, saldo } = useLocalSearchParams<paramsProps>();

    const [atualiza, setAtualiza] = useState(0);
    const [creUsrId, setCreUsrId] = useState('');
    const [idCre, setIdCre] = useState(0);
    const [creValor, setCreValor] = useState('');


    async function GeraNovCredito() {
        try {
            const response = await api.post(`/newcredito`, {
                creUsrId: idUsr, 
                creValor: vlrRec, 
            }) 
            router.push(`./pagtopix", params: {idUsr, name, title, creValor` as any );          
        } catch (error) {
            if (isAxiosError(error)) {
                return Alert.alert(error.response?.data)
            }
          Alert.alert("Não foi possÃ­vel entrar.")
        }
    }

    return(
        <View style={styles.container}>
            <Header user={idUsr} nomUser={name} sysTitle={title} />
            <View>
                <View >
                    <Text style={styles.label}>Valor Recarga</Text>
                    <TextInput 
                        style={styles.input}
                        placeholderTextColor="#fafafa" 
                        placeholder="Informe valor recarga" 
                        onChangeText={setCreValor} 
                        value={creValor} 
                        keyboardType="decimal-pad"
                    />
                </View>
                <View>
                    <Text style={styles.label}>Escolha Forma de Pagamento</Text>
                </View>
                <View style={styles.button}>
                    <Pressable onPress={GeraNovCredito}>
                        <Text style={styles.txtButton}>Pagamento via PIX</Text>
                    </Pressable>
                </View>    
            </View>  
        </View>
    )
}

// router.push({ pathname: "/screens/PagtoPix", params: {idUsr, name, vlrRec, idCre} });

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#020617",
        alignItems: 'center',
    },

    txtTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: "#facc15",
    },

    box: {
        flexDirection: 'row',
        width: "90%",
        height: 120,
        backgroundColor: "#CCC",
        borderRadius: 10,
        alignItems: 'center',
        padding: 10,
        marginLeft: 20,
        marginTop: 10,
    },

    boxValor: {
        flexDirection: 'column',
        width: "50%",
        height: 90,
        backgroundColor: "#FFF",
        borderRadius: 10,
        alignItems: 'center',
        padding: 10,
        marginRight: 75,
    },
    
    label: {
        width: 350,
        fontSize: 10,
        color: "#fafafa",
        paddingHorizontal: 10,
        marginTop: 10,
    },

    input: {
        width: 350,
        height: 50,
        margin: 12,
        borderWidth: 1,
        borderColor: "#facc15",
        borderRadius: 10,
        padding: 10,
        color: "#FFF",
        fontSize: 18,
    },

    button: {
        width: 350,
        height: 90,
        backgroundColor: "#facc15",
        borderRadius: 12,
        justifyContent: 'center',
    },

    txtButton: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#000",
        textAlign: 'center',        
    },

})
