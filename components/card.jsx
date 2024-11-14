// import React from "react";
// import {
//   Pressable,
//   StyleSheet,
//   Text,
//   Touchable,
//   View,
//   Modal,
// } from "react-native";
// import FontAwesome from "@expo/vector-icons/FontAwesome";

// import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";

// const Card = () => {
//   return (
//     <Pressable>
//       <View style={styles.card}>
//         <View style={styles.head}>
//           <View style={styles.image}>
//             <View style={styles.bg}></View>
//             <View>
//               <Text style={styles.txt1}>Fabrics Collections</Text>
//               <Text style={styles.txt2}>Classic Materials</Text>
//             </View>
//           </View>
//           <Pressable>
//             <SimpleLineIcons name="options" size={20} color="#575353" />
//           </Pressable>
//         </View>
//         <View style={styles.body}></View>
//         <View style={styles.bottom}>
//           <Text style={styles.txt3}>30 mins ago</Text>
//           <View style={styles.shared}>
//             <FontAwesome name="send" size={20} color="#575353" />
//             <Text style={styles.txt3}>3</Text>
//           </View>
//         </View>
//       </View>
//     </Pressable>
//   );
// };

// export default Card;

// const styles = StyleSheet.create({
//   card: {
//     width: 310,
//     height: 450,
//     backgroundColor: "#FCFCFC",
//     borderRadius: 20,
//     paddingVertical: 25,
//     paddingHorizontal: 20,
//     display: "flex",
//     justifyContent: "space-between",
//     marginBottom: 15,

//     // Shadow for iOS
//     shadowColor: "#000", // Shadow color
//     shadowOffset: {
//       width: 0,
//       height: 5,
//     },

//     // Position of shadow
//     shadowOpacity: 0.15,
//     // Opacity of shadow

//     shadowRadius: 5,
//     // Blur radius of shadow

//     // Shadow for Android
//     elevation: 8,
//   },
//   head: {
//     display: "flex",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   image: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: 10,
//   },
//   txt1: {
//     fontSize: 14,
//     fontWeight: "900",
//     fontFamily: "Inter",
//     color: "#000",
//   },
//   txt2: {
//     fontSize: 12,
//     marginTop: -1,
//     fontFamily: "Inter",
//     color: "#575353",
//     // fontWeight: "light",
//   },
//   txt3: {
//     color: "#575353",
//     fontSize: 14,
//     fontWeight: "900",
//     fontFamily: "Inter",
//   },
//   bg: {
//     borderRadius: 100,
//     // backgroundColor: "#575353",
//     height: 55,
//     width: 55,
//     borderWidth: 4,
//     borderColor: "#FA9884",
//     borderStyle: "solid",
//   },
//   shared: {
//     flexDirection: "row",
//     display: "flex",
//     gap: 10,
//     alignItems: "center",
//   },
//   body: {
//     width: "100%",
//     height: "70%",
//     borderRadius: 20,
//     backgroundColor: "#4531b9",
//   },
//   bottom: {
//     display: "flex",
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     paddingHorizontal: 5,
//   },
// });
import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import * as Linking from "expo-linking";
import * as Clipboard from "expo-clipboard";

const Card = () => {
  const [modalVisible, setModalVisible] = useState(false);

  // Function to handle sharing links to social media
  const handleShareLink = async (platform) => {
    const link = "https://yourlink.com"; // replace with your actual link

    try {
      switch (platform) {
        case "whatsapp":
          await Linking.openURL(`whatsapp://send?text=${link}`);
          break;
        case "telegram":
          await Linking.openURL(`tg://msg?text=${link}`);
          break;
        case "x":
          await Linking.openURL(`https://x.com/intent/tweet?text=${link}`);
          break;
        default:
          Alert.alert("Platform not supported");
      }
    } catch (error) {
      Alert.alert("Error", "Unable to open the link.");
    }
  };

  // Function to copy the link to clipboard
  const copyLinkToClipboard = async () => {
    await Clipboard.setStringAsync("https://yourlink.com");
    Alert.alert("Link copied to clipboard!");
  };

  return (
    <Pressable>
      <View style={styles.card}>
        <View style={styles.head}>
          <View style={styles.image}>
            <View style={styles.bg}></View>
            <View>
              <Text style={styles.txt1}>Fabrics Collections</Text>
              <Text style={styles.txt2}>Classic Materials</Text>
            </View>
          </View>
          <Pressable onPress={() => setModalVisible(true)}>
            <SimpleLineIcons name="options" size={20} color="#575353" />
          </Pressable>
        </View>
        <View style={styles.body}></View>
        <View style={styles.bottom}>
          <Text style={styles.txt3}>30 mins ago</Text>
          <View style={styles.shared}>
            <FontAwesome name="send" size={20} color="#575353" />
            <Text style={styles.txt3}>3</Text>
          </View>
        </View>
      </View>

      {/* Modal for sharing options */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Share or Copy Link</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleShareLink("whatsapp")}
            >
              <Text style={styles.modalButtonText}>Share on WhatsApp</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleShareLink("telegram")}
            >
              <Text style={styles.modalButtonText}>Share on Telegram</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleShareLink("x")}
            >
              <Text style={styles.modalButtonText}>Share on X</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={copyLinkToClipboard}
            >
              <Text style={styles.modalButtonText}>Copy Link</Text>
            </TouchableOpacity>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={styles.closeModal}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Pressable>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    width: 310,
    height: 450,
    backgroundColor: "#FCFCFC",
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 20,
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 8,
  },
  head: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  image: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  txt1: {
    fontSize: 14,
    fontWeight: "900",
    fontFamily: "Inter",
    color: "#000",
  },
  txt2: {
    fontSize: 12,
    marginTop: -1,
    fontFamily: "Inter",
    color: "#575353",
  },
  txt3: {
    color: "#575353",
    fontSize: 14,
    fontWeight: "900",
    fontFamily: "Inter",
  },
  bg: {
    borderRadius: 100,
    height: 55,
    width: 55,
    borderWidth: 4,
    borderColor: "#FA9884",
  },
  shared: {
    flexDirection: "row",
    display: "flex",
    gap: 10,
    alignItems: "center",
  },
  body: {
    width: "100%",
    height: "70%",
    borderRadius: 20,
    backgroundColor: "#4531b9",
  },
  bottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 250,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#FFF",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "#FA9884",
    marginVertical: 5,
  },
  modalButtonText: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
  },
  closeModal: {
    textAlign: "center",
    color: "#FA9884",
    marginTop: 15,
    fontSize: 16,
  },
});
