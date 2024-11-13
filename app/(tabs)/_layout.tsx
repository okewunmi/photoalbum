import React from "react";
import { Tabs } from "expo-router";
import Feather from "@expo/vector-icons/Ionicons";
const TabLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#FA9884",
          tabBarInactiveTintColor: "#9E9898",
          tabBarStyle: {
            backgroundColor: "#423D3D",
            paddingTop: 4,
            height: 50,
            borderRadius: 20,
            marginBottom: 15,
            width: "92%",
            alignSelf: "center",
            justifyContent: "center",
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            headerShown: false,
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <Feather
                name={"home"}
                size={focused ? 25 : 20}
                color={focused ? "#FA9884" : "#9E9898"}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            headerShown: false,
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <Feather
                name={"search"}
                size={focused ? 25 : 20}
                color={focused ? "#FA9884" : "#9E9898"}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="folder"
          options={{
            title: "Folder",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <Feather
                name={"folder"}
                size={focused ? 25 : 20}
                color={focused ? "#FA9884" : "#9E9898"}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,
            title: "Profile",
            tabBarIcon: ({ focused }) => (
              <Feather
                name={"person"}
                size={focused ? 25 : 20}
                color={focused ? "#FA9884" : "#9E9898"}
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default TabLayout;
