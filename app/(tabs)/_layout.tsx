import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable, useColorScheme } from "react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs>
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
    </Tabs>
  );
}
