import React from "react";
import { Tabs } from "expo-router";
import Feather from "@expo/vector-icons/Ionicons";
const TabLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 80,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <Feather
                name={"home"}
                size={focused ? 35 : 25}
                color={focused ? "#f89a2e" : "#CDCDE0"}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="folder"
          options={{
            title: "Folder",
            tabBarIcon: ({ focused }) => (
              <Feather
                name={"folder"}
                size={focused ? 35 : 25}
                color={focused ? "#f89a2e" : "#CDCDE0"}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ focused }) => (
              <Feather
                name={"person"}
                size={focused ? 35 : 25}
                color={focused ? "#f89a2e" : "#CDCDE0"}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabLayout;
