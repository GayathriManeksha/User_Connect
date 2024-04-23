import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import CustomButton from './CustomButton';

export default function Home({ navigation }) {
  const pressHandler = () => {
    navigation.navigate('instructions');
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={require('../assets/1.jpeg')} style={styles.image} />
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Get Started"
          onPress={pressHandler}
          textColor="white"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Black background color
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    backgroundColor: 'white', // White background color
    width: '100%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
   
    resizeMode: 'contain', // Adjust the image to fit inside the container
  },
});
