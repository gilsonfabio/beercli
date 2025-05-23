import { isAxiosError } from "axios";
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import Header from "@/components/header";
import { api } from '@/server/api';

type paramsProps = {
    idUsr: string;
    name: string;
    title: string;
    saldo: string;    
}

export default function Recarga(){
    const { idUsr, name, title } = useLocalSearchParams<paramsProps>();

    const [creValor, setCreValor] = useState('');

    function handleChangeValue(text: string) {
        const cleanValue = text.replace(/\D/g, ''); // Remove tudo que não for número

        if (!cleanValue) {
            setCreValor('');
            return;
        }

        const numericValue = (Number(cleanValue) / 100).toFixed(2);
        const [integerPart, decimalPart] = numericValue.split('.');

        const integerWithSeparator = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        const formatted = `${integerWithSeparator},${decimalPart}`;
        setCreValor(formatted);
    }

    async function GeraNovCredito() {
        try {
            const valorAPI = creValor.replace(/\./g, '').replace(',', '.'); // Remove pontos e troca vírgula por ponto

            const response = await api.post(`/newcredito`, {
                creUsrId: idUsr, 
                creValor: valorAPI,  
            });
            let nrocredito = response.data.creId
            console.log('gerou credito nro.:', nrocredito)
            router.push(`/pagtopix?idUsr=${idUsr}&name=${name}&title=${title}&creId=${nrocredito}&creValor=${creValor}` as any);
        } catch (error) {
            if (isAxiosError(error)) {
                return Alert.alert(error.response?.data);
            }
            Alert.alert("Não foi possível gerar o crédito.");
        }
    }

    return(
        <View style={styles.container}>
            <Header user={idUsr} nomUser={name} sysTitle={title} />
            <View>
                <View>
                    <Text style={styles.label}>Valor Recarga</Text>
                    <TextInput 
                        style={styles.input}
                        placeholderTextColor="#fafafa" 
                        placeholder="Informe valor recarga" 
                        onChangeText={handleChangeValue} 
                        value={creValor} 
                        keyboardType="numeric"
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
        alignItems: 'center',
        marginLeft: 10,
        marginTop: 5,
    },

    txtButton: {
        fontSize: 18,
        fontWeight: 'bold',
        color: "#000",
        textAlign: 'center',        
    },
})
