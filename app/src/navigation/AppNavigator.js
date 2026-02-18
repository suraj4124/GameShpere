import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

// Screen Imports
import DashboardScreen from '../screens/home/DashboardScreen';
import DiscoverScreen from '../screens/home/DiscoverScreen';
import GameDetailsScreen from '../screens/home/GameDetailsScreen';
import CreateGameScreen from '../screens/organizer/CreateGameScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import AuthNavigator from './AuthNavigator';

// Icons (Using placeholder text if vector-icons fails, but standardizing on Ionicons for Expo)
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Home Stack to include Game Details
const HomeStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="DashboardMain" component={DashboardScreen} options={{ headerShown: false }} />
            <Stack.Screen name="GameDetails" component={GameDetailsScreen} options={{ title: 'Game Details' }} />
        </Stack.Navigator>
    );
};

// Discover Stack to include Game Details
const DiscoverStack = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="DiscoverMain" component={DiscoverScreen} options={{ headerShown: false }} />
            <Stack.Screen name="GameDetails" component={GameDetailsScreen} options={{ title: 'Game Details' }} />
        </Stack.Navigator>
    );
};

const AppNavigator = () => {
    const { isLoading, userToken, userInfo } = useContext(AuthContext);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size={'large'} />
            </View>
        );
    }

    return (
        <>
            {userToken !== null ? (
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        headerShown: false,
                        tabBarIcon: ({ focused, color, size }) => {
                            let iconName;

                            if (route.name === 'Home') {
                                iconName = focused ? 'home' : 'home-outline';
                            } else if (route.name === 'Discover') {
                                iconName = focused ? 'search' : 'search-outline';
                            } else if (route.name === 'Create') {
                                iconName = focused ? 'add-circle' : 'add-circle-outline';
                            } else if (route.name === 'Profile') {
                                iconName = focused ? 'person' : 'person-outline';
                            }

                            return <Ionicons name={iconName} size={size} color={color} />;
                        },
                        tabBarActiveTintColor: '#0056b3',
                        tabBarInactiveTintColor: 'gray',
                    })}
                >
                    <Tab.Screen name="Home" component={HomeStack} />
                    <Tab.Screen name="Discover" component={DiscoverStack} />

                    {/* Only show Create Game for Organizer */}
                    {userInfo?.role === 'organizer' && (
                        <Tab.Screen name="Create" component={CreateGameScreen} options={{ title: 'Create Game' }} />
                    )}

                    <Tab.Screen name="Profile" component={ProfileScreen} />
                </Tab.Navigator>
            ) : (
                <AuthNavigator />
            )}
        </>
    );
};

export default AppNavigator;
