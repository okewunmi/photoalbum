import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
  Storage,
} from "react-native-appwrite";

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

export const getCurrentUser = async () => {
  try {
    const currentAccount = await getAccount();
    if (!currentAccount) throw new Error("No current account found");

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.usersCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser || currentUser.total === 0) {
      throw new Error("No user found in database");
    }

    return currentUser.documents[0];
  } catch (error) {
    console.log(error.message || "Error fetching current user");
    return null;
  }
};

// Function to check if folder already exists

// export const createFolder = async (name, subtitle, createdBy) => {
//   try {
//     const folderId = ID.unique(); // Generate the unique ID
//     const newFolder = await databases.createDocument(
//       config.databaseId,
//       config.foldersCollectionId,
//       folderId, // Use this as the document ID
//       {
//         name,
//         subtitle,
//         createdBy,
//         createdAt: new Date().toISOString(),
//         folderId, // Add the folderId to the document data
//       }
//     );

//     return newFolder;
//   } catch (error) {
//     throw new Error(error.message || "Error creating folder");
//   }
// };
export const createFolder = async (name, subtitle) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not authenticated");

    const folderId = ID.unique(); // Generate the unique ID
    const newFolder = await databases.createDocument(
      config.databaseId,
      config.foldersCollectionId,
      folderId, // Use this as the document ID
      {
        name,
        subtitle,
        createdBy: currentUser.accountId, // Store the accountId of the user who created the folder
        createdAt: new Date().toISOString(),
        folderId, // Add the folderId to the document data
      }
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

    const response = await databases.listDocuments(
      config.databaseId,
      config.foldersCollectionId,
      [Query.equal("createdBy", currentUser.accountId)] // Filter folders by createdBy (user's account ID)
    );

    return response.documents;
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

// **Image Management**
export const addOrUpdateImageInFolder = async (folderId, file, uploadedBy) => {
  try {
    // Upload the file to Appwrite storage
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      file
    );
    const fileUrl = storage.getFileView(config.storageId, uploadedFile.$id);

    // Check if a document with this folderId and fileId already exists
    const existingImage = await databases.listDocuments(
      config.databaseId,
      config.imagesCollectionId,
      [
        Query.equal("folderId", folderId),
        Query.equal("fileId", uploadedFile.$id),
      ]
    );

    let updatedImage;

    if (existingImage.total > 0) {
      // Update the existing document
      const documentId = existingImage.documents[0].$id; // Get the existing document ID
      updatedImage = await databases.updateDocument(
        config.databaseId,
        config.imagesCollectionId,
        documentId,
        {
          folderId,
          fileId: uploadedFile.$id,
          fileUrl,
          uploadedBy,
          createdAt: Math.floor(Date.now() / 1000), // Current timestamp in seconds
        }
      );
    } else {
      // Create a new document if it doesn't exist
      updatedImage = await databases.createDocument(
        config.databaseId,
        config.imagesCollectionId,
        ID.unique(),
        {
          folderId,
          fileId: uploadedFile.$id,
          fileUrl,
          uploadedBy,
          createdAt: Math.floor(Date.now() / 1000), // Current timestamp in seconds
        }
      );
    }

    return updatedImage;
  } catch (error) {
    throw new Error(
      error.message || "Error adding or updating image in folder"
    );
  }
};

export const uploadImage = async (file, folderId) => {
  try {
    const uploadedFile = await storage.createFile(storageId, ID.unique(), file);
    const fileUrl = storage.getFileView(storageId, uploadedFile.$id);

    const newImage = await databases.createDocument(
      config.databaseId,
      config.imagesCollectionId,
      ID.unique(),
      {
        folderId,
        fileId: uploadedFile.$id,
        fileUrl,
      }
    );

    return newImage;
  } catch (error) {
    throw new Error(error.message || "Error uploading image");
  }
};

export const fetchImagesInFolder = async (folderId) => {
  try {
    const response = await databases.listDocuments(
      config.databaseId,
      config.imagesCollectionId,
      [Query.equal("folderId", folderId)]
    );
    return response.documents;
  } catch (error) {
    throw new Error(error.message || "Error fetching images in folder");
  }
};
