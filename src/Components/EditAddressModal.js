import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import {FontFamily, Images} from '../utils/Images';
import Button from './Button';
import axiosBaseURL from '../services/AxiosBaseURL';
import {showMessage} from 'react-native-flash-message';

const EditAddressModal = ({modalstate, onRequestClose, Address, token,   setAddress, }) => {
  const [text, setText] = useState(Address);

  useEffect(() => {
  setText(Address);
}, [Address]);

  // const SaveData = () => {
  //   onRequestClose();

  //   axiosBaseURL
  //     .post('/common/UpdateAddress', {
  //       token: token,
  //       updatedAddress: text,
  //     })
  //     .then(response => {
  //       console.log('90909009090', response);

  //       showMessage({
  //         message: 'Address updated successfully',
  //         type: 'success',
  //       });
  //     })
  //     .catch(() => {
  //       showMessage({
  //         message: 'Failed, Please try again',
  //         type: 'warning',
  //       });
  //     });
  // };

  const SaveData = () => {
  axiosBaseURL
    .post('/common/UpdateAddress', {
      token: token,
      updatedAddress: text,
    })
    .then(response => {
      setAddress(text);   
      onRequestClose();

      showMessage({
        message: 'Address updated successfully',
        type: 'success',
      });
    })
    .catch(() => {
      showMessage({
        message: 'Failed, Please try again',
        type: 'warning',
      });
    });
};

  const Closemodal = () => {
    setText(Address);
    onRequestClose();
  };

  return (
    // <Modal
    //   animationType="slide"
    //   transparent
    //   visible={modalstate}
    //   onRequestClose={onRequestClose}>
    //   <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    //     <View
    //       style={{
    //         height: responsiveScreenHeight(35),
    //         width: responsiveScreenWidth(85),
    //         backgroundColor: '#9FED3A',
    //         justifyContent: 'center',
    //         alignSelf: 'center',
    //         borderRadius: responsiveScreenWidth(4),
    //         alignItems: 'center',
    //         gap: responsiveScreenWidth(5),
    //       }}>
    //       <View
    //         style={{
    //           width: '80%',
    //           justifyContent: 'space-between',
    //           flexDirection: 'row',
    //         }}>
    //         <Text
    //           style={{
    //             color: 'black',
    //             fontSize: responsiveFontSize(2),
    //             fontFamily: FontFamily.Bold,
    //           }}>
    //           Edit Your Address
    //         </Text>

    //         <TouchableOpacity onPress={Closemodal}>
    //           <Image
    //             source={Images.Cross}
    //             resizeMode="contain"
    //             style={{width: responsiveScreenWidth(5)}}
    //           />
    //         </TouchableOpacity>
    //       </View>

    //       <TextInput
    //         style={styles.textArea}
    //         value={text}
    //         onChangeText={setText}
    //         placeholder="Type something here..."
    //         multiline
    //         numberOfLines={4}
    //       />

    //       <Button
    //         onPress={SaveData}
    //         text="Save"
    //         textstyle={{
    //           color: 'white',
    //           fontWeight: '500',
    //           fontSize: responsiveFontSize(2),
    //         }}
    //         containerstyles={{
    //           backgroundColor: 'black',
    //           height: responsiveScreenHeight(5),
    //         }}
    //       />
    //     </View>
    //   </View>
    // </Modal>

    <Modal
  animationType="slide"
  transparent
  visible={modalstate}
  onRequestClose={Closemodal}>

  {/* overlay */}
  <View style={styles.overlay}>

    {/* bottom sheet */}
    <View style={styles.sheet}>
      <View style={styles.header}>
        <Text style={styles.title}>Edit your Address</Text>

        <TouchableOpacity onPress={Closemodal}>
          <Image
            source={Images.Cross}
            style={styles.cross}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.textArea}
        value={text}
        onChangeText={setText}
        placeholder="Add your address ..."
        placeholderTextColor="#888"
        multiline
      />

      <Button
        onPress={SaveData}
        text="Save"
        textstyle={{color: 'black', fontWeight: '700'}}
        containerstyles={styles.saveBtn}
      />
    </View>
  </View>
</Modal>

  );
};

export default EditAddressModal;

const styles = StyleSheet.create({
  // textArea: {
  //   height: '50%',
  //   width: '80%',
  //   borderColor: 'black',
  //   borderWidth: 1,
  //   padding: 10,
  //   textAlignVertical: 'top',
  //   borderRadius: 10,
  //   color: 'black',
  // },

   overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },

  sheet: {
    backgroundColor: '#222',
    padding: responsiveScreenWidth(6),
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    minHeight: responsiveScreenHeight(35),
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveScreenHeight(2),
  },

  title: {
    color: 'white',
    fontSize: responsiveFontSize(2.3),
    fontFamily: FontFamily.Bold,
  },

  cross: {
    width: responsiveScreenWidth(5),
    tintColor: 'white',
  },

  textArea: {
    height: responsiveScreenHeight(14),
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 12,
    padding: 12,
    color: 'white',
    textAlignVertical: 'top',
    marginBottom: responsiveScreenHeight(3),
  },

  saveBtn: {
    backgroundColor: '#9FED3A',
    height: responsiveScreenHeight(6),
    borderRadius: 40,
  },
});
