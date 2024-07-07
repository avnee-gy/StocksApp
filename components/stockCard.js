import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Link } from "expo-router";
import { colors } from "../utils/data";

const StockCard = ({ stock, type }) => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch(
          `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${stock.ticker}&apikey=7Z8VFEAI09PLONBW`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data);
        setStockData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    // fetchStockData();
  }, [stock, type]);

  return (
    <Link
      href={{
        pathname: "/[id]",
        params: { id: stock.ticker },
      }}
      style={styles.card}
    >
      <View>
        <View style={styles.info}>
          <Text style={styles.name}>
            {/* {stockData.Name ? "International Business Machines" : stock.ticker} */}
            {stock.ticker}
          </Text>
          <View
            style={{
              paddingTop: 30,
              // flexDirection: "row",
              // justifyContent: "center",
            }}
          >
            <Text style={styles.price}>${stock.price}</Text>
            <Text
              style={[
                styles.change,
                { color: type === "gainers" ? "#03C03C" : "#FF0800" },
              ]}
            >
              {type === "gainers" ? (
                <AntDesign name="arrowup" size={14} color="#03C03C" />
              ) : (
                <AntDesign name="arrowdown" size={14} color="#FF0800" />
              )}
              {stock.change_amount} ( {stock.change_percentage} )
            </Text>
          </View>
        </View>
        {/* </Pressable> */}
      </View>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    marginBottom: 20,
    padding: 20,
    paddingVertical: 20,
    backgroundColor: colors.blue,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.light,
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.light,
  },
  change: {
    fontSize: 14,
    fontWeight: "700",
  },
});

export default StockCard;
