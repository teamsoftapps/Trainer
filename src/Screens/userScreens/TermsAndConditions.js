import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/Ionicons';

const TermsAndConditions = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <Icon name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Terms & Conditions</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.text}>
                    Welcome to Stern's Gym Trainers Connect. By using our application, you agree to comply with and be bound by the following terms and conditions of use.
                </Text>

                <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
                <Text style={styles.text}>
                    By accessing and using this app, you accept and agree to be bound by the terms and provision of this agreement.
                </Text>

                <Text style={styles.sectionTitle}>2. User Responsibilities</Text>
                <Text style={styles.text}>
                    Users are responsible for maintaining the confidentiality of their account and password and for restricting access to their mobile device.
                </Text>

                <Text style={styles.sectionTitle}>3. Training and Health</Text>
                <Text style={styles.text}>
                    You should consult with a physician before starting any exercise program. You agree that you are participating in training at your own risk.
                </Text>

                <Text style={styles.sectionTitle}>4. Payments and Cancellations</Text>
                <Text style={styles.text}>
                    Payment for sessions must be made through the app. Cancellations must be made at least 24 hours in advance to receive a refund.
                </Text>

                <Text style={styles.sectionTitle}>5. Modifications</Text>
                <Text style={styles.text}>
                    We reserve the right to change these terms at any time. Your continued use of the app signifies your acceptance of any updated terms.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
};

export default TermsAndConditions;

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
        fontSize: responsiveFontSize(2.5),
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    sectionTitle: {
        color: '#B2FF00',
        fontSize: responsiveFontSize(2.2),
        fontWeight: 'bold',
        marginTop: 25,
        marginBottom: 10,
    },
    text: {
        color: '#aaa',
        fontSize: responsiveFontSize(1.8),
        lineHeight: 24,
    }
});
