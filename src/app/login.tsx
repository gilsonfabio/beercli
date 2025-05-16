import { api } from '@/server/api';
import { Feather, Ionicons } from '@expo/vector-icons';
import { isAxiosError } from "axios";
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Easing,
    Keyboard,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    Vibration,
    View
} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function Login() {
    const navigation = useNavigation();
    const router = useRouter();
    const params = useLocalSearchParams();
    const { expoPushToken } = params;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(40)).current;
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const shakeAnim = useRef(new Animated.Value(0)).current;
    const logoScaleAnim = useRef(new Animated.Value(0.8)).current;

    let title = 'Produtos';

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.timing(logoScaleAnim, {
                toValue: 1,
                duration: 800,
                easing: Easing.bounce,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    function handlePressIn() {
        Animated.spring(scaleAnim, {
            toValue: 0.95,
            useNativeDriver: true,
        }).start();
    }

    function handlePressOut() {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            useNativeDriver: true,
        }).start();
    }

    function triggerShake() {
        Animated.sequence([
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: -10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 10, duration: 50, useNativeDriver: true }),
            Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
        ]).start();
    }

    async function handleSignIn() {
        try {
            const response = await api.post(`/signIn`, {
                email,
                password,
            });

            let id = response.data.id;
            let nomCliente = response.data.name;
            let saldo = response.data.saldo;

            router.push(`/dashboard?idUsr=${id}&name=${nomCliente}&title=${title}&saldo=${saldo}` as any);
        } catch (error) {
            Vibration.vibrate(100);
            triggerShake();

            if (isAxiosError(error)) {
                return Alert.alert(error.response?.data);
            }
            Alert.alert("Não foi possível entrar.");
        }
    }

    async function handleCadastro() {
        try {
            router.push(`./register`);
        } catch (error) {
            Vibration.vibrate(100);
            triggerShake();

            if (isAxiosError(error)) {
                return Alert.alert(error.response?.data);
            }
            Alert.alert("Não foi possível entrar.");
        }
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                contentContainerStyle={styles.scrollContentContainer}
                enableOnAndroid
                extraScrollHeight={Platform.OS === 'ios' ? 0 : 120}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <LinearGradient
                    colors={['#facc15', '#000']} 
                    style={styles.gradientBackground}
                >
                    <Animated.View style={[styles.animatedContainer, {
                        opacity: fadeAnim,
                        transform: [{ translateY }],
                    }]}>
                        <Text style={styles.txtContainer}>Login</Text>

                        <Animated.Image
                            source={require('@/assets/images/logowhite.png')}
                            resizeMode="contain"
                            style={[styles.imgLogo, { transform: [{ scale: logoScaleAnim }] }]}
                        />

                        <Animated.View style={{ transform: [{ translateX: shakeAnim }] }}>
                            <Text style={styles.label}>Email</Text>
                            <View style={styles.inputContainer}>
                                <Feather name="mail" size={20} color="#fafafa" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholderTextColor="#ccc"
                                    placeholder="Informe seu email"
                                    onChangeText={setEmail}
                                    value={email}
                                    autoFocus
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                            <Text style={styles.label}>Senha</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.inputPassword}
                                    secureTextEntry={!showPassword}
                                    placeholderTextColor="#ccc"
                                    placeholder="Informe sua Senha"
                                    onChangeText={setPassword}
                                    value={password}
                                    autoCapitalize="none"
                                />
                                <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.iconEye}>
                                    <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="#fafafa" />
                                </Pressable>
                            </View>
                        </Animated.View>

                        <View style={{ marginTop: 10 }}>
                            <Pressable
                                onPressIn={handlePressIn}
                                onPressOut={handlePressOut}
                                onPress={handleSignIn}
                            >
                                <Animated.View style={[styles.button, { transform: [{ scale: scaleAnim }] }]}>
                                    <Text style={styles.txtButton}>Entrar</Text>
                                </Animated.View>
                            </Pressable>
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Pressable onPress={handleCadastro}>
                                <Text style={styles.txtCadastro}>Criar Conta</Text>
                            </Pressable>
                        </View>
                    </Animated.View>
                </LinearGradient>
            </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    scrollContentContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    gradientBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    animatedContainer: {
        alignItems: 'center',
    },
    txtContainer: {
        fontSize: 32,
        color: '#fff',
        marginBottom: 1,
        fontWeight: 'bold',
    },
    imgLogo: {
        width: 150,
        height: 150,
        marginBottom: 6,
    },
    label: {
        color: '#fafafa',
        fontSize: 16,
        marginBottom: 8,
        marginTop: 20,
        alignSelf: 'flex-start',
        width: 300,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 300,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 25,
        paddingHorizontal: 15,
        marginBottom: 15,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        color: '#fff',
        paddingVertical: 12,
        fontSize: 16,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: 300,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 25,
        paddingHorizontal: 15,
        marginBottom: 20,
    },
    inputPassword: {
        flex: 1,
        color: '#fff',
        paddingVertical: 12,
        fontSize: 16,
    },
    iconEye: {
        marginLeft: 10,
    },
    button: {
        marginTop: 30,
        backgroundColor: '#fff',
        paddingVertical: 14,
        paddingHorizontal: 50,
        borderRadius: 30,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    txtButton: {
        color: '#000080', 
        fontSize: 18,
        fontWeight: 'bold',
    },

    txtCadastro: {
        color: '#dc2626', 
        fontSize: 16,
        fontWeight: 'bold',
    },

    register: {
        color: '#dc2626', 
        fontSize: 12,
        fontWeight: 'bold',
    },
});