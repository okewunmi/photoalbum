import React, { useState, useEffect } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  RefreshControl,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import Card from "../../components/card";
import Shared from "../../components/shared";
import dash from "../../assets/images/dash.png";
import Person3 from "../../assets/images/person6.jpeg";
import Person2 from "../../assets/images/person7.jpeg";
import Person1 from "../../assets/images/person8.jpeg";
import { router, Redirect, Link } from "expo-router";
import { getCurrentUser, fetchFolders } from "@/lib/appwrite";

const home = () => {
  const [folder, setFolder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const fetchedFolders = await fetchFolders();
      setFolder(fetchedFolders); // Update the folder state
    } catch (error) {
      console.error("Error refreshing folders:", error.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser && currentUser.username) {
          setUserName(currentUser.username);
        }
      } catch (error) {
        console.error("Error fetching user:", error.message);
      }
    };

    fetchUserName();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const currentUser = await getCurrentUser();

        if (currentUser && currentUser.username) {
          setUserName(currentUser.username);
        }

        const fetchedFolders = await fetchFolders();

        setFolder(fetchedFolders);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={folder || []}
        keyExtractor={(item) => item.$id.toString()}
        renderItem={({ item }) => (
          <View style={styles.headercard}>
            <Link
              href={{
                pathname: "[folderId]",
                params: { folderId: item.$id },
              }}
            >
              <Card post={item} />
            </Link>
          </View>
        )}
        ListHeaderComponent={() => (
          <View style={styles.Listheader}>
            <View style={styles.head}>
              <View>
                <Text style={styles.welcome}>Hi, {userName}</Text>
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
              <Text style={styles.sharedtxt}>Recent Photos</Text>
              <Shared />
            </View>
            <View style={styles.ListFolder}>
              <Text style={styles.sharedtxt}>Latest Folder</Text>
            </View>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          !loading && (
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              No folders available.
            </Text>
          )
        }
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
    paddingTop: 30,
    paddingHorizontal: 25,
  },
  shared: {
    display: "flex",
    paddingTop: 30,
    paddingBottom: 15,
    borderBottomColor: "#dbdbdb",
    borderBottomWidth: 1,
    borderStyle: "solid",

    // flexDirection: "row",
  },
  sharedtxt: {
    paddingBottom: 18,
    fontFamily: "Helvetica",
    fontSize: 16,
    paddingLeft: 15,

    color: "#7b7676",
  },

  ListFolder: {
    paddingTop: 30,
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
    borderColor: "#575353",
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
    marginBottom: 15,
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
