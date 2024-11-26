// import React, { useState } from "react";
// import {
//   View,
//   TextInput,
//   Button,
//   Alert,
//   Image,
//   StyleSheet,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import {
//   createFolder,
//   uploadImage,
//   checkFolderExist,
//   getCurrentUser,
// } from "../../lib/appwrite";
// import { useRouter } from "expo-router"; // Updated to use the latest hooks for routing

// const Folder = () => {
//   const [folderName, setFolderName] = useState("");
//   const [subtitle, setSubtitle] = useState("");
//   const [folderImage, setFolderImage] = useState(null);
//   const router = useRouter();

//   // const pickFolderImage = async () => {
//   //   try {
//   //     const result = await ImagePicker.launchImageLibraryAsync({
//   //       mediaTypes: ["images"],
//   //       quality: 1,
//   //       allowsMultipleSelection: true, // Ensure this is set correctly
//   //     });

//   //     if (!result.canceled) {
//   //       setFolderImage(result.assets.map((asset) => asset.uri));
//   //     }
//   //   } catch (error) {
//   //     Alert.alert("Error picking image", error.message);
//   //   }
//   // };
//   const pickFolderImage = async () => {
//     try {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ["images"],
//         quality: 1,
//         allowsMultipleSelection: false, // Set to false to avoid selecting multiple images
//       });

//       if (!result.canceled && result.assets.length > 0) {
//         setFolderImage(result.assets[0].uri); // Use the first image URI
//       }
//     } catch (error) {
//       Alert.alert("Error picking image", error.message);
//     }
//   };

//   const handleCreateFolder = async () => {
//     if (!folderName || !subtitle) {
//       Alert.alert("Validation Error", "Please fill all the fields.");
//       return;
//     }

//     try {
//       const folderExists = await checkFolderExist(folderName);
//       if (folderExists) {
//         Alert.alert(
//           "Duplicate Folder",
//           "Folder already exists. Please choose a different name."
//         );
//         return;
//       }

//       const currentUser = await getCurrentUser();
//       const createdBy = currentUser?.username || "Unknown User";

//       let imageUrls = [];
//       if (folderImage) {
//         imageUrls = await uploadImage(folderImage); // Make sure it's an array of URLs
//       }

//       const newFolder = await createFolder(
//         folderName,
//         subtitle,
//         createdBy,
//         imageUrls
//       );

//       Alert.alert(
//         "Success",
//         `Folder created successfully with ID: ${newFolder.folderId}`
//       );
//       setFolderName("");
//       setSubtitle("");
//       setFolderImage(null);
//       router.push("/home");
//     } catch (error) {
//       console.error("Error:", error);
//       Alert.alert("Error", error.message || "Something went wrong.");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         placeholder="Folder Name"
//         value={folderName}
//         onChangeText={setFolderName}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Subtitle"
//         value={subtitle}
//         onChangeText={setSubtitle}
//         style={styles.input}
//       />
//       <Button title="Pick Folder Image" onPress={pickFolderImage} />
//       {folderImage && (
//         <Image source={{ uri: folderImage }} style={styles.imagePreview} />
//       )}

//       <Button title="Create Folder" onPress={handleCreateFolder} />
//     </View>
//   );
// };

// export default Folder;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 16,
//     backgroundColor: "#fff",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     marginBottom: 12,
//     padding: 8,
//     borderRadius: 4,
//   },
//   imagePreview: {
//     width: 100,
//     height: 100,
//     marginBottom: 12,
//     borderRadius: 8,
//   },
// });

// import React, { useState } from "react";
// import {
//   View,
//   TextInput,
//   Button,
//   Alert,
//   Image,
//   StyleSheet,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import {
//   createFolder,
//   uploadImage,
//   checkFolderExist,
//   getCurrentUser,
// } from "../../lib/appwrite";
// import { useRouter } from "expo-router";

// const Folder = () => {
//   const [folderName, setFolderName] = useState("");
//   const [subtitle, setSubtitle] = useState("");
//   const [folderImage, setFolderImage] = useState([]);
//   const router = useRouter();

//   const pickFolderImage = async () => {
//     try {
//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ["images"],
//         quality: 1,
//         allowsMultipleSelection: true, // Allow multiple images to be selected
//       });

//       if (!result.canceled && result.assets.length > 0) {
//         // Set the folderImage state to an array of URIs for all selected images
//         setFolderImage(result.assets.map((asset) => asset.uri));
//       }
//     } catch (error) {
//       Alert.alert("Error picking image", error.message);
//     }
//   };

