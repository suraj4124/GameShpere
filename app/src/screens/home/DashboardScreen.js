import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import GameCard from '../../components/GameCard';
import axios from '../../api/axios';
import Loader from '../../components/Loader';
import { COLORS, SIZES } from '../../utils/theme';
import { Ionicons } from '@expo/vector-icons';

const DashboardScreen = ({ navigation }) => {
    const { userInfo } = useContext(AuthContext);
    const [upcomingGames, setUpcomingGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedSport, setSelectedSport] = useState('All');

    const sports = ['All', 'Football', 'Basketball', 'Tennis', 'Cricket'];

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get('/games');
            const games = response.data;
            setUpcomingGames(games.slice(0, 5));
        } catch (e) {
            console.log('Error fetching dashboard data', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchDashboardData();
    };

    if (loading && !refreshing) {
        return <Loader />;
    }

    const renderHeader = () => (
        <>
            {/* Top Bar */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.appName}>SportUp</Text>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="notifications-outline" size={24} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{userInfo?.name?.charAt(0) || 'U'}</Text>
                    </View>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Ionicons name="search-outline" size={20} color={COLORS.textSecondary} style={styles.searchIcon} />
                <TextInput
                    placeholder="Search sports, venues, or players"
                    style={styles.searchInput}
                    placeholderTextColor={COLORS.textSecondary}
                />
                <TouchableOpacity style={styles.filterButton}>
                    <Ionicons name="options-outline" size={20} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            {/* Sport Filters */}
            <View style={styles.filtersContainer}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={sports}
                    keyExtractor={(item) => item}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.filterChip,
                                selectedSport === item && styles.filterChipActive
                            ]}
                            onPress={() => setSelectedSport(item)}
                        >
                            {item !== 'All' && (
                                <Ionicons
                                    name={item === 'Football' ? 'football' : item === 'Basketball' ? 'basketball' : 'trophy-outline'}
                                    size={16}
                                    color={selectedSport === item ? COLORS.white : COLORS.textPrimary}
                                    style={{ marginRight: 6 }}
                                />
                            )}
                            <Text style={[
                                styles.filterText,
                                selectedSport === item && styles.filterTextActive
                            ]}>{item}</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Upcoming Games</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Discover')}>
                    <Text style={styles.seeAll}>View all</Text>
                </TouchableOpacity>
            </View>
        </>
    );

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={upcomingGames}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <GameCard
                        game={item}
                        onPress={() => navigation.navigate('GameDetails', { gameId: item._id })}
                    />
                )}
                style={styles.list}
                contentContainerStyle={styles.listContent}
                ListHeaderComponent={renderHeader}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No upcoming games found.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.surface, // Light gray background
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: COLORS.white,
    },
    appName: {
        fontSize: 24,
        fontWeight: '900',
        color: COLORS.primary,
        letterSpacing: -0.5,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        marginRight: 15,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#fde68a', // Light amber
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    avatarText: {
        color: '#d97706',
        fontWeight: 'bold',
        fontSize: 16,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        margin: 20,
        marginTop: 10,
    },
    searchInput: {
        flex: 1,
        backgroundColor: COLORS.white,
        height: 50,
        borderRadius: 12,
        paddingLeft: 45,
        paddingRight: 15,
        borderWidth: 1,
        borderColor: COLORS.border,
        fontSize: 15,
        color: COLORS.textPrimary,
    },
    searchIcon: {
        position: 'absolute',
        left: 15,
        zIndex: 1,
    },
    filterButton: {
        width: 50,
        height: 50,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    filtersContainer: {
        marginBottom: 20,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
        backgroundColor: COLORS.white,
        marginRight: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    filterChipActive: {
        backgroundColor: COLORS.primary,
        borderColor: COLORS.primary,
    },
    filterText: {
        color: COLORS.textPrimary,
        fontWeight: '600',
        fontSize: 14,
    },
    filterTextActive: {
        color: COLORS.white,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: COLORS.textPrimary,
    },
    seeAll: {
        color: COLORS.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    list: {
        flex: 1,
    },
    listContent: {
        paddingBottom: 20,
    },
    emptyState: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        color: COLORS.textSecondary,
    }
});

export default DashboardScreen;
