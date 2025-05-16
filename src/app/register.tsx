import { validateCPF } from '@/components/validateCPF';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from "expo-router";
import React, { useState } from 'react';
import {
    Alert,
    Button,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { api } from '@/server/api';

export default function App() {
    const router = useRouter();
    const [cpf, setCpf] = useState('');
    const [birthDate, setBirthDate] = useState<Date | null>(null);
    const [name, setName] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const [usuarios, setUsuarios] = useState([]);

    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const formatDate = (date: Date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const checkUser = async () => {
        const formattedCPF = cpf.replace(/\D/g, '');

        if (!validateCPF(formattedCPF)) {
            Alert.alert('CPF inválido', 'Por favor, insira um CPF válido.');
            return;
        }

        api.get(`searchCpf/${formattedCPF}`).then(response => { 
            setUsuarios(response.data);                    
        }) 

        if (usuarios) {
            Alert.alert('Usuário encontrado com esse CPF!');
            return; 
        }

        if (!birthDate) {
            Alert.alert('Data inválida', 'Por favor, selecione sua data de nascimento.');
        return;
        }

        const currentYear = new Date().getFullYear();
        const nascYear = birthDate.getFullYear();
        const idade = currentYear - nascYear;

        if (idade < 18) {
            Alert.alert('Usuário com idade inferior a 18 anos! Cadastro não permetido.');
            return; 
        }

        const formattedDate = formatDate(birthDate);
        setLoading(true);

        try {
            const response = await fetch(
                `https://ws.hubdodesenvolvedor.com.br/v2/cpf/?cpf=${formattedCPF}&data=${formattedDate}&token=176059145irakDZOPMs317869448`,
                {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                }
            );

            const data = await response.json();
            //console.log('Resposta da API:', data);

            const nome = data.result?.nome_da_pf;
            if (nome) {
                setName(nome); 
            } else {
                Alert.alert('Nome não encontrado', 'A API retornou dados, mas não o nome.');
                setName('');
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            Alert.alert('Erro', 'Erro ao verificar usuário.');
        } finally {
            setLoading(false);
        }
    };

    const onChangeDate = (event: any, selectedDate?: Date) => {
        setShowPicker(false);
        if (selectedDate) setBirthDate(selectedDate);
    };

    const onPress = () => {    
       api.post('newuser', {
            nome: name, 
            cpf, 
            nascimento: birthDate,
            email, 
            celular: phone, 
            password
        }).then(() => {
            alert('Usuário cadastrado com sucesso!')
            router.push(`./login`);
        }).catch(() => {
            alert('Erro no cadastro!');
        })  
    }

    return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Usuário</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite seu CPF"
        keyboardType="numeric"
        value={cpf}
        onChangeText={setCpf}
      />

      <Pressable onPress={() => setShowPicker(true)} style={styles.input}>
        <Text style={{ color: birthDate ? '#000' : '#999' }}>
          {birthDate ? formatDate(birthDate) : 'Selecionar data de nascimento'}
        </Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={birthDate || new Date(1980, 0, 1)}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={onChangeDate}
          maximumDate={new Date()}
          minimumDate={new Date(1900, 0, 1)}
        />
      )}

      <Button
        title={loading ? 'Verificando...' : 'Registrar'}
        onPress={checkUser}
        disabled={loading}
      />

      {name !== '' && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
            Olá, {name}! Complete seu cadastro:
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Digite seu telefone"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          <TextInput
            style={styles.input}
            placeholder="Digite seu email"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Digite uma senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <Button
            title="Finalizar cadastro"
            onPress={onPress}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
});
