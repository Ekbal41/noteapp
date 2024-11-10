import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import * as SQLite from "expo-sqlite";
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useRouter } from "expo-router";
interface Note {
  id: number;
  title: string;
  body: string;
}
export default function HomeScreen() {
  const db = SQLite.openDatabase("notes.db");
  const [notes, setNotes] = useState<Note[]>([]);
  const isFocused = useIsFocused();
  const router = useRouter();

  const fetchNotes = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from notes ORDER BY id DESC;",
        [],
        (txOb, result) => setNotes(result.rows._array)
      );
    });
  };
  const handleDeleteNote = (id: number) => {
    db.transaction((tx) => {
      tx.executeSql(
        "delete from notes where id = ?;",
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
  };

  useEffect(() => {
    fetchNotes();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {notes.map((note) => (
          <TouchableOpacity
            key={note.id}
            style={styles.noteCard}
            activeOpacity={1}
          >
            <View style={styles.noteHeader}>
              <View style={styles.noteHeaderFirst}>
                <FontAwesome name="sticky-note" size={24} color="#2980b9" />
                <Text style={styles.noteTitle}>{note.title}</Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                }}
              >
                {/* // add params */}
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: "/add",
                      params: {
                        noteId: note.id,
                        noteTitle: note.title,
                        noteBody: note.body,
                      },
                    })
                  }
                >
                  <FontAwesome name="pencil-square" size={24} color="#2980b9" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDeleteNote(note.id)}>
                  <FontAwesome name="trash" size={28} color="#e74c3c" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.noteContainer}>
              <Text style={styles.noteContent}>
                {note.body.length > 100
                  ? note.body.slice(0, 100) + "..."
                  : note.body}
              </Text>
            </View>
          </TouchableOpacity>
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
  },
  noteHeaderFirst: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
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
});
