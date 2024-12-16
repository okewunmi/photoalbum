import React, { useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Link, router } from "expo-router";
import rightCornerImage from "../../assets/images/rightcorner.png";
import google from "../../assets/images/google.png";
import facebook from "../../assets/images/facebook.png";
import Linkedin from "../../assets/images/linkedin-icon.png";

import { auth } from "../../lib/firebase";
// import authConfig from "../../lib/authConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

const SignIn = () => {
  const [isSubmting, setIssubmtting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Error", "Please fill in both email and password fields.");
      console.log("form checked.");
      return;
    }

    setIssubmtting(true);
    console.log("setsubmiting is true.");
    const { email, password } = form;

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // const result = await getCurrentUser();
      router.replace("/home");
      console.log("Navigation to home page successful.");
      return result;
    } catch (error) {
      Alert.alert(
        "Login Failed",
        error.message || "An error occurred. Please try again."
      );
    } finally {
      setIssubmtting(false);
    }
  };

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
          <TextInput
            style={styles.input}
            placeholder="Email"
            title="Email"
            value={form.email}
            onChangeText={(e) => setForm({ ...form, email: e })}
            keyboardType="email-address"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            title="Password"
            value={form.password}
            onChangeText={(e) => setForm({ ...form, password: e })}
            secureTextEntry={true} // Add for password masking
          />

          <TouchableOpacity
            style={styles.btn}
            onPress={submit}
            disabled={isSubmting}
          >
            <Text style={styles.btnTxt}>
              {isSubmting ? "Loging in ..." : "Login "}
            </Text>
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

        {/* other sign in options */}
        <View style={styles.auth}>
          <TouchableOpacity>
            <Image source={google} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={facebook} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={Linkedin} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  safeArea: {
    height: "100%",
    // flex: 1,
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
    width: 214,
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
    marginTop: 150,
    paddingHorizontal: 35,
    gap: 10,
    width: "100%",
  },
  input: {
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: "#A8A6A7",
    fontSize: 14,
    fontWeight: "light",
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
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Nunito",
    textTransform: "uppercase",
    color: "#fff",
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
  auth: {
    width: "100%",
    paddingVertical: 30,
    paddingHorizontal: 20,
    flexDirection: "row",
    gap: 30,
    justifyContent: "center",
  },
  icon: {
    width: 25,
    height: 25,
  },
});
