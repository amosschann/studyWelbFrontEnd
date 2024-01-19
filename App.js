import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Auth, useAuth } from './components/Auth';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import styles from './components/Style';
import { SignInStackScreen, SignUpStackScreen } from './navigation/Stacks';

const Tab = createBottomTabNavigator();

function MainApp() {
  const { signedIn } = useAuth();

  if (signedIn === null) {
    //initial loading before auth check is done
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.mainView]}>
          <PageLoad/>
        </View>
      </SafeAreaView>
    );

  }

  if (signedIn) { //use tabs and screens for signed in user 
    return (
      <NavigationContainer>
        <Tab.Navigator>

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
