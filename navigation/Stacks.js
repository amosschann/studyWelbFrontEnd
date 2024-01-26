import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen'
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SettingsScreen from '../screens/SettingsScreen';
import WellnessScreen from '../screens/WellnessScreen';
import DayTasksScreen from '../screens/DayTasksScreen';


//**Main Stacks with Navigator */
export function SignInStackScreen() {
    const SignInStack = createNativeStackNavigator();
    return(
      <SignInStack.Navigator>
        <SignInStack.Screen 
          name="SignInScreen" 
          component={SignInScreen}
          options={{ 
            title: 'Sign In'
          }}
        />
        {SignUpStackScreen()}
      </SignInStack.Navigator>
    );
}

export function SignUpStackScreen() {
    const SignUpStack = createNativeStackNavigator();
    return(
        <SignUpStack.Screen 
        name="SignUpScreen" 
        component={SignUpScreen}
        options={{ 
            title: 'Sign Up' 
        }}
        />
    );
}
  
export function HomeStackScreen() {
  const HomeStack = createNativeStackNavigator();
  return (
      <HomeStack.Navigator>
        {/* Screens */}
        <HomeStack.Screen 
          name="HomeScreen" 
          component={HomeScreen} 
          options={{
            title: "Home"
          }}
        />
        {dayTasksStackScreen()}

        </HomeStack.Navigator>
  );
}

export function WellnessStackScreen() {
  const WellnessStack = createNativeStackNavigator();
  return (
      <WellnessStack.Navigator>
        {/* Screens */}
        <WellnessStack.Screen 
          name="WellnessScreen" 
          component={WellnessScreen} 
          options={{
            title: "Wellness"
          }}
        />

        </WellnessStack.Navigator>
  );
}

export function SettingsStackScreen() {
  const SettingsStack = createNativeStackNavigator();
  return (
      <SettingsStack.Navigator>
        {/* Screens */}
        <SettingsStack.Screen 
          name="SettingsScreen" 
          component={SettingsScreen} 
          options={{
            title: "Settings"
          }}
        />

        </SettingsStack.Navigator>
  );
}


//**Reusable stacks */
export function dayTasksStackScreen() {
  const dayTasksStack = createNativeStackNavigator();
  return(
        <dayTasksStack.Screen 
          name="DayTasksScreen" 
          component={DayTasksScreen}
          options={{ 
            title: 'Day Tasks' 
          }}
        />
  );
}