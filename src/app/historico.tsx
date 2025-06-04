import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from "react-native";

import LisHistorico from "@/components/lisHistorico";
import { api } from '@/server/api';

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

export default function Historico({ idUsr }:props) {
    const [historico, setHistorico] = useState<Array<historicoProps>>([]);

    const navigation = useNavigation();
    const router = useRouter();
    const { id, name } = useLocalSearchParams()

    useEffect(() => {
        let id = idUsr;
        api({
            method: 'get',    
            url: `historico/${id}`,                 
        }).then(function(resp) {
            setHistorico(resp.data)
        }).catch(function(error) {
            alert(`Falha no acesso historico! Tente novamente.`);
        })
                          
    }, []);

    return(
        <View style={styles.container}>            
            <View style={styles.boxTitle}>
                <Text style={styles.txtTitle}>Historico</Text>
            </View>
            <FlatList
                data={historico}
                horizontal={false}
                numColumns={1}
                renderItem={({item}) => <LisHistorico data={item} />}
                keyExtractor={(item) => item.conId}
            />
        </View>
    )
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
})