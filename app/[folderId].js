import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  fetchFolderDetails,
  fetchImagesInFolder,
  uploadImageToFolder,
  getAccount,
  addPhoto,
} from "../lib/appwrite";
import * as DocumentPicker from "expo-document-picker";
import Entypo from "@expo/vector-icons/Entypo";

import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Pressable,
  Image,
} from "react-native";

const FolderDetails = () => {
  const { folderId } = useLocalSearchParams();
  const [folder, setFolder] = useState(null);
  const [images, setImages] = useState([]);

  const ensureAuthenticated = async () => {
    const account = await getAccount();
    if (!account) {
      throw new Error("User is not authenticated");
    }
  };

  // Fetch folder details
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
    if (folderId) refreshImages();
  }, [folderId]);

  // Fetch images in folder
  const refreshImages = async () => {
    try {
      await ensureAuthenticated(); // Ensure user is logged in
      const imagesInFolder = await fetchImagesInFolder(folderId);
      setImages(imagesInFolder);
    } catch (error) {
      console.error("Error fetching images:", error.message);
      alert("You are not authorized to view these images");
    }
  };

  if (!folder) {
    return <Text>Loading folder details...</Text>;
  }

  const handleAddPhotos = async () => {
    try {
      // Allow multiple image selection
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        multiple: true, // Enable multiple file selection
      });

      if (result.type === "success") {
        // Check if multiple files are selected
        const files = Array.isArray(result) ? result : [result];

        // Iterate through selected files and upload each
        for (const selectedFile of files) {
          const file = {
            uri: selectedFile.uri,
            name: selectedFile.name,
            type: selectedFile.mimeType || "image/jpeg",
          };

          // Use the addPhoto function to upload and associate photo with the folder
          await addPhoto(folderId, file); // Add photo to the folder using addPhoto function
        }

        // Refresh the image list after all uploads
        await refreshImages();

        // Show success message
        alert("Photos uploaded successfully!");
      }
    } catch (error) {
      console.error("Error adding photos:", error.message);
      // Show error message
      alert("Failed to upload the photos. Please try again.");
    }
  };

  return (
    <View style={styles.box}>
      <View style={styles.boxBtn}>
        <Pressable style={styles.btn} onPress={handleAddPhotos}>
          <Text style={styles.btnTxt}>Add Photos</Text>
        </Pressable>
        <Pressable style={styles.btn}>
          <Entypo name="share" size={18} color="#fff" />
          <Text style={styles.btnTxt}>Share</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scroll}>
        <Text style={styles.title}>Details of folder {folderId}</Text>
        <View style={styles.imageGrid}>
          {images.map((image) => (
            <Image
              key={image.$id}
              source={{ uri: image.fileUrl }}
              style={styles.image}
            />
          ))}
        </View>
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
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  imageContainer: {
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  imageId: {
    marginTop: 5,
    fontSize: 12,
    color: "#666",
  },
});
