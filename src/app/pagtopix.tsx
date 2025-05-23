import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { api } from '@/server/api';

type ParamsProps = {
    idUsr: string;
    name: string;
    title: string;
    creId: string;
    creValor: string;
};

export default function PagtoPix() {
    const params = useLocalSearchParams<ParamsProps>();
    const [imgBase64, setImgBase64] = useState('');
    const [linkQRCode, setLinkQRCode] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const gerarQRCode = async () => {
            try {
                console.log('Gerando QR Code para:', params.creId);

                const { data } = await axios.post('https://backbeer.vercel.app/authorize', {
                    creUsrId: params.idUsr,
                    creId: params.creId,
                    creValor: params.creValor,
                });

                console.log('Resposta da API:', data);

                if (data.imagemQrcode && data.qrcode) {
                    const imagem = data.imagemQrcode.startsWith('data:image')
                        ? data.imagemQrcode
                        : `data:image/png;base64,${data.imagemQrcode}`;
                    setImgBase64(imagem);
                    setLinkQRCode(data.qrcode);
                } else {
                    Alert.alert('Erro', 'Dados inválidos retornados pela API.');
                }
            } catch (error) {
                console.error('Erro ao gerar QR Code:', error);
                Alert.alert('Erro', 'Falha ao gerar o QR Code. Tente novamente.');
            } finally {
                setIsLoading(false);
            }
        };

        gerarQRCode();
    }, []);

    const handleConfirma = async () => {
        try {
            await api.post('cnfRecarga', { creId: params.creId });

            Alert.alert('Sucesso', 'Recarga realizada com sucesso! Aguardando confirmação de pagamento.');
            router.push(`/dashboard?idUsr=${params.idUsr}&name=${params.name}&title=${params.title}`);
        } catch (error) {
            console.error('Erro na confirmação:', error);
            Alert.alert('Erro', 'Erro na confirmação da compra.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <AntDesign name="arrowleft" size={28} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Pagamento via Pix</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.valor}>
                    Valor da Compra: <Text style={styles.valorDestaque}>R$ {params.creValor}</Text>
                </Text>

                {isLoading ? (
                    <ActivityIndicator size="large" color="#facc15" />
                ) : (
                    <>
                        {imgBase64 ? (
                            <Image
                                style={styles.qrCode}
                                source={{ uri: imgBase64 }}
                            />
                        ) : (
                            <Text style={styles.erroQRCode}>QR Code não disponível</Text>
                        )}

                        <Text style={styles.copiaColaLabel}>Copia e Cola:</Text>
                        <Text selectable style={styles.copiaCola}>
                            {linkQRCode || 'Link não disponível'}
                        </Text>

                        <TouchableOpacity style={styles.botao} onPress={handleConfirma}>
                            <Text style={styles.botaoTexto}>Confirmar Compra</Text>
                        </TouchableOpacity>
                    </>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#020617',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#111827',
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 16,
    },
    content: {
        alignItems: 'center',
        padding: 20,
    },
    valor: {
        color: '#f9fafb',
        fontSize: 16,
        marginBottom: 16,
    },
    valorDestaque: {
        color: '#facc15',
        fontWeight: '700',
    },
    qrCode: {
        width: 250,
        height: 250,
        marginVertical: 20,
    },
    erroQRCode: {
        color: 'red',
        marginVertical: 20,
    },
    copiaColaLabel: {
        color: '#f9fafb',
        fontSize: 16,
        marginBottom: 4,
    },
    copiaCola: {
        color: '#facc15',
        backgroundColor: '#1f2937',
        padding: 10,
        borderRadius: 8,
        textAlign: 'center',
        marginBottom: 20,
    },
    botao: {
        backgroundColor: '#facc15',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    botaoTexto: {
        color: '#000',
        fontWeight: '600',
        fontSize: 16,
    },
});
