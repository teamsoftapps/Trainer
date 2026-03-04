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

const PrivacyPolicy = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <Icon name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy Policy</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Text style={styles.text}>
                    This Privacy Policy describes how your personal information is collected, used, and shared when you use the Stern's Gym Trainers Connect app.
                </Text>

                <Text style={styles.sectionTitle}>1. Information We Collect</Text>
                <Text style={styles.text}>
                    We collect personal information you provide to us such as your name, email address, payment information, and physical measurements.
                </Text>

                <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
                <Text style={styles.text}>
                    We use your information to provide and improve our services, process payments, and communicate with you about your training.
                </Text>

                <Text style={styles.sectionTitle}>3. Sharing Your Information</Text>
                <Text style={styles.text}>
                    We may share your information with trainers you book with. We do not sell your personal information to third parties.
                </Text>

                <Text style={styles.sectionTitle}>4. Data Security</Text>
                <Text style={styles.text}>
                    We implement appropriate technical and organizational measures to protect your personal data against unauthorized access.
                </Text>

                <Text style={styles.sectionTitle}>5. Your Rights</Text>
                <Text style={styles.text}>
                    You have the right to access, correct, or delete your personal information. You can do this at any time through the settings in the app.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
};

export default PrivacyPolicy;

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
