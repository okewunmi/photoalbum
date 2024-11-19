import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  Image,
  Text,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  createFolder,
  uploadImage,
  checkFolderExist,
  getCurrentUser,
} from "../../lib/appwrite";
import { router } from "expo-router";
const folder = ({ navigation }) => {
  const [folderName, setFolderName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [folderImage, setFolderImage] = useState(null);

  const pickFolderImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setFolderImage(result.uri);
      }
    } catch (error) {
      Alert.alert("Error picking image", error.message);
    }
  };

  // const handleCreateFolder = async () => {
  //   if (!folderName || !subtitle) {
  //     Alert.alert("Please fill all the fields");
  //     return;
  //   }

  //   try {
  //     // Check if the folder already exists
  //     const folderExists = await checkFolderExist(folderName);

  //     if (folderExists) {
  //       Alert.alert("Folder already exists", "Please choose a different name.");
  //       return;
  //     }

  //     // Create the folder in Appwrite database without the background image

  //     const currentUser = await getCurrentUser();
  //     const createdBy = currentUser?.username || "Unknown User"; // Assuming the username is fetched from current user data

  //     const newFolder = await createFolder(folderName, subtitle, createdBy);

  //     Alert.alert("Folder Created Successfully");
  //     setFolderName("");
  //     setSubtitle("");
  //     router.push("/home"); // Redirect back to Home Screen
  //     return newFolder;
  //   } catch (error) {
  //     Alert.alert("Error creating folder", error.message);
  //   }
  // };

  // const handleCreateFolder = async () => {
  //   if (!folderName || !subtitle) {
  //     Alert.alert("Please fill all the fields");
  //     return;
  //   }

  //   try {
  //     // Check if the folder already exists
  //     const folderExists = await checkFolderExist(folderName);

  //     if (folderExists) {
  //       Alert.alert("Folder already exists", "Please choose a different name.");
  //       return;
  //     }

  //     // Fetch the current user's username
  //     const currentUser = await getCurrentUser();
  //     const createdBy = currentUser?.username || "Unknown User"; // Fallback to 'Unknown User'

  //     // Create the folder in Appwrite database with the createdBy field
  //     const newFolder = await createFolder(folderName, subtitle, createdBy);

  //     Alert.alert("Folder Created Successfully");
  //     setFolderName("");
  //     setSubtitle("");
  //     router.push("/home"); // Redirect back to Home Screen
  //     return newFolder;
  //   } catch (error) {
  //     Alert.alert("Error creating folder", error.message);
  //   }
  // };

  const handleCreateFolder = async () => {
    if (!folderName || !subtitle) {
      Alert.alert("Please fill all the fields");
      return;
    }

    try {
      // Check if the folder already exists
      const folderExists = await checkFolderExist(folderName);

      if (folderExists) {
        Alert.alert("Folder already exists", "Please choose a different name.");
        return;
      }

      // Fetch the current user's username
      const currentUser = await getCurrentUser();
      const createdBy = currentUser?.username || "Unknown User";

      // Create the folder
      const newFolder = await createFolder(folderName, subtitle, createdBy);

      Alert.alert(
        "Folder Created Successfully",
        `Folder ID: ${newFolder.folderId}`
      );
      setFolderName("");
      setSubtitle("");
      router.push("/home"); // Redirect back to Home Screen
      return newFolder;
    } catch (error) {
      Alert.alert("Error creating folder", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Folder Name"
        value={folderName}
        onChangeText={setFolderName}
        style={styles.input}
      />
      <TextInput
        placeholder="Subtitle"
        value={subtitle}
        onChangeText={setSubtitle}
        style={styles.input}
      />
      {/* <Button title="Pick Folder Image" onPress={pickFolderImage} />
      {folderImage && (
        <Image source={{ uri: folderImage }} style={styles.imagePreview} />
      )} */}
      <Button title="Create Folder" onPress={handleCreateFolder} />
    </View>
  );
};

export default folder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
    padding: 8,
    borderRadius: 4,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginBottom: 12,
    borderRadius: 8,
  },
});
