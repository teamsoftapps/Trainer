import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import WrapperContainer from '../Components/Wrapper'
import { Images } from '../utils/Images'
import { responsiveHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions'

const upcoming = [
  {
    id: 1,
    name: 'Alex Morgan',
    date: 'Monday, Oct, 23',
    time: '8:00 AM',
    timeage: '30 mins before',
    status: 'Pending',
    image: Images.trainer2,
    address: '4th Street, Blinken Ave, San Francisco, California',
  },
  {
    id: 2,
    name: 'Barbra Michelle',
    date: 'Monday, Oct, 2',
    time: '10:00 AM',
    timeage: '15 mins before',
    status: 'Confirmed',
    image: Images.trainer,
    address: '4th Street, Blinken Ave, San Francisco, California',
  },
  {
    id: 3,
    name: 'Mathues Pablo',
    date: 'Sunday, Oct, 21',
    time: '12:00 PM',
    timeage: 'None',
    status: 'Cancelled',
    image: Images.trainer3,
    address: '4th Street, Blinken Ave, San Francisco, California',
  },
];

const Upcoming = () => {
  return (
    <WrapperContainer style={{ backgroundColor: "#181818" }}>

      <FlatList showsVerticalScrollIndicator={false} data={upcoming} renderItem={({ item, index }) => {
        return (
          <View style={styles.border}>
            <View style={styles.container}>
              <View style={styles.left}>
                <Image source={item.image} />
                <View>
                  <Text style={styles.whitetext} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.whitetext} numberOfLines={1}>
                    {item.date}
                  </Text>
                  <Text style={styles.greytext} numberOfLines={1}>
                    {item.time}
                  </Text>
                </View>
              </View>
              <View style={styles.right}>
                <Text style={styles.timeago}>{item.timeage}</Text>
                <View
                  style={{
                    ...styles.curve,
                    borderRadius: responsiveScreenWidth(10),
                    backgroundColor:
                      item.status === 'Pending'
                        ? '#B8B8B8'
                        : item.status === 'Confirmed'
                        ? '#9FED3A'
                        : item.status === 'Cancelled'
                        ? '#FF2D55'
                        : 'none',
                  }}>
                  <Text
                    style={
                      item.status === 'Cancelled'
                        ? styles.whitetext
                        : styles.blacktext
                    }>
                    {item.status}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        );
      }} />

    </WrapperContainer>
  )
}

export default Upcoming

const styles = StyleSheet.create({
  border: { borderBottomColor: "#B8B8B8", borderBottomWidth: 0.5 },
  container: { flexDirection: "row", justifyContent: "space-between", width: "88%", alignSelf: "center", paddingVertical: responsiveScreenWidth(5) },
  left: { flexDirection: "row", gap: responsiveScreenWidth(3), alignItems: "center" },
  whitetext: { color: "white", fontWeight: "500" },
  blacktext: { color: "black", fontWeight: "500" },
  greytext: { color: "#B8B8B8", fontWeight: "400" },
  right: { justifyContent: "space-evenly", alignItems: "flex-end" },
  timeago: { color: "#B8B8B8", fontWeight: "400" },
  curve: {
    width: "100%", alignItems: "center", justifyContent: "center", padding: responsiveScreenWidth(1), paddingHorizontal:responsiveScreenWidth(5)
  }
})