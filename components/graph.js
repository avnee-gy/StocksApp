import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { LineGraph } from "react-native-graph";
import { colors } from "../utils/data";

const parseData = (data, numPoints) => {
  const parsedData = Object.keys(data).map((key) => ({
    time: new Date(key),
    value: parseFloat(data[key]["4. close"]),
  }));

  // Sort data by time
  parsedData.sort((a, b) => a.time - b.time);
  console.log(JSON.stringify(parsedData, null, 2));

  // Select the specified number of points
  return parsedData.slice(-numPoints);
};

const GraphComponent = ({ data, numPoints }) => {
  const [amount, setAmount] = useState(null);

  const chartData = parseData(data, numPoints).map((item) => ({
    date: item.time,
    value: item.value,
  }));

  const onPointSelected = (point) => {
    setAmount(point.value);
  };

  return (
    <View>
      {amount ? (
        <Text style={{ fontSize: 20, color: colors.blue, fontWeight: "700" }}>
          ${amount}
        </Text>
      ) : (
        ""
      )}

      <LineGraph
        animated={true}
        points={chartData}
        color={colors.blue}
        style={{ width: "100%", height: 300 }}
        gradientFillColors={[colors.blue, colors.dark]}
        enablePanGesture
        onPointSelected={onPointSelected}
      />
    </View>
  );
};

export default GraphComponent;

const styles = StyleSheet.create({});
