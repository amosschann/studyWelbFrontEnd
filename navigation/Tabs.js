import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeStackScreen } from '../navigation/Stacks';

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