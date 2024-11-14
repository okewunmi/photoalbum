import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";

import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/Ionicons";

import dash from "../../assets/images/dash.png";
const home = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View style={styles.head}>
          <Pressable>
            <Image source={dash} resizeMode="contain" size={35} />
          </Pressable>
          <Pressable style={styles.msg}>
            <Text style={styles.dot}>5</Text>
            <AntDesign name="chatbubble-ellipses" size={35} color="#FA9884" />
          </Pressable>
        </View>
        {/* <FlatList /> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default home;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#f2f2f2",
    height: "100%",
  },
  head: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingVertical: 40,
    width: "100%",
    flexDirection: "row",
  },
  msg: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    // position: "relative",
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 100,
    backgroundColor: "#575353",
    position: "absolute",
    textAlign: "center",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#fff",
    fontSize: 10,
    color: "#fff",
    top: 0,
    left: 22,
    zIndex: 1000,
  },
});
