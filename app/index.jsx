import React from "react";

import {
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  StyleSheet,
  Button,
  Pressable,
} from "react-native";

import { router, Redirect, Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import welcome from "../constants/images";

// import { useGlobalContext } from "../ContextFile/GlobalProvider";

const Index = () => {
  // const { isLoggedIn, loading } = useGlobalContext();
  // if (!loading && !isLoggedIn) return <Redirect href="/home" />;

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.Box}>
        <Image source={welcome} resizeMode="contain" style={styles.img} />
        <View style={styles.txtBox}>
          <Text style={styles.txt}>Let’s Connect Together</Text>
        </View>
        <View style={styles.btnBox}>
          <Link style={[styles.btn, styles.btnWhite]} href="/sign-in">
            Login
          </Link>
          <Link href="/sign-up" style={[styles.btn, styles.btncolor]}>
            Sign Up
          </Link>
        </View>
      </View>
      <StatusBar backgroundColor="#ffff" style="light" />
    </SafeAreaView>
  );
};

export default Index;

const styles = StyleSheet.create({
  main: {
    height: "100%",
    backgroundColor: "#fff",
  },
  Box: {
    minHeight: "85%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  img: {
    marginTop: 90,
    height: 280,
    maxWidth: 350,
    width: "100%",
  },
  txtBox: {
    marginTop: 15,
    paddingVertical: 40,
  },
  txt: {
    color: "#000",
    fontSize: 30,
    fontWeight: "light",
    textAlign: "center",
  },
  btnBox: {
    gap: 15,
  },
  btn: {
    borderRadius: 50,
    width: 280,
    height: 30,
    padding: 25,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#9E9898",
  },
  btnWhite: {
    backgroundColor: "#fff",
  },
  btncolor: {
    backgroundColor: "#FA9884",
    color: "#fff",
    fontSize: 15,
    fontWeight: "400",
  },
  btntxtblack: {
    color: "#000",
    fontSize: 15,
    fontWeight: "400",
  },
  btntxtwhite: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "400",
  },
});
