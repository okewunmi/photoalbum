import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
  Permission,
  Role,
} from "react-native-appwrite";
import * as FileSystem from "expo-file-system";
import { Platform } from "react-native";
export const config = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.photoSharingApp.mobile",
  projectId: "6737ba8a002277b3ec6e",
  databaseId: "6737c11f002541073abe",
  usersCollectionId: "6737c158002ac374fd11",
  foldersCollectionId: "673bed5600264ab0614e",
  imagesCollectionId: "6737c1ca00134e9e7e2f",
  storageId: "6737cd2b0005232c7e9b",
};

const {
  endpoint,
  platform,
  projectId,
  databaseId,
  usersCollectionId,
  foldersCollectionId,
  imagesCollectionId,
  storageId,
} = config;

const client = new Client();

client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// **User Authentication**
export const createUser = async (username, email, password) => {
  try {
    const newAccount = await account.create(
      ID.unique(), // Unique user ID
      email, // Email address
      password, // Password
      username // Optional name
    );
    if (!newAccount) throw new Error("Failed to create account");

    const avatarsUrl = avatars.getInitials(username); // Optional avatar

    await signIn(email, password); // Log in user automatically

    const newUser = await databases.createDocument(
      config.databaseId,
      config.usersCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        username: username,
        email: email,
        avatar: avatarsUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(error.message || "Error creating user");
  }
};

export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error.message || "Error signing in");
  }
};

// **Logout Function**
export const logout = async () => {
  try {
    const session = await account.deleteSession("current");
    console.log("Logged out successfully");
    return session;
  } catch (error) {
    throw new Error(error.message || "Error logging out");
  }
};
export const getAccount = async () => {
  try {
    const currentAccount = await account.get();
    return currentAccount;
  } catch (error) {
    throw new Error(error.message || "Error fetching account");
  }
};

// export const getCurrentUser = async () => {
//   try {
//     const currentAccount = await getAccount();
//     if (!currentAccount) throw new Error("No current account found");

//     const currentUser = await databases.listDocuments(
//       config.databaseId,
//       config.usersCollectionId,
//       [Query.equal("accountId", currentAccount.$id)]
//     );

//     if (!currentUser || currentUser.total === 0) {
//       throw new Error("No user found in database");
//     }

//     return currentUser.documents[0];
//   } catch (error) {
//     console.log(error.message || "Error fetching current user");
//     return null;
//   }
// };

export const upload = async (folderId, imageFiles) => {
  try {
    const uploadedUrls = [];

    // Upload each image to Storage
    for (const imageFile of imageFiles) {
      // Convert URI to Blob for React Native
      let blob;
      if (Platform.OS !== "web") {
        const response = await fetch(imageFile.uri);
        blob = await response.blob();
      } else {
        blob = imageFile;
      }

      // Create file in Storage
      try {
        const file = await storage.createFile(
          config.storageId,
          ID.unique(),
          blob,
          // Add proper file information
          imageFile.name || `image-${Date.now()}.jpg`
        );

        if (!file || !file.$id) {
          console.error("File upload failed:", file);
          continue; // Skip this file and continue with others
        }

        // Get the file view URL
        const fileUrl = storage.getFileView(config.storageId, file.$id).href; // Get the actual URL string

        uploadedUrls.push(fileUrl);
      } catch (uploadError) {
        console.error("Error uploading single file:", uploadError);
        continue; // Skip failed upload and continue with others
      }
    }

    if (uploadedUrls.length === 0) {
      throw new Error("No images were successfully uploaded");
    }

    // Fetch the current folder document
    const folder = await databases.getDocument(
      config.databaseId,
      config.foldersCollectionId,
      folderId
    );

    // Ensure folder.images is an array
    const currentImages = Array.isArray(folder.images) ? folder.images : [];

    // Update the folder document with new image URLs
    await databases.updateDocument(
      config.databaseId,
      config.foldersCollectionId,
      folderId,
      {
        images: [...currentImages, ...uploadedUrls],
      }
    );

    return uploadedUrls;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
};

// Create a new folder
export const createFolders = async (name, subtitle) => {
  try {
    const currentUser = await getCurrentUser(); // Assuming you have this function

    const response = await databases.createDocument(
      config.databaseId,
      config.foldersCollectionId,
      ID.unique(), // Generate a unique ID for the folder
      {
        name: name,
        subtitle: subtitle,
        folderId: ID.unique(), // Add the required folderId field
        createdAt: new Date().toISOString(),
        createdBy: currentUser?.$id || "anonymous",
        images: [], // Initialize empty images array
        user: currentUser?.$id, // Add user relationship
      }
    );
    return response;
  } catch (error) {
    console.error("Error creating folder:", error);
    throw error;
  }
};

// Upload multiple images to a folder

export const uploadImagesNew = async (folderId, imageFiles) => {
  try {
    const uploadedUrls = [];

    // Upload each image to Storage
    for (const imageFile of imageFiles) {
      const file = await storage.createFile(
        config.storageId,
        ID.unique(),
        imageFile
      );

      // Get the file view URL
      const fileUrl = storage.getFileView(config.storageId, file.$id);
      uploadedUrls.push(fileUrl);
    }

    // Update the folder document with new image URLs
    const folder = await databases.getDocument(
      config.databaseId,
      config.foldersCollectionId,
      folderId
    );

    const updatedImages = [...folder.images, ...uploadedUrls];

    await databases.updateDocument(
      config.databaseId,
      config.foldersCollectionId,
      folderId,
      {
        images: updatedImages,
      }
    );

    return uploadedUrls;
  } catch (error) {
    console.error("Error uploading images:", error);
    throw error;
  }
};

// Helper function to get current user
export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw new Error("No current account found");

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.usersCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser || currentUser.total === 0) {
      throw new Error("No user found in database");
    }

    // Return the first user document
    return {
      ...currentUser.documents[0],
      $id: currentUser.documents[0].accountId, // Ensure $id is available
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    throw new Error("Failed to get current user");
  }
};