//   const handleCreateFolder = async () => {
//     if (!folderName || !subtitle) {
//       Alert.alert("Validation Error", "Please fill all the fields.");
//       return;
//     }

//     try {
//       const folderExists = await checkFolderExist(folderName);
//       if (folderExists) {
//         Alert.alert(
//           "Duplicate Folder",
//           "Folder already exists. Please choose a different name."
//         );
//         return;
//       }

//       const currentUser = await getCurrentUser();
//       const createdBy = currentUser?.username || "Unknown User";

//       let imageUrls = [];
//       if (folderImage.length > 0) {
//         imageUrls = await uploadImage(folderImage); // Upload all images if multiple are selected
//       }

//       const newFolder = await createFolder(
//         folderName,
//         subtitle,
//         createdBy,
//         imageUrls
//       );

//       Alert.alert(
//         "Success",
//         `Folder created successfully with ID: ${newFolder.folderId}`
//       );
//       setFolderName("");
//       setSubtitle("");
//       setFolderImage([]);
//       router.push("/home");
//     } catch (error) {
//       console.error("Error:", error);
//       Alert.alert("Error", error.message || "Something went wrong.");
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         placeholder="Folder Name"
//         value={folderName}
//         onChangeText={setFolderName}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Subtitle"
//         value={subtitle}
//         onChangeText={setSubtitle}
//         style={styles.input}
//       />
//       <Button title="Pick Folder Image" onPress={pickFolderImage} />
//       {folderImage && folderImage.length > 0 && (
//         <View style={styles.imagePreviewContainer}>
//           {folderImage.map((uri, index) => (
//             <Image key={index} source={{ uri }} style={styles.imagePreview} />
//           ))}
//         </View>
//       )}
//       <Button title="Create Folder" onPress={handleCreateFolder} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     padding: 16,
//     backgroundColor: "#fff",
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     marginBottom: 12,
//     padding: 8,
//     borderRadius: 4,
//   },
//   imagePreviewContainer: {
//     flexDirection: "row", // Arrange images in a row
//     flexWrap: "wrap", // Wrap images if there are many
//     marginBottom: 12,
//   },
//   imagePreview: {
//     width: 100,
//     height: 100,
//     marginRight: 10,
//     marginBottom: 10,
//     borderRadius: 8,
//   },
// });

// export default Folder;

// import React, { useState } from "react";
// import { View, TextInput, Button, Image, Alert } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import {
//   createFolderNew,
//   uploadImagesNew,
//   getCurrentUser,
//   checkFolderExist,
// } from "../../lib/appwrite";

// const CreateFolder = () => {
//   const [name, setName] = useState("");
//   const [subtitle, setSubtitle] = useState("");
//   const [selectedImages, setSelectedImages] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const pickImages = async () => {
//     try {
//       const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

//       if (permissionResult.granted === false) {
//         Alert.alert(
//           "Permission Required",
//           "Permission to access camera roll is required!"
//         );
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsMultipleSelection: true,
//         quality: 1,
//       });

//       if (!result.canceled) {
//         setSelectedImages(result.assets);
//       }
//     } catch (error) {
//       Alert.alert("Error", "Failed to pick images");
//       console.error("Error picking images:", error);
//     }
//   };

//   const handleCreate = async () => {
//     if (!name || !subtitle) {
//       Alert.alert("Validation Error", "Please fill all the fields.");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // Check if folder exists
//       const folderExists = await checkFolderExist(name);
//       if (folderExists) {
//         Alert.alert(
//           "Duplicate Folder",
//           "Folder already exists. Please choose a different name."
//         );
//         setIsLoading(false);
//         return;
//       }

//       // Create the folder
//       const folder = await createFolderNew(name, subtitle);
//       console.log("Folder created:", folder);

//       // Upload images if any are selected
//       if (selectedImages.length > 0) {
//         try {
//           // Convert image assets to the format expected by uploadImagesNew
//           const imageFiles = selectedImages.map((image) => ({
//             uri: image.uri,
//             type: "image/jpeg",
//             name: "image.jpg",
//           }));

//           await uploadImagesNew(folder.$id, imageFiles);
//         } catch (uploadError) {
//           console.error("Error uploading images:", uploadError);
//           Alert.alert(
//             "Partial Success",
//             "Folder created but failed to upload some images."
//           );
//         }
//       }

