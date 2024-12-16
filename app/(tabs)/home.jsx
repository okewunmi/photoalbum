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
import { router } from "expo-router";
import {
  collection,
  getDocs,
  query,
  where,
  limit,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const Home = () => {
  const [folder, setFolder] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState("Anonymous");
  const [refreshing, setRefreshing] = useState(false);
  const [recentPhotos, setRecentPhotos] = useState([]); // State for recent photos

  const fetchUserFolders = async () => {
    setLoading(true);
    const currentUser = auth.currentUser;

    if (currentUser) {
      try {
        // Fetch folders of the current user
        const folderQuery = query(
          collection(db, "folders"),
          where("userId", "==", currentUser.uid)
        );

        const folderSnapshot = await getDocs(folderQuery);

        if (!folderSnapshot.empty) {
          const userFolders = folderSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setFolder(userFolders);

          // Fetch images for each folder
          await fetchImagesInFolders(userFolders);
        } else {
          console.log("No folders found for the current user.");
          setFolder([]);
          setRecentPhotos([]); // Reset recent photos if no folders
        }
      } catch (error) {
        console.error("Error fetching user folders:", error.message);
      } finally {
        setLoading(false);
      }
    } else {
      console.log("No user is currently logged in.");
      setLoading(false);
    }
  };

  const fetchImagesInFolders = async (folders) => {
    try {
      const allImages = [];
      for (const folder of folders) {
        // Fetching images within each folder
        // Assuming `folder.images` is an array of image URLs stored in the `folder` document
        const folderImages = folder.images || []; // Use empty array if no images exist

        allImages.push(...folderImages); // Add to consolidated list of all images
      }

      setRecentPhotos(allImages); // Update state with all images
    } catch (error) {
      console.error("Error fetching images in folders:", error.message);
    }
  };

  const fetchCurrentUser = async () => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      try {
        const userQuery = query(
          collection(db, "user"),
          where("uid", "==", currentUser.uid)
        );

        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          setUserName(userData.username || "Anonymous");
        } else {
          console.log("User document not found.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    } else {
      console.log("No user is currently logged in.");
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchUserFolders();
    } catch (error) {
      console.error("Error refreshing folders:", error.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserFolders();
    fetchCurrentUser();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={folder || []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.headercard} key={item.id}>
            {/* <TouchableOpacity
              onPress={() => router.push("/details/[folderId]")}
            >
              <Card post={item} />
            </TouchableOpacity> */}
            <TouchableOpacity
              onPress={() => router.push(`/details/${item.id}`)} // Pass the folderId dynamically
            >
              <Card post={item} />
            </TouchableOpacity>
          </View>
        )}
        ListHeaderComponent={() => (
          <View style={styles.Listheader}>
            <View style={styles.head}>
              <Text style={styles.welcome}>Hi, {userName}</Text>
              <TouchableOpacity>
                <Image source={dash} resizeMode="contain" size={20} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.boxInput}>
              <TextInput
                placeholder="Search for folder..."
                keyboardType="text"
                style={styles.input}
              />
              <Pressable>
                <Feather name="search" size={22} color="#575353" />
              </Pressable>
            </TouchableOpacity>
            <View style={styles.shared}>
              <Text style={styles.sharedtxt}>Recent Photos</Text>
              <Shared recentPhotos={recentPhotos} />
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

export default Home;

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#f2f2f2",
    height: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  Listheader: {
    paddingTop: 20,
    paddingHorizontal: 25,
  },
  shared: {
    display: "flex",
    paddingTop: 30,
    paddingBottom: 15,
    borderBottomColor: "#dbdbdb",
    borderBottomWidth: 2,
    borderStyle: "solid",
  },
  sharedtxt: {
    paddingBottom: 18,
    fontFamily: "Helvetica",
    fontSize: 18,
    paddingLeft: 10,
    color: "#6b5454",
    fontWeight: "bold",
  },

  ListFolder: {
    paddingTop: 30,
  },
  welcome: {
    fontFamily: "inter",
    fontSize: 20,
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
