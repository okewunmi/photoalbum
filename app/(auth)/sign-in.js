import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import rightCornerImage from "../../assets/images/rightcorner.png";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { FcGoogle } from "react-icons/fc";

const signIn = () => {
  return (
    <View style={styles.view}>
      <View style={styles.Boximg}>
        <Image
          source={rightCornerImage}
          style={styles.img}
          resizeMode="contain"
        />
      </View>
      <View style={styles.boxtxt}>
        <Text style={styles.txt1}>Sign In</Text>
        <Text style={styles.txt2}>Enter Your Email And Password</Text>

        <View style={styles.boxinput}>
          <TextInput style={styles.input} placeholder="Email" />
          <TextInput style={styles.input} placeholder="Password" />
          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnTxt}>Login</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.reg}>
          <Text>Don't have an account?</Text>
          <Link href="/sign-up">
            <Text style={styles.regLink}>Sign Up</Text>
          </Link>
        </View>
      </View>
      <View style={styles.regLinkOther}>
        <View style={styles.labels}>
          <View style={styles.line}></View>
          <Text style={styles.linetxt}>Sign In with</Text>
        </View>
        <View style={styles.auth}></View>
      </View>
    </View>
  );
};

export default signIn;

const styles = StyleSheet.create({
  safeArea: {
    height: "100%",
    backgroundColor: "#ffff",
  },
  view: {
    height: "100%",
    backgroundColor: "#ffff",
  },
  // Boximg: {
  //   height: 100,
  //   width: 300,
  // },
  img: {
    height: 120,
    width: 210,
  },
  boxtxt: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  txt1: {
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: "Nunito",
  },
  txt2: {
    fontSize: 15,
    fontFamily: "Nunito",
    color: "#A8A6A7",
    marginTop: 50,
  },
  boxinput: {
    marginTop: 50,
    paddingHorizontal: 35,
    gap: 10,
    width: "100%",
  },
  input: {
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: "#A8A6A7",
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "Nunito",
  },
  btn: {
    padding: 14,
    alignItems: "center",
    backgroundColor: "#FA9884",
    borderRadius: 40,
    marginTop: 30,
  },
  btnTxt: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Nunito",
  },
  reg: {
    marginTop: 10,
    flexDirection: "row",
    gap: 5,
  },
  regLink: {
    color: "#56CCF2",
  },
  regLinkOther: {
    marginTop: 40,
  },
  labels: {
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  line: {
    borderBottomWidth: 1,
    width: "100%",
    borderStyle: "solid",
    borderColor: "#A8A6A7",
  },
  linetxt: {
    fontSize: 15,
    paddingHorizontal: 10,
    position: "absolute",
    // zIndex: 100,
    backgroundColor: "#fff",
  },
  auth: {},
});
