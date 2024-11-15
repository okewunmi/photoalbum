// import React from "react";
// import { Text, View } from "react-native";
// const folder = () => {
//   return (
//     <View>
//       <Text>folder</Text>
//     </View>
//   );
// };

// export default folder;

import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  Image,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { createFolder, uploadImage } from "../../lib/appwrite";

const Folder = ({ navigation }) => {
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

  const handleCreateFolder = async () => {
    if (!folderName || !subtitle || !folderImage) {
      Alert.alert("Please fill all the fields and select an image");
      return;
    }

    try {
      // Upload the folder image to Appwrite storage
      const imageFile = {
        uri: folderImage,
        type: "image/jpeg",
        name: `${folderName}_image.jpg`,
      };

      const uploadedImage = await uploadImage(imageFile, null); // Passing null for folderId
      const imageUrl = uploadedImage.fileUrl;

      // Create the folder in Appwrite database
      await createFolder(folderName, subtitle, imageUrl);

      Alert.alert("Folder Created Successfully");
      navigation.navigate("home"); // Redirect back to Home Screen
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
      <Button title="Pick Folder Image" onPress={pickFolderImage} />
      {folderImage && (
        <Image source={{ uri: folderImage }} style={styles.imagePreview} />
      )}
      <Button title="Create Folder" onPress={handleCreateFolder} />
    </View>
  );
};

export default Folder;

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
