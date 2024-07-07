import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import StockCard from "../components/stockCard";
import { top_gainers_losers, colors } from "../utils/data";
import { getData, storeData } from "../utils/cache"; // Import utility functions
import { Feather } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const API_URL = "https://www.alphavantage.co/query";
const API_KEY = "7Z8VFEAI09PLONBW";

const StockList = ({ type }) => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const cacheKey = `stocks_${type}`;
      const cachedData = await getData(cacheKey);

      if (cachedData) {
        setStocks(cachedData);
        setLoading(false);
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
          setLoading(false);
        } catch (error) {
          console.error("Error fetching stock data:", error);
          setError(error);
          setLoading(false);
        }
      }
    };

    fetchData();
    // Uncomment the line above and remove the following lines when API is ready
    // type === "gainers"
    //   ? setStocks(top_gainers_losers.top_gainers)
    //   : setStocks(top_gainers_losers.top_losers);
    // setLoading(false);
  }, [type]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.blue} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Error fetching stock data.</Text>
      </SafeAreaView>
    );
  }

  if (stocks.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No stocks available.</Text>
      </SafeAreaView>
    );
  }

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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.dark,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.dark,
  },
  errorText: {
    color: colors.red,
    fontSize: 18,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.dark,
  },
  emptyText: {
    color: colors.light,
    fontSize: 18,
    fontWeight: "bold",
  },
});
