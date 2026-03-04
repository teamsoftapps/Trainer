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
} from 'react-native';
import {
  responsiveFontSize,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import {useSelector} from 'react-redux';
import {ShopAPI} from '../../services/shopApi';

const OrderDetails = ({route, navigation}) => {
  const {order: initialOrder} = route.params;
  const [order, setOrder] = React.useState(initialOrder);
  const [refreshing, setRefreshing] = React.useState(false);
  const token = useSelector(state => state?.Auth?.data?.token);

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

  const getStatusColor = status => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return '#B2FF00';
      case 'pending':
        return '#FFA500';
      case 'shipped':
        return '#2196F3';
      case 'delivered':
        return '#4CAF50';
      case 'cancelled':
        return '#F44336';
      default:
        return '#fff';
    }
  };

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
              {order.payment?.paymentStatus || 'N/A'}
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
              ${(order.totalAmount / 100).toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>$0.00</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Grand Total</Text>
            <Text style={styles.grandTotal}>
              ${(order.totalAmount / 100).toFixed(2)}
            </Text>
          </View>
        </View>

        {order.payment?.paymentIntentId && (
          <TouchableOpacity
            style={styles.receiptButton}
            onPress={() =>
              Linking.openURL(
                `https://dashboard.stripe.com/payments/${order.payment.paymentIntentId}`,
              )
            }>
            <Text style={styles.receiptButtonText}>View Stripe Reference</Text>
            <Icon name="external-link-outline" size={18} color="#000" />
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
});
