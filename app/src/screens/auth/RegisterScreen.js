import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import InputField from '../../components/InputField';
import ButtonPrimary from '../../components/ButtonPrimary';
import Loader from '../../components/Loader';
import { validateEmail, validatePassword, validateRequired } from '../../utils/validators';
import { COLORS, SIZES } from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';

const RegisterScreen = ({ navigation }) => {
    const { register, isLoading } = useContext(AuthContext);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('player'); // 'player' or 'organizer'

    const handleRegister = async () => {
        if (!validateRequired(name)) {
            Alert.alert('Invalid Name', 'Please enter your full name');
            return;
        }
        if (!validateEmail(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address');
            return;
        }
        if (!validatePassword(password)) {
            Alert.alert('Invalid Password', 'Password must be at least 6 characters');
            return;
        }

        try {
            await register(name, email, password, role);
        } catch (e) {
            Alert.alert('Registration Failed', 'Please try again later.');
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <Ionicons name="basketball-outline" size={40} color={COLORS.primary} style={styles.logo} />
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join the community today</Text>
                </View>

                <View style={styles.form}>
                    <Text style={styles.sectionLabel}>Full Name</Text>
                    <InputField
                        placeholder="Enter your full name"
                        value={name}
                        onChangeText={text => setName(text)}
                        icon="person-outline"
                    />

                    <Text style={styles.sectionLabel}>Email Address</Text>
                    <InputField
                        placeholder="name@example.com"
                        value={email}
                        onChangeText={text => setEmail(text)}
                        keyboardType="email-address"
                        icon="mail-outline"
                    />

                    <Text style={styles.sectionLabel}>Password</Text>
                    <InputField
                        placeholder="Create a password"
                        value={password}
                        onChangeText={text => setPassword(text)}
                        inputType="password"
                        icon="lock-closed-outline"
                    />

                    {/* Role Toggle Switch */}
                    <Text style={styles.sectionLabel}>I want to:</Text>
                    <View style={styles.toggleContainer}>
                        <TouchableOpacity
                            style={[styles.toggleButton, role === 'player' && styles.toggleButtonActive]}
                            onPress={() => setRole('player')}
                            activeOpacity={0.9}
                        >
                            <Ionicons name="person" size={18} color={role === 'player' ? COLORS.primary : COLORS.textSecondary} style={{ marginRight: 8 }} />
                            <Text style={[styles.toggleText, role === 'player' && styles.toggleTextActive]}>Play Games</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.toggleButton, role === 'organizer' && styles.toggleButtonActive]}
                            onPress={() => setRole('organizer')}
                            activeOpacity={0.9}
                        >
                            <Ionicons name="calendar" size={18} color={role === 'organizer' ? COLORS.primary : COLORS.textSecondary} style={{ marginRight: 8 }} />
                            <Text style={[styles.toggleText, role === 'organizer' && styles.toggleTextActive]}>Organize Games</Text>
                        </TouchableOpacity>
                    </View>

                    <ButtonPrimary title="Create Account" onPress={handleRegister} />

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.link}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
    },
    content: {
        padding: 25,
        paddingTop: 50,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logo: {
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.textPrimary,
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
    },
    form: {
        width: '100%',
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 8,
        marginTop: 5,
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        borderRadius: 12,
        padding: 4,
        marginBottom: 30,
        height: 55,
    },
    toggleButton: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    toggleButtonActive: {
        backgroundColor: COLORS.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    toggleText: {
        color: COLORS.textSecondary,
        fontWeight: '600',
        fontSize: 14,
    },
    toggleTextActive: {
        color: COLORS.primary,
        fontWeight: '700',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 40,
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

export default RegisterScreen;
