import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import Person from "../assets/images/person.jpeg";
const shared = () => {
  return (
    <View style={styles.box}>
      <View style={styles.circle}>
        <Image style={styles.img} source={Person} resizeMode="cover" />
      </View>
    </View>
  );
};

export default shared;

const styles = StyleSheet.create({
  box: {
    alignSelf: "flex-start",
    display: "flex",
    paddingLeft: 10,
    flexDirection: "row",
    gap: 30,
    marginBottom: 30,
  },
  circle: {
    width: 70,
    height: 70,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: "#FA9884",
  },
  img: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#fff",
  },
});
