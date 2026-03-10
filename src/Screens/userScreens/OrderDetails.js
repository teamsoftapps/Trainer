import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {useSelector} from 'react-redux';
import {ShopAPI} from '../../services/shopApi';
import {useStripe} from '@stripe/stripe-react-native';
import {showMessage} from 'react-native-flash-message';

const OrderDetails = ({route, navigation}) => {
  const {order: initialOrder} = route.params;
  const [order, setOrder] = React.useState(initialOrder);
  const [refreshing, setRefreshing] = React.useState(false);
  const [isPaying, setIsPaying] = React.useState(false);
  const [isCancelling, setIsCancelling] = React.useState(false);
  const token = useSelector(state => state?.Auth?.data?.token);
  const {initPaymentSheet, presentPaymentSheet} = useStripe();

  const fetchOrderDetails = async () => {
    try {
      setRefreshing(true);
      const res = await ShopAPI.getMyOrders(token);
      if (res.success) {
        const updatedOrder = res.data.find(o => o._id === order._id);
        if (updatedOrder) {
          setOrder(updatedOrder);
        }
      }
    } catch (error) {
      console.log('Error refreshing order details:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handlePayNow = async () => {
    try {
      setIsPaying(true);
      const intentRes = await ShopAPI.payForOrder(token, order._id);
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
        if (presentError.code !== 'Canceled') {
          showMessage({message: presentError.message, type: 'danger'});
        }
        return;
      }

      showMessage({
        message: 'Payment successful!',
        type: 'success',
        backgroundColor: '#B2FF00',
        color: '#000',
      });
      fetchOrderDetails();
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

  const handleCancelOrder = () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order? This action cannot be undone.',
      [
        {text: 'No', style: 'cancel'},
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsCancelling(true);
              const res = await ShopAPI.cancelOrder(token, order._id);
              if (res.success) {
                showMessage({
                  message: 'Order cancelled successfully',
                  type: 'success',
                  backgroundColor: '#B2FF00',
                  color: '#000',
                });
                fetchOrderDetails();
              } else {
                showMessage({
                  message: res.message || 'Failed to cancel order',
                  type: 'danger',
                });
              }
            } catch (error) {
              console.log('Cancel order error:', error);
              showMessage({
                message: error.message || 'Something went wrong',
                type: 'danger',
              });
            } finally {
              setIsCancelling(false);
            }
          },
        },
      ],
    );
  };

  const getStatusColor = status => {
    switch (status?.toLowerCase()) {
      case 'succeeded':
      case 'paid':
        return '#B2FF00';
      case 'received':
        return '#9C27B0';
      case 'pending':
        return '#FFA500';
      case 'shipped':
        return '#2196F3';
      case 'delivered':
        return '#4CAF50';
      case 'failed':
      case 'cancelled':
        return '#F44336';
      default:
        return '#fff';
    }
  };

  const isPaymentPending =
    !['succeeded', 'paid'].includes(
      order.payment?.paymentStatus?.toLowerCase(),
    ) && order.status !== 'cancelled';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}>
          <Icon name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <TouchableOpacity
          onPress={fetchOrderDetails}
          style={styles.iconButton}
          disabled={refreshing}>
          {refreshing ? (
            <ActivityIndicator size="small" color="#B2FF00" />
          ) : (
            <Icon name="refresh" size={24} color="#B2FF00" />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.statusSection}>
          <Text style={styles.statusLabel}>Order Status</Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: getStatusColor(order.status) + '20',
                borderColor: getStatusColor(order.status),
              },
            ]}>
            <Text
              style={[
                styles.statusText,
                {color: getStatusColor(order.status)},
              ]}>
              {order.status?.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order Info</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Order ID</Text>
            <Text style={styles.infoValue}>#{order._id.toUpperCase()}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>
              {moment(order.createdAt).format('DD MMM YYYY, hh:mm A')}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Payment Status</Text>
            <Text
              style={[
                styles.infoValue,
                {color: getStatusColor(order.payment?.paymentStatus)},
              ]}>
              {order.payment?.paymentStatus?.toUpperCase() || 'N/A'}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Delivery Address</Text>
          <View style={styles.addressContainer}>
            <Icon name="location-outline" size={20} color="#B2FF00" />
            <Text style={styles.addressText}>
              {order.deliveryAddress || 'No address provided'}
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Items</Text>
          {order.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Image
                source={{
                  uri:
                    item.productId?.mediaUrl ||
                    'https://via.placeholder.com/150',
                }}
                style={styles.itemImage}
              />
              <View style={styles.itemInfo}>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {item.productId?.title || 'Unknown Product'}
                </Text>
                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>${item.price}</Text>
            </View>
          ))}
        </View>

        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              ${order.totalAmount?.toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>$0.00</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.grandTotal}>
              ${order.totalAmount?.toFixed(2)}
            </Text>
          </View>
        </View>

        {isPaymentPending && (
          <TouchableOpacity
            style={[styles.payNowButton, isPaying && {opacity: 0.7}]}
            onPress={handlePayNow}
            disabled={isPaying}>
            {isPaying ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <>
                <Icon name="card-outline" size={22} color="#000" />
                <Text style={styles.payNowText}>Pay Now</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {['pending', 'paid', 'received'].includes(
          order.status?.toLowerCase(),
        ) && (
          <TouchableOpacity
            style={[styles.cancelButton, isCancelling && {opacity: 0.7}]}
            onPress={handleCancelOrder}
            disabled={isCancelling}>
            {isCancelling ? (
              <ActivityIndicator size="small" color="#F44336" />
            ) : (
              <>
                <Icon name="close-circle-outline" size={22} color="#F44336" />
                <Text style={styles.cancelButtonText}>Cancel Order</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderDetails;

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
  iconButton: {
    padding: 5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: responsiveFontSize(2.8),
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  statusSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  statusLabel: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardTitle: {
    color: '#888',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  infoLabel: {
    color: '#aaa',
    fontSize: 14,
  },
  infoValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressText: {
    color: '#fff',
    fontSize: 15,
    marginLeft: 10,
    flex: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#333',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  itemQuantity: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
  itemPrice: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  summaryCard: {
    marginTop: 10,
    paddingHorizontal: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    color: '#888',
    fontSize: 15,
  },
  summaryValue: {
    color: '#fff',
    fontSize: 15,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 15,
    marginTop: 5,
  },
  totalLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  grandTotal: {
    color: '#B2FF00',
    fontSize: 22,
    fontWeight: 'bold',
  },
  receiptButton: {
    backgroundColor: '#B2FF00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 30,
  },
  receiptButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  payNowButton: {
    backgroundColor: '#B2FF00',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 30,
    marginTop: 25,
    gap: 10,
  },
  payNowText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 30,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#F44336',
    gap: 10,
  },
  cancelButtonText: {
    color: '#F44336',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
