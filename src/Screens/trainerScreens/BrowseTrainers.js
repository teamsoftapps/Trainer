import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
  TextInput,
} from 'react-native';
import {AirbnbRating} from 'react-native-ratings';
import {useNavigation, useRoute} from '@react-navigation/native';
import WrapperContainer from '../../Components/Wrapper';
import {Images} from '../../utils/Images';
import {useGetTrainersQuery} from '../../store/Apis/Post';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import axiosBaseURL from '../../services/AxiosBaseURL';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BrowseTrainers = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {data} = useGetTrainersQuery();
  const [trainerData, setTrainerData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [originalData, setOriginalData] = useState([]);
  const authData = useSelector(state => state?.Auth?.data);

  useEffect(() => {
    if (data?.data) {
      // Filter out current trainer
      const others = data.data.filter(t => t._id !== authData?._id);
      setTrainerData(others);
      setFilteredData(others);
      setOriginalData(others);
    }
  }, [data, authData?._id]);

  useEffect(() => {
    if (route.params?.filters) {
      applyFilters(route.params.filters);
    }
  }, [route.params?.filters]);

  const applyFilters = filters => {
    let filtered = [...originalData];
    if (filters.isAvailable)
      filtered = filtered.filter(t => t.isAvailable === true);
    if (filters.gender)
      filtered = filtered.filter(t => t.gender === filters.gender);
    if (filters.minRating > 0)
      filtered = filtered.filter(t => t.Rating >= filters.minRating);
    if (filters.experience !== 'Any')
      filtered = filtered.filter(t => t.experience === filters.experience);

    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'Price (lowest first)':
          filtered.sort((a, b) => Number(a.Hourlyrate) - Number(b.Hourlyrate));
          break;
        case 'Star Rating (highest first)':
          filtered.sort((a, b) => b.Rating - a.Rating);
          break;
      }
    }
    setFilteredData(filtered);
    setTrainerData(filtered); // keep it synced for text search
  };

  const handleSearch = text => {
    setSearchQuery(text);
    if (!text.trim()) {
      setFilteredData(trainerData);
    } else {
      const filtered = trainerData.filter(t =>
        t.fullName?.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredData(filtered);
    }
  };

  const renderTrainerCard = ({item}) => {
    const primarySpeciality = item.Speciality?.[0]?.value || 'Professional';

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('TrainerProfile', {data: item})}
        style={styles.card}>
        <Image source={{uri: item.profileImage}} style={styles.trainerImage} />
        <View style={styles.cardContent}>
          <View style={styles.headerRow}>
            <Text style={styles.trainerName} numberOfLines={1}>
              {item.fullName || 'Trainer'}
            </Text>
            <AirbnbRating
              count={5}
              defaultRating={Number(item.Rating) || 0}
              size={12}
              showRating={false}
              isDisabled
            />
          </View>
          <Text style={styles.specialityText} numberOfLines={1}>
            {primarySpeciality} • {item.experience || 'Exp. N/A'}
          </Text>
          <View style={styles.footerRow}>
            <View style={styles.priceContainer}>
              <MaterialCommunityIcons name="cash" size={18} color="#9FED3A" />
              <Text style={styles.priceText}>${item.Hourlyrate}/hr</Text>
            </View>
            <TouchableOpacity
              style={styles.contactBtn}
              onPress={async () => {
                try {
                  const res = await axiosBaseURL.post(
                    '/chat/create-conversation',
                    {
                      userId: authData?._id,
                      trainerId: item?._id,
                    },
                  );
                  if (res.data?.success) {
                    const conversation = res.data.conversation || res.data.data;
                    const convId = conversation?._id || conversation?.id;
                    navigation.navigate('ChatScreen', {
                      conversationId: convId,
                      otherUser: item,
                      myRole: 'user', // Initiator role
                    });
                  }
                } catch (err) {
                  console.log('Chat error:', err?.message);
                }
              }}>
              <Text style={styles.contactBtnText}>Contact</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <WrapperContainer style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.title}>Browse Trainers</Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Filter', {returnTo: 'BrowseTrainers'})
          }>
          <Ionicons name="filter" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          placeholder="Search by name..."
          placeholderTextColor="#999"
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={filteredData}
        renderItem={renderTrainerCard}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No trainers found</Text>
        }
      />
    </WrapperContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveHeight(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
    color: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    marginHorizontal: responsiveWidth(5),
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: responsiveHeight(2),
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: '#fff',
    marginLeft: 8,
  },
  listContent: {
    paddingHorizontal: responsiveWidth(5),
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    flexDirection: 'row',
    padding: 12,
  },
  trainerImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trainerName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  specialityText: {
    color: '#999',
    fontSize: 13,
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    color: '#9FED3A',
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 14,
  },
  contactBtn: {
    backgroundColor: '#9FED3A',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  contactBtnText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 12,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});

export default BrowseTrainers;