export const createFolder = async (name, subtitle, images = []) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not authenticated");

    const permissions = [
      Permission.read(Role.user(currentUser.accountId)), // Read permissions
      Permission.write(Role.user(currentUser.accountId)), // Write permissions
    ];

    // Create folder document
    const newFolder = await databases.createDocument(
      ID.unique(), // Unique folder ID
      config.databaseId,
      config.foldersCollectionId,
      folderId,
      {
        name, // Folder name
        subtitle, // Folder subtitle
        createdAt: new Date().toISOString(), // Timestamp
        createdBy: currentUser.accountId, // User ID
        folderId: newFolder.$id, // Folder ID
        user: currentUser.accountId, // Relationship to the user
        images, // Array of image URLs
      },
      permissions
    );

    return newFolder;
  } catch (error) {
    throw new Error(error.message || "Error creating folder");
  }
};

export const checkFolderExist = async (folderName) => {
  try {
    const response = await databases.listDocuments(
      config.databaseId,
      config.foldersCollectionId,
      [Query.equal("name", folderName)] // Query by folder name
    );
    return response.total > 0; // Returns true if folder exists
  } catch (error) {
    throw new Error(error.message || "Error checking folder existence");
  }
};

// Fetch folders that are created by the current user
export const fetchFolders = async () => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not authenticated");

    // Fetch folders created by the current user
    const response = await databases.listDocuments(
      config.databaseId,
      config.foldersCollectionId,
      [
        Query.equal("createdBy", currentUser.accountId), // Filter by the createdBy field (user's account ID)
      ]
    );

    // Assuming each folder has the structure like: { name, subtitle, createdAt, createdBy, user, images }
    const folders = response.documents.map((folder) => ({
      id: folder.$id, // Folder document ID
      name: folder.name,
      subtitle: folder.subtitle,
      createdAt: folder.createdAt,
      createdBy: folder.createdBy,
      user: folder.user, // Relationship with user (the user ID that owns the folder)
      images: folder.images || [], // Images will be an array of URLs or an empty array
    }));

    return folders;
  } catch (error) {
    throw new Error(error.message || "Error fetching folders");
  }
};

//folderDetail
export const fetchFolderDetails = async (folderId) => {
  try {
    const response = await databases.getDocument(
      config.databaseId,
      config.foldersCollectionId,
      folderId
    );
    return response;
  } catch (error) {
    throw new Error(error.message || "Error fetching folder details");
  }
};

// Fetch images for a specific folder
export const fetchImagesInFolder = async (folderId) => {
  try {
    const images = await databases.listDocuments(
      config.databaseId,
      config.imagesCollectionId,
      [Query.equal("folderId", folderId)] // Fetch images for the given folderId
    );

    return images.documents;
  } catch (error) {
    console.error("Error fetching images in folder:", error.message);
    throw new Error("Unable to fetch images for this folder");
  }
};

export const createFolderss = async (name, subtitle) => {
  try {
    const data = {
      name,
      subtitle,
      folderId: ID.unique(),
      createdAt: new Date().toISOString(),
      createdBy: "user-id", // Replace with actual user ID if you have authentication
      images: [],
    };

    const response = await databases.createDocument(
      config.databaseId,
      config.foldersCollectionId,
      ID.unique(),
      data
    );

    return response;
  } catch (error) {
    console.error("Error creating folder:", error);
    throw error;
  }
};

