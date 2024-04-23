import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
//import MapView, { Marker } from 'react-native-maps';

const ListingPage = ({ route }) => {
  const { category, location } = route.params;
  const [availableWorkers, setAvailableWorkers] = useState([
    { id: 1, name: 'Worker 1', amount: '$50' },
    { id: 2, name: 'Worker 2', amount: '$45' },
    { id: 3, name: 'Worker 3', amount: '$60' },
    // Add more worker data as needed
  ]);

  return (
    <View style={styles.container}>
      {/* MapView for the top half of the screen */}
      <View style={styles.mapContainer}>
        
      </View>

      {/* Worker list for the bottom half of the screen */}
      <View style={styles.workerListContainer}>
        
          <FlatList
            data={availableWorkers}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.workerItem}>
                <Text style={styles.workerName}>{item.name}</Text>
                <Text style={styles.workerAmount}>{item.amount}</Text>
              </TouchableOpacity>
            )}
          /> 
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  workerListContainer: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#fff',
    padding: 16,
    marginTop: -20,
  },
  workerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 12,
  },
  workerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  workerAmount: {
    fontSize: 16,
  },
});

export default ListingPage;
