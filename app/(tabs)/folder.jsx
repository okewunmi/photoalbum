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
  TouchableOpacity,
} from "react-native";
import { appwriteCreateFolder, appwriteUploadImage } from "../../lib/appwrite";
import * as ImagePicker from "expo-image-picker";

export default function FolderScreen({ navigation }) {
  const [folderName, setFolderName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [folderImage, setFolderImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);

  const pickFolderImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.cancelled) {
      setFolderImage(result.uri);
    }
  };

  const createFolder = async () => {
    if (!folderName || !subtitle || !folderImage) {
      Alert.alert("Please fill all the fields");
      return;
    }
    try {
      const folderData = await appwriteCreateFolder(
        folderName,
        subtitle,
        folderImage
      );
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
      <Button title="Create Folder" onPress={createFolder} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  input: {
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
    borderRadius: 4,
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
});
