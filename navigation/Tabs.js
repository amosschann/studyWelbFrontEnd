import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeStackScreen, SettingsStackScreen, WellnessStackScreen } from '../navigation/Stacks';

const Tab = createBottomTabNavigator();

export function HomeTabScreen() {
    return (
        <Tab.Screen
            name="Home"
            component={HomeStackScreen}
            options={{
                tabBarLabel: 'Home',
                headerShown: false
            }}
        />
    )
}

export function WellnessTabScreen() {
    return (
        <Tab.Screen
            name="Wellness"
            component={WellnessStackScreen}
            options={{
                tabBarLabel: 'Wellness',
                headerShown: false
            }}
        />
    )
}

export function SettingsTabScreen() {
    return (
        <Tab.Screen
            name="Settings"
            component={SettingsStackScreen}
            options={{
                tabBarLabel: 'Settings',
                headerShown: false
            }}
        />
    )
}