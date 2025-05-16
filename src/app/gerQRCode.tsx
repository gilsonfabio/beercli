import React, { useState } from 'react';
import { Button, KeyboardAvoidingView, Platform, StyleSheet, TextInput, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

export default function GerQRCode() {
  const [text, setText] = useState('');
  const [qrValue, setQrValue] = useState('');

  const handleGenerate = () => {
    setQrValue(text);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <TextInput
        style={styles.input}
        placeholder="Digite algo para gerar o QR Code"
        value={text}
        onChangeText={setText}
      />
      <Button title="Gerar QR Code" onPress={handleGenerate} />
      <View style={styles.qrContainer}>
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  qrContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
});
