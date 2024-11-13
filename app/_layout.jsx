import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { SplashScreen, Stack } from "expo-router";
// import { useFonts } from "expo-font";
// import GlobalProvider from "../ContextFile/GlobalProvider";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  // useEffect(() => {
  //   if (error) throw error;
  //   if (fontsLoaded) SplashScreen.hideAsync();
  // }, [fontsLoaded, error]);

  // if (!fontsLoaded && !error) return null;

  return (
    // <GlobalProvider>
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
    // </GlobalProvider>
  );
};

export default RootLayout;
