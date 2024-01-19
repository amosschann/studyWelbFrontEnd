import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen'
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';


//**Main Stacks with Navigator */
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
        {/* {travelStackScreen()}
        {itineraryStackScreen()} */}

        </HomeStack.Navigator>
  );
}


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
  