import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import { useContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
// stacking
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// Auth imtegration
import { AuthContext, AuthProvider } from './auth/authContext';
// componenents
import LoginScreen from './auth/loginscreen';
import StateScreen from './(tabs)';
import ModalScreen from './modal';
import TabLayout from './(tabs)/_layout';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// creating thr navigation stack
const Stack = createNativeStackNavigator();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, error] = useFonts({

    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }



  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <RootLayoutNav />
      </ThemeProvider>
    </AuthProvider>
  );
}

function RootLayoutNav() {
  const { userToken } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {!userToken ? (
        <Stack.Screen name="auth/loginscreen" component={LoginScreen} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="(tabs)" component={TabLayout} options={{ headerShown: false }} />
          <Stack.Screen name="modal" component={ModalScreen} options={{ presentation: 'modal' }} />
        </>
      )}
    </Stack.Navigator>
  );
}
