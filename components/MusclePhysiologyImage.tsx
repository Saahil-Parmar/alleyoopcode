import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { getMuscleColor } from '../utils/muscleUtils';

interface MusclePhysiologyImageProps {
  muscleSummary: Record<string, number>;
}

const MusclePhysiologyImage: React.FC<MusclePhysiologyImageProps> = ({ muscleSummary }) => {
  const [showingFront, setShowingFront] = useState(true);

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/gettyimages-1178749273-612x612.jpg-scvFf44si6xOfOzQff2mwzMmwjeBSa.jpeg' }}
        style={styles.image}
      />
      {Object.entries(muscleSummary).map(([muscle, lastWorked]) => (
        <View
          key={muscle}
          style={[
            styles.muscleOverlay,
            { backgroundColor: getMuscleColor(lastWorked) },
          ]}
        />
      ))}
      <TouchableOpacity 
        style={styles.rotateButton}
        onPress={() => setShowingFront(!showingFront)}
      >
        <Text style={styles.rotateButtonText}>
          Show {showingFront ? 'Back' : 'Front'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 500,
    position: 'relative',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  muscleOverlay: {
    position: 'absolute',
    opacity: 0.5,
  },
  rotateButton: {
    position: 'absolute',
    bottom: -40,
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  rotateButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default MusclePhysiologyImage;

