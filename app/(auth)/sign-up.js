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
import { SafeAreaView } from "react-native-safe-area-context";
import rightCornerImage from "../../assets/images/rightcorner.png";

// Import signIn and signUp functions from your API or library
import { signIn, createUser } from "../../lib/appwrite"; // Replace with your actual paths

const SignIn = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Sign Up
  const handleSignUp = async () => {
    if (!form.username || !form.email || !form.password) {
      Alert.alert("Error", " All fields are required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createUser(form.username, form.email, form.password);
      Alert.alert("Success", "Account created successfully!");
      router.replace("/sign-in");
      return result;
    } catch (error) {
      Alert.alert("Sign Up Failed", error.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
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
        <Text style={styles.txt1}>Sign Up</Text>
        <Text style={styles.txt2}>Enter Your Email And Password</Text>

        <View style={styles.boxinput}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={form.username}
            onChangeText={(text) => setForm({ ...form, username: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={form.password}
            onChangeText={(text) => setForm({ ...form, password: text })}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.btn}
            onPress={handleSignUp}
            disabled={isSubmitting}
          >
            <Text style={styles.btnTxt}>
              {isSubmitting ? "Signing up..." : "Sign up"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.reg}>
          <Text>Already have an account?</Text>
          <Link href="/sign-in">
            <Text style={styles.regLink}>Sign In</Text>
          </Link>
        </View>
      </View>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  safeArea: {
    height: "100%",
    backgroundColor: "#ffff",
  },
  view: {
    height: "100%",
    backgroundColor: "#ffff",
  },
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
    marginTop: 150,
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
});
