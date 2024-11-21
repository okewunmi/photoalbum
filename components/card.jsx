import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  Touchable,
  View,
  Modal,
  Alert,
  TouchableOpacity,
} from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import * as Linking from "expo-linking";
import * as Clipboard from "expo-clipboard";
const Card = ({ post }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleShareLink = async (platform) => {
    const link = "https://yourlink.com"; // replace with your actual link
    const message = encodeURIComponent("Check this out: " + link);

    try {
      switch (platform) {
        case "whatsapp":
          await Linking.openURL(`whatsapp://send?text=${message}`);
          break;
        case "telegram":
          await Linking.openURL(`tg://msg?text=${message}`);
          break;
        case "x":
          await Linking.openURL(`https://x.com/intent/tweet?text=${message}`);
          break;
        case "linkedin":
          await Linking.openURL(
            `https://www.linkedin.com/sharing/share-offsite/?url=${link}`
          );
          break;
        case "gmail":
          await Linking.openURL(
            `mailto:?subject=Check this out&body=${message}`
          );
          break;
        case "slack":
          await Linking.openURL(
            `slack://open?team=your_team_id&channel=your_channel_id`
          );
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

  const { name, subtitle, createdAt, id } = post;

  function formatCreatedAt(createdAt) {
    const now = new Date();
    const createdAtDate = new Date(createdAt);
    const diffInSeconds = Math.floor((now - createdAtDate) / 1000);

    const units = [
      { label: "year", seconds: 60 * 60 * 24 * 365 },
      { label: "month", seconds: 60 * 60 * 24 * 30 },
      { label: "week", seconds: 60 * 60 * 24 * 7 },
      { label: "day", seconds: 60 * 60 * 24 },
      { label: "hour", seconds: 60 * 60 },
      { label: "minute", seconds: 60 },
    ];

    for (const unit of units) {
      const count = Math.floor(diffInSeconds / unit.seconds);
      if (count > 0) {
        return `${count} ${unit.label}${count > 1 ? "s" : ""} ago`;
      }
    }

    return "just now";
  }

  return (
    <>
      <View style={styles.card}>
        <View style={styles.head}>
          <View style={styles.image}>
            {/* <LinearGradient
              colors={["#c17388", "#90306f"]}
              style={{ flex: 1 }}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            /> */}
            {/* <View style={styles.bg}></View> */}
            <View>
              <Text style={styles.txt1}>{name || "Fabrics Collections"}</Text>
              <Text style={styles.txt2}>{subtitle || "Classic Materials"}</Text>
            </View>
          </View>
        </View>
        <View style={styles.body}></View>
        <View style={styles.bottom}>
          <Text style={styles.txt3}>
            {formatCreatedAt(createdAt) || "30 mins"}
          </Text>
          <View style={styles.shared}>
            <FontAwesome name="image" size={20} color="#575353" />
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
            <Text style={styles.modalTitle}>Share </Text>

            <View style={styles.modalGrid}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleShareLink("whatsapp")}
              >
                <FontAwesome5 name="whatsapp-square" size={24} color="black" />
                <Text style={styles.modalButtonText}> WhatsApp</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleShareLink("linkedin")}
              >
                <FontAwesome5 name="linkedin" size={24} color="black" />
                <Text style={styles.modalButtonText}> linkedin</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleShareLink("gmail")}
              >
                <MaterialCommunityIcons name="gmail" size={24} color="black" />
                <Text style={styles.modalButtonText}> gmail</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleShareLink("telegram")}
              >
                <FontAwesome5 name="telegram" size={24} color="black" />
                <Text style={styles.modalButtonText}>Telegram</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleShareLink("x")}
              >
                <FontAwesome5 name="twitter-square" size={24} color="black" />
                <Text style={styles.modalButtonText}> X</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={copyLinkToClipboard}
              >
                <Entypo name="clipboard" size={24} color="black" />
                <Text style={styles.modalButtonText}>Copy Link</Text>
              </TouchableOpacity>
            </View>

            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={styles.closeModal}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Card;

const styles = StyleSheet.create({
  card: {
    width: 310,
    height: 300,
    backgroundColor: "#FCFCFC",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 15,

    // Shadow for iOS
    shadowColor: "#000", // Shadow color
    shadowOffset: {
      width: 0,
      height: 5,
    },

    // Position of shadow
    shadowOpacity: 0.15,
    // Opacity of shadow

    shadowRadius: 5,
    // Blur radius of shadow

    // Shadow for Android
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
    fontSize: 13,
    fontWeight: "900",
    fontFamily: "Inter",
    color: "#000",
  },
  txt2: {
    fontSize: 12,
    marginTop: 0,
    fontFamily: "Inter",
    color: "#575353",
    // fontWeight: "light",
  },
  txt3: {
    color: "#575353",
    fontSize: 12,
    fontWeight: "900",
    fontFamily: "Inter",
  },
  bg: {
    borderRadius: 100,
    // backgroundColor: "#575353",
    height: 45,
    width: 45,
    borderWidth: 4,
    borderColor: "#FA9884",
    borderStyle: "solid",
  },
  folderButton: {
    flexDirection: "row",
    gap: 20,
  },
  shared: {
    flexDirection: "row",
    display: "flex",
    gap: 5,
    alignItems: "center",
  },
  body: {
    width: "100%",
    height: "70%",
    borderRadius: 10,
    backgroundColor: "#4531b9",
  },
  bottom: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    bottom: 0,
    // left: 0,
    position: "absolute",
    width: "99%",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 20,
    borderRadius: 30,
    backgroundColor: "#FFF",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 1,
    // Optional, to add spacing between items if supported
  },

  modalButton: {
    width: "25%",
    // Adjust as needed for two buttons per row
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: "center",
  },

  modalButtonText: {
    color: "#000",
    fontSize: 10,
    textAlign: "center",
  },
  closeModal: {
    textAlign: "center",
    // color: "#FA9884",
    color: "#fff",
    backgroundColor: "#575353",
    marginTop: 15,
    width: "80%",
    alignSelf: "center",
    fontSize: 15,
    paddingVertical: 10,
    borderRadius: 20,
  },
});
