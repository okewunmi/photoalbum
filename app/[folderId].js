import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { fetchFolderDetails } from "../lib/appwrite";
import Entypo from "@expo/vector-icons/Entypo";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Button,
  Pressable,
} from "react-native";

const FolderDetails = () => {
  const { folderId } = useLocalSearchParams();
  const [folder, setFolder] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const details = await fetchFolderDetails(folderId);
        setFolder(details);
      } catch (error) {
        console.error("Error fetching folder details:", error.message);
      }
    };

    if (folderId) fetchDetails();
  }, [folderId]);

  if (!folder) {
    return <Text>Loading folder details...</Text>;
  }

  return (
    <View style={styles.box}>
      <View style={styles.boxBtn}>
        <Pressable style={styles.btn}>
          <Text style={styles.btnTxt}>add photos</Text>
        </Pressable>
        <Pressable style={styles.btn}>
          <Entypo name="share" size={18} color="#fff" />
          <Text style={styles.btnTxt}>share</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scroll}>
        <Text style={styles.title}>Details of folder {folderId}</Text>
      </ScrollView>
    </View>
  );
};
export default FolderDetails;

const styles = StyleSheet.create({
  box: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  btn: {
    // padding: 10,
    backgroundColor: "#000",
    width: 110,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    flexDirection: "row",
    gap: 10,
  },
  btnTxt: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
  },
  boxBtn: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  scroll: {
    marginTop: 20,
  },
});
