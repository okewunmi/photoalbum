import React, { useState } from "react";
import {
  Alert,
  Text,
  Button,
  Image,
  StyleSheet,
  TextInput,
  View,
  ActivityIndicator,
} from "react-native";
import { db } from "@/lib/firebase";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useGlobalContext } from "../../ContextFile/GlobalProvider"; // Import GlobalContext
import { SafeAreaView } from "react-native-safe-area-context";

// Helper function to create folders in Firestore
const createFolders = async ({ name, subtitle, userId }) => {
  const folderData = {
    name,
    subtitle,
    userId,
    createdAt: new Date().toISOString(),
  };

  const folderRef = await addDoc(collection(db, "folders"), folderData);
  return { id: folderRef.id, ...folderData }; // Return folder ID and data
};

// Helper function to upload multiple images to Firebase Storage
const uploadMultipleImages = async (folderId, images) => {
  const storage = getStorage();
  const imageUrls = [];

  for (const image of images) {
    const imageRef = ref(storage, `folders/${folderId}/${image.fileName}`);
    const response = await fetch(image.uri);
    const blob = await response.blob();

    await uploadBytes(imageRef, blob);
    const downloadUrl = await getDownloadURL(imageRef);
    imageUrls.push(downloadUrl);
  }

  return imageUrls; // Return the array of image URLs
};

const CreateFolder = () => {
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { user } = useGlobalContext(); // Get the current user from GlobalContext

  const handleSelectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Images,
      allowsMultipleSelection: true, // Enable multiple image selection
    });

    if (!result.canceled) {
      setSelectedImages(result.assets);
    }
  };

  const handleCreate = async () => {
    if (!name.trim() || !subtitle.trim()) {
      Alert.alert("Required Fields", "Please fill in all fields");
      return;
    }

    if (!user) {
      Alert.alert("Authentication Error", "No user is currently logged in.");
      return;
    }

    setIsLoading(true);

    try {
      const userId = user.uid;

      // Create folder in Firestore (this will only happen once)
      const folder = await createFolders({
        name,
        subtitle,
        userId,
      });

      console.log("Folder created:", folder);

      // If images were selected, upload them
      if (selectedImages.length > 0) {
        const imageUrls = await uploadMultipleImages(folder.id, selectedImages);

        // Update the folder document with image URLs
        await addDoc(collection(db, "folders"), {
          ...folder,
          images: imageUrls,
        });

        console.log("Images uploaded and saved successfully.");
      }

      setName("");
      setSubtitle("");
      setSelectedImages([]);

      Alert.alert("Success", "Folder created successfully!", [
        {
          text: "OK",
          onPress: () => router.push("/home"), // Navigate to the home screen after success
        },
      ]);
    } catch (error) {
      console.error("Error during folder creation or upload:", error);
      Alert.alert(
        "Error",
        "Failed to create folder or upload images. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.test}>
        <Text style={styles.txt}>Create a Folder</Text>
      </View>
      <TextInput
        placeholder="Folder Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Subtitle"
        value={subtitle}
        onChangeText={setSubtitle}
        style={styles.input}
        multiline
      />
      <Button
        title="Select Images"
        onPress={handleSelectImage}
        color="#423D3D"
      />
      <View style={styles.imageContainer}>
        {selectedImages.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image.uri }}
            style={styles.imagePreview}
          />
        ))}
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <Button
          title="Create Folder"
          onPress={handleCreate}
          disabled={!name.trim() || !subtitle.trim()}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  test: {
    paddingVertical: 30,
    width: "100%",
  },
  txt: {
    textAlign: "center",
    fontSize: 20,
    fontFamily: "helvetica",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    padding: 8,
    marginVertical: 8,
    borderRadius: 12,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 8,
  },
  imagePreview: {
    width: 120,
    height: 120,
    margin: 4,
    borderRadius: 8,
  },
  btn: {
    backgroundColor: "#FA9884",
    borderRadius: 12,
  },
});

export default CreateFolder;
