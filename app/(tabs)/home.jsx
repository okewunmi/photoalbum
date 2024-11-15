import React from "react";
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Button,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import AntDesign from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import Card from "../../components/card";
import Shared from "../../components/shared";
import dash from "../../assets/images/dash.png";
import Person9 from "../../assets/images/person.jpeg";
import Person8 from "../../assets/images/person1.jpeg";
import Person7 from "../../assets/images/person2.jpeg";
import Person6 from "../../assets/images/person3.jpeg";
import Person5 from "../../assets/images/person4.jpeg";
import Person4 from "../../assets/images/person5.jpeg";
import Person3 from "../../assets/images/person6.jpeg";
import Person2 from "../../assets/images/person7.jpeg";
import Person1 from "../../assets/images/person8.jpeg";
import add from "../../assets/images/add.png";
const home = () => {
  const DUMMY_DATA = [
    {
      id: "1",
      heading: "Traditional Atires",
      txt: "For men and women",
      image: Person1,
    },
    {
      id: "2",
      heading: "Fabrics Collection",
      txt: "Casual wears for all",
      image: Person2,
    },
    {
      id: "3",
      heading: "Fabrics Collection",
      txt: "Casual for men and women",
      image: Person3,
    },
    {
      id: "4",
      heading: "Fabrics Collection",
      txt: "Casual for men and women",
      // image: Person4,
    },
    {
      id: "5",
      heading: "Fabrics Collection",
      txt: "Casual for men and women",

      // image: Person4,
    },
    {
      id: "6",
      heading: "Fabrics Collection",
      txt: "Casual for men and women",
      // image: Person5,
    },
    {
      id: "7",
      heading: "Fabrics Collection",
      txt: "Casual for men and women",
      // image: Person6,
    },
    {
      id: "8",
      heading: "Fabrics Collection",
      txt: "Casual wears for men and women",
      // image: Person7,
    },
  ];
  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={DUMMY_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.headercard}>
            <Card post={item} />
          </View>
        )}
        ListHeaderComponent={() => (
          <View style={styles.Listheader}>
            <View style={styles.head}>
              <View>
                <Text style={styles.welcome}>Hi, Adekunle</Text>
              </View>
              <TouchableOpacity>
                <Image source={dash} resizeMode="contain" size={20} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.boxInput}>
              <TextInput
                placeholder="search for folder.."
                keyboardType="text"
                style={styles.input}
              />
              <Pressable>
                <Feather name="search" size={22} color="#575353" />
              </Pressable>
            </TouchableOpacity>
            <View style={styles.shared}>
              <Text style={styles.sharedtxt}>Recently Uploaded</Text>
              <Shared />
            </View>
            <View style={styles.ListFolder}>
              <Text style={styles.sharedtxt}>All Folders</Text>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default home;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#f2f2f2",
    height: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  Listheader: {
    paddingHorizontal: 25,
  },
  shared: {
    display: "flex",
    paddingVertical: 20,
    // flexDirection: "row",
  },
  sharedtxt: {
    paddingBottom: 18,
    fontFamily: "Helvetica",
    fontSize: 15,
    fontWeight: "bold",
    // color: "#575353",
  },
  welcome: {
    fontFamily: "inter",
    fontSize: 29,
    fontWeight: "bold",
    // color: "#575353",
  },
  boxInput: {
    width: "100%",
    height: 37,
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "row",
    paddingHorizontal: 10,
  },
  input: {
    width: "90%",
    height: "100%",
    paddingHorizontal: 15,
    fontSize: 13,
    fontWeight: "light",
    borderStyle: "solid",
    // backgroundColor: "grey",
    borderRadius: 20,
  },
  headercard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  head: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    // paddingHorizontal: 30,
    paddingVertical: 20,
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
  card: {
    marginTop: 130,
  },
});
