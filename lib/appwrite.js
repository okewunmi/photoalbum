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

const uploadFileToAppwrite = async (uri) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return blob;
};

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
export const createFolder = async (name, subtitle) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not authenticated");

    const folderId = ID.unique(); // Generate the unique ID
    const permissions = [
      Permission.read(Role.user(currentUser.accountId)),
      Permission.write(Role.user(currentUser.accountId)),
    ];
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

// ** Add Photo to Folder and Create Image Document **
export const addPhoto = async (folderId, fileUri) => {
  try {
    // Fetch the current user
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not authenticated");

    // Convert file URI to Blob for Appwrite
    const fileBlob = await uploadFileToAppwrite(fileUri);
    if (!fileBlob) throw new Error("Failed to create file blob");

    // Define file permissions (view/edit access for the user)
    const permissions = [
      Permission.read(Role.user(currentUser.accountId)),
      Permission.write(Role.user(currentUser.accountId)),
    ];

    // Upload file to Appwrite Storage
    const uploadedFile = await storage.createFile(
      config.storageId,
      ID.unique(),
      fileBlob,
      permissions
    );

    console.log("File uploaded successfully:", uploadedFile);

    // Generate the file's viewable URL
    const fileUrl = storage.getFileView(config.storageId, uploadedFile.$id);

    // Create a document for the image in the Images Collection
    const newImage = await databases.createDocument(
      config.databaseId,
      config.imagesCollectionId,
      ID.unique(), // Unique ID for the image
      {
        folderId, // Link to the folder
        fileId: uploadedFile.$id, // ID of the uploaded file
        fileUrl, // URL to view the image
        uploadedBy: currentUser.accountId, // User who uploaded
        createdAt: Math.floor(Date.now() / 1000), // Timestamp
      },
      permissions
    );

    console.log("Image successfully associated with folder:", newImage);
    return newImage;
  } catch (error) {
    console.error("Error uploading image to folder:", error.message);
    throw new Error("Unable to upload image to folder");
  }
};
