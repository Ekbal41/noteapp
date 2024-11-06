import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

let db: any;
let storage: any;

if (Platform.OS !== "web") {
  const SQLite = require("expo-sqlite");
  db = SQLite.openDatabase("allnotes.db");
} else {
  storage = require("localforage");
}

interface Note {
  id: number;
  title: string;
  body: string;
}

export default function AddScreen() {
  const [noteTitle, setNoteTitle] = useState<string>("");
  const [noteBody, setNoteBody] = useState<string>("");
  const router = useRouter();
  const currentDateTime = new Date().toLocaleString();
  const { id } = useLocalSearchParams();
  const isFocused = useIsFocused();

  useEffect(() => {
    if (!id) {
      setNoteBody("");
      setNoteTitle("");
    }
  }, [id, isFocused]);

  // If in Edit mode, fetch the note
  useEffect(() => {
    if (id) {
      if (Platform.OS !== "web") {
        db?.transaction((tx: any) => {
          tx.executeSql(
            "select * from notes where id = ?;",
            [id],
            (_tx: any, results: any) => {
              const rows = results.rows;
              if (rows.length > 0) {
                const note = rows.item(0);
                setNoteTitle(note.title);
                setNoteBody(note.body);
              }
            },
            (_txOb: any, error: any) => {
              alert(error);
              return true;
            }
          );
        });
      } else {
        storage.getItem("allnotes").then((notes: Note[]) => {
          const noteToEdit = notes.find(
            (note) => note.id === parseInt(id as string)
          );
          if (noteToEdit) {
            setNoteTitle(noteToEdit.title);
            setNoteBody(noteToEdit.body);
          }
        });
      }
    }
  }, [id, isFocused]);

  // Handle saving new or updating existing note
  const handleSaveNote = async () => {
    if (Platform.OS !== "web") {
      if (db) {
        if (id) {
          // Update existing note
          db.transaction((tx: any) => {
            tx.executeSql(
              "update notes set title = ?, body = ? where id = ?;",
              [noteTitle, noteBody, id],
              () => {
                router.push("/"); // Navigate to home or notes list
              },
              (_txOb: any, error: any) => {
                alert(error);
                return true;
              }
            );
          });
        } else {
          // Add new note
          db.transaction((tx: any) => {
            tx.executeSql(
              "insert into notes (title, body) values (?, ?);",
              [currentDateTime, noteBody],
              () => {
                router.push("/"); // Navigate to home or notes list
              },
              (_txOb: any, error: any) => {
                alert(error);
                return true;
              }
            );
          });
        }
      }
    } else {
      try {
        const notes: Note[] = (await storage.getItem("allnotes")) || [];
        if (id) {
          // Update existing note
          const updatedNotes = notes.map((note) =>
            note.id === parseInt(id as string)
              ? { ...note, title: noteTitle, body: noteBody }
              : note
          );
          await storage.setItem("allnotes", updatedNotes);
        } else {
          // Add new note
          const newNoteId = notes.length + 1;
          const newNote: Note = {
            id: newNoteId,
            title: noteTitle || currentDateTime,
            body: noteBody,
          };
          notes.push(newNote);
          await storage.setItem("allnotes", notes);
        }
        setNoteBody("");
        setNoteTitle(""); // Clear title and body after saving
        router.push("/"); // Navigate to home or notes list
      } catch (error) {
        console.error("Error saving note:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{id ? `Edit Note` : `New Note`}</Text>
        <TouchableOpacity onPress={handleSaveNote} style={styles.saveButton}>
          <FontAwesome name="save" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.inputTitle}
        placeholder="Enter note title..."
        value={noteTitle}
        onChangeText={(text) => setNoteTitle(text)}
      />
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
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 22,
    fontWeight: "600",
    color: "#333",
  },
  saveButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  inputTitle: {
    height: 50,
    fontSize: 18,
    marginBottom: 20,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    backgroundColor: "#fff",
    textTransform: "capitalize",
  },
  textarea: {
    height: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#fff",
    textAlignVertical: "top",
    marginBottom: 20,
  },
});
