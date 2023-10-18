import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, Button } from "react-native";
import { Text, View } from "../../components/Themed";
import * as SQLite from "expo-sqlite";
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function TabTwoScreen() {
  const db = SQLite.openDatabase("notes.db");
  const [noteBody, setNoteBody] = useState("");
  const router = useRouter();
  const getDateTime = () => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    return new Date().toLocaleDateString(undefined, options);
  };
  const currentDateTime = getDateTime();
  const handleAddNote = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "insert into notes (title, body) values (?, ?);",
        [currentDateTime, noteBody],
        () => {
          router.back();
        },
        (_txOb, error) => {
          alert(error);
          return true;
        }
      );
    });
    setNoteBody("");
  };

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists notes (id integer primary key not null, title text, body text);"
      );
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{currentDateTime}</Text>
        <TouchableOpacity onPress={handleAddNote}>
          <FontAwesome name="save" size={24} color="#2f95dc" />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.textarea}
        placeholder="Enter note body..."
        multiline={true}
        value={noteBody}
        onChangeText={(text) => setNoteBody(text)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  label: {
    fontSize: 20,
    marginBottom: 8,
    fontWeight: "bold",
  },

  textarea: {
    borderColor: "#f3f3f3",
    borderWidth: 1,
    marginBottom: 10,
    paddingTop: 10,
    fontSize: 16,
    textAlignVertical: "top",
    borderRadius: 5,
    height: "90%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#f3f3f3",
  },
});
