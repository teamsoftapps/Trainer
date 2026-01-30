import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState} from 'react';
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

const ManagePlans = () => {
  const navigation = useNavigation();
  const [isAccept, setIsAccept] = useState(false);
  const [status, setStatus] = useState('Pending');
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
                Weekly Plan
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: '#000',
                  fontSize: responsiveFontSize(2),
                  fontWeight: '700',
                }}>
                $9.99
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
              Includes unlimited session bookings. priority support, and more.
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
          Invoice
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
                  01-Invoice-2024
                </Text>
                <Text
                  style={{color: '#bbbbbb', fontSize: responsiveFontSize(1.5)}}>
                  10 october 2024
                </Text>
              </View>
            </View>
            <TouchableOpacity>
              <Image
                source={Images.downloadIcon}
                tintColor={'#9FED3A'}
                style={{height: responsiveHeight(3), width: responsiveWidth(3)}}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: responsiveHeight(3),
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
                  01-Invoice-2024
                </Text>
                <Text
                  style={{color: '#bbbbbb', fontSize: responsiveFontSize(1.5)}}>
                  10 october 2024
                </Text>
              </View>
            </View>
            <TouchableOpacity>
              <Image
                source={Images.downloadIcon}
                tintColor={'#9FED3A'}
                style={{height: responsiveHeight(3), width: responsiveWidth(3)}}
              />
            </TouchableOpacity>
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
                  01-Invoice-2024
                </Text>
                <Text
                  style={{color: '#bbbbbb', fontSize: responsiveFontSize(1.5)}}>
                  10 october 2024
                </Text>
              </View>
            </View>
            <TouchableOpacity>
              <Image
                source={Images.downloadIcon}
                tintColor={'#9FED3A'}
                style={{height: responsiveHeight(3), width: responsiveWidth(3)}}
              />
            </TouchableOpacity>
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
              mainStyle={{
                height: responsiveHeight(5.5),
                width: responsiveWidth(75),
              }}
            />
            <ButtonComp
              onPress={() => {
                setIsAccept(true);
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
            textAlign: 'center',
            width: responsiveWidth(70),
            alignSelf: 'center',
            color: '#bbbbbb',
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
                      Canceling will end access on 17 October 2023. You can
                      still use your plan until then.
                    </Text>
                    <ButtonComp
                      onPress={() => {
                        setStatus('Confirmed');
                        setIsAccept(false);
                      }}
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
