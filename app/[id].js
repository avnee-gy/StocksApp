import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ActivityIndicator,
  ScrollView,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { chartData, colors, companyData } from "../utils/data";
import GraphComponent from "../components/graph";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "../components/searchBar";
import { storeData, getData } from "../utils/cache";

const StockDetails = () => {
  const { id } = useLocalSearchParams();
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      const cacheKey = `stock_${id}`;
      const cachedData = await getData(cacheKey);

      if (cachedData) {
        setStockData(cachedData);
        setLoading(false);
      } else {
        try {
          const response = await fetch(
            `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${id}&apikey=VILD8MDCGSBXRYRS`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setStockData(data);
          await storeData(cacheKey, data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching stock data:", error);
          setError(error.message);
          setLoading(false);
        }
      }
    };
    fetchStockData();
    // setStockData(companyData);
    // setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorText}>
          Oops Sorry! Failed to load stock data :( {error}
        </Text>
      </View>
    );
  }

  if (!stockData || !stockData.Name) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorText}>
          Oops Sorry! Failed to load stock data :({" "}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <SearchBar />
      <View style={styles.headerText}>
        <Text style={styles.companyName}>{stockData.Name}</Text>
        <Text style={styles.stockTicker}>
          {stockData.Symbol}, {stockData.AssetType}
        </Text>
        <Text style={styles.exchange}>{stockData.Exchange}</Text>
      </View>

      <Text style={styles.price}>
        ${stockData.CIK}{" "}
        <Text style={styles.priceChange}>
          <AntDesign name="arrowup" size={14} color="#03C03C" /> 0.41%
        </Text>
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 10, paddingVertical: 15 }}>
          <GraphComponent symbol={stockData.Symbol} numPoints={40} />
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>About {stockData.Name}:</Text>
          <Text style={styles.description}>
            {stockData.Description.length > 150
              ? stockData.Description.substr(0, 150) + "..."
              : stockData.Description}
          </Text>
          <View style={styles.tags}>
            <Text style={styles.tag}>Industry: {stockData.Industry}</Text>
            <Text style={styles.tag}>Sector: {stockData.Sector}</Text>
          </View>
          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Text style={styles.detailTitle}>52-Week Low</Text>
              <Text style={styles.detailValue}>${stockData["52WeekLow"]}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailTitle}>Current Price</Text>
              <Text style={styles.detailValue}>${stockData["CIK"]}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailTitle}>52-Week High</Text>
              <Text style={styles.detailValue}>${stockData["52WeekHigh"]}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default StockDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: colors.dark,
    paddingVertical: 20,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  error: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    fontWeight: "700",
  },
  header: {
    // flexDirection: "row",
    alignItems: "left",
    marginBottom: 20,
  },
  searchBar: {
    flex: 1,
    width: "100%",
    borderWidth: 1,
    borderColor: colors.blue,
    padding: 10,
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
    color: "#FFFFFF",
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  headerText: {
    flexDirection: "column",
    flexWrap: "wrap",
  },
  companyName: {
    fontSize: 20,
    fontWeight: "bold",
    flexWrap: "wrap",
    color: colors.light,
  },
  stockTicker: {
    fontSize: 16,
    flexWrap: "wrap",
    color: colors.light,
  },
  exchange: {
    fontSize: 14,
    color: "gray",
    flexWrap: "wrap",
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    flexWrap: "wrap",
    color: colors.light,
  },
  priceChange: {
    fontSize: 18,
    color: "#03C03C",
    flexWrap: "wrap",
  },
  chart: {
    alignItems: "center",
    marginBottom: 20,
  },
  chartImage: {
    width: "100%",
    height: 150,
  },
  infoContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.light,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
    flexWrap: "wrap",
    color: colors.light,
  },
  tags: {
    flexDirection: "row",
    marginBottom: 20,
    flexWrap: "wrap",
  },
  tag: {
    backgroundColor: colors.blue,
    padding: 5,
    marginRight: 10,
    marginTop: 10,
    borderRadius: 5,
    fontSize: 14,
    flexWrap: "wrap",
    color: colors.light,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  detailRow: {
    flexDirection: "column",
    flexWrap: "wrap",
  },
  detailTitle: {
    fontSize: 14,
    color: "gray",
    flexWrap: "wrap",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "bold",
    flexWrap: "wrap",
    color: colors.light,
  },
});
