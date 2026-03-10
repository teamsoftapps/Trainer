import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  responsiveFontSize,
  responsiveScreenHeight,
} from 'react-native-responsive-dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import {Calendar} from 'react-native-calendars';
import ImagePicker from 'react-native-image-crop-picker';
import {useSelector} from 'react-redux';
import axiosBaseURL from '../../services/AxiosBaseURL';
import moment from 'moment';

const ExerciseLog = ({navigation}) => {
  const today = moment().format('YYYY-MM-DD');
  const [selectedDate, setSelectedDate] = useState(today);
  const [logs, setLogs] = useState([]); // All fetched logs
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form states
  const [media, setMedia] = useState(null);
  const [reps, setReps] = useState('');
  const [sets, setSets] = useState('');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [thighs, setThighs] = useState('');

  const token = useSelector(state => state?.Auth?.data?.token);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosBaseURL.get('/user/exerciseLogs', {
        headers: {Authorization: `Bearer ${token}`},
      });
      if (res.data.status) {
        setLogs(res.data.data);
        populateForm(res.data.data, selectedDate);
      }
    } catch (err) {
      console.log('Error fetching exercise logs:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const populateForm = (allLogs, date) => {
    const logForDate = allLogs.find(l => l.date === date);
    if (logForDate) {
      setMedia(logForDate.mediaUrl || null);
      setReps(logForDate.reps ? String(logForDate.reps) : '');
      setSets(logForDate.sets ? String(logForDate.sets) : '');
      setWeight(logForDate.weight ? String(logForDate.weight) : '');
      setHeight(logForDate.heightCm ? String(logForDate.heightCm) : '');
      setChest(logForDate.chestIn ? String(logForDate.chestIn) : '');
      setWaist(logForDate.waistIn ? String(logForDate.waistIn) : '');
      setHips(logForDate.hipsIn ? String(logForDate.hipsIn) : '');
      setThighs(logForDate.thighsIn ? String(logForDate.thighsIn) : '');
    } else {
      // Reset form
      setMedia(null);
      setReps('');
      setSets('');
      setWeight('');
      setHeight('');
      setChest('');
      setWaist('');
      setHips('');
      setThighs('');
    }
  };

  const handleDateChange = date => {
    setSelectedDate(date);
    populateForm(logs, date);
  };

  const handleMediaUpload = () => {
    ImagePicker.openPicker({
      mediaType: 'any',
    })
      .then(image => {
        setMedia(image.path);
      })
      .catch(err => {
        console.log('Image picker cancelled or failed:', err);
      });
  };

  const handleSaveLog = async () => {
    if (!selectedDate) {
      Alert.alert('Error', 'Please select a date first.');
      return;
    }

    try {
      setSaving(true);
      const formData = new FormData();
      formData.append('date', selectedDate);
      if (reps) formData.append('reps', reps);
      if (sets) formData.append('sets', sets);
      if (weight) formData.append('weight', weight);
      if (height) formData.append('heightCm', height);
      if (chest) formData.append('chestIn', chest);
      if (waist) formData.append('waistIn', waist);
      if (hips) formData.append('hipsIn', hips);
      if (thighs) formData.append('thighsIn', thighs);

      if (media && !media.startsWith('http')) {
        const name = media.split('/').pop();
        const type =
          media.endsWith('.mp4') || media.endsWith('.mov')
            ? 'video/mp4'
            : 'image/jpeg';
        formData.append('mediaUrl', {
          uri: media,
          name,
          type,
        });
      }

      const res = await axiosBaseURL.post('/user/exerciseLog', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.status) {
        Alert.alert('Success', 'Exercise log saved successfully!');
        fetchLogs(); // refresh logs to get updated mediaUrl and data
      }
    } catch (error) {
      console.log('Error saving log:', error?.response?.data || error.message);
      Alert.alert('Error', 'Failed to save exercise log');
    } finally {
      setSaving(false);
    }
  };

  // Prepare marked dates map for the calendar to highlight days with logs
  const markedDates = {
    [selectedDate]: {
      selected: true,
      selectedColor: '#A3FF12',
      selectedTextColor: '#000',
    },
  };
  logs.forEach(log => {
    if (log.date !== selectedDate) {
      markedDates[log.date] = {marked: true, dotColor: '#A3FF12'};
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconButton}>
          <Icon name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Exercise Log</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('ExerciseLogsHistory', {logs})}
          style={styles.iconButton}>
          <Icon name="time-outline" size={28} color="#A3FF12" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#A3FF12" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <Calendar
            style={styles.calendarContainer}
            theme={{
              backgroundColor: '#161616',
              calendarBackground: '#161616',
              textSectionTitleColor: '#888',
              selectedDayBackgroundColor: '#A3FF12',
              selectedDayTextColor: '#000',
              todayTextColor: '#A3FF12',
              dayTextColor: '#fff',
              textDisabledColor: '#444',
              monthTextColor: '#fff',
              arrowColor: '#888',
              textMonthFontWeight: 'bold',
              textDayFontSize: responsiveFontSize(1.8),
              textMonthFontSize: responsiveFontSize(2),
              textDayHeaderFontSize: responsiveFontSize(1.6),
            }}
            onDayPress={day => handleDateChange(day.dateString)}
            markedDates={markedDates}
          />

          <TouchableOpacity
            style={styles.mediaUploadBox}
            onPress={handleMediaUpload}>
            {media ? (
              <Image source={{uri: media}} style={styles.previewImage} />
            ) : (
              <View style={styles.uploadPlaceholder}>
                <Icon
                  name="add-circle-outline"
                  size={30}
                  color="#888"
                  style={{marginRight: 10}}
                />
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
            style={[styles.logButton, saving && {opacity: 0.7}]}
            onPress={handleSaveLog}
            disabled={saving}>
            {saving ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <Text style={styles.logButtonText}>Log Workout</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
