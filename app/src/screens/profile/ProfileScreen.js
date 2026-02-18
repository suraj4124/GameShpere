import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ScrollView } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import ButtonPrimary from '../../components/ButtonPrimary';

const ProfileScreen = () => {
    const { userInfo, logout } = useContext(AuthContext);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>
                            {userInfo?.name ? userInfo.name.charAt(0).toUpperCase() : 'U'}
                        </Text>
                    </View>
                    <Text style={styles.name}>{userInfo?.name || 'User Name'}</Text>
                    <Text style={styles.role}>{userInfo?.role ? userInfo.role.toUpperCase() : 'PLAYER'}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Account Info</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Email</Text>
                        <Text style={styles.value}>{userInfo?.email || 'email@example.com'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Location</Text>
                        <Text style={styles.value}>Not set</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Favorite Sports</Text>
                        <Text style={styles.value}>Basketball, Tennis</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Text style={styles.label}>Skill Level</Text>
                        <Text style={styles.value}>Intermediate</Text>
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    <ButtonPrimary title="Edit Profile" onPress={() => { }} disabled={true} />

                    <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                        <Text style={styles.logoutText}>Log Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    content: {
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#0056b3',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    avatarText: {
        color: '#fff',
        fontSize: 40,
        fontWeight: 'bold',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    role: {
        fontSize: 14,
        color: '#666',
        letterSpacing: 1,
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 15,
        color: '#333',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        paddingBottom: 10,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    label: {
        color: '#666',
        fontSize: 16,
    },
    value: {
        color: '#333',
        fontSize: 16,
        fontWeight: '500',
    },
    buttonContainer: {
        marginTop: 10,
    },
    logoutButton: {
        marginTop: 15,
        alignItems: 'center',
        padding: 15,
    },
    logoutText: {
        color: '#d9534f',
        fontSize: 16,
        fontWeight: '600',
    }
});

export default ProfileScreen;
