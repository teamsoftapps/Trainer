import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Image,
    ScrollView,
    ImageBackground,
} from 'react-native';
import { responsiveFontSize, responsiveScreenHeight, responsiveScreenWidth, responsiveWidth } from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../store/Slices/CartSlice';
import { showMessage } from 'react-native-flash-message';
import LinearGradient from 'react-native-linear-gradient';

const ProductDetails = ({ route, navigation }) => {
    const { product } = route.params;
    const dispatch = useDispatch();

    const handleAddToCart = () => {
        dispatch(addToCart(product));
        showMessage({
            message: "Added to cart",
            type: "success",
            backgroundColor: "#B2FF00",
            color: "#000"
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground
                source={{ uri: product.mediaUrl }}
                style={styles.backgroundImage}
                blurRadius={20}
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)', '#161616']}
                    style={styles.gradient}
                >
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                            <Icon name="arrow-back" size={28} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconButton}>
                            <Icon name="flag-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        <View style={styles.contentCard}>
                            <View style={styles.productHeader}>
                                <Image source={{ uri: product.mediaUrl }} style={styles.productImage} />
                                <View style={styles.titleContainer}>
                                    <Text style={styles.title}>{product.title}</Text>
                                    <Text style={styles.subtitle}>{product.description}</Text>
                                </View>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Benifits</Text>
                                <Text style={styles.verifiedText}>Verified by Business</Text>
                                <Text style={styles.descriptionText}>
                                    Step into a piece of history with the Stern's Gym Legendary Hoodie! Crafted for those who value quality and tradition, this hoodie showcases our iconic logo, a symbol of strength and dedication that has inspired fitness enthusiasts since 1946.
                                </Text>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Description</Text>
                                <Text style={styles.descriptionText}>
                                    {product.fullDescription || product.description}
                                </Text>
                            </View>
                        </View>
                    </ScrollView>

                    <View style={styles.footer}>
                        <Text style={styles.priceText}>${product.price}</Text>
                        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
                            <Text style={styles.addButtonText}>Add</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </SafeAreaView>
    );
};

export default ProductDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#161616',
    },
    backgroundImage: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 10,
    },
    iconButton: {
        padding: 5,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    contentCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 25,
        padding: 20,
        marginTop: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    productHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },
    productImage: {
        width: responsiveScreenWidth(35),
        height: responsiveScreenWidth(35),
        borderRadius: 15,
    },
    titleContainer: {
        flex: 1,
        marginLeft: 15,
    },
    title: {
        color: '#fff',
        fontSize: responsiveFontSize(2.5),
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        color: '#888',
        fontSize: responsiveFontSize(1.6),
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: responsiveFontSize(2.2),
        fontWeight: 'bold',
        marginBottom: 5,
    },
    verifiedText: {
        color: '#888',
        fontSize: 12,
        marginBottom: 15,
    },
    descriptionText: {
        color: '#ccc',
        fontSize: responsiveFontSize(1.8),
        lineHeight: 24,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 25,
        paddingVertical: 20,
        backgroundColor: '#161616',
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    priceText: {
        color: '#fff',
        fontSize: responsiveFontSize(4),
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#B2FF00',
        paddingHorizontal: 40,
        paddingVertical: 15,
        borderRadius: 30,
    },
    addButtonText: {
        color: '#000',
        fontSize: responsiveFontSize(2.2),
        fontWeight: 'bold',
    },
});
