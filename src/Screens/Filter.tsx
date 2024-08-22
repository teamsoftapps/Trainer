import React, {useRef, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  PanResponder,
  Animated,
  Dimensions,
} from 'react-native';
import WrapperContainer from '../Components/Wrapper';
import Header from '../Components/Header';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Button from '../Components/Button';
import {useNavigation} from '@react-navigation/native';

const Filter = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedSortIndex, setSelectedSortIndex] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedWorkExperience, setSelectedWorkExperience] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);

  const toggleSwitch = () => setIsEnabled(prevState => !prevState);

  const navigation = useNavigation();
  const sortOptions = [
    {id: '1', feildName: 'popularity'},
    {id: '2', feildName: 'Star Rating (highest first)'},
    {id: '3', feildName: 'Star Rating (lowest first)'},
    {id: '4', feildName: 'Best Reviewed First'},
    {id: '5', feildName: 'Most Reviewed First'},
    {id: '6', feildName: 'Price (lowest first)'},
    {id: '7', feildName: 'Price (highest first)'},
  ];

  const Genders = [
    {id: '1', gender: 'Male'},
    {id: '2', gender: 'Female'},
  ];

  const WorkExperinces = [
    {id: '1', content: 'Any Experience'},
    {id: '4', content: '<1'},
    {id: '2', content: '1-5'},
    {id: '5', content: '5-10'},
    {id: '3', content: '10-15'},
    {id: '6', content: '15-20'},
  ];

  const Ratings = [
    {
      id: 1,
      image: require('../assets/Images/Starrr.png'),
    },
    {
      id: 2,
      image: require('../assets/Images/Starrr.png'),
    },
    {
      id: 3,
      image: require('../assets/Images/Starrr.png'),
    },
    {
      id: 4,
      image: require('../assets/Images/Starrr.png'),
    },
    {
      id: 5,
      image: require('../assets/Images/Starrr.png'),
    },
  ];

  const RenderedSortItems = ({item, index}) => {
    const isSelected = index === selectedSortIndex;
    return (
      <TouchableOpacity
        onPress={() => setSelectedSortIndex(index)}
        style={styles.optionContainer}>
        <Text style={styles.optionText}>{item.feildName}</Text>
        {isSelected ? (
          <Image
            source={require('../assets/Images/success.png')}
            style={styles.icon}
          />
        ) : (
          <Image
            source={require('../assets/Images/checkkkk.png')}
            style={[styles.icon, {tintColor: isSelected ? '#fff' : '#E5E5E5'}]}
          />
        )}
      </TouchableOpacity>
    );
  };

  const RenderedGenders = ({item, index}) => {
    const isSelected = index === selectedGender;
    return (
      <TouchableOpacity
        onPress={() => setSelectedGender(index)}
        style={styles.optionContainer}>
        <Text style={styles.optionText}>{item.gender}</Text>
        {isSelected ? (
          <Image
            source={require('../assets/Images/success.png')}
            style={styles.icon}
          />
        ) : (
          <Image
            source={require('../assets/Images/checkkkk.png')}
            style={[styles.icon, {tintColor: isSelected ? '#fff' : '#E5E5E5'}]}
          />
        )}
      </TouchableOpacity>
    );
  };

  const RenderedWorkExperience = ({item, index}) => {
    const isSelected = index === selectedWorkExperience;
    return (
      <TouchableOpacity
        onPress={() => setSelectedWorkExperience(index)}
        style={[
          styles.workExperienceItem,
          {
            ...styles.workExperienceItem,
            borderColor: isSelected ? '#9FED3A' : '#bbbbbb',
          },
          isSelected ? {backgroundColor: '#9FED3A'} : null,
        ]}>
        <Text style={{color: isSelected ? '#000' : '#bbbbbb'}}>
          {item.content}
        </Text>
      </TouchableOpacity>
    );
  };

  const RenderedRatings = ({item, index}) => {
    const isSelected = index === selectedRating;

    return (
      <TouchableOpacity onPress={() => setSelectedRating(index)}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRightWidth: item.id === 5 ? 0 : responsiveWidth(0.5),
            borderRightColor: '#bbbbbb',
            width: responsiveWidth(17),
            backgroundColor: isSelected ? '#9FED3A' : 'transparent',
            height: responsiveHeight(4),
            borderTopLeftRadius: index === 0 ? responsiveWidth(3.9) : 0,
            borderBottomLeftRadius: index === 0 ? responsiveWidth(3.9) : 0,
            borderTopRightRadius: index === 4 ? responsiveWidth(15) : 0,
            borderBottomRightRadius: index === 4 ? responsiveWidth(3.9) : 0,
          }}>
          <Text style={{color: isSelected ? '#000' : '#fff'}}>{item.id}</Text>
          <Image
            source={item.image}
            style={{
              height: responsiveHeight(2),
              width: responsiveWidth(3),
              tintColor: isSelected ? '#000' : '#9FED3A',
            }}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <WrapperContainer style={styles.container}>
      <ScrollView>
        <Header
          onPress={() => {
            navigation.goBack();
          }}
          rightView={
            <TouchableOpacity
              onPress={() => {
                setIsEnabled(false);
                setSelectedGender(null),
                  setSelectedRating(null),
                  setSelectedSortIndex(null);
                setSelectedWorkExperience(null);
              }}>
              <Text style={styles.resetText}>RESET</Text>
            </TouchableOpacity>
          }
        />
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Filter</Text>
        </View>
        <View style={styles.availabilityContainer}>
          <Text style={styles.sectionTitle}>Availability</Text>
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Available Today</Text>
          <Switch
            trackColor={{false: '#767577', true: '#18D200'}}
            thumbColor={'#f4f3f4'}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Sort Options</Text>
          <FlatList
            data={sortOptions}
            renderItem={RenderedSortItems}
            keyExtractor={item => item.id}
          />
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Gender</Text>
          <FlatList
            data={Genders}
            renderItem={RenderedGenders}
            keyExtractor={item => item.id}
          />
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Work Experience (years)</Text>
          <View style={styles.workExperienceList}>
            <FlatList
              data={WorkExperinces}
              renderItem={RenderedWorkExperience}
              keyExtractor={item => item.id}
              numColumns={2}
            />
          </View>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Price Range</Text>
          <Text
            style={[
              styles.sectionSubTitle,
              {...styles.sectionSubTitle, color: '#fff'},
            ]}>
            $10 -$87
          </Text>
          <Text
            style={[
              styles.sectionSubTitle,
              {...styles.sectionSubTitle, marginTop: responsiveHeight(0.5)},
            ]}>
            The average price is $45
          </Text>
        </View>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Star Rating</Text>
          <View
            style={{
              height: responsiveHeight(4),
              borderRadius: responsiveWidth(5),
              borderWidth: responsiveWidth(0.3),
              borderColor: '#bbbbbb',
              marginTop: responsiveHeight(2),
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              marginBottom: responsiveHeight(2),
            }}>
            <FlatList horizontal data={Ratings} renderItem={RenderedRatings} />
          </View>
        </View>
      </ScrollView>
      <Button containerstyles={{alignSelf: 'center'}} text="Apply Filters" />
    </WrapperContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#181818',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '85%',
    alignSelf: 'center',
    marginBottom: responsiveHeight(2),
  },
  headerText: {
    color: 'white',
    fontSize: responsiveFontSize(3.3),
  },
  availabilityContainer: {
    marginLeft: responsiveWidth(8),
    marginTop: responsiveHeight(2),
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: responsiveWidth(7.5),
    marginTop: responsiveHeight(2),
    borderBottomWidth: responsiveWidth(0.05),
    borderBottomColor: '#E5E5E5',
    paddingBottom: responsiveHeight(0.5),
  },
  switchLabel: {
    color: '#fff',
    fontSize: responsiveFontSize(1.7),
  },
  sectionContainer: {
    marginHorizontal: responsiveWidth(8),
    marginTop: responsiveHeight(2),
  },
  sectionTitle: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    marginTop: responsiveHeight(3),
  },
  sectionSubTitle: {
    color: '#bbbbbb',
    marginTop: responsiveHeight(2),
  },
  optionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: responsiveHeight(6),
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: responsiveWidth(0.05),
  },
  optionText: {
    color: '#fff',
    fontSize: responsiveFontSize(1.7),
  },
  icon: {
    height: responsiveHeight(2.7),
    width: responsiveWidth(5.2),
  },
  workExperienceItem: {
    height: responsiveHeight(7),
    width: responsiveWidth(40),
    borderRadius: responsiveWidth(2),
    borderColor: '#BBBBBB',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: responsiveWidth(1.5),
    marginBottom: responsiveHeight(1.5),
  },
  workExperienceList: {
    paddingVertical: responsiveHeight(2),
    flexDirection: 'row',
    alignItems: 'center',
  },
  resetText: {
    color: '#BBBBBB',
  },
});

export default Filter;
