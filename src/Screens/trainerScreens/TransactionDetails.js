import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';

const TransactionDetails = ({ route }) => {
    const { transaction } = route.params;
    const navigation = useNavigation();

    const user = transaction?.userId || {};
    const amount = transaction?.amount ? (transaction.amount / 100).toFixed(2) : '0.00';
    const transactionDate = transaction?.updatedAt ? new Date(transaction.updatedAt) : new Date();

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon name="chevron-back" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Transaction Details</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Amount Card */}
                <View style={styles.amountCard}>
                    <Text style={styles.amountLabel}>Total Amount</Text>
                    <Text style={styles.amountValue}>${amount}</Text>
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>COMPLETED</Text>
                    </View>
                </View>

                {/* User Info */}
                <Text style={styles.sectionTitle}>Client Information</Text>
                <View style={styles.infoCard}>
                    <Image
                        source={{ uri: user?.profileImage || 'https://i.pravatar.cc/150?img=11' }}
                        style={styles.userImage}
                    />
                    <View style={styles.userDetails}>
                        <Text style={styles.userName}>{user?.fullName || 'Unknown User'}</Text>
                        {user?.email && <Text style={styles.userEmail}>{user.email}</Text>}
                    </View>
                </View>

                {/* Transaction Info */}
                <Text style={styles.sectionTitle}>Details</Text>
                <View style={styles.detailsCard}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Date</Text>
                        <Text style={styles.detailValue}>{transactionDate.toLocaleDateString()}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Time</Text>
                        <Text style={styles.detailValue}>{transactionDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    </View>

                    {transaction?.Date && (
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Session Date</Text>
                            <Text style={styles.detailValue}>{transaction.Date}</Text>
                        </View>
                    )}

                    {transaction?.bookingTime && (
                        <View style={styles.detailRow}>
                            <Text style={styles.detailLabel}>Session Time</Text>
                            <Text style={styles.detailValue}>{transaction.bookingTime}</Text>
                        </View>
                    )}

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Transaction ID</Text>
                        <Text style={styles.detailValue}>{transaction?._id || 'N/A'}</Text>
                    </View>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Payment Method</Text>
                        <Text style={styles.detailValue}>Card</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default TransactionDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0b0b0b',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a1a',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    backBtn: {
        padding: 5,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    amountCard: {
        backgroundColor: '#151515',
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#2a2a2a',
    },
    amountLabel: {
        color: '#aaa',
        fontSize: 14,
        marginBottom: 10,
    },
    amountValue: {
        color: '#9FED3A',
        fontSize: 42,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    statusBadge: {
        backgroundColor: 'rgba(159, 237, 58, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        color: '#9FED3A',
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        marginLeft: 5,
    },
    infoCard: {
        backgroundColor: '#151515',
        borderRadius: 16,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },
    userImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 1,
        borderColor: '#333',
    },
    userDetails: {
        marginLeft: 15,
        flex: 1,
    },
    userName: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    userEmail: {
        color: '#aaa',
        fontSize: 14,
    },
    detailsCard: {
        backgroundColor: '#151515',
        borderRadius: 16,
        padding: 20,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#252525',
    },
    detailLabel: {
        color: '#aaa',
        fontSize: 15,
    },
    detailValue: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '500',
    },
});
