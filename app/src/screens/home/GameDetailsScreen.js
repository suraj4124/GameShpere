import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Image, StatusBar, TouchableOpacity } from 'react-native';
import axios from '../../api/axios';
import ButtonPrimary from '../../components/ButtonPrimary';
import Loader from '../../components/Loader';
import { AuthContext } from '../../context/AuthContext';
import { COLORS, SIZES } from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';

// Mapping sports to Unsplash images (same as GameCard)
const SPORT_IMAGES = {
    'Basketball': 'https://images.unsplash.com/photo-1546519638-68e109d98aa3?auto=format&fit=crop&w=800&q=80',
    'Football': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
    'Tennis': 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800&q=80',
    'Badminton': 'https://images.unsplash.com/photo-1626224583764-847890e058f5?auto=format&fit=crop&w=800&q=80',
    'Default': 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80'
};

const GameDetailsScreen = ({ route, navigation }) => {
    const { gameId } = route.params;
    const { userInfo } = useContext(AuthContext);
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);

    useEffect(() => {
        fetchGameDetails();
    }, [gameId]);

    const fetchGameDetails = async () => {
        try {
            const response = await axios.get(`/games/${gameId}`);
            setGame(response.data);
        } catch (e) {
            Alert.alert('Error', 'Could not load game details');
            navigation.goBack();
        } finally {
            setLoading(false);
        }
    };

    const handleJoinGame = async () => {
        if (game.participants.length >= game.maxPlayers) {
            Alert.alert('Full', 'This game is already full.');
            return;
        }

        const alreadyJoined = game.participants.some(p =>
            (typeof p === 'string' ? p : p._id) === userInfo._id
        );

        if (alreadyJoined) {
            Alert.alert('Info', 'You have already joined this game.');
            return;
        }

        setJoining(true);
        try {
            await axios.post(`/join/${gameId}`);
            Alert.alert('Success', 'You have joined the game!');
            fetchGameDetails();
        } catch (e) {
            Alert.alert('Error', 'Failed to join game. Please try again.');
        } finally {
            setJoining(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (!game) return null;

    const imageSource = { uri: SPORT_IMAGES[game.sport] || SPORT_IMAGES['Default'] };
    const formattedDate = new Date(game.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    const formattedTime = new Date(game.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const spotsLeft = game.maxPlayers - game.participants.length;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Hero Image */}
            <View style={styles.heroContainer}>
                <Image source={imageSource} style={styles.heroImage} resizeMode="cover" />
                <View style={styles.heroOverlay} />
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.white} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.heartButton} onPress={() => Alert.alert('Saved', 'Game saved to favorites!')}>
                    <Ionicons name="heart-outline" size={24} color={COLORS.white} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.header}>
                    <View style={styles.timeTag}>
                        <Text style={styles.openText}>{spotsLeft} SPOTS LEFT</Text>
                    </View>
                    <View style={styles.skillTag}>
                        <Text style={styles.skillText}>{game.skillLevel || 'Intermediate'}</Text>
                    </View>

                    <Text style={styles.title}>{game.title}</Text>
                    <Text style={styles.subtitle}>Competitive 5v5 pickup game</Text>

                    {/* Organizer Card */}
                    <View style={styles.organizerCard}>
                        <View style={styles.organizerAvatar}>
                            <Text style={styles.organizerInitial}>{game.organizer?.name?.charAt(0) || 'O'}</Text>
                        </View>
                        <View style={styles.organizerInfo}>
                            <Text style={styles.organizerName}>{game.organizer?.name || 'Unknown Organizer'}</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name="star" size={12} color="#f59e0b" />
                                <Text style={styles.organizerRating}>4.9 Organizer</Text>
                            </View>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.messageText}>Message</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Info Grid */}
                <View style={styles.infoGrid}>
                    <View style={styles.infoItem}>
                        <View style={styles.iconBox}>
                            <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
                        </View>
                        <View>
                            <Text style={styles.infoLabel}>DATE & TIME</Text>
                            <Text style={styles.infoValue}>{formattedDate}</Text>
                            <Text style={styles.infoSub}>{formattedTime}</Text>
                        </View>
                    </View>
                    <View style={styles.infoItem}>
                        <View style={styles.iconBox}>
                            <Ionicons name="location-outline" size={20} color={COLORS.primary} />
                        </View>
                        <View>
                            <Text style={styles.infoLabel}>LOCATION</Text>
                            <Text style={styles.infoValue}>{game.location}</Text>
                            <Text style={styles.infoSub}>0.8 mi away</Text>
                        </View>
                    </View>
                    <View style={styles.infoItem}>
                        <View style={styles.iconBox}>
                            <Ionicons name="wallet-outline" size={20} color={COLORS.primary} />
                        </View>
                        <View>
                            <Text style={styles.infoLabel}>ENTRY FEE</Text>
                            <Text style={styles.infoValue}>$10.00</Text>
                            <Text style={styles.infoSub}>Pay at venue</Text>
                        </View>
                    </View>
                    <View style={styles.infoItem}>
                        <View style={styles.iconBox}>
                            <Ionicons name="football-outline" size={20} color={COLORS.primary} />
                        </View>
                        <View>
                            <Text style={styles.infoLabel}>FORMAT</Text>
                            <Text style={styles.infoValue}>5 vs 5</Text>
                            <Text style={styles.infoSub}>Turf shoes only</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About the Game</Text>
                    <Text style={styles.description}>{game.description || 'Casual pickup game for anyone who wants to get a run in. Please bring both a white and a dark shirt so we can split teams easily.'}</Text>
                    <Text style={styles.bulletPoint}>• No slide tackling</Text>
                    <Text style={styles.bulletPoint}>• Call your own fouls</Text>
                    <Text style={styles.bulletPoint}>• Have fun!</Text>
                </View>

                <View style={styles.footerSpace} />
            </ScrollView>

            {/* Floating Footer */}
            <View style={styles.footer}>
                <View style={styles.footerInfo}>
                    <Text style={styles.spotsFilledText}>Spots Filled</Text>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${(game.participants.length / game.maxPlayers) * 100}%` }]} />
                    </View>
                    <Text style={styles.spotsCount}>{game.participants.length}/{game.maxPlayers}</Text>
                </View>
                <ButtonPrimary
                    title={joining ? "Joining..." : "Join Game"}
                    onPress={handleJoinGame}
                    disabled={joining || spotsLeft === 0}
                    style={{ marginTop: 0, flex: 1, marginLeft: 20 }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    heroContainer: {
        height: 250,
        width: '100%',
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heartButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
        paddingHorizontal: 20,
        paddingTop: 30,
    },
    header: {
        marginBottom: 20,
    },
    timeTag: {
        backgroundColor: '#d1fae5',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginBottom: 10,
        flexDirection: 'row',
        display: 'inline-flex',
        marginRight: 10,
    },
    skillTag: {
        backgroundColor: COLORS.surface,
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        marginBottom: 10,
        position: 'absolute',
        right: 0,
        top: 0
    },
    openText: {
        color: COLORS.success,
        fontWeight: '700',
        fontSize: 12,
    },
    skillText: {
        color: COLORS.textSecondary,
        fontWeight: '600',
        fontSize: 12,
    },
    title: {
        fontSize: 26,
        fontWeight: '800',
        color: COLORS.textPrimary,
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 16,
        color: COLORS.textSecondary,
        marginBottom: 20,
    },
    organizerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: 12,
        borderRadius: 12,
    },
    organizerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    organizerInitial: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    organizerInfo: {
        flex: 1,
    },
    organizerName: {
        fontWeight: '700',
        color: COLORS.textPrimary,
        fontSize: 15,
    },
    organizerRating: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginLeft: 4,
    },
    messageText: {
        color: COLORS.primary,
        fontWeight: '700',
        fontSize: 14,
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 25,
    },
    infoItem: {
        width: '48%',
        flexDirection: 'row',
        marginBottom: 20,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#ede9fe', // Light violet
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    infoLabel: {
        fontSize: 10,
        color: COLORS.textSecondary,
        fontWeight: '700',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    infoSub: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: COLORS.textPrimary,
        marginBottom: 10,
    },
    description: {
        fontSize: 15,
        color: COLORS.textSecondary,
        lineHeight: 24,
        marginBottom: 15,
    },
    bulletPoint: {
        fontSize: 15,
        color: COLORS.textSecondary,
        marginBottom: 5,
    },
    footerSpace: {
        height: 100,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 10,
    },
    footerInfo: {
        width: '40%',
    },
    spotsFilledText: {
        fontSize: 12,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 5,
    },
    progressBarBg: {
        height: 6,
        backgroundColor: COLORS.surface,
        borderRadius: 3,
        marginBottom: 5,
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: COLORS.success,
        borderRadius: 3,
    },
    spotsCount: {
        fontSize: 12,
        color: COLORS.textSecondary,
        alignSelf: 'flex-end',
    }

});

export default GameDetailsScreen;
