import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import WrapperContainer from '../Components/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenFontSize,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {FontFamily, Images} from '../utils/Images';
import ButtonComp from '../Components/ButtonComp';
import {availableTimes, TimeSlots} from '../utils/Dummy';

const CompleteProfile = () => {
  const [firstname, setfirstname] = useState('');
  const [secondname, setsecondname] = useState('');
  const [Speciality, setSpeciality] = useState('');
  const [Email, setEmail] = useState('');
  const [Bio, setBio] = useState('');
  const [Hourly, setHourly] = useState('35');
  const [selectedTime, setSelectedTime] = useState([]);
  
  const handlePress = item => {
    setSelectedTime(prevSelectedItems => {
      if (prevSelectedItems.includes(item)) {
        return prevSelectedItems.filter(selectedItem => selectedItem !== item);
      } else {
        return [...prevSelectedItems, item];
      }
    });
  };

  const Specialsity = [
    {key: 1, value: 'Strength Training'},
    {key: 2, value: 'Yoga'},
    {key: 3, value: 'Cardio Fitness'},
    {key: 4, value: 'Weight Loss Coaching'},
    {key: 5, value: 'Bodybuilding'},
    {key: 6, value: 'Crossfit'},
  ];
  // const navigation = useNavigation();
  const renderItem = ({item}) => (
    <TouchableOpacity
      key={item.key}
      style={{
        paddingVertical: responsiveWidth(2),
        paddingHorizontal: responsiveWidth(4),
        borderRadius: 25,
        marginHorizontal: 5,
        borderWidth: 1,
        backgroundColor: item.value === Speciality ? '#9FED3A' : '#181818',
        borderColor: '#9FED3A',
      }}
      onPress={() => setSpeciality(item.value)}>
      <Text
        style={{
          color: item.value === Speciality ? 'black' : '#9FED3A',
          fontSize: responsiveFontSize(2),
        }}>
        {item.value}
      </Text>
    </TouchableOpacity>
  );
  const renderItems = ({item}) => (
    <TouchableOpacity
      style={{
        paddingVertical: responsiveWidth(2),
        paddingHorizontal: responsiveWidth(4),
        borderRadius: 25,
        marginHorizontal: 5,
        borderWidth: 1,
        backgroundColor: selectedTime.includes(item) ? '#9FED3A' : '#181818',
        borderColor: '#9FED3A',
      }}
      onPress={() => handlePress(item)}>
      <Text
        style={{
          color: selectedTime.includes(item) ? 'black' : '#9FED3A',
          fontSize: responsiveFontSize(2),
        }}>
        {item}
      </Text>
    </TouchableOpacity>
  );
  return (
    <WrapperContainer>
      <ScrollView>
        <View
          style={{
            width: responsiveScreenWidth(90),
            alignSelf: 'center',
          }}>
          <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
            <Text style={{color: 'white', fontSize: responsiveFontSize(2.4)}}>
              Complete Your Profile
            </Text>
            <Text style={{color: 'grey', fontSize: responsiveFontSize(2)}}>
              Skip
            </Text>
          </View>
          <Text style={{color: 'white', marginTop: responsiveHeight(3)}}>
            Profile picture
          </Text>
          <View
            style={{
              flexDirection: 'row',
              gap: responsiveWidth(7),
              marginTop: responsiveHeight(1),
            }}>
            <Image source={Images.placeholderimage} style={{}} />
            <View style={{flex: 1, justifyContent: 'space-around'}}>
              <Text
                style={{
                  color: '#9FED3A',
                  fontSize: responsiveScreenFontSize(2),
                }}>
                Upload your photo
              </Text>
              <Text
                style={{fontSize: responsiveScreenFontSize(2), color: 'white'}}>
                Upload a high-quality image
              </Text>
            </View>
          </View>
          <View
            style={{
              gap: responsiveHeight(2.5),
              marginTop: responsiveHeight(2),
            }}>
            <View
              style={{
                paddingHorizontal: responsiveWidth(5),
                paddingVertical: responsiveWidth(1),
                borderWidth: 0.5,
                borderColor: '#908C8D',
                borderRadius: 10,
              }}>
              <Text style={{color: '#908C8D'}}>First Name</Text>
              <TextInput
                value={firstname}
                onChangeText={setfirstname}
                placeholder="Enter First Name"
                style={{
                  padding: 0,
                  fontFamily: FontFamily.Semi_Bold,
                  color: 'white',
                  fontSize: responsiveFontSize(2),
                  width: responsiveWidth(67),
                  height: responsiveHeight(4),
                }}
                numberOfLines={1}
                placeholderTextColor={'white'}
              />
            </View>
            <View
              style={{
                paddingHorizontal: responsiveWidth(5),
                paddingVertical: responsiveWidth(1),
                borderWidth: 0.5,
                borderColor: '#908C8D',
                borderRadius: 10,
              }}>
              <Text style={{color: '#908C8D'}}>Last Name</Text>
              <TextInput
                placeholder="Enter Last Name"
                value={secondname}
                onChangeText={setsecondname}
                style={{
                  padding: 0,
                  fontFamily: FontFamily.Semi_Bold,
                  color: 'white',
                  fontSize: responsiveFontSize(2),
                  width: responsiveWidth(67),
                  height: responsiveHeight(4),
                }}
                numberOfLines={1}
                placeholderTextColor={'white'}
              />
            </View>
            <View
              style={{
                paddingHorizontal: responsiveWidth(5),
                paddingVertical: responsiveWidth(1),
                borderWidth: 0.5,
                borderColor: '#908C8D',
                borderRadius: 10,
              }}>
              <Text style={{color: '#908C8D'}}>Email</Text>
              <TextInput
                placeholder="Enter Email"
                value={Email}
                onChangeText={setEmail}
                style={{
                  padding: 0,
                  fontFamily: FontFamily.Semi_Bold,
                  color: 'white',
                  fontSize: responsiveFontSize(2),
                  width: responsiveWidth(67),
                  height: responsiveHeight(4),
                }}
                numberOfLines={1}
                placeholderTextColor={'white'}
              />
            </View>
            <View>
              <Text style={{color: 'white', marginBottom: responsiveHeight(1)}}>
                Bio
              </Text>
              <View
                style={{
                  paddingHorizontal: responsiveWidth(3),
                  paddingVertical: responsiveWidth(1),
                  borderWidth: 0.5,
                  borderColor: '#908C8D',
                  borderRadius: 10,
                  height: responsiveHeight(20),
                }}>
                <TextInput
                  placeholder="A brief introduction about yourself and your training philosophy"
                  onChangeText={setBio}
                  value={Bio}
                  style={{
                    padding: 0,
                    fontFamily: FontFamily.Semi_Bold,
                    color: 'white',
                    fontSize: responsiveFontSize(1.5),
                    height: Bio.length == 0 ? responsiveHeight(7) : 'auto',
                  }}
                  multiline
                  placeholderTextColor={'grey'}
                />
              </View>
            </View>
          </View>
          <Text
            style={{
              color: 'white',
              fontSize: responsiveFontSize(2),
              fontFamily: FontFamily.Medium,
              marginLeft: responsiveWidth(2),
              marginTop: responsiveHeight(2),
            }}>
            Speciality
          </Text>
          <View style={{marginTop: responsiveHeight(1.5)}}>
            <FlatList
              data={Specialsity}
              renderItem={renderItem}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{alignItems: 'center'}}
            />
          </View>
          <Text
            style={{
              color: 'white',
              fontSize: responsiveFontSize(2),
              fontFamily: FontFamily.Medium,
              marginLeft: responsiveWidth(2),
              marginTop: responsiveHeight(2),
            }}>
            Hourly Rate
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginLeft: responsiveWidth(2),
              marginTop: responsiveHeight(2),
            }}>
            <View
              style={{
                paddingHorizontal: responsiveWidth(2),
                borderWidth: 0.5,
                borderColor: '#908C8D',
                width: responsiveWidth(14),
                borderRadius: 5,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text style={{color: 'white', fontFamily: FontFamily.Semi_Bold}}>
                $
              </Text>
              <TextInput
                keyboardType="numeric"
                style={{paddingVertical: 0, color: 'white'}}
                value={Hourly}
                onChangeText={setHourly}
              />
            </View>
            <Text style={{color: 'white', fontFamily: FontFamily.Semi_Bold}}>
              /hr
            </Text>
          </View>
          <Text
            style={{
              color: 'white',
              fontSize: responsiveFontSize(2),
              fontFamily: FontFamily.Medium,
              marginLeft: responsiveWidth(2),
              marginTop: responsiveHeight(2),
            }}>
            Availability
          </Text>
          <View style={{marginTop: responsiveHeight(1.5)}}>
            <FlatList
              data={TimeSlots}
              renderItem={renderItems}
              keyExtractor={item => item}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{alignItems: 'center'}}
            />
          </View>
          <ButtonComp
            mainStyle={{marginTop: responsiveHeight(5)}}
            text="Next"
            onPress={() => {
              // navigation.navigate('Membership');
            }}
          />
        </View>
      </ScrollView>
    </WrapperContainer>
  );
};

export default CompleteProfile;

const styles = StyleSheet.create({});
