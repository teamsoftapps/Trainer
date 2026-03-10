import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveScreenWidth,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import {useSelector} from 'react-redux';
import {ShopAPI} from '../../services/shopApi';
import moment from 'moment';

const MyOrders = ({navigation}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const token = useSelector(state => state?.Auth?.data?.token);

  const fetchOrders = async () => {
    try {
      const res = await ShopAPI.getMyOrders(token);
      if (res.success) {
        setOrders(res.data);
      }
    } catch (error) {
      console.log('Error fetching orders:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
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

  const renderOrderItem = ({item}) => (
    <TouchableOpacity
      style={styles.orderCard}
      onPress={() => navigation.navigate('OrderDetails', {order: item})}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>
            Order #{item._id.slice(-6).toUpperCase()}
          </Text>
          <Text style={styles.orderDate}>
            {moment(item.createdAt).format('DD MMM YYYY, hh:mm A')}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            {borderColor: getStatusColor(item.status)},
          ]}>
          <Text
            style={[styles.statusText, {color: getStatusColor(item.status)}]}>
            {item.status?.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.itemsContainer}>
        {item.items.map((subItem, index) => (
          <View key={index} style={styles.subItem}>
            <Image
              source={{
                uri:
                  subItem.productId?.mediaUrl ||
                  'https://via.placeholder.com/150',
              }}
              style={styles.itemThumb}
            />
            <View style={styles.itemDetails}>
              <Text style={styles.itemTitle} numberOfLines={1}>
                {subItem.productId?.title || 'Unknown Product'}
              </Text>
              <Text style={styles.itemMeta}>
                Qty: {subItem.quantity} • ${subItem.price}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.totalLabel}>Total Amount</Text>
        <Text style={styles.totalValue}>${item.totalAmount?.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}>
          <Icon name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{width: 28}} />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#B2FF00" />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item._id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#B2FF00"
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="receipt-outline" size={80} color="#333" />
              <Text style={styles.emptyText}>No orders found yet</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default MyOrders;

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
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  orderCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 12,
    marginBottom: 12,
  },
  orderId: {
    color: '#fff',
    fontSize: responsiveFontSize(2),
    fontWeight: 'bold',
    marginBottom: 4,
  },
  orderDate: {
    color: '#888',
    fontSize: 12,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  itemsContainer: {
    marginBottom: 10,
  },
  subItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemThumb: {
    width: 40,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#333',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  itemMeta: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingTop: 12,
    marginTop: 5,
  },
  totalLabel: {
    color: '#888',
    fontSize: 14,
  },
  totalValue: {
    color: '#B2FF00',
    fontSize: 18,
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: '#888',
    fontSize: 18,
    marginTop: 20,
  },
});
