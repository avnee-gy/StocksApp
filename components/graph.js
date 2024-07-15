import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { LineGraph } from "react-native-graph";
import { colors } from "../utils/data";
import { getData, storeData } from "../utils/cache";

const parseData = (data, numPoints) => {
  const parsedData = Object.keys(data).map((key) => ({
    time: new Date(key),
    value: parseFloat(data[key]["4. close"]),
  }));

  // Sort data by time
  parsedData.sort((a, b) => a.time - b.time);

  // Select the specified number of points
  return parsedData.slice(-numPoints);
};

const getCachedData = async (key) => {
  try {
    const cachedData = await getData(key);
    return cachedData ? JSON.parse(cachedData) : null;
  } catch (error) {
    console.error("Error getting cached data: ", error);
    return null;
  }
};

const cacheData = async (key, data) => {
  try {
    await storeData(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error caching data: ", error);
  }
};

const GraphComponent = ({ symbol, numPoints }) => {
  const [amount, setAmount] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const cacheKey = `stock_data_${symbol}`;
      const cachedData = await getCachedData(cacheKey);
      if (cachedData) {
        setChartData(parseData(cachedData, numPoints));
        setLoading(false);
      } else {
        try {
          const response = await fetch(
            `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&apikey=J3VB8NO31HDE3UGK`
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log(data);
          const timeSeriesData = data["Time Series (5min)"];

          if (!timeSeriesData) {
            throw new Error("No time series data available");
          }

          const parsedData = parseData(timeSeriesData, numPoints).map(
            (item) => ({
              date: item.time,
              value: item.value,
            })
          );

          setChartData(parsedData);
          await cacheData(cacheKey, parsedData);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setError(error.message);
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [symbol, numPoints]);

  const onPointSelected = (point) => {
    setAmount(point.value);
  };

  return (
    <View>
      {amount ? (
        <Text style={{ fontSize: 20, color: colors.blue, fontWeight: "700" }}>
          ${amount}
        </Text>
      ) : null}

      {error ? (
        <Text style={{ fontSize: 20, color: colors.red, fontWeight: "700" }}>
          {error}
        </Text>
      ) : (
        <LineGraph
          animated={true}
          points={chartData}
          color={colors.blue}
          style={{ width: "100%", height: 300 }}
          gradientFillColors={[colors.blue, colors.dark]}
          enablePanGesture
          onPointSelected={onPointSelected}
        />
      )}
    </View>
  );
};

export default GraphComponent;

const styles = StyleSheet.create({});
