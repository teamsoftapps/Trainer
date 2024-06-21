import {StyleSheet, Text, View, Pressable} from 'react-native';
import React, { useState } from 'react';
import PaymentModal from '../Components/PaymentModal';
import { responsiveScreenHeight,responsiveHeight } from 'react-native-responsive-dimensions';
import Button from '../Components/Button';

const Home = () => {
  const [modal, setmodal] = useState(false)
  return (
    <View style={{alignItems:"center", justifyContent:"flex-end", height:responsiveHeight(90)}}>

      <PaymentModal modalstate={modal} onRequestClose={()=>{setmodal(false)}}/>
      
      <Button text="Open modal" textstyle={{color:"white"}} onPress={()=>{setmodal(true)}} containerstyles={{}}/>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
