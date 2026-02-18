import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { COLORS, SIZES, SHADOWS } from '../utils/theme';
import { Ionicons } from '@expo/vector-icons';

// Mapping sports to Unsplash images (in a real app, these would be assets or CDN links)
const SPORT_IMAGES = {
    'Basketball': 'https://images.unsplash.com/photo-1546519638-68e109d98aa3?auto=format&fit=crop&w=800&q=80',
    'Football': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
    'Tennis': 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?auto=format&fit=crop&w=800&q=80',
    'Badminton': 'https://images.unsplash.com/photo-1626224583764-847890e058f5?auto=format&fit=crop&w=800&q=80',
    'Default': 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=800&q=80'
};

const GameCard = ({ game, onPress }) => {
    const formattedDate = new Date(game.date).toLocaleDateString([], { month: 'short', day: 'numeric' });
    const formattedTime = new Date(game.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const participantsCount = game.participants ? game.participants.length : 0;
    const progress = Math.min(participantsCount / game.maxPlayers, 1);
    const spotsLeft = game.maxPlayers - participantsCount;

    const imageSource = { uri: SPORT_IMAGES[game.sport] || SPORT_IMAGES['Default'] };

    // Status Badge Logic
    let statusColor = COLORS.primary;
    let statusText = game.skillLevel || 'Open';
    if (spotsLeft === 0) {
        statusColor = COLORS.error;
        statusText = 'FULL';
    } else if (spotsLeft <= 2) {
        statusColor = '#f59e0b'; // Amber
        statusText = `${spotsLeft} spots left!`;
    }

    return (
        <TouchableOpacity onPress={onPress} style={styles.card} activeOpacity={0.9}>
            <View style={styles.imageContainer}>
                <Image source={imageSource} style={styles.image} resizeMode="cover" />
                <View style={styles.overlay} />
                <View style={styles.badgeContainer}>
                    <View style={[styles.badge, { backgroundColor: '#fff' }]}>
                        <Text style={[styles.badgeText, { color: COLORS.primary }]}>{game.sport}</Text>
                    </View>
                    {spotsLeft <= 2 && (
                        <View style={[styles.badge, { backgroundColor: statusColor }]}>
                            <Text style={[styles.badgeText, { color: '#fff' }]}>{statusText}</Text>
                        </View>
                    )}
                </View>
            </View>

            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={1}>{game.title}</Text>
                <View style={styles.row}>
                    <Ionicons name="location-outline" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.location}>{game.location}</Text>
                </View>
                <View style={styles.row}>
                    <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
                    <Text style={styles.time}>{formattedDate} • {formattedTime}</Text>
                </View>

                <View style={styles.footer}>
                    <View style={styles.progressContainer}>
                        <Text style={styles.progressText}>{participantsCount}/{game.maxPlayers} Players</Text>
                        <View style={styles.progressBarBg}>
                            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
                        </View>
                    </View>
                    <TouchableOpacity style={styles.joinButton} onPress={onPress}>
                        <Text style={styles.joinText}>Join</Text>
                        <Ionicons name="arrow-forward" size={14} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: SIZES.radius + 5,
        marginBottom: 20,
        ...SHADOWS.medium,
        overflow: 'hidden',
    },
    imageContainer: {
        height: 150,
        width: '100%',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    badgeContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        flexDirection: 'row',
    },
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        marginRight: 8,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    content: {
        padding: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 5,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    location: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginLeft: 5,
    },
    time: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginLeft: 5,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: COLORS.border,
    },
    progressContainer: {
        width: '60%',
    },
    progressText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 4,
        fontWeight: '600',
    },
    progressBarBg: {
        height: 8,
        backgroundColor: COLORS.surface,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: COLORS.primary,
        borderRadius: 4,
    },
    joinButton: {
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    joinText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
        marginRight: 5,
    },
});

export default GameCard;
