import React, { useState, useEffect} from "react"
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native"
import { useLocalSearchParams, router} from 'expo-router';
import axios from 'axios';
import { AntDesign } from '@expo/vector-icons';

import { api } from '@/server/api';

type imgProps = {
    "base64File": string;
}

type local = {
    idUsr: string;
    name: string;
    title: string;
    creValor: string;
}

export default function PagtoPix(){
    const local = useLocalSearchParams();
    const [state, setState] = useState<imgProps>() as any;

    const [imgBase64, setImgBase64] = useState('*');
    const [linkQRCode, setLinkQRCode] = useState('');
    const [txid, setTxid] = useState('');

    useEffect(() => {
        axios({
            method: 'post',    
            url: `http://10.111.135.208:3333/authorize`,
            data: {
              creUsrId: local.idUsr,  
              creId: local.idCre,
              creValor: local.creValor,   
            }
        }).then(function(response) {
            //setState({base64File: 'data:image/png;base64' + response.data.imagemQrcode});
            console.log(response.data)
            setImgBase64(response.data.imagemQrcode)
            setLinkQRCode(response.data.qrcode)
        }).catch(function(error) {
            console.log(error)
        })                                
    }, []);

    function handleConfirma() {
        api.post('cnfRecarga', {      
            creId: local.idCre 
        }).then(() => {
            alert('Recarga realizada com sucesso! Aguardando confirmação de pagamento.');
            router.push(`./Dashboard?idUsr=${local.id}&name=${local.name}&title=${local.title}` as any ); 
        }).catch(() => {
            alert('Erro no cadastro!');
        })  
    }

    return(
        <View style={styles.container}>
            <View >
                <View >
                    <TouchableOpacity onPress={() => router.back()} >
                        <View>                      
                            <AntDesign name="arrowleft" size={24} color="white" />
                        </View>
                    </TouchableOpacity>
                    <View >
                        <Text >Forma de Pagto Pix</Text>
                    </View>    
                </View>
                <View >
                    <Text>Valor da Compra: {local.vlrRec}</Text>
                </View>             
                <View>
                    <Image style={{width: 250, height: 250}} source={{uri: imgBase64 }} />
                </View> 
                <View>
                    <Text>Copia e Cola:</Text>
                    <Text>{linkQRCode}</Text>
                </View> 
                <View>
                    <TouchableOpacity  onPress={handleConfirma} >
                        <Text>Confirma Compra</Text>
                    </TouchableOpacity>
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


})
