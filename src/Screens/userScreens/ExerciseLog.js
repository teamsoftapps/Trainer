import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    Image,
    ScrollView,
} from 'react-native';
import { responsiveFontSize, responsiveScreenHeight } from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import { Calendar } from 'react-native-calendars';
import ImagePicker from 'react-native-image-crop-picker';

const ExerciseLog = ({ navigation }) => {
    const [selectedDate, setSelectedDate] = useState('');
    const [media, setMedia] = useState(null);
    const [reps, setReps] = useState('');
    const [sets, setSets] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [chest, setChest] = useState('');
    const [waist, setWaist] = useState('');
    const [hips, setHips] = useState('');
    const [thighs, setThighs] = useState('');

    const handleMediaUpload = () => {
        ImagePicker.openPicker({
            width: 400,
            height: 300,
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

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <Icon name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Exercise Log</Text>
                <View style={{ width: 28 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <Calendar
                    style={styles.calendarContainer}
                    theme={{
                        backgroundColor: '#161616',
                        calendarBackground: '#161616',
                        textSectionTitleColor: '#888',
                        selectedDayBackgroundColor: '#A3FF12', // Neon Green
                        selectedDayTextColor: '#000',
                        todayTextColor: '#A3FF12',
                        dayTextColor: '#fff',
                        textDisabledColor: '#444',
                        monthTextColor: '#fff',
                        arrowColor: '#888',
                        textMonthFontWeight: 'bold',
                        textDayFontSize: responsiveFontSize(1.8),
                        textMonthFontSize: responsiveFontSize(2),
                        textDayHeaderFontSize: responsiveFontSize(1.6)
                    }}
                    onDayPress={day => {
                        setSelectedDate(day.dateString);
                    }}
                    markedDates={{
                        [selectedDate]: { selected: true, disableTouchEvent: true, selectedColor: '#A3FF12', selectedTextColor: '#000' }
                    }}
                />

                <TouchableOpacity style={styles.mediaUploadBox} onPress={handleMediaUpload}>
                    {media ? (
                        <Image source={{ uri: media }} style={styles.previewImage} />
                    ) : (
                        <View style={styles.uploadPlaceholder}>
                            <Icon name="add-circle-outline" size={30} color="#888" style={{ marginRight: 10 }} />
                            <Text style={styles.mediaUploadText}>Upload Media</Text>
                        </View>
                    )}
                </TouchableOpacity>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Reps"
                        placeholderTextColor="#fff"
                        keyboardType="numeric"
                        value={reps}
                        onChangeText={setReps}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Sets"
                        placeholderTextColor="#fff"
                        keyboardType="numeric"
                        value={sets}
                        onChangeText={setSets}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Weight"
                        placeholderTextColor="#fff"
                        keyboardType="numeric"
                        value={weight}
                        onChangeText={setWeight}
                    />
                </View>

                {/* Body Measurements Section */}
                <Text style={styles.sectionHeader}>Body Measurements</Text>

                <View style={styles.measurementsGrid}>
                    <View style={styles.measurementItem}>
                        <Text style={styles.measurementLabel}>Height (cm)</Text>
                        <TextInput
                            style={styles.measurementInput}
                            placeholder="0"
                            placeholderTextColor="#555"
                            keyboardType="numeric"
                            value={height}
                            onChangeText={setHeight}
                        />
                    </View>
                    <View style={styles.measurementItem}>
                        <Text style={styles.measurementLabel}>Chest (in)</Text>
                        <TextInput
                            style={styles.measurementInput}
                            placeholder="0"
                            placeholderTextColor="#555"
                            keyboardType="numeric"
                            value={chest}
                            onChangeText={setChest}
                        />
                    </View>
                </View>

                <View style={styles.measurementsGrid}>
                    <View style={styles.measurementItem}>
                        <Text style={styles.measurementLabel}>Waist (in)</Text>
                        <TextInput
                            style={styles.measurementInput}
                            placeholder="0"
                            placeholderTextColor="#555"
                            keyboardType="numeric"
                            value={waist}
                            onChangeText={setWaist}
                        />
                    </View>
                    <View style={styles.measurementItem}>
                        <Text style={styles.measurementLabel}>Hips (in)</Text>
                        <TextInput
                            style={styles.measurementInput}
                            placeholder="0"
                            placeholderTextColor="#555"
                            keyboardType="numeric"
                            value={hips}
                            onChangeText={setHips}
                        />
                    </View>
                </View>

                <View style={styles.measurementsGrid}>
                    <View style={styles.measurementItem}>
                        <Text style={styles.measurementLabel}>Thighs (in)</Text>
                        <TextInput
                            style={styles.measurementInput}
                            placeholder="0"
                            placeholderTextColor="#555"
                            keyboardType="numeric"
                            value={thighs}
                            onChangeText={setThighs}
                        />
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.logButton}
                    onPress={() => {
                        // Log workout logic
                        console.log('Logging workout...');
                    }}
                >
                    <Text style={styles.logButtonText}>Log Workout</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ExerciseLog;

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
    iconButton: {
        padding: 5,
    },
    headerTitle: {
        color: '#fff',
        fontSize: responsiveFontSize(2.8),
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    calendarContainer: {
        marginBottom: 30,
        borderRadius: 10,
        paddingBottom: 10,
    },
    mediaUploadBox: {
        backgroundColor: '#333',
        borderRadius: 15,
        height: responsiveScreenHeight(18),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
        overflow: 'hidden',
    },
    uploadPlaceholder: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    mediaUploadText: {
        color: '#888',
        fontSize: responsiveFontSize(1.8),
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    inputContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#444',
        marginBottom: 20,
    },
    input: {
        color: '#fff',
        fontSize: responsiveFontSize(2),
        paddingVertical: 10,
    },
    sectionHeader: {
        color: '#B2FF00',
        fontSize: responsiveFontSize(2.2),
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 15,
    },
    measurementsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    measurementItem: {
        width: '48%',
    },
    measurementLabel: {
        color: '#888',
        fontSize: 12,
        marginBottom: 5,
    },
    measurementInput: {
        backgroundColor: '#222',
        color: '#fff',
        borderRadius: 8,
        paddingHorizontal: 15,
        height: 45,
        fontSize: 16,
    },
    logButton: {
        backgroundColor: '#B2FF00',
        height: 55,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    logButtonText: {
        color: '#000',
        fontSize: responsiveFontSize(2.2),
        fontWeight: 'bold',
    },
});
