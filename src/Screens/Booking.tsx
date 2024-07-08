import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import WrapperContainer from '../Components/Wrapper';
import Header from '../Components/Header';
import {
  responsiveFontSize,
  responsiveScreenWidth,
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Upcoming from './Upcoming';
import Previous from './Previous';
import {FontFamily} from '../utils/Images';

const Tab = createMaterialTopTabNavigator();
const Booking = () => {
  const [first, setfirst] = useState(false);


  return (
    <WrapperContainer style={{backgroundColor: '#181818'}}>
      <Header text='Bookings' textstyle={{fontSize:responsiveFontSize(3.5), color:"white"}} />
      

      <Tab.Navigator
        tabBar={({navigation, state}) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderBottomWidth: responsiveHeight(0.05),
              borderBottomColor: 'gray',
              marginTop:responsiveHeight(0.5)
            }}>
            <TouchableOpacity
              onPress={() => {
                // setselect(false);
                navigation.navigate('Upcoming');
              }}
              activeOpacity={0.8}
              style={{
                borderBottomWidth: responsiveHeight(0.4),
                paddingBottom: responsiveHeight(0.5),
                borderBottomColor:
                  state.index === 0 ? '#9FED3A' : 'transparent',
                borderRadius: responsiveHeight(0.2),
                width: responsiveWidth(50),
                alignItems: 'center',
              }}>
              <Text style={styles.subhead}>Upcoming</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                // setselect(true);
                navigation.navigate('Previous', {data: 'Ok'});
              }}
              activeOpacity={0.8}
              style={{
                borderBottomWidth: responsiveHeight(0.4),
                paddingBottom: responsiveHeight(0.5),
                borderRadius: responsiveHeight(0.2),
                width: responsiveWidth(50),
                alignItems: 'center',
                borderBottomColor:
                  state.index === 1 ? '#9FED3A' : 'transparent',
              }}>
              <Text style={styles.subhead}>Previous</Text>
            </TouchableOpacity>
          </View>
        )}>
        <Tab.Screen name="Upcoming" component={Upcoming} />
        <Tab.Screen name="Previous" component={Previous} />
      </Tab.Navigator>

      
    </WrapperContainer>
  );
};

export default Booking;

const styles = StyleSheet.create({
  subhead: {
    fontSize: responsiveFontSize(2),
    color: '#fff',
  },
});
