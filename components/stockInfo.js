import React from "react";
import { View, Text, StyleSheet } from "react-native";
import GraphComponent from "../components/graph";
import { chartData, colors } from "../utils/data";

const StockInfo = ({ stockData }) => {
  return (
    <>
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
    </>
  );
};

const styles = StyleSheet.create({
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

export default StockInfo;
