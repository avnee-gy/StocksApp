// ThemeSwitch.js

import React from "react";
import { View, Switch, Text, StyleSheet } from "react-native";
import { useTheme, darkTheme } from "../utils/themes";

const ThemeSwitch = () => {
  const { colors, toggleTheme } = useTheme();
  const isDarkMode = colors === darkTheme;

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { color: colors.light }]}>Dark Mode</Text>
      <Switch
        value={isDarkMode}
        onValueChange={toggleTheme}
        thumbColor={isDarkMode ? colors.blue : "#f4f3f4"}
        trackColor={{ false: "#767577", true: colors.blue }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  text: {
    marginRight: 10,
  },
});

export default ThemeSwitch;
