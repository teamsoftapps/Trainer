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
import React, { useState } from 'react';
import WrapperContainer from '../Components/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveScreenFontSize,
  responsiveScreenWidth,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import { FontFamily, Images } from '../utils/Images';
import ButtonComp from '../Components/ButtonComp';
import { availableTimes, Specialities, TimeSlots } from '../utils/Dummy';
import { useNavigation } from '@react-navigation/native';
import axiosBaseURL from '../utils/AxiosBaseURL';

const CompleteProfile = ({ route }) => {
  // const { data } = route.params;
  // const Name = data.fullname.split(' ');

  // Data States
  const [firstname, setfirstname] = useState("");
  const [secondname, setsecondname] = useState("");
  const [Speciality, setSpeciality] = useState([]);
  const [Email, setEmail] = useState("");
  const [Bio, setBio] = useState('');
  const [Hourly, setHourly] = useState('35');
  const [selectedTime, setSelectedTime] = useState([]);

  // Formik States
  const [specialityformik, setspecialityformik] = useState(false);
  const [Bioformik, setBioformik] = useState(false);
  const [Hourlyformik, setHourlyformik] = useState(false);
  const [timeformik, settimeformik] = useState(false);

  // Formik Conditions
  const condition1 = Hourly !== "0";
  const condition2 = selectedTime.length !== 0;
  const condition3 = Bio != '';
  const condition4 = Speciality.length !== 0;




  // const navigation = useNavigation();


  const Function = () => {

    if (condition1 && condition2 && condition3 && condition4) {
      setspecialityformik(false);
      setBioformik(false);
      settimeformik(false);
      setHourlyformik(false);

      // API
      axiosBaseURL
        .post('/trainer/update', {
          email: Email,
          Bio: Bio,
          Speciality: Speciality,
          Hourlyrate: Hourly,
          Availiblity: selectedTime,
        })
        .then(response => {
          console.log('User Created', response.data);

        })
        .catch(error => {
          console.log('Error fetching data:', error);

        });
    }
    else {

      if (!condition4) setspecialityformik(true);
      if (!condition3) setBioformik(true);
      if (!condition2) settimeformik(true);
      if (!condition1) setHourlyformik(true);

    }
  }


  return (
    <WrapperContainer>
      <ScrollView>
        <View
          style={styles.Main}>
          <View style={styles.Header}>
            <Text style={styles.H1}>
              Complete Your Profile
            </Text>
            <Text style={styles.greyH}>
              Skip
            </Text>
          </View>
          <Text style={styles.subHeading}>
            Profile picture
          </Text>
          <View
            style={styles.ProfileContainer}>
            <Image source={Images.placeholderimage} style={{}} />
            <View style={styles.ProfileText}>
              <Text
                style={styles.UploadText}>
                Upload your photo
              </Text>
              <Text
                style={styles.UploadText2}>
                Upload a high-quality image
              </Text>
            </View>
          </View>
          <View
            style={styles.FirstNameContainer}>
            <View
              style={styles.FirstNameH}>
              <Text style={{ color: '#908C8D' }}>First Name</Text>
              <TextInput
                value={firstname}
                onChangeText={setfirstname}
                placeholder="Enter First Name"
                style={styles.FirstNameInput}
                numberOfLines={1}
                placeholderTextColor={'white'}
              />
            </View>
            <View
              style={styles.LastNameContainer}>
              <Text style={{ color: '#908C8D' }}>Last Name</Text>
              <TextInput
                placeholder="Enter Last Name"
                value={secondname}
                onChangeText={setsecondname}
                style={styles.LastNameInput}
                numberOfLines={1}
                placeholderTextColor={'white'}
              />
            </View>
            <View
              style={styles.EmailContainer}>
              <Text style={{ color: '#908C8D' }}>Email</Text>
              <TextInput
                placeholder="Enter Email"
                value={Email}
                onChangeText={setEmail}
                style={styles.EmailInput}
                numberOfLines={1}
                placeholderTextColor={'white'}
              />
            </View>
            <View>
              <Text style={{ color: Bioformik ? "red" : 'white', marginBottom: responsiveHeight(1) }}>
                Bio
              </Text>
              <View
                style={[{ ...styles.BioCont }, {
                  borderColor: Bioformik ? "red" : '#908C8D'
                }]}>
                <TextInput
                  placeholder="A brief introduction about yourself and your training philosophy"
                  onChangeText={setBio}
                  value={Bio}
                  style={[{ ...styles.BioInput }, { height: Bio.length == 0 ? responsiveHeight(7) : 'auto' }]}
                  multiline
                  placeholderTextColor={'grey'}
                />
              </View>
            </View>
          </View>
          <Text
            style={[{ ...styles.SpecialityMain }, {
              color: specialityformik ? "red" : 'white',
            }]}>
            Speciality
          </Text>
          <View style={{ marginTop: responsiveHeight(1.5) }}>
            <FlatList
              data={Specialities}
              renderItem={({ item }) => (
                <TouchableOpacity
                  key={item.key}
                  style={[{ ...styles.MainFlatlist }, {
                    backgroundColor: Speciality.includes(item.value) ? '#9FED3A' : '#181818'
                  }]}
                  onPress={() => {
                    setSpeciality(prevSelectedItems => {
                      if (prevSelectedItems.includes(item.value)) {
                        return prevSelectedItems.filter(selectedItem => selectedItem !== item.value);
                      } else {
                        return [...prevSelectedItems, item.value];
                      }
                    });
                  }
                  }>
                  <Text
                    style={{
                      color: Speciality.includes(item.value) ? 'black' : '#9FED3A',
                      fontSize: responsiveFontSize(2),
                    }}>
                    {item.value}
                  </Text>
                </TouchableOpacity >
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ alignItems: 'center' }}
            />
          </View>
          <Text
            style={[{ ...styles.HourlyText1 }, { color: Hourlyformik ? "red" : 'white' }]}>
            Hourly Rate
          </Text>
          <View
            style={styles.HourlyContainer}>
            <View
              style={styles.RateContainer}>
              <Text style={styles.Dollar}>
                $
              </Text>
              <TextInput
                keyboardType="numeric"
                style={{ paddingVertical: 0, color: 'white' }}
                value={Hourly}
                onChangeText={setHourly}
              />
            </View>
            <Text style={styles.HourlyText}>
              /hr
            </Text>
          </View>
          <Text
            style={[{ ...styles.Avail }, { color: timeformik ? "red" : 'white' }]}>
            Availability
          </Text>
          <View style={{ marginTop: responsiveHeight(1.5) }}>
            <FlatList
              data={TimeSlots}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[{ ...styles.MainFlatlist2 }, {
                    backgroundColor: selectedTime.includes(item) ? '#9FED3A' : '#181818',
                  }]}
                  onPress={() => {
                    setSelectedTime(prevSelectedItems => {
                      if (prevSelectedItems.includes(item)) {
                        return prevSelectedItems.filter(selectedItem => selectedItem !== item);
                      } else {
                        return [...prevSelectedItems, item];
                      }
                    });
                  }}>
                  <Text
                    style={{
                      color: selectedTime.includes(item) ? 'black' : '#9FED3A',
                      fontSize: responsiveFontSize(2),
                    }}>
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              keyExtractor={item => item}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ alignItems: 'center' }}
            />
          </View>
          <ButtonComp
            mainStyle={{
              marginTop: responsiveHeight(5),
              marginBottom: responsiveHeight(5),
            }}
            text="Next"
            onPress={() => {
              Function()
              // navigation.navigate('Membership');
            }}
          />
        </View>
      </ScrollView>
    </WrapperContainer>
  );
};