export const uploadss = async (folderId, imageFiles) => {
  try {
    const uploadedUrls = [];

    for (const imageFile of imageFiles) {
      try {
        // Convert URI to Blob
        const response = await fetch(imageFile.uri);
        const blob = await response.blob();

        // Upload file to storage
        const file = await storage.createFile(
          config.storageId,
          ID.unique(),
          blob
        );

        if (file && file.$id) {
          // Get file URL
          const fileUrl = storage.getFileView(config.storageId, file.$id);

          uploadedUrls.push(fileUrl.href);
        }
      } catch (uploadError) {
        console.error("Error uploading single file:", uploadError);
        continue;
      }
    }

    // Update folder with new images
    if (uploadedUrls.length > 0) {
      const folder = await databases.getDocument(
        config.databaseId,
        config.foldersCollectionId,
        folderId
      );

      const currentImages = Array.isArray(folder.images) ? folder.images : [];

      await databases.updateDocument(
        config.databaseId,
        config.foldersCollectionId,
        folderId,
        {
          images: [...currentImages, ...uploadedUrls],
        }
      );
    }

    return uploadedUrls;
  } catch (error) {
    console.error("Error in uploads:", error);
    throw error;
  }
};

// Upload images to Appwrite Storage
const uploadImages = async (imageFiles) => {
  const uploadImage = async (imageFile) => {
    try {
      let blob;
      if (Platform.OS !== "web") {
        const response = await fetch(imageFile.uri);
        blob = await response.blob();
      } else {
        blob = imageFile;
      }

      const file = await storage.createFile(
        config.storageId,
        ID.unique(),
        blob
      );

      const fileUrl = storage.getFileView(config.storageId, file.$id).href;
      return fileUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  // Use Promise.all to upload all images concurrently
  const uploadedUrls = await Promise.all(
    imageFiles.map((imageFile) => uploadImage(imageFile))
  );
  return uploadedUrls;
};

// Add images to folder and update database
const addImagesToFolder = async (folderId, uploadedUrls) => {
  try {
    const folder = await databases.getDocument(
      config.databaseId,
      config.foldersCollectionId,
      folderId
    );

    const currentImages = Array.isArray(folder.images) ? folder.images : [];

    await databases.updateDocument(
      config.databaseId,
      config.foldersCollectionId,
      folderId,
      {
        images: [...currentImages, ...uploadedUrls],
      }
    );
  } catch (error) {
    console.error("Error updating folder with images:", error);
    throw error;
  }
};

// Main upload function
export const MainUpload = async (folderId, imageFiles) => {
  try {
    const uploadedUrls = await uploadImages(imageFiles);
    await addImagesToFolder(folderId, uploadedUrls);
    return uploadedUrls;
  } catch (error) {
    console.error("Error during upload process:", error);
    throw error;
  }
};

// Create a new folder
// export const createFolders = async (name, subtitle) => {
//   try {
//     const currentUser = await getCurrentUser(); // Ensure this function returns the current user
//     const folderData = {
//       name,
//       subtitle,
//       folderId: ID.unique(),
//       createdAt: new Date().toISOString(),
//       createdBy: currentUser?.$id || "anonymous",
//       images: [],
//       user: currentUser?.$id,
//     };

//     const response = await databases.createDocument(
//       config.databaseId,
//       config.foldersCollectionId,
//       ID.unique(),
//       folderData
//     );

//     return response;
//   } catch (error) {
//     console.error("Error creating folder:", error);
//     throw error;
//   }
// };

export const uploadMultipleImages = async (folderId, images) => {
  try {
    const uploadPromises = images.map(async (image) => {
      const response = await fetch(image.uri);
      const blob = await response.blob();
      const file = await storage.createFile(
        config.storageId, // Replace with your bucket ID
        ID.unique(),
        blob
      );
      return storage.getFileView(config.storageId, file.$id).href; // Get the URL
    });

    const uploadedFiles = await Promise.all(uploadPromises);
    console.log("Uploaded Files:", uploadedFiles);

    // Add URLs to the folder
    const folder = await databases.getDocument(
      config.databaseId,
      config.foldersCollectionId,
      folderId
    );

    const updatedImages = Array.isArray(folder.images)
      ? [...folder.images, ...uploadedFiles]
      : uploadedFiles;

    await databases.updateDocument(
      config.databaseId,
      config.foldersCollectionId,
      folderId,
      { images: updatedImages }
    );

    return uploadedFiles;
  } catch (error) {
    console.error("Error uploading files:", error);
    throw error;
  }
};
