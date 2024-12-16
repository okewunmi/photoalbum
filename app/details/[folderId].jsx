// import React, { useEffect, useState } from "react";
// import { useLocalSearchParams } from "expo-router";
// import { StyleSheet, View, Text } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// const FolderDetails = () => {
//   const { folderId } = useLocalSearchParams();
//   const [folder, setFolder] = useState(null);

//   // useEffect(() => {
//   //   const fetchDetails = async () => {
//   //     try {
//   //       const details = await fetchFolderDetails(folderId);
//   //       setFolder(details);
//   //     } catch (error) {
//   //       console.error("Error fetching folder details:", error.message);
//   //     }
//   //   };

//   //   if (folderId) fetchDetails();
//   // }, [folderId]);

//   // if (!folder) {
//   //   return <Text>Loading folder details...</Text>;
//   // }

//   return (
//     <SafeAreaView style={styles.view}>
//       <View style={styles.box}>
//         <Text style={styles.title}>Details of folder {folderId}</Text>
//       </View>
//     </SafeAreaView>
//   );
// };
// export default FolderDetails;

// const styles = StyleSheet.create({
//   view: {
//     flex: 1,
//     paddingHorizontal: 20,
//   },
//   box: {},
// });

// import React, { useEffect, useState } from "react";
// import { useLocalSearchParams } from "expo-router";
// import { StyleSheet, View, Text, FlatList, Image } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { db } from "@/lib/firebase";
// import { doc, getDoc } from "firebase/firestore";
// import { useNavigation } from "@react-navigation/native";
// const FolderDetails = () => {
//   const { folderId } = useLocalSearchParams(); // Retrieve the folderId passed via routing
//   const [folder, setFolder] = useState(null);
//   const [images, setImages] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   const navigation = useNavigation();

//   useEffect(() => {
//     if (folder?.name) {
//       navigation.setOptions({ title: folder.name }); // Update the screen name
//     }
//   }, [folder?.name]);

//   // ...rest of the code

//   useEffect(() => {
//     const fetchDetails = async () => {
//       try {
//         const folderRef = doc(db, "folders", folderId);
//         const folderSnapshot = await getDoc(folderRef);

//         if (folderSnapshot.exists()) {
//           const folderData = folderSnapshot.data();
//           setFolder(folderData);

//           // Assuming images are stored as an array in the folder document
//           setImages(folderData.images || []);
//         } else {
//           console.error("Folder not found.");
//         }
//       } catch (error) {
//         console.error("Error fetching folder details:", error.message);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (folderId) fetchDetails();
//   }, [folderId]);

//   if (isLoading) {
//     return (
//       <SafeAreaView style={styles.view}>
//         <Text>Loading folder details...</Text>
//       </SafeAreaView>
//     );
//   }

//   if (!folder) {
//     return (
//       <SafeAreaView style={styles.view}>
//         <Text>No folder found.</Text>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.view}>
//       <View style={styles.header}>
//         <Text style={styles.title}>{folder.name}</Text>
//         <Text style={styles.subtitle}>{folder.subtitle}</Text>
//       </View>
//       <FlatList
//         data={images}
//         keyExtractor={(item, index) => index.toString()}
//         renderItem={({ item }) => (
//           <Image source={{ uri: item }} style={styles.image} />
//         )}
//         contentContainerStyle={styles.imageContainer}
//       />
//     </SafeAreaView>
//   );
// };

// export default FolderDetails;

// const styles = StyleSheet.create({
//   view: {
//     flex: 1,
//     paddingHorizontal: 20,
//     backgroundColor: "#fff",
//   },
//   header: {
//     marginVertical: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//   },
//   subtitle: {
//     fontSize: 16,
//     textAlign: "center",
//     color: "#555",
//   },
//   imageContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "center",
//   },
//   image: {
//     width: 120,
//     height: 120,
//     margin: 10,
//     borderRadius: 8,
//   },
// });

import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
const FolderDetails = () => {
  const { folderId } = useLocalSearchParams(); // Get dynamic folderId from the route
  const [folderName, setFolderName] = useState("");
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFolderDetails = async () => {
      try {
        // Fetch folder metadata from Firestore
        const folderRef = doc(db, "folders", folderId);
        const folderSnapshot = await getDoc(folderRef);

        if (folderSnapshot.exists()) {
          const folderData = folderSnapshot.data();
          console.log("Fetched Folder Data:", folderData);

          setFolderName(folderData.name || "Unnamed Folder");
          navigation.setOptions({ title: folderData.name || "Folder Details" });

          // Fetch images from Firebase Storage
          const storage = getStorage();
          const folderStorageRef = ref(storage, `folders/${folderId}`);
          const folderList = await listAll(folderStorageRef);

          const imageUrls = await Promise.all(
            folderList.items.map((itemRef) => getDownloadURL(itemRef))
          );

          console.log("Fetched Image URLs:", imageUrls);
          setImages(imageUrls);
        } else {
          console.error("Folder not found.");
        }
      } catch (error) {
        console.error("Error fetching folder details:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (folderId) fetchFolderDetails();
  }, [folderId]);

  const handleAddPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
      });

      if (result.canceled) return;

      const selectedImages = result.assets;
      const storage = getStorage();
      const uploadedImageUrls = [];

      for (const image of selectedImages) {
        const imageRef = ref(storage, `folders/${folderId}/${image.fileName}`);
        const response = await fetch(image.uri);
        const blob = await response.blob();

        await uploadBytes(imageRef, blob);
        const downloadUrl = await getDownloadURL(imageRef);
        uploadedImageUrls.push(downloadUrl);
      }

      // Update Firestore folder document with new image URLs
      const folderRef = doc(db, "folders", folderId);
      await updateDoc(folderRef, {
        images: arrayUnion(...uploadedImageUrls),
      });

      // Update local state
      setImages((prev) => [...prev, ...uploadedImageUrls]);
      Alert.alert("Success", "Photos added successfully!");
    } catch (error) {
      console.error("Error adding photos:", error);
      Alert.alert("Error", "Failed to add photos. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.view}>
        <Text>Loading folder details...</Text>
      </SafeAreaView>
    );
  }

  if (images.length === 0) {
    return (
      <SafeAreaView style={styles.view}>
        <Text>No images found in this folder.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.header}>
        <TouchableOpacity style={[styles.touch]} onPress={handleAddPhoto}>
          <Text>add photo</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.touch}>
          <Text>share</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={images}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.image}>
            <Image source={{ uri: item }} style={styles.image} />
          </View>
        )}
        contentContainerStyle={styles.imageContainer}
      />
    </SafeAreaView>
  );
};

export default FolderDetails;

const styles = StyleSheet.create({
  view: {
    flex: 1,
    // paddingTop: 20,

    backgroundColor: "#fff",
  },
  header: {
    marginHorizontal: 40,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  touch: {
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 20,
  },
  btn1: {
    color: "#FA9884",
  },
  btn2: {
    backgroundColor: "#433f3f",
    color: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 280,
    height: 400,
    marginBottom: 20,
    // marginVertical: 20,
    // margin: 10,
    borderRadius: 8,
  },
});
