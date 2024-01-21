import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Auth, useAuth } from './components/Auth';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import styles from './components/Style';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SignInStackScreen, SignUpStackScreen } from './navigation/Stacks';
import { HomeTabScreen, SettingsTabScreen, WellnessTabScreen } from './navigation/Tabs';

const Tab = createBottomTabNavigator();

function MainApp() {
  const { signedIn } = useAuth();

  if (signedIn === null) {
    //initial loading before auth check is done
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.mainView]}>
          {/* <PageLoad/> */}
        </View>
      </SafeAreaView>
    );

  }

  if (signedIn) { //use tabs and screens for signed in user 
    return (
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName="Home" // Change this if you want to start with a different screen
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === 'Home') {
                iconName = focused
                  ? 'home-circle'
                  : 'home-circle-outline';
                  color = '#0E63A3';
              } else if (route.name === 'Wellness') {
                iconName = focused
                  ? 'heart-circle'
                  : 'heart-circle-outline';
                  color = '#0E63A3';
              } else if (route.name === 'Settings') {
                iconName = focused
                  ? 'account-circle'
                  : 'account-circle-outline';
                  color = '#0E63A3';
              }
              return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#0E63A3',
            tabBarInactiveTintColor: '#000000',
          })}
        >
          {/* POST SignIn */}
          {HomeTabScreen()}
          {WellnessTabScreen()}
          {SettingsTabScreen()}
        </Tab.Navigator>
      <StatusBar barStyle="default" />
    </NavigationContainer>
    )
  } else { //use tabs and screens for guest
    return (
      <NavigationContainer>
            <>
              {/* PRE SignIn */}
              {SignInStackScreen()}
              {SignUpStackScreen()}
            </>
        <StatusBar barStyle="default" />
      </NavigationContainer>
    );
  }

}

export default function App() {
  return (
    <Auth>
      <MainApp/>
    </Auth>
  );
}
