import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenWidth,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import WrapperContainer from "../../Components/Wrapper";
import { FontFamily } from "../../utils/Images";
import { TrainerBookingAPI } from "../../services/trainerBookingApi";

const Previous = () => {
  const navigation = useNavigation();
  const token = useSelector((state) => state?.Auth?.data?.token);

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await TrainerBookingAPI.getMyBookings(token);

      if (res?.success) {
        const filtered = (res.data || []).filter(
          (b) =>
            b.status === "completed" ||
            b.status === "cancelled" ||
            b.status === "rejected"
        );
        setSessions(filtered);
      }
    } catch (e) {
      console.log("trainer previous error:", e?.response?.data || e.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      load();
    }, [])
  );

  const renderItem = ({ item }) => {
    const user = item.userId;
    const statusText = item.status.toUpperCase();

    let statusColor = "#999";
    if (item.status === "completed") statusColor = "#9FED3A";
    if (item.status === "cancelled" || item.status === "rejected") statusColor = "#FF2D55";

    return (
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.cardContent}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("BookingDetails", { data: item })}
        >
          <Image source={{ uri: user?.profileImage }} style={styles.avatar} />

          <View style={styles.infoContainer}>
            <Text style={styles.name}>{user?.fullName || "User"}</Text>
            <Text style={styles.subText}>
              {item.date} • {item.time}
            </Text>
            <Text style={[styles.statusText, { color: statusColor }]}>{statusText}</Text>
          </View>

          <View style={styles.rightContainer}>
            <Text style={styles.viewDetailsText}>View Details</Text>
          </View>
        </TouchableOpacity>
        <View style={styles.separator} />
      </View>
    );
  };

  const Empty = () => (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", marginTop: 40 }}>
      {loading ? (
        <ActivityIndicator size="large" color={"#9FED3A"} />
      ) : (
        <Text style={{ color: "gray", fontSize: responsiveFontSize(2), textAlign: 'center' }}>
          No session history found
        </Text>
      )}
    </View>
  );

  return (
    <WrapperContainer style={{ backgroundColor: "#181818" }}>
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        data={sessions}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={Empty}
      />
    </WrapperContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    paddingHorizontal: responsiveWidth(6),
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    color: "white",
    fontSize: responsiveFontSize(2),
    fontWeight: "700",
  },
  subText: {
    color: "#aaa",
    fontSize: responsiveFontSize(1.6),
    marginTop: 4,
  },
  statusText: {
    marginTop: 8,
    fontWeight: "700",
    fontSize: responsiveFontSize(1.6),
  },
  rightContainer: {
    justifyContent: 'center',
  },
  viewDetailsText: {
    color: "#9FED3A",
    fontSize: responsiveFontSize(1.6),
    fontFamily: FontFamily.Medium,
  },
  separator: {
    height: 1,
    backgroundColor: '#2C2C2E',
    width: '100%',
  },
});

export default Previous;