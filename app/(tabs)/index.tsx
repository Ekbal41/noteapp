import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import * as SQLite from "expo-sqlite";
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import * as localForage from "localforage"; // For web storage (alternative to SQLite)
import { useRouter } from "expo-router";

interface Note {
  id: number;
  title: string;
  body: string;
}

export default function Index() {
  const isWeb = typeof window !== "undefined";
  const db = isWeb ? null : SQLite.openDatabase("allnotes.db");
  const [notes, setNotes] = useState<Note[]>([]);
  const isFocused = useIsFocused();
  const router = useRouter();

  // Fetch notes - platform-specific logic
  const fetchNotes = () => {
    if (isWeb) {
      // Fetch notes from localForage on web
      localForage.getItem("allnotes").then((storedNotes: unknown) => {
        const notesArray = storedNotes as Note[] | null;
        setNotes(notesArray || []);
      });
    } else {
      // Fetch notes from SQLite on mobile
      db?.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM notes ORDER BY id DESC;",
          [],
          (txOb, result) => setNotes(result.rows._array)
        );
      });
    }
  };

  // Handle delete - platform-specific logic
  const handleDeleteNote = (id: number) => {
    if (isWeb) {
      // On web, we remove the note from the array and update localForage
      const updatedNotes = notes.filter((note) => note.id !== id);
      setNotes(updatedNotes);
      localForage.setItem("allnotes", updatedNotes);
    } else {
      // On mobile, use SQLite to delete the note
      db?.transaction((tx) => {
        tx.executeSql(
          "DELETE FROM notes WHERE id = ?;",
          [id],
          () => {
            fetchNotes();
          },
          (_txOb, error) => {
            console.error(error);
            return true;
          }
        );
      });
    }
  };

  // Fetch notes when screen is focused
  useEffect(() => {
    fetchNotes();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {notes.map((note) => (
          <View key={note.id} style={styles.noteCard}>
            <View style={styles.noteHeader}>
              <View style={styles.noteHeaderFirst}>
                <Text style={styles.noteTitle}>{note.title}</Text>
              </View>
              <View style={styles.noteHeaderActions}>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/note",
                      params: { id: note.id },
                    })
                  }
                  style={styles.showButton}
                >
                  <FontAwesome name="eye" size={24} color="#2ecc71" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/add",
                      params: { id: note.id },
                    })
                  }
                  style={styles.editButton}
                >
                  <FontAwesome name="pencil-square" size={24} color="#3498db" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteNote(note.id)}
                  style={styles.deleteButton}
                >
                  <FontAwesome name="trash" size={24} color="#e74c3c" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.noteContainer}>
              <Text style={styles.noteContent}>{note.body?.slice(0, 100)}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ecf0f1",
  },
  scrollContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  noteCard: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    flexDirection: "column",
    alignItems: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },

  noteHeader: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  noteHeaderFirst: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  noteHeaderActions: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },

  noteContainer: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  noteContent: {
    paddingTop: 5,
    fontSize: 16,
    color: "#7f8c8d",
    fontFamily: "sans-serif",
  },
  deleteButton: {
    padding: 5,
  },
  editButton: {
    padding: 5,
  },
  showButton: {
    padding: 5,
  },
});
