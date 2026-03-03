import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import {
  responsiveFontSize,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { BookingAPI } from "../../services/bookingApi";

const Upcoming = () => {
  const navigation = useNavigation();
  const token = useSelector((state) => state?.Auth?.data?.token);

  console.log("token in upcoming:", token)

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await BookingAPI.getMyBookings(token);

      console.log("response in upcoming:", res.data)

      if (res?.success) {
        const filtered = res.data.filter(
          (b) => b.status === "pending" || b.status === "confirmed" || b.status === "pending_payment" || b.status === "trainer_completed"
        );
        setBookings(filtered);
      }
    } catch (e) {
      console.log("Upcoming error:", e.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [])
  );

  const renderItem = ({ item }) => {
    const trainer = item.trainerId;

    console.log("item in upcoming:", item)

    const statusText = item.status === "pending_payment" ? "Pending" : (item.status === "trainer_completed" ? "Waiting Approval" : item.status.charAt(0).toUpperCase() + item.status.slice(1));
    const statusBg = item.status === "confirmed" ? "#9FED3A" : (item.status === "trainer_completed" ? "#FFA500" : (item.status === "pending_payment" || item.status === "pending" ? "#C7C7CC" : "#FF4B4B"));
    const statusTextColor = (item.status === "confirmed" || item.status === "trainer_completed") ? "black" : "white";

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          navigation.navigate("BookingDetails", {
            data: item,
          })
        }
      >
        <View style={styles.cardContent}>
          <Image source={{ uri: trainer?.profileImage }} style={styles.avatar} />

          <View style={styles.infoContainer}>
            <Text style={styles.name}>{trainer?.fullName}</Text>
            <Text style={styles.dateText}>{item.date}</Text>
            <Text style={styles.timeText}>{item.time}</Text>
          </View>

          <View style={styles.rightContainer}>
            <Text style={styles.reminderText}>{item.reminder} before</Text>
            <View style={[styles.statusPill, { backgroundColor: statusBg }]}>
              <Text style={[styles.statusText, { color: statusTextColor }]}>{statusText}</Text>
            </View>
          </View>
        </View>
        <View style={styles.separator} />
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#181818', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#9FED3A" />
      </View>
    );
  }

  if (!bookings.length) {
    return (
      <Text style={{ color: "gray", textAlign: "center", marginTop: 40, fontSize: responsiveFontSize(2) }}>
        No upcoming bookings
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={bookings}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Upcoming;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
  },
  card: {
    paddingHorizontal: responsiveWidth(6),
    marginTop: 20,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    color: "white",
    fontSize: responsiveFontSize(2.2),
    fontWeight: "700",
    marginBottom: 4,
  },
  dateText: {
    color: "#8E8E93",
    fontSize: responsiveFontSize(1.8),
    marginBottom: 2,
  },
  timeText: {
    color: "#8E8E93",
    fontSize: responsiveFontSize(1.8),
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  reminderText: {
    color: "#8E8E93",
    fontSize: responsiveFontSize(1.6),
    marginBottom: 8,
  },
  statusPill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    minWidth: 90,
    alignItems: 'center',
  },
  statusText: {
    fontSize: responsiveFontSize(1.7),
    fontWeight: "600",
  },
  separator: {
    height: 1,
    backgroundColor: '#333',
    width: '100%',
  },
});