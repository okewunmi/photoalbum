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
    await account.deleteSession("current");
    // "current" refers to the currently active session

    console.log("Logged out successfully");
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

export const createFolder = async (name, subtitle, createdBy) => {
  try {
    const folderId = ID.unique(); // Generate the unique ID
    const newFolder = await databases.createDocument(
      config.databaseId,
      config.foldersCollectionId,
      folderId, // Use this as the document ID
      {
        name,
        subtitle,
        createdBy,
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
      databaseId,
      foldersCollectionId,
      [Query.equal("name", folderName)] // Query by folder name
    );
    return response.total > 0; // Returns true if folder exists
  } catch (error) {
    throw new Error(error.message || "Error checking folder existence");
  }
};

// export const fetchFolders = async () => {
//   try {
//     const response = await databases.listDocuments(
//       config.databaseId,
//       config.foldersCollectionId
//     );
//     return response.documents;
//   } catch (error) {
//     throw new Error(error.message || "Error fetching folders");
//   }
// };

// **Image Management**

export const uploadImage = async (file, folderId) => {
  try {
    const uploadedFile = await storage.createFile(storageId, ID.unique(), file);
    const fileUrl = storage.getFileView(storageId, uploadedFile.$id);

    const newImage = await databases.createDocument(
      databaseId,
      imagesCollectionId,
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
      databaseId,
      imagesCollectionId,
      [Query.equal("folderId", folderId)]
    );
    return response.documents;
  } catch (error) {
    throw new Error(error.message || "Error fetching images in folder");
  }
};
