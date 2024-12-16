
import { FlatList, Image, StyleSheet, View } from "react-native";
import React from "react";
import Person1 from "../assets/images/person1.jpeg";
const Shared = ({ recentPhotos }) => {
  return (
    <FlatList
      horizontal
      data={recentPhotos} // Using the recentPhotos passed as props
      renderItem={({ item }) => (
        <View style={styles.box}>
          <View style={styles.circle}>
            <Image
              style={styles.img}
              source={{ uri: item } || Person1} // Assuming each item in recentPhotos is a URL string
              resizeMode="cover"
            />
          </View>
        </View>
      )}
      keyExtractor={(item, index) => index.toString()} // Using index as key if items are URL strings
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default Shared;

const styles = StyleSheet.create({
  box: {
    alignSelf: "flex-start",
    paddingLeft: 20,
  },
  circle: {
    width: 190,
    height: 220,
    borderRadius: 15,
    overflow: "hidden",
  },
  img: {
    width: "100%",
    height: "100%",
  },
});