//       // Reset form
//       setName("");
//       setSubtitle("");
//       setSelectedImages([]);

//       Alert.alert("Success", "Folder created successfully!");
//     } catch (error) {
//       console.error("Error in handleCreate:", error);
//       Alert.alert(
//         "Error",
//         error.message || "Failed to create folder. Please try again."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         placeholder="Folder Name"
//         value={name}
//         onChangeText={setName}
//         style={styles.input}
//       />
//       <TextInput
//         placeholder="Subtitle"
//         value={subtitle}
//         onChangeText={setSubtitle}
//         style={styles.input}
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

//       <Button
//         title={isLoading ? "Creating..." : "Create Folder"}
//         onPress={handleCreate}
//         disabled={isLoading || !name || !subtitle}
//       />
//     </View>
//   );
// };

// const styles = {
//   container: {
//     marginTop: 50,
//     padding: 20,
//   },
//   input: {
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     padding: 10,
//   },
//   imageGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginTop: 10,
//     marginBottom: 10,
//   },
//   thumbnail: {
//     width: 100,
//     height: 100,
//     margin: 5,
//     borderRadius: 5,
//   },
// };

// export default CreateFolder;

// import React, { useState } from "react";
// import {
//   View,
//   TextInput,
//   Button,
//   Image,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import {
//   createFolderNew,
//   uploadImagesNew,
//   getCurrentUser,
//   checkFolderExist,
//   createFolders,
//   uploads,
// } from "../../lib/appwrite";
// import { router, Redirect, Link } from "expo-router";

// const CreateFolder = () => {
//   const [name, setName] = useState("");
//   const [subtitle, setSubtitle] = useState("");
//   const [selectedImages, setSelectedImages] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const pickImages = async () => {
//     try {
//       const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

//       if (permissionResult.granted === false) {
//         Alert.alert(
//           "Permission Required",
//           "Permission to access camera roll is required!"
//         );
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ["images"],
//         allowsMultipleSelection: true,
//         quality: 1,
//       });

//       if (!result.canceled) {
//         setSelectedImages(result.assets);
//       }
//     } catch (error) {
//       Alert.alert("Error", "Failed to pick images");
//       console.error("Error picking images:", error);
//     }
//   };

//   const handleCreate = async () => {
//     if (!name || !subtitle) {
//       Alert.alert("Validation Error", "Please fill all the fields.");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // Check if folder exists
//       // const folderExists = await checkFolderExist(name);
//       // if (folderExists) {
//       //   Alert.alert(
//       //     "Duplicate Folder",
//       //     "Folder already exists. Please choose a different name."
//       //   );
//       //   setIsLoading(false);
//       //   return;
//       // }

//       // Create the folder - createFolderNew now handles folderId generation
//       const folder = await createFolders(name, subtitle);
//       console.log("Folder created:", folder);

//       // Upload images if any are selected
//       if (selectedImages.length > 0) {
//         try {
//           const imageFiles = selectedImages.map((image) => ({
//             uri: image.uri,
//             type: "image/jpeg",
//             name: `image-${Date.now()}.jpg`, // Add timestamp to ensure unique names
//           }));

//           await uploads(folder.$id, imageFiles);
//         } catch (uploadError) {
//           console.error("Error uploading images:", uploadError);
//           Alert.alert(
//             "Partial Success",
//             "Folder created but failed to upload some images."
//           );
//         }
//       }

//       // Reset form
//       setName("");
//       setSubtitle("");
//       setSelectedImages([]);

//       Alert.alert("Success", "Folder created successfully!", [
//         {
//           text: "OK",
//           onPress: () => router.push("/home"), // Navigate back after successful creation
//         },
//       ]);
//     } catch (error) {
//       console.error("Error in handleCreate:", error);
//       Alert.alert(
//         "Error",
//         error.message || "Failed to create folder. Please try again."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <TextInput
//         placeholder="Folder Name"
//         value={name}
//         onChangeText={setName}
//         style={styles.input}
//         editable={!isLoading}
//       />
//       <TextInput
//         placeholder="Subtitle"
//         value={subtitle}
//         onChangeText={setSubtitle}
//         style={styles.input}
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
//         <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
//       ) : (
//         <Button
//           title="Create Folder"
//           onPress={handleCreate}
//           disabled={!name || !subtitle}
//         />
//       )}
//     </View>
//   );
// };

