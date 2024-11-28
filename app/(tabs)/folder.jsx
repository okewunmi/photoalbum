// // components/CreateFolder.js
// import React, { useState } from "react";
// import {
//   View,
//   TextInput,
//   Button,
//   Image,
//   Alert,
//   ActivityIndicator,
//   StyleSheet,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import {
//   createFolders,
//   uploadss,
//   MainUpload,
//   uploadMultipleImages,
// } from "../../lib/appwrite";
// import { useRouter, router } from "expo-router";

// const CreateFolder = () => {
//   const [name, setName] = useState("");
//   const [subtitle, setSubtitle] = useState("");
//   const [selectedImages, setSelectedImages] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();

//   const pickImages = async () => {
//     try {
//       const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

//       if (!permissionResult.granted) {
//         Alert.alert(
//           "Permission Required",
//           "Please grant camera roll access to continue"
//         );
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ["images"],
//         allowsMultipleSelection: true,
//         quality: 1,
//       });

//       if (!result.canceled && result.assets) {
//         setSelectedImages(result.assets);
//       }
//     } catch (error) {
//       console.error("Error picking images:", error);
//       Alert.alert("Error", "Failed to pick images");
//     }
//   };

//   const handleCreate = async () => {
//     if (!name.trim() || !subtitle.trim()) {
//       Alert.alert("Required Fields", "Please fill in all fields");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // Create a new folder
//       const folder = await createFolders(name, subtitle);
//       console.log("Folder created:", folder);

//       // Check if there are selected images
//       if (selectedImages.length > 0) {
//         const imageFiles = selectedImages.map((image) => ({
//           uri: image.uri,
//           name: `image-${Date.now()}.jpg`,
//           type: "image/jpeg",
//         }));

//         // Upload images to the created folder
//         await uploadMultipleImages(folder.$id, imageFiles);
//         console.log("Images uploaded successfully");
//       }

//       // Reset form fields
//       setName("");
//       setSubtitle("");
//       setSelectedImages([]);

//       Alert.alert("Success", "Folder created successfully!", [
//         {
//           text: "OK",
//           onPress: () => router.push("/home"), // Navigate to the home screen
//         },
//       ]);
//     } catch (error) {
//       console.error("Error during folder creation or upload:", error);
//       Alert.alert(
//         "Error",
//         "Failed to create folder or upload images. Please try again."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         style={styles.input}
//         placeholder="Folder Name"
//         value={name}
//         onChangeText={setName}
//         editable={!isLoading}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Subtitle"
//         value={subtitle}
//         onChangeText={setSubtitle}
//         editable={!isLoading}
//       />

//       <Button title="Pick Images" onPress={pickImages} disabled={isLoading} />

//       <View style={styles.imageGrid}>
//         {selectedImages.map((image, index) => (
//           <Image
//             key={index}
//             source={{ uri: image.uri }}
//             style={styles.thumbnail}
//           />
//         ))}
//       </View>

//       {isLoading ? (
//         <ActivityIndicator size="large" color="#0000ff" />
//       ) : (
//         <Button
//           title="Create Folder"
//           onPress={handleCreate}
//           disabled={!name.trim() || !subtitle.trim()}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginTop: 50,
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#fff",
//   },
//   input: {
//     height: 40,
//     borderColor: "gray",
//     borderWidth: 1,
//     marginBottom: 10,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//   },
//   imageGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginVertical: 10,
//   },
//   thumbnail: {
//     width: 100,
//     height: 100,
//     margin: 5,
//     borderRadius: 5,
//   },
// });

// export default CreateFolder;
// import { db, auth, storage } from "../../lib/firebase";

import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Text,
  TextInput,
  Image,
  FlatList,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth, storage } from "../../lib/firebase";

const CreateFolderScreen = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [folderName, setFolderName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Monitor the current user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "Anonymous User",
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Select multiple images
  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true, // Enable multiple selection (Expo SDK 49+)
    });

    if (!result.canceled) {
      setSelectedImages(result.assets.map((asset) => asset.uri));
    }
  };

  // Upload images to Firebase Storage
  const uploadImages = async (folderId) => {
    const uploadedUrls = [];
    for (const uri of selectedImages) {
      const response = await fetch(uri);
      const blob = await response.blob();

      const imageRef = ref(
        storage,
        `folders/${folderId}/${uri.split("/").pop()}`
      );
      await uploadBytes(imageRef, blob);
      const downloadUrl = await getDownloadURL(imageRef);

      uploadedUrls.push(downloadUrl);
    }
    return uploadedUrls;
  };

  // Create folder in Firestore
  const createFolder = async () => {
    if (!currentUser) {
      alert("You must be logged in to create a folder.");
      return;
    }

    if (!folderName || !subtitle) {
      alert("Please enter a folder name and subtitle.");
      return;
    }

    if (selectedImages.length === 0) {
      alert("Please select at least one image.");
      return;
    }

    setUploading(true);
    try {
      const folderId = `folder_${Date.now()}`; // Generate a unique folder ID

      // Upload images and get their download URLs
      const imageUrls = await uploadImages(folderId);

      // Folder data to save in Firestore
      const folderData = {
        createdAt: serverTimestamp(),
        createdBy: currentUser.uid,
        folderId,
        image: imageUrls,
        name: folderName,
        subtitle,
        user: `/user/${currentUser.uid}`,
      };

      // Save folder to Firestore
      await addDoc(collection(db, "folders"), folderData);

      alert("Folder created successfully!");
      setSelectedImages([]); // Clear selected images
      setFolderName(""); // Reset folder name input
      setSubtitle(""); // Reset subtitle input
    } catch (error) {
      console.error("Error creating folder:", error);
      alert("Failed to create folder. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Enter Folder Name"
        value={folderName}
        onChangeText={setFolderName}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter Description"
        value={subtitle}
        onChangeText={setSubtitle}
      />

      <Button title="Pick Images" onPress={pickImages} />
      <FlatList
        data={selectedImages}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.imagePreview} />
        )}
      />

      <Button
        title="Create Folder"
        onPress={createFolder}
        disabled={uploading}
      />
    </View>
  );
};

export default CreateFolderScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     padding: 10,
//   },
//   input: {
//     width: "80%",
//     height: 40,
//     borderColor: "#ccc",
//     borderWidth: 1,
//     borderRadius: 5,
//     marginVertical: 10,
//     paddingHorizontal: 10,
//   },
//   imagePreview: {
//     width: 100,
//     height: 100,
//     margin: 5,
//     borderRadius: 5,
//   },
// });
