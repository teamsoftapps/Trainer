import React, {useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import WrapperContainer from '../../Components/Wrapper';
import Header from '../../Components/Header';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Button from '../../Components/Button';
import {useNavigation} from '@react-navigation/native';

const Filter = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedSortIndex, setSelectedSortIndex] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedWorkExperience, setSelectedWorkExperience] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);

  const toggleSwitch = () => setIsEnabled(prev => !prev);
  const navigation = useNavigation();

  const resetAll = () => {
    setIsEnabled(false);
    setSelectedGender(null);
    setSelectedRating(null);
    setSelectedSortIndex(null);
    setSelectedWorkExperience(null);
  };

  const sortOptions = [
    {id: '1', feildName: 'Popularity'},
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
    {id: '1', content: 'Any'},
    {id: '4', content: '<1'},
    {id: '2', content: '1-5'},
    {id: '5', content: '5-10'},
    {id: '3', content: '10-15'},
    {id: '6', content: '15-20'},
  ];

  const Ratings = [
    {id: 1, image: require('../../assets/Images/Starrr.png')},
    {id: 2, image: require('../../assets/Images/Starrr.png')},
    {id: 3, image: require('../../assets/Images/Starrr.png')},
    {id: 4, image: require('../../assets/Images/Starrr.png')},
    {id: 5, image: require('../../assets/Images/Starrr.png')},
  ];

  const Section = ({title, right, children}) => {
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {right ? right : null}
        </View>
        <View style={styles.card}>{children}</View>
      </View>
    );
  };

  const RenderedSortItems = ({item, index}) => {
    const isSelected = index === selectedSortIndex;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setSelectedSortIndex(index)}
        style={styles.rowItem}>
        <Text style={styles.rowText}>{item.feildName}</Text>

        <View style={[styles.checkPill, isSelected && styles.checkPillActive]}>
          {isSelected ? (
            <Image
              source={require('../../assets/Images/success.png')}
              style={[styles.checkIcon, {tintColor: '#000'}]}
            />
          ) : (
            <View style={styles.checkDot} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const RenderedGenders = ({item, index}) => {
    const isSelected = index === selectedGender;
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setSelectedGender(index)}
        style={styles.rowItem}>
        <Text style={styles.rowText}>{item.gender}</Text>

        <View style={[styles.checkPill, isSelected && styles.checkPillActive]}>
          {isSelected ? (
            <Image
              source={require('../../assets/Images/success.png')}
              style={[styles.checkIcon, {tintColor: '#000'}]}
            />
          ) : (
            <View style={styles.checkDot} />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const RenderedWorkExperience = ({item, index}) => {
    const isSelected = index === selectedWorkExperience;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setSelectedWorkExperience(index)}
        style={[styles.pill, isSelected && styles.pillActive]}>
        <Text style={[styles.pillText, isSelected && styles.pillTextActive]}>
          {item.content}
        </Text>
      </TouchableOpacity>
    );
  };

  const RenderedRatings = ({item, index}) => {
    const isSelected = index === selectedRating;
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={() => setSelectedRating(index)}
        style={[
          styles.ratingSeg,
          index === 0 && styles.ratingLeft,
          index === 4 && styles.ratingRight,
          isSelected && styles.ratingSegActive,
        ]}>
        <Text
          style={[styles.ratingText, isSelected && styles.ratingTextActive]}>
          {item.id}
        </Text>
        <Image
          source={item.image}
          style={[
            styles.ratingStar,
            {tintColor: isSelected ? '#000' : '#9FED3A'},
          ]}
        />
      </TouchableOpacity>
    );
  };

  const handleApply = () => {
    // Map the indices/values to actual filterable data
    const filterData = {
      isAvailable: isEnabled,
      gender: selectedGender !== null ? Genders[selectedGender].gender : null,
      minRating: selectedRating !== null ? selectedRating + 1 : 0,
      experience:
        selectedWorkExperience !== null
          ? WorkExperinces[selectedWorkExperience].content
          : 'Any',
      sortBy:
        selectedSortIndex !== null
          ? sortOptions[selectedSortIndex].feildName
          : null,
    };

    // Navigate back with the data
    navigation.navigate('SearchTrainer', {filters: filterData});
  };

  return (
    <WrapperContainer style={styles.container}>
      <Header
        onPress={() => navigation.goBack()}
        rightView={
          <TouchableOpacity onPress={resetAll} activeOpacity={0.8}>
            <Text style={styles.resetText}>RESET</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.titleWrap}>
          <Text style={styles.pageTitle}>Filters</Text>
          <Text style={styles.pageSub}>
            Refine trainers by availability, experience, and ratings.
          </Text>
        </View>

        <Section
          title="Availability"
          right={
            <View style={styles.switchRight}>
              <Text style={styles.switchLabel}>Available today</Text>
              <Switch
                trackColor={{false: '#3A3A3A', true: '#18D200'}}
                thumbColor={'#f4f3f4'}
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
          }>
          <View style={styles.infoRow}>
            <View style={styles.greenDot} />
            <Text style={styles.infoText}>
              Show trainers who have open slots today.
            </Text>
          </View>
        </Section>

        <Section title="Sort Options">
          <FlatList
            data={sortOptions}
            renderItem={RenderedSortItems}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </Section>

        <Section title="Gender">
          <FlatList
            data={Genders}
            renderItem={RenderedGenders}
            keyExtractor={item => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </Section>

        <Section title="Work Experience (years)">
          <View style={styles.pillGrid}>
            <FlatList
              data={WorkExperinces}
              renderItem={RenderedWorkExperience}
              keyExtractor={item => item.id}
              numColumns={3}
              scrollEnabled={false}
              columnWrapperStyle={styles.pillRow}
            />
          </View>
        </Section>

        <Section
          title="Price Range"
          right={<Text style={styles.priceTag}>$10 - $87</Text>}>
          <Text style={styles.muted}>The average price is $45</Text>
          {/* Later you can add slider here */}
        </Section>

        <Section title="Star Rating">
          <View style={styles.ratingWrap}>
            {Ratings.map((r, i) => (
              <RenderedRatings key={r.id} item={r} index={i} />
            ))}
          </View>
          <Text style={[styles.muted, {marginTop: responsiveHeight(1.2)}]}>
            Select minimum star rating.
          </Text>
        </Section>

        <View style={{height: responsiveHeight(10)}} />
      </ScrollView>

      {/* Sticky bottom bar */}
      <View style={styles.bottomBar}>
        <Button
          onPress={handleApply}
          containerstyles={styles.applyBtn}
          text="Apply Filters"
        />
      </View>
    </WrapperContainer>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: '#121212', flex: 1},

  scrollContent: {
    paddingBottom: responsiveHeight(2),
  },

  titleWrap: {
    width: '88%',
    alignSelf: 'center',
    marginTop: responsiveHeight(1),
    marginBottom: responsiveHeight(1.5),
  },
  pageTitle: {
    color: '#fff',
    fontSize: responsiveFontSize(3.3),
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  pageSub: {
    color: '#9B9B9B',
    marginTop: responsiveHeight(0.7),
    lineHeight: responsiveHeight(2.4),
  },

  resetText: {
    color: '#A6A6A6',
    fontWeight: '600',
    letterSpacing: 0.3,
  },

  section: {
    width: '88%',
    alignSelf: 'center',
    marginTop: responsiveHeight(1.6),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: responsiveHeight(1),
  },
  sectionTitle: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontWeight: '600',
  },

  card: {
    backgroundColor: '#181818',
    borderRadius: responsiveWidth(4),
    paddingVertical: responsiveHeight(1.4),
    paddingHorizontal: responsiveWidth(4),
    borderWidth: 1,
    borderColor: '#242424',
  },

  separator: {
    height: 1,
    backgroundColor: '#242424',
    marginVertical: responsiveHeight(0.8),
  },

  rowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: responsiveHeight(0.8),
  },
  rowText: {
    color: '#EDEDED',
    fontSize: responsiveFontSize(1.75),
    maxWidth: '78%',
  },

  checkPill: {
    height: responsiveHeight(3.2),
    width: responsiveHeight(3.2),
    borderRadius: responsiveHeight(1.6),
    borderWidth: 1,
    borderColor: '#2E2E2E',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#141414',
  },
  checkPillActive: {
    backgroundColor: '#9FED3A',
    borderColor: '#9FED3A',
  },
  checkIcon: {
    height: responsiveHeight(2.1),
    width: responsiveHeight(2.1),
  },
  checkDot: {
    height: responsiveHeight(1.1),
    width: responsiveHeight(1.1),
    borderRadius: responsiveHeight(0.55),
    backgroundColor: '#2E2E2E',
  },

  switchRight: {flexDirection: 'row', alignItems: 'center', gap: 10},
  switchLabel: {color: '#CFCFCF'},

  infoRow: {flexDirection: 'row', alignItems: 'center'},
  greenDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#9FED3A',
    marginRight: 10,
  },
  infoText: {color: '#A6A6A6'},

  pillGrid: {paddingTop: responsiveHeight(0.5)},
  pillRow: {justifyContent: 'space-between'},
  pill: {
    flex: 1,
    marginBottom: responsiveHeight(1.2),
    marginRight: responsiveWidth(2),
    paddingVertical: responsiveHeight(1.2),
    borderRadius: responsiveWidth(3),
    borderWidth: 1,
    borderColor: '#2E2E2E',
    backgroundColor: '#141414',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: '#9FED3A',
    borderColor: '#9FED3A',
  },
  pillText: {color: '#BDBDBD', fontWeight: '600'},
  pillTextActive: {color: '#000'},

  priceTag: {
    color: '#9FED3A',
    fontWeight: '700',
  },
  muted: {color: '#9B9B9B'},

  ratingWrap: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#2E2E2E',
    borderRadius: responsiveWidth(4),
    overflow: 'hidden',
    backgroundColor: '#141414',
  },
  ratingSeg: {
    flex: 1,
    height: responsiveHeight(5),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#2E2E2E',
    gap: 6,
  },
  ratingLeft: {},
  ratingRight: {borderRightWidth: 0},
  ratingSegActive: {backgroundColor: '#9FED3A'},
  ratingText: {color: '#fff', fontWeight: '700'},
  ratingTextActive: {color: '#000'},
  ratingStar: {height: responsiveHeight(2.1), width: responsiveWidth(3.4)},

  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: responsiveWidth(6),
    paddingTop: responsiveHeight(1.2),
    paddingBottom: responsiveHeight(2.2),
    backgroundColor: 'rgba(18,18,18,0.96)',
    borderTopWidth: 1,
    borderTopColor: '#242424',
  },
  applyBtn: {alignSelf: 'center', width: '100%'},
});

export default Filter;
