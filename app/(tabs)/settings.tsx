import React, { useState } from "react";
import {
  StyleSheet,
  Switch,
  View,
  Text,
} from "react-native";

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Save To Phone</Text>
        <Switch value={true} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 19,
    color: "#333",
    fontWeight: "bold",
  },
});
