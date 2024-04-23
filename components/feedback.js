import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

import { useNavigation } from '@react-navigation/native';
const Feedback = ({route}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { app_id} = route.params;
  const navigation = useNavigation();
  const handleStarPress = (value) => {
    setRating(value);
  };

  const handleSubmit = async () => {
    // You can handle submission logic here, like sending the feedback to your backend
    console.log('Rating:', rating);
    console.log('Comment:', comment);
    console.log('id:', app_id);
    // Reset fields after submission
    try {
      const feedbackData = {
        appointmentId: app_id, // Replace with the actual appointment ID
        description: comment,
        rating: rating,
      };

      // Replace 'YOUR_BACKEND_API_URL' with your actual backend API URL
      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/feedback/feedback`, feedbackData);

      console.log('Feedback submitted:', response.data);

      // Reset fields after submission
      setRating(0);
      setComment('');
      navigation.navigate('feed');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
    setRating(0);
    setComment('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Feedback</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleStarPress(index)}
            style={styles.starButton}
          >
            <Ionicons
              name={rating >= index ? 'star' : 'star-outline'}
              size={40}
              color={rating >= index ? '#781C68' : '#CCCCCC'}
            />
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        placeholder="Enter your comment"
        style={styles.commentInput}
        multiline
        value={comment}
        onChangeText={setComment}
      />
      <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color:'#781C68'
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  starButton: {
    marginRight: 10,
  },
  commentInput: {
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#781C68',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Feedback;
