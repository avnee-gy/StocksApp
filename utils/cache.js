import AsyncStorage from "@react-native-async-storage/async-storage";

const CACHE_EXPIRATION = 3600 * 1000; // 1 hour

const storeData = async (key, value) => {
  try {
    const data = {
      value,
      timestamp: Date.now(),
    };
    await AsyncStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save to storage:", e);
  }
};

const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    if (jsonValue != null) {
      const data = JSON.parse(jsonValue);
      if (Date.now() - data.timestamp < CACHE_EXPIRATION) {
        return data.value;
      } else {
        await AsyncStorage.removeItem(key);
      }
    }
  } catch (e) {
    console.error("Failed to fetch from storage:", e);
  }
  return null;
};

export { storeData, getData };
