import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import {baseUrl} from '../../services/Urls';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {addToCart} from '../../store/Slices/CartSlice';
import {showMessage} from 'react-native-flash-message';
import {responsiveScreenWidth} from 'react-native-responsive-dimensions';

const Store = ({navigation}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const totalQuantity = useSelector(state => state.cart.totalQuantity);

  // Fallback dummy products to show UI if backend fetch fails
  const dummyProducts = [
    {
      _id: '65e6d6b8b0e5d6a2a0000001',
      title: "Stern's Gym Classic Hoodie",
      description: 'Crafted for Champion Since 1946',
      fullDescription:
        "Step into a piece of history with the Stern's Gym Legendary Hoodie! Crafted for those who value quality and tradition, this hoodie showcases our iconic logo, a symbol of strength and dedication that has inspired fitness enthusiasts since 1946.",
      price: 89,
      mediaUrl: 'https://via.placeholder.com/150',
      benefits: 'Verified by Business',
    },
    {
      _id: '65e6d6b8b0e5d6a2a0000002',
      title: "Stern's Gym Bulldog Credo T-Shirt",
      description: '"Embrace the Spirit of Strength"',
      fullDescription:
        'Show off your gains in this premium bulldog credo t-shirt. Minimalist design but maximum impact. Made from high-quality cotton to keep you cool during intense sessions.',
      price: 39,
      mediaUrl: 'https://via.placeholder.com/150',
      benefits: 'Verified by Business',
    },
  ];

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/Common/GetProducts`);
      if (response.data.status) {
        setProducts(response.data.data);
      } else {
        setProducts(dummyProducts);
      }
    } catch (error) {
      console.log('Error fetching products:', error);
      setProducts(dummyProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToCart = item => {
    dispatch(addToCart(item));
    showMessage({
      message: 'Added to cart',
      type: 'success',
      backgroundColor: '#B2FF00',
      color: '#000',
    });
  };

  const renderProduct = ({item}) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetails', {product: item})}>
      <View style={styles.imageContainer}>
        <Image
          source={{uri: item.mediaUrl}}
          style={styles.productImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.productSubtitle} numberOfLines={1}>
          {item.description}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>${item.price}</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => handleAddToCart(item)}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
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
        <Text style={styles.headerTitle}>Shop</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Cart')}
          style={styles.iconButton}>
          <Icon name="cart-outline" size={28} color="#fff" />
          {totalQuantity > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{totalQuantity}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products"
          placeholderTextColor="#888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#b2ff00" />
        </View>
      ) : (
        <FlatList
          data={products.filter(p =>
            p.title.toLowerCase().includes(searchQuery.toLowerCase()),
          )}
          keyExtractor={item => item._id}
          numColumns={2}
          renderItem={renderProduct}
          contentContainerStyle={styles.listContainer}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default Store;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161616', // Using theme dark color from image
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333333',
    marginHorizontal: 20,
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: responsiveFontSize(1.8),
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#1E1E1E',
    borderRadius: 15,
    overflow: 'hidden',
    paddingBottom: 15,
  },
  imageContainer: {
    height: responsiveScreenHeight(18),
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    padding: 10,
  },
  productTitle: {
    color: '#fff',
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600',
    marginBottom: 5,
    minHeight: responsiveFontSize(4.5), // For 2 lines
  },
  productSubtitle: {
    color: '#888',
    fontSize: responsiveFontSize(1.4),
    marginBottom: 15,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productPrice: {
    color: '#fff',
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#B2FF00', // Neon green
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  addButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.6),
  },
  badge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: '#B2FF00',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
  },
});
