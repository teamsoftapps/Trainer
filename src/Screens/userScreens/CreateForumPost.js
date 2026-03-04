import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    Image,
} from 'react-native';
import { responsiveFontSize, responsiveScreenHeight } from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';

const CreateForumPost = ({ navigation }) => {
    const [description, setDescription] = useState('');
    const [media, setMedia] = useState(null);

    const handleMediaUpload = () => {
        ImagePicker.openPicker({
            width: 400,
            height: 400,
            cropping: true,
            mediaType: 'any',
        })
            .then(image => {
                setMedia(image.path);
            })
            .catch(err => {
                console.log("Image picker cancelled or failed:", err);
            });
    };

    const handlePost = () => {
        // API Call to save post
        navigation.goBack();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back" size={28} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.headerCenter}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/100' }} // Same dog logo
                        style={styles.logoImage}
                    />
                </View>

                <View style={styles.headerRight} />
            </View>

            <View style={styles.content}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.descriptionInput}
                        placeholder="Description"
                        placeholderTextColor="#888"
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>

                <TouchableOpacity style={styles.mediaUploadBox} onPress={handleMediaUpload}>
                    {media ? (
                        <Image source={{ uri: media }} style={styles.previewImage} />
                    ) : (
                        <Text style={styles.mediaUploadText}>+ Media</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity style={styles.postButton} onPress={handlePost}>
                    <Text style={styles.postButtonText}>Post</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default CreateForumPost;

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
    headerLeft: {
        flex: 1,
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
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    inputContainer: {
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 8,
        marginBottom: 20,
        paddingHorizontal: 15,
        height: 55,
        justifyContent: 'center',
    },
    descriptionInput: {
        color: '#fff',
        fontSize: responsiveFontSize(1.8),
    },
    mediaUploadBox: {
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 8,
        height: responsiveScreenHeight(35),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        overflow: 'hidden',
    },
    mediaUploadText: {
        color: '#fff',
        fontSize: responsiveFontSize(2),
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    postButton: {
        backgroundColor: '#A3FF12', // Neon green
        height: 55,
        borderRadius: 27.5,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        width: '50%',
    },
    postButtonText: {
        color: '#000',
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
    },
});
