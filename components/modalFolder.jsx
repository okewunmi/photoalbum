import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  Image,
  Button,
  StyleSheet,
} from "react-native";
import { appwriteFetchImagesInFolder } from "../lib/appwrite";

export default function FolderModal({ visible, onClose, folder }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (folder) {
      const fetchImages = async () => {
        try {
          const imagesData = await appwriteFetchImagesInFolder(folder.$id);
          setImages(imagesData);
        } catch (error) {
          console.error("Error fetching images:", error);
        }
      };
      fetchImages();
    }
  }, [folder]);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <Text style={styles.modalTitle}>{folder.name}</Text>
        <FlatList
          data={images}
          keyExtractor={(item) => item.$id}
          renderItem={({ item }) => (
            <Image source={{ uri: item.fileUrl }} style={styles.image} />
          )}
        />
        <Button title="Close" onPress={onClose} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalTitle: { fontSize: 24, marginBottom: 16 },
  image: { width: 100, height: 100, marginBottom: 10 },
});
