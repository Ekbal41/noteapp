import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet } from "react-native";

import { Text, View } from "../components/Themed";

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.version}>Build Version: 0.0.1</Text>
      <Text style={styles.name}>Developed By : Asif Ekbal</Text>
      <Text style={styles.info}>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f3f3f3",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  info: {
    fontSize: 16,
    lineHeight: 24,
  },
  name: {
    lineHeight: 24,
    marginBottom: 20,
    fontSize: 16,

  },
  version: {
    lineHeight: 24,
    fontSize: 16,

  },
});