export default CompleteProfile;

const styles = StyleSheet.create({
  MainFlatlist2: {
    paddingVertical: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(4),
    borderRadius: 25,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#9FED3A',
  },
  MainFlatlist: {
    paddingVertical: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(4),
    borderRadius: 25,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#9FED3A',
  },
  SpecialityMain: {
    fontSize: responsiveFontSize(2),
    fontFamily: FontFamily.Medium,
    marginLeft: responsiveWidth(2),
    marginTop: responsiveHeight(2),
  },
  BioInput: {
    padding: 0,
    fontFamily: FontFamily.Semi_Bold,
    color: 'white',
    fontSize: responsiveFontSize(1.5),
  },
  BioCont: {
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveWidth(1),
    borderWidth: 0.5,
    borderRadius: 10,
    height: responsiveHeight(20),
  },
  HourlyText1: {
    fontSize: responsiveFontSize(2),
    fontFamily: FontFamily.Medium,
    marginLeft: responsiveWidth(2),
    marginTop: responsiveHeight(2),
  },
  Avail: {
    fontSize: responsiveFontSize(2),
    fontFamily: FontFamily.Medium,
    marginLeft: responsiveWidth(2),
    marginTop: responsiveHeight(2),
  },
  HourlyText: { color: 'white', fontFamily: FontFamily.Semi_Bold },
  Dollar: { color: 'white', fontFamily: FontFamily.Semi_Bold },
  RateContainer: {
    paddingHorizontal: responsiveWidth(2),
    borderWidth: 0.5,
    borderColor: '#908C8D',
    width: responsiveWidth(14),
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  HourlyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: responsiveWidth(2),
    marginTop: responsiveHeight(2),
  },
  Main: {
    width: responsiveScreenWidth(90),
    alignSelf: 'center',
  },
  Header: { justifyContent: 'space-between', flexDirection: 'row' },
  H1: { color: 'white', fontSize: responsiveFontSize(2.4) },
  greyH: { color: 'grey', fontSize: responsiveFontSize(2) },
  subHeading: { color: 'white', marginTop: responsiveHeight(3) },
  ProfileContainer: {
    flexDirection: 'row',
    gap: responsiveWidth(7),
    marginTop: responsiveHeight(1),
  },
  ProfileText: { flex: 1, justifyContent: 'space-around' },
  UploadText: {
    color: '#9FED3A',
    fontSize: responsiveScreenFontSize(2),
  },
  UploadText2: { fontSize: responsiveScreenFontSize(2), color: 'white' },
  FirstNameContainer: {
    gap: responsiveHeight(2.5),
    marginTop: responsiveHeight(2),
  },
  FirstNameH: {
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveWidth(1),
    borderWidth: 0.5,
    borderColor: '#908C8D',
    borderRadius: 10,
  },
  FirstNameInput: {
    padding: 0,
    fontFamily: FontFamily.Semi_Bold,
    color: 'white',
    fontSize: responsiveFontSize(2),
    width: responsiveWidth(67),
    height: responsiveHeight(4),
  },
  LastNameContainer: {
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveWidth(1),
    borderWidth: 0.5,
    borderColor: '#908C8D',
    borderRadius: 10,
  },
  LastNameInput: {
    padding: 0,
    fontFamily: FontFamily.Semi_Bold,
    color: 'white',
    fontSize: responsiveFontSize(2),
    width: responsiveWidth(67),
    height: responsiveHeight(4),
  },
  EmailContainer: {
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveWidth(1),
    borderWidth: 0.5,
    borderColor: '#908C8D',
    borderRadius: 10,
  },
  EmailInput: {
    padding: 0,
    fontFamily: FontFamily.Semi_Bold,
    color: 'white',
    fontSize: responsiveFontSize(2),
    width: responsiveWidth(67),
    height: responsiveHeight(4),
  }
});
