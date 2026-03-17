import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {FontFamily} from '../utils/Images';

const MembershipCountdown = ({membershipStatus, onPress}) => {
  if (!membershipStatus || membershipStatus.membershipType === 'none') {
    return null;
  }

  const {remainingDays, membershipType} = membershipStatus;
  const isTrial = membershipType === 'trial';
  const label = isTrial ? 'Free Trial' : 'Subscription';
  const message = `${remainingDays} ${
    remainingDays === 1 ? 'day' : 'days'
  } remaining in ${label}`;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={styles.container}>
      <View style={styles.content}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{isTrial ? 'Trial' : 'Active'}</Text>
        </View>
        <Text numberOfLines={2} style={styles.message}>
          {message}
        </Text>
      </View>
      <Text style={styles.actionText}>Renew ›</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#9FED3A',
    marginHorizontal: responsiveWidth(7),
    marginTop: responsiveHeight(1),
    paddingVertical: responsiveHeight(1.2),
    paddingHorizontal: responsiveWidth(4),
    borderRadius: responsiveWidth(2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  badge: {
    backgroundColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 10,
  },
  badgeText: {
    color: '#9FED3A',
    fontSize: 10,
    fontFamily: FontFamily.Extra_Bold,
    textTransform: 'uppercase',
  },
  message: {
    color: '#000',
    fontSize: responsiveFontSize(1.6),
    fontFamily: FontFamily.Semi_Bold,
    width: responsiveWidth(45),
  },
  actionText: {
    color: '#000',
    fontSize: responsiveFontSize(1.6),
    fontFamily: FontFamily.Bold,
  },
});

export default MembershipCountdown;
