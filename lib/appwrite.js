import {
  Account,
  Avatars,
  client,
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
  foldersCollectionId: "6737c192002a29b4b5b2",
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

client.setEndpoint(endpoint).setProject(projectId).setPlatform(platform);

const account = new Account(client);
const storage = new Storage(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

// **User Authentication**
export const createUser = async (email, password, username) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );
    if (!newAccount) throw new Error("Failed to create account");

    const avatarsUrl = avatars.getInitials(username);

    await signIn(email, password);

    const newUser = await databases.createDocument(
      databaseId,
      usersCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
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
    const session = await account.createEmailSession(email, password);
    return session;
  } catch (error) {
    throw new Error(error.message || "Error signing in");
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
      databaseId,
      usersCollectionId,
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

// **Folder Management**
export const createFolder = async (name, subtitle, backgroundImageUrl) => {
  try {
    const newFolder = await databases.createDocument(
      databaseId,
      foldersCollectionId,
      ID.unique(),
      {
        name,
        subtitle,
        backgroundImage: backgroundImageUrl,
      }
    );
    return newFolder;
  } catch (error) {
    throw new Error(error.message || "Error creating folder");
  }
};

export const fetchFolders = async () => {
  try {
    const response = await databases.listDocuments(
      databaseId,
      foldersCollectionId
    );
    return response.documents;
  } catch (error) {
    throw new Error(error.message || "Error fetching folders");
  }
};

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
