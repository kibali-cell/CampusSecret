import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider } from './src/context/AuthContext';


// Import Firebase services (initialization happens via firebase.js)
import './config/firebase'; // This line initializes Firebase

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Screens
import LoginScreen from './src/screens/LoginScreen';
import MissionScreen from './src/screens/MissionScreen';
import ChatScreen from './src/screens/ChatScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MissionHistoryScreen from './src/screens/MissionHistoryScreen';
import AchievementsScreen from './src/screens/AchievementsScreen';
import TeamMissionScreen from './src/screens/TeamMissions';
import LeaderboardScreen from './src/screens/LeaderboardScreen';

const TabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Missions" component={MissionScreen} />
    <Tab.Screen name="History" component={MissionHistoryScreen} />
    <Tab.Screen name="Achievements" component={AchievementsScreen} />
    <Tab.Screen name="Chat" component={ChatScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />

    <Tab.Screen name="Team Missions" component={TeamMissionScreen} />
    <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
  </Tab.Navigator>
);

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Main" 
            component={TabNavigator}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;