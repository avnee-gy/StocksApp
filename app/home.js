import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import axios from "axios";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import StockCard from "../components/stockCard";
import { top_gainers_losers, colors } from "../utils/data";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeData, getData } from "../utils/cache"; // Import utility functions
import { Feather } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemeSwitch from "../components/themeSwitch";

const API_URL = "https://www.alphavantage.co/query";
const API_KEY = "2LS8EDYELUBUAHQA";

const StockList = ({ type }) => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const cacheKey = `stocks_${type}`;
      const cachedData = await getData(cacheKey);

      if (cachedData) {
        setStocks(cachedData);
      } else {
        try {
          const response = await axios.get(
            `${API_URL}?function=TOP_GAINERS_LOSERS&apikey=${API_KEY}`
          );
          const data =
            type === "gainers"
              ? response.data.top_gainers
              : response.data.top_losers;
          setStocks(data);
          await storeData(cacheKey, data);
        } catch (error) {
          console.error("Error fetching stock data:", error);
          setStocks(
            type === "gainers"
              ? top_gainers_losers.top_gainers
              : top_gainers_losers.top_losers
          );
        }
      }
    };

    // fetchData();
    type === "gainers"
      ? setStocks(top_gainers_losers.top_gainers)
      : setStocks(top_gainers_losers.top_losers);
  }, [type]);

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <StockCard stock={item} />
    </View>
  );

  return (
    <SafeAreaView style={{ backgroundColor: colors.dark }}>
      {/* <ThemeSwitch /> */}
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text
          style={{
            color: colors.light,
            fontSize: 30,
            fontWeight: "800",
            paddingVertical: 10,
          }}
        >
          {type === "gainers" ? "Top Gainers" : "Top Losers"}
        </Text>
      </View>
      <ScrollView style={styles.container}>
        {stocks.map((stock, index) => (
          <StockCard key={index} stock={stock} type={type} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const TopGainers = () => <StockList type="gainers" />;
const TopLosers = () => <StockList type="losers" />;

const Tab = createBottomTabNavigator();

const Home = () => {
  return (
    <Tab.Navigator
      initialRouteName="TopGainers"
      screenOptions={({ route }) => ({
        tabBarLabelPosition: "beside-icon",
        tabBarInactiveBackgroundColor: colors.dark,
        tabBarActiveBackgroundColor: colors.blue,
        tabBarLabelStyle: { color: colors.light, fontWeight: "600" },
        headerShown: false,
        tabBarIcon: ({ size }) => {
          let iconName;
          if (route.name === "Top Gainers") {
            iconName = "arrow-up-circle";
          } else if (route.name === "Top Losers") {
            iconName = "arrow-down-circle";
          }
          return <Feather name={iconName} color={colors.light} size={size} />;
        },
      })}
    >
      <Tab.Screen
        name="Top Gainers"
        component={TopGainers}
        options={{ tabBarLabel: "Top Gainers" }}
      />
      <Tab.Screen
        name="Top Losers"
        component={TopLosers}
        options={{ tabBarLabel: "Top Losers" }}
      />
    </Tab.Navigator>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  item: {
    flex: 1,
  },
});
