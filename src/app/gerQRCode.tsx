import { api } from "@/server/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function GerQRCode() {
  const [text, setText] = useState('');
  const [qrValue, setQrValue] = useState('');

  const router = useRouter();
  const { idUsr } = useLocalSearchParams();

  useEffect(() => {
    api.get(`busUser/${idUsr}`).then(response => {
      const userData = response.data;
      setText(userData);
      setQrValue(userData);
    });
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.qrContainer}>
        <Text style={styles.instructionText}>
          🎉 Apresente este QR Code para retirar seu chopp! 🍻
        </Text>
        {qrValue !== '' && <QRCode value={qrValue} size={200} />}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  qrContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center',
    color: '#222',
    paddingHorizontal: 20,
    lineHeight: 26,
    letterSpacing: 0.5,
  },
});

