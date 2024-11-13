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
  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.Box}>
        <Image source={welcome} resizeMode="contain" style={styles.img} />
        <View style={styles.txtBox}>
          <Text style={styles.txt}>Let’s Connect Together </Text>
        </View>
        <View style={styles.btnBox}>
          <Link style={[styles.btn, styles.btnWhite]} href="/home">
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
    marginTop: 100,
    minHeight: "85%",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    gap: 10,
  },
  img: {
    height: 280,
    width: 350,
  },
  txtBox: {
    marginTop: 15,
    paddingVertical: 40,
    paddingHorizontal: 30,
    // gap: ,
  },
  txt: {
    color: "black",
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    // lineHeight: 38,
    fontFamily: "Inter",
  },
  btnBox: {
    gap: 14,
  },
  btn: {
    borderRadius: 100,
    width: 280,
    height: 30,
    padding: 11,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#9E9898",
  },

  btnWhite: {
    backgroundColor: "#fff",
    color: "#000",
    textAlign: "center",
    height: "auto",
    fontSize: 15,
    fontWeight: "bold",
  },
  btncolor: {
    backgroundColor: "#FA9884",
    color: "#fff",
    textAlign: "center",
    height: "auto",
    fontWeight: "bold",
    fontSize: 15,
  },
});
