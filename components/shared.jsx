import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router, usePathname } from "expo-router";
import React from "react";
import Person from "../assets/images/person.jpeg";
import Person1 from "../assets/images/person1.jpeg";
import Person2 from "../assets/images/person2.jpeg";
import Person3 from "../assets/images/person3.jpeg";
import Person4 from "../assets/images/person4.jpeg";
import Person5 from "../assets/images/person5.jpeg";
import Person6 from "../assets/images/person6.jpeg";
import Person7 from "../assets/images/person7.jpeg";
import add from "../assets/images/add.png";

const Shared = () => {
  const DUMMY_DATA = [
    {
      id: "1",
      image: Person,
    },
    {
      id: "2",
      image: Person1,
    },
    {
      id: "3",
      image: Person2,
    },
    {
      id: "4",
      image: Person3,
    },
    {
      id: "5",
      image: Person4,
    },
    {
      id: "6",
      image: Person5,
    },
    {
      id: "7",
      image: Person6,
    },
    {
      id: "8",
      image: Person7,
    },
  ];

  return (
    <FlatList
      horizontal
      data={DUMMY_DATA}
      renderItem={({ item }) => (
        <View style={styles.box}>
          <View style={styles.circle}>
            <Image style={styles.img} source={item.image} resizeMode="cover" />
          </View>
        </View>
      )}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
      ListHeaderComponent={
        <TouchableOpacity
          style={[styles.circle, styles.left]}
          onPress={() => router.push("/folder")}
        >
          <Image source={add} resizeMode="cover" style={styles.img} />
        </TouchableOpacity>
      }
    />
  );
};

export default Shared;

const styles = StyleSheet.create({
  left: {
    // marginVertical: 25,
  },
  headerContainer: {
    padding: 15,
    backgroundColor: "#FA9884",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  headerText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  box: {
    alignSelf: "flex-start",
    paddingLeft: 20,
    // marginVertical: 25,
  },

  circle: {
    width: 190,
    height: 200,
    borderRadius: 15,
    // borderRadius: 65 / 2,
    // borderWidth: 2,
    // borderColor: "#FA9884",
    overflow: "hidden",
  },
  img: {
    width: "100%",
    height: "100%",
    // borderRadius: 65 / 2,
    // borderWidth: 3,
    // borderColor: "#f5f5f5",
  },
});
