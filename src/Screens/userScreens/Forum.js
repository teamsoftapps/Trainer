import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { Images } from '../../utils/Images';

const Forum = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.headerTitle}>Forum</Text>
                </View>

                <View style={styles.headerCenter}>
                    <TouchableOpacity onPress={() => navigation.openDrawer()}>
                        <Image
                            source={{ uri: 'https://via.placeholder.com/100' }} // Placeholder for the dog logo
                            style={styles.logoImage}
                        />
                    </TouchableOpacity>
                </View>

                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Icon name="grid-outline" size={24} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <Feather name="message-circle" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Main Forum Content (Empty for now) */}
            <View style={styles.content}>
            </View>

            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('CreateForumPost')}
            >
                <Icon name="add" size={40} color="#000" />
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default Forum;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#161616', // Dark background
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    headerLeft: {
        flex: 1,
    },
    headerTitle: {
        color: '#fff',
        fontSize: responsiveFontSize(2.8),
        fontWeight: 'bold',
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    logoImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#b2ff00',
    },
    headerRight: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    iconButton: {
        marginLeft: 15,
    },
    content: {
        flex: 1,
    },
    fab: {
        position: 'absolute',
        bottom: 30,
        alignSelf: 'center',
        width: 65,
        height: 65,
        borderRadius: 32.5,
        backgroundColor: '#A3FF12', // Neon green
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8, // for Android shadow
        shadowColor: '#A3FF12',
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 5,
    },
});
