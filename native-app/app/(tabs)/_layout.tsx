import FontAwesome from '@expo/vector-icons/FontAwesome';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Link, Tabs } from 'expo-router';
import { Alert, Pressable, useColorScheme } from 'react-native';

// screeen components
import StateScreen from '.';
import EditScreenInfo from '../../components/EditScreenInfo';

// auth for lout feature
import { AuthContext } from '../auth/authContext';

import Colors from '../../constants/Colors';
import { useContext } from 'react';
import { View } from '../../components/Themed';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}
const Tab = createBottomTabNavigator();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { signOut } = useContext(AuthContext);

  const handleLogoutPress = () => {
    // Confirm logout action with the user
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { text: "Log Out", onPress: () => signOut() } // Call your context's logout function
      ]
    );
  };

  return (
    <Tab.Navigator screenOptions={{
      tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
      headerShown: true
    }}>
      <Tab.Screen name="MachineState" component={StateScreen} options={{
        title: 'Machine State',
        tabBarIcon: ({ color }) => <TabBarIcon name='list-ul' color={color} />,
      }} />
      <Tab.Screen name="LogPart" component={EditScreenInfo} options={{
        title: 'Log Part',
        tabBarIcon: ({ color }) => <TabBarIcon name='edit' color={color} />,
      }} />
      <Tab.Screen
        name="LogOut"
        component={View}
        options={{
          title: 'Log Out',
          tabBarIcon: ({ color }) => <TabBarIcon name='sign-out' color={color} />,

        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            handleLogoutPress();
          },
        })}
      />

    </Tab.Navigator>
  );
}
