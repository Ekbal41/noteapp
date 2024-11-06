import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import * as SQLite from "expo-sqlite";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useIsFocused } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";

// LocalForage import for web
let storage: any;
if (Platform.OS === "web") {
  storage = require("localforage");
}

interface Note {
  title: string;
  body: string;
  id: number;
}

export default function NoteScreen() {
  const [note, setNote] = useState<Note | null>(null);
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const isFocused = useIsFocused();
  useEffect(() => {
    const fetchNote = async () => {
      // Case 1: Fetch note by id if it exists in params
      if (id) {
        // On mobile, fetch from SQLite database
        if (Platform.OS !== "web") {
          const db = SQLite.openDatabase("allnotes.db");
          db.transaction((tx: any) => {
            tx.executeSql(
              "SELECT * FROM notes WHERE id = ?",
              [id],
              (_: any, result: any) => {
                if (result.rows.length > 0) {
                  setNote(result.rows._array[0]);
                } else {
                  setNote(null);
                }
              },
              (_: any, error: any) => {
                console.error("SQLite error:", error);
                return false;
              }
            );
          });
        } else {
          // On web, fetch from localForage
          const notes: Note[] = (await storage.getItem("allnotes")) || [];
          const selectedNote = notes.find(
            (note) => note.id === parseInt(id as string)
          );
          if (selectedNote) {
            setNote(selectedNote);
          } else {
            setNote(null);
          }
        }
      } else {
        // Case 2: If no id, fetch the last edited note
        if (Platform.OS !== "web") {
          const db = SQLite.openDatabase("allnotes.db");
          db.transaction((tx: any) => {
            tx.executeSql(
              "SELECT * FROM notes ORDER BY id DESC LIMIT 1;",
              [],
              (_: any, result: any) => {
                if (result.rows.length > 0) {
                  setNote(result.rows._array[0]);
                } else {
                  setNote(null);
                }
              },
              (_: any, error: any) => {
                console.error("SQLite error:", error);
                return false;
              }
            );
          });
        } else {
          // On web, fetch the last note from localForage
          const notes: Note[] = (await storage.getItem("allnotes")) || [];
          if (notes.length > 0) {
            setNote(notes[notes.length - 1]);
          } else {
            setNote(null);
          }
        }
      }
    };
    fetchNote();
  }, [id, isFocused]);

  if (!note) {
    return (
      <View style={styles.container}>
        <Text style={styles.noNotesText}>No note found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{note.title}</Text>
      <Text style={styles.body}>{note.body}</Text>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/")}
      >
        <Text style={styles.backButtonText}>
          <FontAwesome
            name="home"
            size={24}
            color="white"
            style={{
              marginRight: 5,
            }}
          />
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textTransform: "capitalize",
  },
  body: {
    fontSize: 16,
    color: "#555",
  },
  noNotesText: {
    fontSize: 16,
    color: "#888",
    textTransform: "capitalize",
  },
  backButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#2f95dc",
    borderRadius: 5,
  },
  backButtonText: {
    textAlign: "center",
  },
});
