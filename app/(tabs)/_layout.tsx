import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { Link } from "expo-router";
import Colors from "../../constants/Colors";
import { useColorScheme } from "react-native";

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
            <FontAwesome name="home" size={24} color={color} />
          ),
          title: "",
          headerTitle: "All Notes",
          headerTitleAlign: "left",
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "",
          headerTitle: "Add/Edit Note",
          tabBarIcon: ({ color }) => (
            <Link href="/add">
              <FontAwesome name="plus-circle" size={24} color={color} />
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="note"
        options={{
          title: "",
          headerTitle: "Showing Note",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="eye" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
