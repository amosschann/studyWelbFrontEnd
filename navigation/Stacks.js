import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen'
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SettingsScreen from '../screens/SettingsScreen';
import WellnessScreen from '../screens/WellnessScreen';
import DayTasksScreen from '../screens/DayTasksScreen';
import AddTasksScreen from '../screens/AddTasksScreen';
import ManageTasksScreen from '../screens/ManageTasksScreen';
import JournalScreen from '../screens/JournalScreen';
import ManageJournalScreen from '../screens/ManageJournalScreen';
import WellnessStasticScreen from '../screens/WellnessStatisticsScreen';
import ManageWellnessScreen from '../screens/ManageWellnessScreen';

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
        {addTasksStackScreen()}
        {manageTasksStackScreen()}
        {journalStackScreen()}
        {manageJournalStackScreen()}

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
        {manageWellnessStackScreen()}
        {wellnessStatisticsStackScreen()}
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

export function addTasksStackScreen() {
  const addTasksStack = createNativeStackNavigator();
  return(
        <addTasksStack.Screen 
          name="AddTasksScreen" 
          component={AddTasksScreen}
          options={{ 
            title: 'Add Tasks' 
          }}
        />
  );
}

export function manageTasksStackScreen() {
  const manageTasksStack = createNativeStackNavigator();
  return(
        <manageTasksStack.Screen 
          name="ManageTasksScreen" 
          component={ManageTasksScreen}
          options={{ 
            title: 'Manage Tasks' 
          }}
        />
  );
}

export function journalStackScreen() {
  const journalStack = createNativeStackNavigator();
  return(
        <journalStack.Screen 
          name="JournalScreen" 
          component={JournalScreen}
          options={{ 
            title: 'Journal' 
          }}
        />
  );
}

export function manageJournalStackScreen() {
  const manageJournalStack = createNativeStackNavigator();
  return(
        <manageJournalStack.Screen 
          name="ManageJournalScreen" 
          component={ManageJournalScreen}
          options={{ 
            title: 'Manage Journal' 
          }}
        />
  );
}

export function manageWellnessStackScreen() {
  const manageWellnessStack = createNativeStackNavigator();
  return(
        <manageWellnessStack.Screen 
          name="ManageWellnessScreen" 
          component={ManageWellnessScreen}
          options={{ 
            title: 'Manage Wellness' 
          }}
        />
  );
}

export function wellnessStatisticsStackScreen() {
  const wellnessStatisticsStack = createNativeStackNavigator();
  return(
        <wellnessStatisticsStack.Screen 
          name="WellnessStatisticsScreen" 
          component={WellnessStasticScreen}
          options={{ 
            title: 'Statistics' 
          }}
        />
  );
}