// const styles = {
//   container: {
//     marginTop: 50,
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#fff",
//   },
//   input: {
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     padding: 10,
//   },
//   imageGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginVertical: 10,
//   },
//   thumbnail: {
//     width: 95,
//     height: 100,
//     margin: 5,
//     borderRadius: 5,
//   },
//   loader: {
//     marginVertical: 20,
//   },
// };

// export default CreateFolder;

// import React, { useState } from "react";
// import {
//   View,
//   TextInput,
//   Button,
//   Image,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import * as ImagePicker from "expo-image-picker";
// import * as FileSystem from "expo-file-system";
// import { createFolders, uploads } from "../../lib/appwrite";
// import { useRouter, router } from "expo-router"; // Updated to use the latest hooks for routing

// const CreateFolder = () => {
//   const [name, setName] = useState("");
//   const [subtitle, setSubtitle] = useState("");
//   const [selectedImages, setSelectedImages] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const prepareImageFile = async (imageUri) => {
//     try {
//       // Get file info
//       const fileInfo = await FileSystem.getInfoAsync(imageUri);

//       // Read the file as base64
//       const base64 = await FileSystem.readAsStringAsync(imageUri, {
//         encoding: FileSystem.EncodingType.Base64,
//       });

//       return {
//         uri: imageUri,
//         type: "image/jpeg",
//         name: `image-${Date.now()}.jpg`,
//         size: fileInfo.size,
//         base64: base64,
//       };
//     } catch (error) {
//       console.error("Error preparing image:", error);
//       throw error;
//     }
//   };

//   const handleCreate = async () => {
//     if (!name || !subtitle) {
//       Alert.alert("Validation Error", "Please fill all the fields.");
//       return;
//     }

//     setIsLoading(true);

//     try {
//       // Create the folder
//       const folder = await createFolders(name, subtitle);

//       if (!folder || !folder.$id) {
//         throw new Error("Failed to create folder properly");
//       }

//       console.log("Folder created:", folder);

//       // Upload images if any are selected
//       if (selectedImages.length > 0) {
//         try {
//           // Prepare image files with proper format
//           const imageFiles = await Promise.all(
//             selectedImages.map(async (image) => {
//               return await prepareImageFile(image.uri);
//             })
//           );

//           // Upload the prepared images
//           await uploads(folder.$id, imageFiles);
//           console.log("Images uploaded successfully");
//         } catch (uploadError) {
//           console.error("Error uploading images:", uploadError);
//           Alert.alert(
//             "Partial Success",
//             "Folder created but failed to upload some images."
//           );
//         }
//       }

//       // Reset form
//       setName("");
//       setSubtitle("");
//       setSelectedImages([]);

