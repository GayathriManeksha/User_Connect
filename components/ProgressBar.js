import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ProgressBar = ({ stages, currentStage }) => {
  const [progressWidth, setProgressWidth] = useState(0);

  const calculateProgress = () => {
    const stageCount = stages.length;
    const currentStageIndex = stages.indexOf(currentStage);
    const progress = (currentStageIndex + 1) / stageCount;
    return progress * 100 + '%';
  };

  return (
    <View style={styles.container}>
      <View style={[styles.progressBar, { width: calculateProgress() }]} />
      <View style={styles.stagesContainer}>
        {stages.map((stage, index) => (
          <TouchableOpacity key={index} style={styles.stage}>
            <Text style={styles.stageText}>{stage}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  progressBar: {
    height: 10,
    backgroundColor: 'blue',
  },
  stagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  stage: {
    flex: 1,
    alignItems: 'center',
  },
  stageText: {
    color: 'black',
  },
});

export default ProgressBar;
