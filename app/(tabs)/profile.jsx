// import React from "react";
// import { Text, View } from "react-native";
// const profile = () => {
//   return (
//     <View>
//       <Text>home</Text>
//     </View>
//   );
// };

// export default profile;

import React from "react";
import { View, Button, Alert } from "react-native";
import { logout } from "../../lib/appwrite"; // Adjust the path to where your logout function is

const LogoutButton = () => {
  const handleLogout = async () => {
    try {
      await logout();
      Alert.alert("Logged out", "You have been logged out successfully.");
      // Optionally, you can navigate the user to the login screen after logout:
      // navigation.navigate('Login'); // If you're using React Navigation
    } catch (error) {
      Alert.alert(
        "Logout Error",
        error.message || "An error occurred while logging out."
      );
    }
  };

  return (
    <View style={{ height: "100%", backgroundColor: "red" }}>
      <Button
        title="Logout"
        onPress={handleLogout}
        color="#000"
        style={{ height: 30, with: 40 }}
      />
    </View>
  );
};

export default LogoutButton;
