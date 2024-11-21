import { useLocalSearchParams } from "expo-router";
import { fetchFolderDetails } from "../../lib/appwrite";
import { StyleSheet, View, Text } from "react-native";

const FolderDetails = () => {
  const { folderId } = useLocalSearchParams();
  const [folder, setFolder] = useState(null);

  // useEffect(() => {
  //   const fetchDetails = async () => {
  //     try {
  //       const details = await fetchFolderDetails(folderId);
  //       setFolder(details);
  //     } catch (error) {
  //       console.error("Error fetching folder details:", error.message);
  //     }
  //   };

  //   if (folderId) fetchDetails();
  // }, [folderId]);

  // if (!folder) {
  //   return <Text>Loading folder details...</Text>;
  // }

  return (
    <View style={styles.box}>
      <Text style={styles.title}>Details of folder {folderId}</Text>
    </View>
  );
};

export default FolderDetails;

const styles = StyleSheet({
  box: {
    flex: 1,
  },
});
