import React, { useState } from 'react';
import { StyleSheet, TextInput, View, TouchableOpacity, Text ,Alert} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Import MaterialIcons for icons
import moment from 'moment'; // Import moment for date-time handling
import { useNavigation } from '@react-navigation/native';

import axios from 'axios';
export default function Details({ route }) {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [period, setPeriod] = useState('');
  const navigation = useNavigation();

  const { bidId, workerId } = route.params;

  const handleButtonPress = async () => {
    if (!day || !month || !year || !hours || !minutes || !period) {
      // Display alert if any of the fields are empty
      Alert.alert(
        'Incomplete Details',
        'Please enter all fields before submitting.',
        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
        { cancelable: false }
      );
      return; // Exit the function early if any field is empty
    }
    
    try {
      // Combine date and time inputs
      const dateTimeString = `${year}-${month}-${day}T${hours}:${minutes} ${period}`;
      const dateTimeObject = moment(dateTimeString, 'YYYY-MM-DDTHH:mm A').toDate();

      // Send the date and time as a single Date object
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/appointment/accept-request/${bidId}`, {
        date: dateTimeObject
      });

      console.log('Response:', response);
      if (response.status === 200)
        navigation.navigate('active');
    } catch (error) {
      console.log('Error:', error);
      Alert.alert(
        'Booking failed',
        'An error occurred while processing your booking. Please try again.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('bidding', { workerId })
          }
        ],
        { cancelable: false }
      );

    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label1}>Enter Date and Time for the work and click on the submit button</Text>
      <View style={styles.form}>
        <Text style={styles.label}>Enter Details</Text>

        {/* Date input: Day, Month, Year */}
        <View style={styles.inputRow}>
          <MaterialIcons name="date-range" size={24} color="#781C68" />
          <TextInput
            style={styles.input}
            placeholder="dd"
            value={day}
            onChangeText={setDay}
            keyboardType="numeric"
            maxLength={2}
          />
          <TextInput
            style={styles.input}
            placeholder="mm"
            value={month}
            onChangeText={setMonth}
            keyboardType="numeric"
            maxLength={2}
          />
          <TextInput
            style={styles.input}
            placeholder="yyyy"
            value={year}
            onChangeText={setYear}
            keyboardType="numeric"
            maxLength={4}
          />
        </View>

        {/* Time input: Hours, Minutes, and AM/PM Picker */}
        <View style={styles.inputRow}>
          <MaterialIcons name="access-time" size={24} color="#781C68" />
          <TextInput
            style={styles.input}
            placeholder="hours"
            value={hours}
            onChangeText={setHours}
            keyboardType="numeric"
            maxLength={2}
          />
          <TextInput
            style={styles.input}
            placeholder="min"
            value={minutes}
            onChangeText={setMinutes}
            keyboardType="numeric"
            maxLength={2}
          />
          <TextInput
            style={styles.input}
            placeholder="AM/PM"
            value={period}
            onChangeText={setPeriod}
            maxLength={2}
          />
        </View>

        {/* Submit button */}
        <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Black background color
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    padding: 20,
    borderWidth: 2,
    borderColor: '#a06d95', // White border color
    borderRadius: 10,
    width: 300,
    backgroundColor: "white",
    height: "50%"
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#a06d95', // White text color
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // Align icons and input fields vertically
    marginBottom: 20,
  },
  input: {
    flex: 1, // Take remaining space in the row
    height: 40,
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#fff',
    color: '#000',
    fontSize: 16,
    borderColor: '#ccc',
    borderWidth: 1,
    marginLeft: 10, // Add margin between icon and input field
  },
  button: {
    backgroundColor: '#a06d95', // White background color
    borderRadius: 10,
    padding: 7,
    alignItems: 'center',
    marginTop: 20
  },
  buttonText: {
    color: 'white', // Black text color
    fontSize: 16,
    fontWeight: 'bold',
  },
  label1: {
    fontSize: 16, 
    color: 'grey', // White text color
    marginBottom: 20,
    padding:20
  },
});
