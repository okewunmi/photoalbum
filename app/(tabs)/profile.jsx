import React, { useEffect } from "react";
import {
  View,
  Button,
  Alert,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../ContextFile/GlobalProvider";
// Adjust the path to where your logout function is
import { auth } from "../../lib/firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { router, Redirect, Link } from "expo-router";

const profile = () => {
  const { setisLoggedIn, user, setUser } = useGlobalContext();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    // setisLoggedIn(false);
    router.replace("/sign-in");
  };
  return (
    <SafeAreaView style={styles.view}>
      <TouchableOpacity onPress={() => handleSignOut}>
        <Text> Log out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default profile;

const styles = StyleSheet.create({
  view: {
    height: "100%",
    flex: "1",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ecec",
  },
});
