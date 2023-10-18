import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable, useColorScheme } from "react-native";

import Colors from "../../constants/Colors";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome
              name="home"
              size={24}
              color={color}
              style={{
                marginTop: 11,
              }}
            />
          ),
          title: "",
          headerTitle: "All Notes",
          headerTitleAlign: "left",
          headerRight: () => (
            <Link href="/info" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={24}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "",
          headerTitle: "Add New",
          tabBarIcon: ({ color }) => (
            <FontAwesome
              name="plus-circle"
              size={24}
              color={color}
              style={{
                marginTop: 11,
              }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "",
          headerTitle: "Settings",
          tabBarIcon: ({ color }) => (
            <FontAwesome
              name="gear"
              size={24}
              color={color}
              style={{
                marginTop: 11,
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
