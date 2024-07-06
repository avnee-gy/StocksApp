import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Link } from "expo-router";
import { colors } from "../utils/data";

const App = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.dark,
      }}
    >
      <Text style={{ fontSize: 30, fontWeight: "800", color: colors.light }}>
        Welcome User!
      </Text>
      <Link
        href={{
          pathname: "/home",
        }}
        style={{
          backgroundColor: colors.blue,
          paddingHorizontal: 30,
          paddingVertical: 10,
          marginVertical: 20,
          borderRadius: 20,
        }}
      >
        <TouchableOpacity>
          <Text
            style={{ color: colors.light, fontWeight: "500", fontSize: 24 }}
          >
            Let's Go
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default App;
