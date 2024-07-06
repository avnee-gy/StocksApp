import React, { useState } from "react";
import {
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from "react-native";
import { Link } from "expo-router";
import { colors } from "../utils/data";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${query}&apikey=2LS8EDYELUBUAHQA`
        );
        const data = await response.json();
        console.log(data);
        setSuggestions(data.bestMatches.slice(0, 3));
      } catch (error) {
        console.error("Error fetching search suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = (item) => {
    setSearchQuery(item["2. name"]);
    setSuggestions([]);
    setSearchHistory((prevHistory) => {
      const newHistory = [...prevHistory];
      // Remove item if it already exists in the history
      const existingIndex = newHistory.findIndex(
        (historyItem) => historyItem["1. symbol"] === item["1. symbol"]
      );
      if (existingIndex > -1) {
        newHistory.splice(existingIndex, 1);
      }
      // Add the selected item to the beginning of the history
      return [item, ...newHistory];
    });
  };

  return (
    <View style={styles.header}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search"
        value={searchQuery}
        placeholderTextColor={colors.light}
        onChangeText={handleSearch}
      />
      <FlatList
        data={suggestions.length > 0 ? suggestions : searchHistory.slice(0, 3)}
        keyExtractor={(item) => item["1. symbol"]}
        renderItem={({ item }) => (
          <Link href={{ pathname: "/[id]", params: { id: item["1. symbol"] } }}>
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => handleSelectSuggestion(item)}
            >
              <Text style={styles.suggestionText}>
                {item["2. name"]} ({item["1. symbol"]})
              </Text>
            </TouchableOpacity>
          </Link>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    width: "100%",
    borderWidth: 1,
    borderColor: colors.blue,
    padding: 20,
    borderRadius: 25,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: colors.blue,
    borderRadius: 5,
  },
  suggestionText: {
    fontSize: 16,
    color: colors.light,
  },
});

export default SearchBar;
