import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import InputField from '../../components/InputField';
import ButtonPrimary from '../../components/ButtonPrimary';
import Loader from '../../components/Loader';
import { validateEmail, validatePassword } from '../../utils/validators';
import { COLORS, SIZES } from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
    const { login, isLoading } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!validateEmail(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address');
            return;
        }
        if (!validatePassword(password)) {
            Alert.alert('Invalid Password', 'Password must be at least 6 characters');
            return;
        }

        try {
            await login(email, password);
        } catch (e) {
            Alert.alert('Login Failed', 'Please check your credentials and try again.');
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Ionicons name="flash" size={40} color={COLORS.error} style={{ alignSelf: 'center', marginBottom: 20 }} />
                <Text style={styles.title}>Welcome Back!</Text>
                <Text style={styles.subtitle}>Sign in to continue</Text>

                <View style={styles.form}>
                    <Text style={styles.sectionLabel}>Email Address</Text>
                    <InputField
                        placeholder="Email Address"
                        value={email}
                        onChangeText={text => setEmail(text)}
                        keyboardType="email-address"
                        icon="mail-outline"
                    />

                    <Text style={styles.sectionLabel}>Password</Text>
                    <InputField
                        placeholder="Password"
                        value={password}
                        onChangeText={text => setPassword(text)}
                        inputType="password"
                        icon="lock-closed-outline"
                    />

                    <ButtonPrimary title="Login" onPress={handleLogin} />

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={styles.link}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
    },
    content: {
        paddingHorizontal: 25,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.textPrimary,
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginBottom: 40,
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
    },
    footerText: {
        color: COLORS.textSecondary,
        fontSize: 14,
    },
    link: {
        color: COLORS.primary,
        fontWeight: '700',
        fontSize: 14,
    },
});

export default LoginScreen;
