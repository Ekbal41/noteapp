import React, { useEffect, useState } from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import * as SQLite from "expo-sqlite";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

export default function TabTwoScreen() {
  const db = SQLite.openDatabase("notes.db");
  const params = useLocalSearchParams();
  const [noteBody, setNoteBody] = useState("");
  const [title, setTitle] = useState("");
  const router = useRouter();
  const navigation = useNavigation();

  const handleSaveNote = () => {
    if (!title) {
      alert("Please enter a title.");
      return;
    }
    if (!noteBody) {
      alert("Please enter body.");
      return;
    }

    db.transaction((tx) => {
      if (params.noteId) {
        tx.executeSql(
          "update notes set title = ?, body = ? where id = ?;",
          [title, noteBody, params.noteId as string],
          () => {
            router.setParams({ noteId: "", noteTitle: "", noteBody: "" });
            router.replace("/");
          },
          (_txOb, error) => {
            alert(error);
            return true;
          }
        );
      } else {
        // Insert new note
        tx.executeSql(
          "insert into notes (title, body) values (?, ?);",
          [title, noteBody],
          () => {
            router.replace("/");
          },
          (_txOb, error) => {
            alert(error);
            return true;
          }
        );
      }
    });
    setNoteBody("");
    setTitle("");
  };

  useEffect(() => {
    if (params.noteId && params.noteTitle && params.noteBody) {
      setTitle(params.noteTitle as string);
      setNoteBody(params.noteBody as string);
    }
  }, [params]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "create table if not exists notes (id integer primary key not null, title text, body text);"
      );
    });
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: params.noteId ? "Edit Note" : "Add Note",
      headerRight: () => (
        <TouchableOpacity
          onPress={handleSaveNote}
          style={{
            marginRight: 20,
          }}
        >
          <FontAwesome name="save" size={24} color="#2f95dc" />
        </TouchableOpacity>
      ),
    });
  }, [title, noteBody, params.noteId, navigation]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.title}
        placeholder="Enter title...."
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.textarea}
        placeholder="Enter note body..."
        multiline={true}
        value={noteBody}
        onChangeText={setNoteBody}
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
  title: {
    borderColor: "#f3f3f3",
    borderWidth: 1,
    marginBottom: 10,
    paddingTop: 10,
    fontSize: 16,
    textAlignVertical: "top",
    borderRadius: 5,
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
});
