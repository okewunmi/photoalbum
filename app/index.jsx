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
  TouchableOpacity,
} from "react-native";

import { router, Redirect, Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

import welcome from "../assets/images/welcome.png";
import { useGlobalContext } from "../ContextFile/GlobalProvider";

const Index = () => {
  const { isLoggedIn, loading } = useGlobalContext();
  if (!loading && !isLoggedIn) return <Redirect href="/sign-in" />;
  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.Box}>
        <Image source={welcome} resizeMode="contain" style={styles.img} />
        <View style={styles.txtBox}>
          <Text style={styles.txt}>Let’s Connect Together </Text>
        </View>
        <View style={styles.btnBox}>
          <TouchableOpacity
            style={styles.btnWhite}
            onPress={() => router.push("/sign-in")}
          >
            <Text style={styles.btn2}> Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btncolor}
            onPress={() => router.push("/sign-up")}
          >
            <Text style={styles.btn1}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
      <StatusBar backgroundColor="#ffff" style="dark" />
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
  btn1: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#fff",
  },
  btn2: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#000",
  },
  btnWhite: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#9E9898",
    borderRadius: 100,
    width: 290,
    height: 42,
  },
  btncolor: {
    backgroundColor: "#FA9884",
    color: "#fff",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    borderRadius: 100,
    width: 290,
    height: 42,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#9E9898",
  },
});
