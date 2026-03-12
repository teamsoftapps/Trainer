import {
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import WrapperContainer from '../../Components/Wrapper';
import Header from '../../Components/Header';
import {useNavigation} from '@react-navigation/native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Images} from '../../utils/Images';
import ButtonComp from '../../Components/ButtonComp';
import {useSelector, useDispatch} from 'react-redux';
import axiosBaseURL from '../../services/AxiosBaseURL';
import {updateLogin} from '../../store/Slices/AuthSlice';
import {showError, showSuccess} from '../../utils/helperFunction';

const ManagePlans = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userData = useSelector(state => state.Auth.data);
  const [isAccept, setIsAccept] = useState(false);
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      if (userData?.stripeCustomerID) {
        const res = await axiosBaseURL.post('/trainer/invoices', {
          stripeCustomerID: userData.stripeCustomerID,
        });
        if (res.data.status) {
          setInvoices(res.data.data);
        }
      }
    } catch (error) {
      console.log('Fetch Invoices Error:', error);
    }
  };

  const membership = userData?.membershipStatus || {
    membershipType: 'none',
    remainingDays: 0,
  };

  const planName =
    membership.membershipType === 'subscription'
      ? userData.subscription?.plan?.charAt(0).toUpperCase() +
        userData.subscription?.plan?.slice(1) +
        ' Plan'
      : membership.membershipType === 'trial'
      ? 'Free Trial'
      : 'No Active Plan';

  const planPrice =
    membership.membershipType === 'subscription'
      ? `$${userData.subscription?.price || '0.00'}`
      : '$0.00';

  const handleCancelPlan = async () => {
    try {
      setLoading(true);
      const res = await axiosBaseURL.post('/trainer/cancelSubscription', {
        email: userData.email,
      });
      if (res.data.status) {
        showSuccess(res.data.message);
        dispatch(updateLogin(res.data.data));
        setIsAccept(false);
        // Explicitly navigate to Subscription screen
        navigation.reset({
          index: 0,
          routes: [{name: 'Subscription'}],
        });
      }
    } catch (error) {
      console.log('Cancel Error:', error);
      showError(error?.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  return (
    <WrapperContainer>
      <ScrollView>
        <Header
          onPress={() => {
            navigation.goBack();
          }}
          rightView={
            <Image
              source={Images.logo}
              style={{height: responsiveHeight(5), width: responsiveWidth(10)}}
            />
          }
        />
        <Text
          style={{
            color: '#fff',
            fontSize: responsiveFontSize(3),
            marginHorizontal: responsiveWidth(8),
          }}>
          Manage Plans
        </Text>
        <View
          style={{
            flexDirection: 'column',
            backgroundColor: '#9FED3A',
            width: responsiveWidth(84),
            alignSelf: 'center',
            borderRadius: responsiveWidth(3),
            paddingHorizontal: responsiveWidth(4),
            paddingVertical: responsiveHeight(4),
            marginVertical: responsiveHeight(2),
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                style={{height: responsiveHeight(4), width: responsiveWidth(9)}}
                source={Images.crown}
              />
              <Text
                style={{
                  color: '#000',
                  fontSize: responsiveFontSize(2),
                  fontWeight: '700',
                  marginLeft: responsiveWidth(3),
                }}>
                {planName}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: '#000',
                  fontSize: responsiveFontSize(2),
                  fontWeight: '700',
                }}>
                {planPrice}
              </Text>
            </View>
          </View>
          <View>
            <Text
              style={{
                color: '#000',
                fontWeight: '500',
                marginTop: responsiveHeight(1.5),
              }}>
              {membership.membershipType === 'trial'
                ? `You are currently on a free trial with ${membership.remainingDays} days left.`
                : 'Includes unlimited session bookings, priority support, and more.'}
            </Text>
          </View>
        </View>
        <Text
          style={{
            color: '#fff',
            fontSize: responsiveFontSize(2.5),
            marginHorizontal: responsiveWidth(8),
            marginBottom: responsiveHeight(3),
          }}>
          Next Billing
        </Text>
        <View
          style={{
            flexDirection: 'column',
            backgroundColor: '#232323',
            width: responsiveWidth(84),
            alignSelf: 'center',
            borderRadius: responsiveWidth(3),
            paddingHorizontal: responsiveWidth(4),
            paddingVertical: responsiveHeight(4),
            marginBottom: responsiveHeight(2),
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{
                  borderColor: '#bbbbbb',
                  borderWidth: responsiveWidth(0.3),
                  padding: responsiveWidth(2),
                  borderRadius: responsiveWidth(10),
                  height: responsiveHeight(6),
                  width: responsiveWidth(12),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  tintColor={'#bbbbbb'}
                  source={Images.EmptyFile}
                  style={{
                    height: responsiveHeight(3),
                    width: responsiveWidth(5),
                  }}
                />
              </View>
              <View style={{marginLeft: responsiveWidth(5)}}>
                <Text
                  style={{color: '#fff', fontSize: responsiveFontSize(1.8)}}>
                  Active Subscription
                </Text>
                <Text
                  style={{color: '#bbbbbb', fontSize: responsiveFontSize(1.5)}}>
                  {membership.remainingDays} days remaining
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: responsiveHeight(3),
            }}>
            <ButtonComp
              text="Change Plan"
              onPress={() => navigation.navigate('Subscription')}
              mainStyle={{
                height: responsiveHeight(5.5),
                width: responsiveWidth(75),
              }}
            />
            <ButtonComp
              onPress={() => {
                if (membership.membershipType === 'subscription') {
                  setIsAccept(true);
                } else {
                  showError('No active subscription to cancel');
                }
              }}
              mainStyle={{
                height: responsiveHeight(5.5),
                width: responsiveWidth(75),
                marginTop: responsiveHeight(2),
                backgroundColor: '#232323',
                borderColor: 'red',
                borderWidth: responsiveWidth(0.3),
              }}
              textstyle={{color: 'red'}}
              text="Cancel Plan"
            />
          </View>
        </View>
        <Text
          style={{
            color: '#fff',
            fontSize: responsiveFontSize(2.5),
            marginHorizontal: responsiveWidth(8),
            marginBottom: responsiveHeight(2),
            marginTop: responsiveHeight(2),
          }}>
          Invoices
        </Text>
        {invoices.length > 0 ? (
          invoices.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                backgroundColor: '#232323',
                width: responsiveWidth(84),
                alignSelf: 'center',
                borderRadius: responsiveWidth(3),
                paddingHorizontal: responsiveWidth(4),
                paddingVertical: responsiveHeight(2),
                marginBottom: responsiveHeight(1.5),
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <View>
                <Text style={{color: '#fff', fontSize: responsiveFontSize(1.6)}}>
                  #{item.number}
                </Text>
                <Text
                  style={{color: '#bbbbbb', fontSize: responsiveFontSize(1.4)}}>
                  {new Date(item.created * 1000).toLocaleDateString()}
                </Text>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <Text
                  style={{
                    color: '#9FED3A',
                    fontSize: responsiveFontSize(1.8),
                    fontWeight: '700',
                  }}>
                  ${(item.total / 100).toFixed(2)}
                </Text>
                <TouchableOpacity
                  onPress={() => setSelectedInvoice(item)}>
                  <Text
                    style={{
                      color: '#bbbbbb',
                      fontSize: responsiveFontSize(1.4),
                      textDecorationLine: 'underline',
                    }}>
                    {item.type === 'invoice' ? 'View Details' : 'View Receipt'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text
            style={{
              color: '#bbbbbb',
              textAlign: 'center',
              marginVertical: responsiveHeight(2),
            }}>
            No invoices found.
          </Text>
        )}

        <Text
          style={{
            textAlign: 'center',
            width: responsiveWidth(70),
            alignSelf: 'center',
            color: '#bbbbbb',
            marginTop: responsiveHeight(2),
          }}>
          You can cancel your subscription anytime. Your current plan will
          remain active until the next billing cycle ends.
        </Text>
        <TouchableOpacity>
          <Text
            style={{
              color: '#9FED3A',
              alignSelf: 'center',
              marginVertical: responsiveHeight(3),
              textDecorationColor: '#9FED3A',
              textDecorationLine: 'underline',
            }}>
            Contact Support
          </Text>
        </TouchableOpacity>
        {isAccept && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={isAccept}
            onRequestClose={() => {
              setIsAccept(!isAccept);
            }}>
            <TouchableWithoutFeedback onPress={() => setIsAccept(false)}>
              <View style={styles.modalBackground}>
                <TouchableWithoutFeedback>
                  <View style={styles.modalContainer}>
                    <Image source={Images.checkbox} />
                    <Text
                      style={{
                        color: '#000',
                        fontWeight: '700',
                        fontSize: responsiveFontSize(2),
                        marginVertical: responsiveHeight(2),
                        textAlign: 'center',
                      }}>
                      Are you sure you want to cancel your subscription?
                    </Text>
                    <Text style={{color: '#000', textAlign: 'center'}}>
                      Canceling will end access after your current billing period.
                      You can still use your plan until it expires.
                    </Text>
                    <ButtonComp
                      onPress={handleCancelPlan}
                      btnLoading={loading}
                      mainStyle={{
                        width: responsiveWidth(70),
                        height: responsiveHeight(5),
                        backgroundColor: '#000',
                        marginTop: responsiveHeight(2),
                      }}
                      textstyle={{color: '#fff', fontWeight: 'lighter'}}
                      text="Yes, Cancel Plan"
                    />
                    <ButtonComp
                      onPress={() => {
                        setIsAccept(!isAccept);
                      }}
                      mainStyle={{
                        width: responsiveWidth(70),
                        height: responsiveHeight(5),
                        backgroundColor: '#fff',
                        marginTop: responsiveHeight(2),
                      }}
                      textstyle={{color: '#000', fontWeight: 'lighter'}}
                      text="No, Keep My Plan"
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
        {selectedInvoice && (
          <Modal
            animationType="fade"
            transparent={true}
            visible={!!selectedInvoice}
            onRequestClose={() => setSelectedInvoice(null)}>
            <TouchableWithoutFeedback onPress={() => setSelectedInvoice(null)}>
              <View style={styles.modalBackground}>
                <TouchableWithoutFeedback>
                  <View
                    style={[
                      styles.modalContainer,
                      {backgroundColor: '#fff', padding: 20},
                    ]}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                        marginBottom: 20,
                      }}>
                      <Image
                        source={Images.logo}
                        style={{height: 40, width: 40, tintColor: '#000'}}
                        resizeMode="contain"
                      />
                      <Text
                        style={{
                          color: '#000',
                          fontWeight: 'bold',
                          fontSize: 20,
                        }}>
                        RECEIPT
                      </Text>
                    </View>

                    <View
                      style={{
                        width: '100%',
                        borderBottomWidth: 1,
                        borderBottomColor: '#eee',
                        paddingBottom: 10,
                        marginBottom: 15,
                      }}>
                      <Text style={{color: '#666', fontSize: 12}}>
                        Transaction ID
                      </Text>
                      <Text style={{color: '#000', fontWeight: '600'}}>
                        {selectedInvoice.id}
                      </Text>
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: '100%',
                        marginBottom: 10,
                      }}>
                      <View>
                        <Text style={{color: '#666', fontSize: 12}}>Date</Text>
                        <Text style={{color: '#000', fontWeight: '600'}}>
                          {new Date(
                            selectedInvoice.created * 1000,
                          ).toLocaleDateString()}
                        </Text>
                      </View>
                      <View style={{alignItems: 'flex-end'}}>
                        <Text style={{color: '#666', fontSize: 12}}>
                          Status
                        </Text>
                        <Text
                          style={{
                            color:
                              selectedInvoice.status === 'succeeded' ||
                              selectedInvoice.status === 'paid'
                                ? 'green'
                                : '#f39c12',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                          }}>
                          {selectedInvoice.status}
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{
                        width: '100%',
                        backgroundColor: '#f9f9f9',
                        padding: 15,
                        borderRadius: 8,
                        marginVertical: 15,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginBottom: 5,
                        }}>
                        <Text style={{color: '#333'}}>Description</Text>
                        <Text style={{color: '#333', fontWeight: '600'}}>
                          {selectedInvoice.description || 'Stripe Payment'}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginTop: 10,
                          paddingTop: 10,
                          borderTopWidth: 1,
                          borderTopColor: '#eee',
                        }}>
                        <Text style={{color: '#000', fontWeight: 'bold'}}>
                          Total Amount
                        </Text>
                        <Text
                          style={{
                            color: '#000',
                            fontWeight: 'bold',
                            fontSize: 18,
                          }}>
                          ${(selectedInvoice.total / 100).toFixed(2)}{' '}
                          {selectedInvoice.currency || 'USD'}
                        </Text>
                      </View>
                    </View>

                    {selectedInvoice.download_url && (
                      <ButtonComp
                        onPress={() =>
                          Linking.openURL(selectedInvoice.download_url)
                        }
                        mainStyle={{
                          width: '100%',
                          height: 45,
                          backgroundColor: '#000',
                          marginTop: 10,
                        }}
                        text="Download PDF Receipt"
                      />
                    )}

                    <TouchableOpacity
                      onPress={() => setSelectedInvoice(null)}
                      style={{marginTop: 15, padding: 10}}>
                      <Text style={{color: '#666', fontWeight: '600'}}>
                        Close
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
      </ScrollView>
    </WrapperContainer>
  );
};

export default ManagePlans;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: responsiveWidth(80),
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveWidth(3),
    backgroundColor: '#9BE639',
    borderRadius: responsiveWidth(3),
    alignItems: 'center',
  },
});