//       Alert.alert("Success", "Folder created successfully!", [
//         {
//           text: "OK",
//           onPress: () => router.push("/home"),
//         },
//       ]);
//     } catch (error) {
//       console.error("Error in handleCreate:", error);
//       Alert.alert(
//         "Error",
//         error.message || "Failed to create folder. Please try again."
//       );
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const pickImages = async () => {
//     try {
//       const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

//       if (permissionResult.granted === false) {
//         Alert.alert(
//           "Permission Required",
//           "Permission to access camera roll is required!"
//         );
//         return;
//       }

//       const result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaType.Images,
//         allowsMultipleSelection: true,
//         quality: 1,
//         base64: true,
//       });

//       if (!result.canceled) {
//         setSelectedImages(result.assets);
//       }
//     } catch (error) {
//       Alert.alert("Error", "Failed to pick images");
//       console.error("Error picking images:", error);
//     }
//   };

//   // ... rest of the component remains the same ...
//   return (
//     <View style={styles.container}>
//       <TextInput
//         placeholder="Folder Name"
//         value={name}
//         onChangeText={setName}
//         style={styles.input}
//         editable={!isLoading}
//       />
//       <TextInput
//         placeholder="Subtitle"
//         value={subtitle}
//         onChangeText={setSubtitle}
//         style={styles.input}
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
//         <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
//       ) : (
//         <Button
//           title="Create Folder"
//           onPress={handleCreate}
//           disabled={!name || !subtitle}
//         />
//       )}
//     </View>
//   );
// };

// export default CreateFolder;
// const styles = {
//   container: {
//     marginTop: 50,
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#fff",
//   },
//   input: {
//     marginBottom: 10,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     padding: 10,
//   },
//   imageGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginVertical: 10,
//   },
//   thumbnail: {
//     width: 95,
//     height: 100,
//     margin: 5,
//     borderRadius: 5,
//   },
//   loader: {
//     marginVertical: 20,
//   },
// };

// components/CreateFolder.js
import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Image,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { createFolders, uploadss, MainUpload } from "../../lib/appwrite";
import { useRouter, router } from "expo-router";

const CreateFolder = () => {
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // const pickImages = async () => {
  //   try {
  //     const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

  //     if (!permissionResult.granted) {
  //       Alert.alert(
  //         "Permission Required",
  //         "Please grant camera roll access to continue"
  //       );
  //       return;
  //     }

  //     const result = await ImagePicker.launchImageLibraryAsync({
  //       mediaTypes: ["images"],
  //       allowsMultipleSelection: true,
  //       quality: 1,
  //     });

  //     if (!result.canceled && result.assets) {
  //       setSelectedImages(result.assets);
  //     }
  //   } catch (error) {
  //     console.error("Error picking images:", error);
  //     Alert.alert("Error", "Failed to pick images");
  //   }
  // };

  // const handleCreate = async () => {
  //   if (!name.trim() || !subtitle.trim()) {
  //     Alert.alert("Required Fields", "Please fill in all fields");
  //     return;
  //   }

  //   setIsLoading(true);

  //   try {
  //     // Create folder
  //     const folder = await createFolders(name, subtitle);
  //     console.log("Folder created:", folder);

  //     // Upload images if selected
  //     if (selectedImages.length > 0) {
  //       try {
  //         const imageFiles = selectedImages.map((image) => ({
  //           uri: image.uri,
  //           name: `image-${Date.now()}.jpg`,
  //           type: "image/jpeg",
  //         }));

  //         await uploadss(folder.$id, imageFiles);
  //         console.log("Images uploaded successfully");
  //       } catch (uploadError) {
  //         console.error("Upload error:", uploadError);
  //         Alert.alert(
  //           "Partial Success",
  //           "Folder created but some images failed to upload"
  //         );
  //       }
  //     }

  //     // Reset form
  //     setName("");
  //     setSubtitle("");
  //     setSelectedImages([]);

  //     Alert.alert("Success", "Folder created successfully!", [
  //       {
  //         text: "OK",
  //         onPress: () => router.push("/home"),
  //       },
  //     ]);
  //   } catch (error) {
  //     console.error("Create folder error:", error);
  //     Alert.alert("Error", "Failed to create folder. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const pickImages = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert(
          "Permission Required",
          "Please grant camera roll access to continue"
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsMultipleSelection: true,
        quality: 1,
      });

      if (!result.canceled && result.assets) {
        setSelectedImages(result.assets);
      }
    } catch (error) {
      console.error("Error picking images:", error);
      Alert.alert("Error", "Failed to pick images");
    }
  };

  const handleCreate = async () => {
    if (!name.trim() || !subtitle.trim()) {
      Alert.alert("Required Fields", "Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      // Create a new folder
      const folder = await createFolders(name, subtitle);
      console.log("Folder created:", folder);

      // Check if there are selected images
      if (selectedImages.length > 0) {
        const imageFiles = selectedImages.map((image) => ({
          uri: image.uri,
          name: `image-${Date.now()}.jpg`,
          type: "image/jpeg",
        }));

        // Upload images to the created folder
        await MainUpload(folder.$id, imageFiles);
        console.log("Images uploaded successfully");
      }

      // Reset form fields
      setName("");
      setSubtitle("");
      setSelectedImages([]);

      Alert.alert("Success", "Folder created successfully!", [
        {
          text: "OK",
          onPress: () => router.push("/home"), // Navigate to the home screen
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
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Folder Name"
        value={name}
        onChangeText={setName}
        editable={!isLoading}
      />

      <TextInput
        style={styles.input}
        placeholder="Subtitle"
        value={subtitle}
        onChangeText={setSubtitle}
        editable={!isLoading}
      />

      <Button title="Pick Images" onPress={pickImages} disabled={isLoading} />

      <View style={styles.imageGrid}>
        {selectedImages.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image.uri }}
            style={styles.thumbnail}
          />
        ))}
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button
          title="Create Folder"
          onPress={handleCreate}
          disabled={!name.trim() || !subtitle.trim()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
  },
  thumbnail: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 5,
  },
});

export default CreateFolder;
