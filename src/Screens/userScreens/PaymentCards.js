import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import WrapperContainer from '../../Components/Wrapper';
import Header from '../../Components/Header';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import axiosBaseURL from '../../services/AxiosBaseURL';
import {useSelector} from 'react-redux';
import {showMessage} from 'react-native-flash-message';
const PaymentCards = () => {
  const navigation = useNavigation();
  const authData = useSelector(state => state.Auth.data);

  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);

  useFocusEffect(
    useCallback(() => {
      fetchCards();
    }, []),
  );
  const fetchCards = async () => {
    try {
      const response = await axiosBaseURL.post('/common/GetStripeCards', {
        customerId: authData?.stripeCustomerID,
      });

      setCards(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const removeCard = async paymentId => {
    if (!paymentId) {
      showMessage({
        message: 'Failed, Payment ID is missing',
        type: 'warning',
      });
      return;
    }

    try {
      await axiosBaseURL.delete(`/common/RemoveStripeCard/${paymentId}`);

      // Remove locally
      setCards(prev => prev.filter(card => card.id !== paymentId));

      if (selectedCard === paymentId) {
        setSelectedCard(null);
      }

      showMessage({
        message: 'Card removed successfully',
        type: 'success',
      });
    } catch (error) {
      console.log(error);

      showMessage({
        message: 'Failed to remove card',
        description: error?.response?.data?.error || 'Something went wrong',
        type: 'danger',
      });
    }
  };

  const renderCard = ({item}) => {
    return (
      <TouchableOpacity
        style={[
          styles.cardRow,
          selectedCard === item.id && styles.selectedCard,
        ]}
        onPress={() => {
          navigation.navigate({
            name: 'ReviewBooking',
            params: {selectedCard: item},
            merge: true,
          });
        }}
        activeOpacity={0.9}>
        <View style={styles.leftRow}>
          <View style={{marginLeft: responsiveWidth(3)}}>
            <Text style={styles.cardHolder}>
              {item.billing_details?.name || 'Card Holder'}
            </Text>

            <Text style={styles.cardText}>
              **** **** **** {item.card.last4}
            </Text>

            <Text style={styles.cardSub}>
              Expires {item.card.exp_month}/{item.card.exp_year}
            </Text>
          </View>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {selectedCard === item.id && (
            <Icon
              name="checkmark-circle"
              size={22}
              color="#9FED3A"
              style={{marginRight: responsiveWidth(3)}}
            />
          )}

          {/* 🗑 Delete Icon */}
          <TouchableOpacity
            onPress={() => {
              setCardToDelete(item.id);
              setConfirmVisible(true);
            }}>
            <Icon name="trash-outline" size={20} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <WrapperContainer>
      <Header onPress={() => navigation.goBack()} />

      <Text style={styles.title}>Payment Method</Text>

      <FlatList
        data={cards}
        keyExtractor={item => item.id}
        renderItem={renderCard}
        contentContainerStyle={{paddingBottom: 30}}
      />

      {/* Add New Card */}
      <TouchableOpacity
        style={styles.addCardRow}
        onPress={() => navigation.navigate('AddCard')}>
        <View style={styles.leftRow}>
          <Icon name="add-circle-outline" size={22} color="white" />
          <Text style={styles.addText}>Add New Card</Text>
        </View>
        <Icon name="chevron-forward" size={20} color="#888" />
      </TouchableOpacity>
      <Modal transparent visible={confirmVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Icon name="alert-circle" size={50} color="#9FED3A" />

            <Text style={styles.modalTitle}>Remove Card?</Text>

            <Text style={styles.modalSub}>
              Are you sure you want to remove this card?
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setConfirmVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => {
                  setConfirmVisible(false);
                  removeCard(cardToDelete);
                }}>
                <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </WrapperContainer>
  );
};

export default PaymentCards;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    width: '80%',
    backgroundColor: '#111',
    borderRadius: 30,
    paddingVertical: responsiveHeight(4),
    paddingHorizontal: responsiveWidth(6),
    alignItems: 'center',
  },

  modalTitle: {
    color: 'white',
    fontSize: responsiveFontSize(2.5),
    fontWeight: 'bold',
    marginTop: responsiveHeight(2),
  },

  modalSub: {
    color: '#aaa',
    textAlign: 'center',
    marginTop: responsiveHeight(1),
    fontSize: responsiveFontSize(1.8),
  },

  modalButtons: {
    flexDirection: 'row',
    marginTop: responsiveHeight(3),
    gap: responsiveWidth(4),
  },

  cancelBtn: {
    backgroundColor: '#1C1C1E',
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(6),
    borderRadius: 50,
  },

  removeBtn: {
    backgroundColor: '#9FED3A',
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(6),
    borderRadius: 50,
  },

  cancelText: {
    color: 'white',
    fontSize: responsiveFontSize(1.9),
  },

  removeText: {
    color: 'black',
    fontSize: responsiveFontSize(1.9),
    fontWeight: '600',
  },

  title: {
    color: 'white',
    fontSize: responsiveFontSize(3),
    fontWeight: 'bold',
    paddingHorizontal: responsiveWidth(8),
    marginTop: responsiveHeight(2),
  },
  cardHolder: {
    color: 'white',
    fontSize: responsiveFontSize(2.1),
    fontWeight: '600',
    marginBottom: responsiveHeight(0.5),
  },
  cardRow: {
    marginHorizontal: responsiveWidth(6),
    marginTop: responsiveHeight(2),
    backgroundColor: '#1C1C1E',
    borderRadius: 18,
    padding: responsiveHeight(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  selectedCard: {
    borderWidth: 1,
    borderColor: '#9FED3A',
  },

  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  cardText: {
    color: 'white',
    fontSize: responsiveFontSize(2.2),
    fontWeight: '600',
  },

  cardSub: {
    color: '#888',
    fontSize: responsiveFontSize(1.6),
  },

  addCardRow: {
    marginHorizontal: responsiveWidth(6),
    marginTop: responsiveHeight(3),
    backgroundColor: '#2A2A2A',
    borderRadius: 18,
    padding: responsiveHeight(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  addText: {
    color: 'white',
    fontSize: responsiveFontSize(2.1),
    marginLeft: responsiveWidth(3),
  },
});
