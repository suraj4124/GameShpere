import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TextInput, TouchableOpacity } from 'react-native';
import axios from '../../api/axios';
import GameCard from '../../components/GameCard';
import Loader from '../../components/Loader';
import { Ionicons } from '@expo/vector-icons'; // Assuming Expo environment

const DiscoverScreen = ({ navigation }) => {
    const [games, setGames] = useState([]);
    const [filteredGames, setFilteredGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSport, setSelectedSport] = useState('All');

    const sports = ['All', 'Basketball', 'Football', 'Tennis', 'Badminton'];

    const fetchGames = async () => {
        try {
            const response = await axios.get('/games');
            setGames(response.data);
            setFilteredGames(response.data);
        } catch (e) {
            console.log('Error fetching games', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGames();
    }, []);

    useEffect(() => {
        let result = games;

        if (selectedSport !== 'All') {
            result = result.filter(game => game.sport === selectedSport);
        }

        if (searchQuery) {
            result = result.filter(game =>
                game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                game.location.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredGames(result);
    }, [searchQuery, selectedSport, games]);

    if (loading) {
        return <Loader />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Find Games</Text>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search location or title..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* Filters */}
                <View style={styles.filterContainer}>
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={sports}
                        keyExtractor={(item) => item}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    styles.filterChip,
                                    selectedSport === item && styles.filterChipActive
                                ]}
                                onPress={() => setSelectedSport(item)}
                            >
                                <Text style={[
                                    styles.filterText,
                                    selectedSport === item && styles.filterTextActive
                                ]}>{item}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>

            <FlatList
                data={filteredGames}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                    <GameCard
                        game={item}
                        onPress={() => navigation.navigate('GameDetails', { gameId: item._id })}
                    />
                )}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text>No games found matching your criteria.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    searchContainer: {
        marginBottom: 15,
    },
    searchInput: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 8,
        fontSize: 16,
    },
    filterContainer: {
        flexDirection: 'row',
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        marginRight: 10,
    },
    filterChipActive: {
        backgroundColor: '#0056b3',
    },
    filterText: {
        color: '#333',
        fontWeight: '600',
    },
    filterTextActive: {
        color: '#fff',
    },
    listContent: {
        padding: 20,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 50,
    }
});

export default DiscoverScreen;
