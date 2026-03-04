import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Modal,
  TextInput,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveScreenHeight,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';
import {
  addToCart,
  removeFromCart,
  removeItemCompletely,
  clearCart,
} from '../../store/Slices/CartSlice';
import {useStripe} from '@stripe/stripe-react-native';
import {ShopAPI} from '../../services/shopApi';
import {showMessage} from 'react-native-flash-message';

const Cart = ({navigation}) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const totalAmount = useSelector(state => state.cart.totalAmount);
  const totalQuantity = useSelector(state => state.cart.totalQuantity);
  const token = useSelector(state => state?.Auth?.data?.token);
  console.log('Token in cart:', token);
  console.log('Cart items:', cartItems);
  console.log('Total amount:', totalAmount);
  console.log('Total quantity:', totalQuantity);
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const [isPaying, setIsPaying] = React.useState(false);
  const [address, setAddress] = React.useState('');
  const [addressModalVisible, setAddressModalVisible] = React.useState(false);
  const [tempAddress, setTempAddress] = React.useState('');

  const handleRemoveItem = id => {
    dispatch(removeItemCompletely(id));
  };

  const payForOrder = async () => {
    if (cartItems.length === 0) return;

    try {
      setIsPaying(true);
      const payload = {
        items: cartItems.map(item => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: totalAmount,
        deliveryAddress: address,
      };

      if (!address) {
        showMessage({
          message: 'Please select or enter a delivery address',
          type: 'warning',
        });
        setAddressModalVisible(true);
        return;
      }

      const intentRes = await ShopAPI.createStripeIntent(token, payload);
      if (!intentRes?.success) {
        showMessage({
          message: intentRes?.message || 'Payment intent failed',
          type: 'danger',
        });
        return;
      }

      const {paymentIntent, ephemeralKey, customer} = intentRes.data;

      const {error: initError} = await initPaymentSheet({
        merchantDisplayName: 'Trainer App Shop',
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: false,
      });

      if (initError) {
        showMessage({message: initError.message, type: 'danger'});
        return;
      }

      const {error: presentError} = await presentPaymentSheet();
      if (presentError) {
        if (presentError.code === 'Canceled') {
          // User cancelled - normal behavior
        } else {
          showMessage({message: presentError.message, type: 'danger'});
        }
        return;
      }

      // Success!
      dispatch(clearCart());
      showMessage({
        message: 'Order placed successfully!',
        type: 'success',
        backgroundColor: '#B2FF00',
        color: '#000',
      });
      navigation.goBack();
    } catch (error) {
      console.log('Payment error:', error);
      showMessage({
        message: error.message || 'Something went wrong',
        type: 'danger',
      });
    } finally {
      setIsPaying(false);
    }
  };

  const renderCartItem = ({item}) => (
    <View style={styles.cartItem}>
      <Image source={{uri: item.mediaUrl}} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <TouchableOpacity onPress={() => handleRemoveItem(item._id)}>
            <Icon name="close" size={20} color="#888" />
          </TouchableOpacity>
        </View>
        <Text style={styles.itemSubtitle} numberOfLines={1}>
          {item.description}
        </Text>
        <View style={styles.itemFooter}>
          <Text style={styles.itemPrice}>${item.price}</Text>

          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => dispatch(removeItemCompletely(item._id))}>
              <Icon name="trash-outline" size={16} color="#B2FF00" />
            </TouchableOpacity>

            <View style={styles.quantityControls}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => dispatch(removeFromCart(item._id))}>
                <Icon name="remove" size={18} color="#fff" />
              </TouchableOpacity>

              <Text style={styles.quantityText}>{item.quantity}</Text>

              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => dispatch(addToCart(item))}>
                <Icon name="add" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}>
          <Icon name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart</Text>
        <TouchableOpacity
          onPress={() => {
            dispatch(clearCart());
            showMessage({message: 'Cart cleared', type: 'info'});
          }}
          style={styles.iconButton}>
          <Icon name="trash-outline" size={24} color="#B2FF00" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.addressBox}
          onPress={() => {
            setTempAddress(address);
            setAddressModalVisible(true);
          }}>
          <Icon name="location-outline" size={24} color="#B2FF00" />
          <View style={{flex: 1, marginLeft: 15}}>
            <Text style={styles.addressLabel}>Delivery Address</Text>
            <Text style={styles.addressValue} numberOfLines={1}>
              {address || 'Enter delivery address'}
            </Text>
          </View>
          <Icon name="chevron-forward" size={24} color="#888" />
        </TouchableOpacity>

        <Modal
          visible={addressModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setAddressModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Delivery Address</Text>
              <TextInput
                style={styles.addressInput}
                placeholder="Enter your full address"
                placeholderTextColor="#666"
                value={tempAddress}
                onChangeText={setTempAddress}
                multiline
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setAddressModalVisible(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={() => {
                    setAddress(tempAddress);
                    setAddressModalVisible(false);
                  }}>
                  <Text style={styles.saveButtonText}>Save Address</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Text style={styles.sectionTitle}>Order Details</Text>

        <FlatList
          data={cartItems}
          keyExtractor={item => item._id}
          renderItem={renderCartItem}
          scrollEnabled={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Your cart is empty</Text>
          }
        />

        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Item</Text>
            <Text style={styles.summaryValue}>{totalQuantity}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>$0</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Discount</Text>
            <Text style={styles.summaryValue}>$0</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Payment</Text>
            <Text style={styles.totalValue}>${totalAmount.toFixed(1)}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Payment Method</Text>
        <TouchableOpacity style={styles.paymentSelector} onPress={payForOrder}>
          <Text style={styles.paymentText}>Select payment method</Text>
          <Icon name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.nextButton,
            (cartItems.length === 0 || isPaying) && styles.disabledButton,
          ]}
          disabled={cartItems.length === 0 || isPaying}
          onPress={payForOrder}>
          <Text style={styles.nextButtonText}>
            {isPaying ? 'Processing...' : 'Next'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Cart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161616',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    color: '#fff',
    fontSize: responsiveFontSize(2.8),
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    padding: 15,
    borderRadius: 12,
    marginBottom: 30,
  },
  addressText: {
    color: '#fff',
    flex: 1,
    marginLeft: 15,
    fontSize: responsiveFontSize(2),
  },
  addressLabel: {
    color: '#888',
    fontSize: 12,
  },
  addressValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  addressInput: {
    backgroundColor: '#333',
    borderRadius: 12,
    color: '#fff',
    padding: 15,
    height: 100,
    textAlignVertical: 'top',
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#888',
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#B2FF00',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#333',
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTitle: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    flex: 1,
  },
  itemSubtitle: {
    color: '#aaa',
    fontSize: responsiveFontSize(1.6),
    marginVertical: 4,
  },
  itemPrice: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
  },
  summaryContainer: {
    marginTop: 20,
    marginBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    color: '#888',
    fontSize: responsiveFontSize(1.8),
  },
  summaryValue: {
    color: '#fff',
    fontSize: responsiveFontSize(1.8),
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  totalLabel: {
    color: '#888',
    fontSize: responsiveFontSize(2),
  },
  totalValue: {
    color: '#fff',
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
  },
  paymentSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  paymentText: {
    color: '#888',
    fontSize: responsiveFontSize(1.8),
  },
  nextButton: {
    backgroundColor: '#ccc',
    height: 55,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  disabledButton: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: '#000',
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 20,
    fontSize: responsiveFontSize(2),
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    marginRight: 15,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#444',
    paddingHorizontal: 8,
  },
  controlButton: {
    padding: 5,
  },
  quantityText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 12,
  },
});
