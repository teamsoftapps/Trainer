import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {DrawerContentScrollView} from '@react-navigation/drawer';
import {useSelector} from 'react-redux';
import {
  responsiveScreenHeight,
  responsiveScreenWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';

// Since the user image has custom icons, let's map them to react-native-vector-icons or use simple views.
// I will use Ionicons, FontAwesome etc., but for premium feel let's assume we import from react-native-vector-icons
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomDrawer = props => {
  const userData = useSelector(state => state?.Auth?.data);

  const navigateTo = screen => {
    props.navigation.navigate(screen);
  };

  const DrawerItem = ({iconName, iconType, label, onPress, isDanger}) => {
    return (
      <TouchableOpacity style={styles.drawerItem} onPress={onPress}>
        <View style={styles.iconContainer}>
          {iconType === 'Ionicon' && (
            <Icon
              name={iconName}
              size={24}
              color={isDanger ? '#ff4d4d' : '#fff'}
            />
          )}
          {iconType === 'Material' && (
            <MaterialIcons
              name={iconName}
              size={24}
              color={isDanger ? '#ff4d4d' : '#fff'}
            />
          )}
          {iconType === 'MaterialCommunity' && (
            <MaterialCommunity
              name={iconName}
              size={24}
              color={isDanger ? '#ff4d4d' : '#fff'}
            />
          )}
        </View>
        <Text style={[styles.drawerText, isDanger && styles.dangerText]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => props.navigation.closeDrawer()}>
          <Icon name="close" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.profileSection}>
          <Image
            source={{
              uri: userData?.profileImage || 'https://via.placeholder.com/150',
            }}
            style={styles.profileImage}
          />
          <Text style={styles.nameText}>
            {userData?.firstName} {userData?.lastName}
          </Text>
          <Text style={styles.emailText}>{userData?.email}</Text>
        </View>
      </View>

      <DrawerContentScrollView
        {...props}
        style={styles.scrollContainer}
        contentContainerStyle={{paddingTop: 0}}>
        <View style={styles.menuItems}>
          <DrawerItem
            iconType="Ionicon"
            iconName="home"
            label="Home"
            onPress={() => navigateTo('Home')}
          />
          <DrawerItem
            iconType="Ionicon"
            iconName="settings"
            label="Account Settings"
            onPress={() => navigateTo('Settings')}
          />
          <DrawerItem
            iconType="Ionicon"
            iconName="cart"
            label="Store"
            onPress={() => navigateTo('Store')}
          />
          <DrawerItem
            iconType="Ionicon"
            iconName="receipt"
            label="My Orders"
            onPress={() => navigateTo('MyOrders')}
          />
          <DrawerItem
            iconType="Ionicon"
            iconName="people"
            label="Forum"
            onPress={() => navigateTo('Forum')}
          />
          <DrawerItem
            iconType="Ionicon"
            iconName="barbell"
            label="Exercise Log"
            onPress={() => navigateTo('ExerciseLog')}
          />
          <DrawerItem
            iconType="Ionicon"
            iconName="heart"
            label="Favorites"
            onPress={() => navigateTo('Favourites')}
          />
          <DrawerItem
            iconType="MaterialCommunity"
            iconName="forum"
            label="FAQ"
            onPress={() => navigateTo('FAQs')}
          />
          <DrawerItem
            iconType="Ionicon"
            iconName="ban"
            label="Blocked Users"
            onPress={() => navigateTo('BlockedUsers')}
          />
          <DrawerItem
            iconType="Ionicon"
            iconName="options"
            label="Terms & Condition"
            onPress={() => navigateTo('TermsAndConditions')}
          />
          <DrawerItem
            iconType="Ionicon"
            iconName="shield-checkmark"
            label="Privacy Policy"
            onPress={() => navigateTo('PrivacyPolicy')}
          />
          <DrawerItem
            iconType="Ionicon"
            iconName="trash"
            label="Delete Account"
            isDanger={true}
            onPress={() => navigateTo('Settings')}
          />
        </View>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1E1E', // Dark premium background
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
    borderBottomWidth: 0,
  },
  closeButton: {
    alignSelf: 'flex-end',
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#b2ff00', // Neon green border for premium feel
    marginBottom: 10,
  },
  nameText: {
    color: '#fff',
    fontSize: responsiveFontSize(2.2),
    fontWeight: 'bold',
  },
  emailText: {
    color: '#aaa',
    fontSize: responsiveFontSize(1.6),
    marginTop: 5,
  },
  menuItems: {
    paddingHorizontal: 20,
    marginTop: 10,
    paddingBottom: 20,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  iconContainer: {
    width: 30,
    alignItems: 'center',
    marginRight: 15,
  },
  drawerText: {
    color: '#fff',
    fontSize: responsiveFontSize(1.8),
    fontWeight: '500',
  },
  dangerText: {
    color: '#ff4d4d',
  },
});
