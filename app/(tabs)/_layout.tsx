import React from "react";
import { Tabs } from "expo-router";
import Feather from "@expo/vector-icons/Ionicons";
import Foundation from "@expo/vector-icons/Foundation";
import Fontisto from "@expo/vector-icons/Fontisto";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StatusBar } from "expo-status-bar";

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
            paddingTop: 8,
            height: 60,
            borderRadius: 20,
            marginBottom: 17,
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
              <Foundation
                name={"home"}
                size={focused ? 30 : 25}
                color={focused ? "#FA9884" : "#9E9898"}
              />
            ),
          }}
        />
        {/* <Tabs.Screen
          name="search"
          options={{
            headerShown: false,
            title: "Home",
            tabBarIcon: ({ focused }) => (
              <Fontisto
                name={"search"}
                size={focused ? 30 : 25}
                color={focused ? "#FA9884" : "#9E9898"}
              />
            ),
          }}
        /> */}

        <Tabs.Screen
          name="folder"
          options={{
            title: "folder",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <MaterialIcons
                name={"add-box"}
                size={focused ? 35 : 30}
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
                size={focused ? 30 : 25}
                color={focused ? "#FA9884" : "#9E9898"}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="notify"
          options={{
            // tabBarBadge: 1,
            headerShown: false,
            title: "Notify",
            tabBarIcon: ({ focused }) => (
              <Feather
                name={"notifications"}
                size={focused ? 30 : 25}
                color={focused ? "#FA9884" : "#9E9898"}
              />
            ),
          }}
        />
      </Tabs>
      <StatusBar backgroundColor="#f2f2f2" style="dark" />
    </>
  );
};

export default TabLayout;
