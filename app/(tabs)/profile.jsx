import React from "react";
import { View, Button, Alert, Text, TouchableOpacity,StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../ContextFile/GlobalProvider";
import {getCurrentUser, logout } from "../../lib/appwrite"; // Adjust the path to where your logout function is
import { router, Redirect, Link } from "expo-router";
const profile = () => {
  const { setisLoggedIn, user, setUser, } = useGlobalContext();

  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert("Logged out", "You have been logged out successfully.");
      
    } catch (error) {
      Alert.alert(
        "Logout Error",
        error.message || "An error occurred while logging out."
      );
    }
  };
  return (
    <SafeAreaView>
      <TouchableOpacity
            
            onPress={() => router.push("/sign-in")}
          >
            <Text > Log out</Text>
          </TouchableOpacity>
    </SafeAreaView>
  );
};

export default profile;

const styles = StyleSheet.create({
  view:{
    height: '100%',
    flex: '1',
    alignItems: 'center',
    justifyContent: 'center'
  }

})




