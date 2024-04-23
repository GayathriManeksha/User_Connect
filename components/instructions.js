import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import CustomButton from './CustomButton';

import { useNavigation } from '@react-navigation/native';
const Instructions = () => {
    const navigation = useNavigation();
    const pressHandler = () => {
        navigation.navigate('login');
      };
  return (<View style={styles.container}> 
       <Image source={require('../assets/qs.png')} style={styles.image} />
      <Text style={styles.instruction}>
        1. Categories-ൽ നിന്ന് തിരഞ്ഞെടുക്കുക.
      </Text>
      <Text style={styles.instruction}>
        2. ഏറ്റവും അടുത്തുള്ള 5 തൊഴിലാളികളെ ലിസ്റ്റുചെയ്യാൻ Search ബട്ടൺ ക്ലിക്കുചെയ്യുക.
      </Text>
      <Text style={styles.instruction}>
        3. ചാറ്റ് ചെയ്യാനും ഒരു Appointment ബുക്ക് ചെയ്യാനും  "Chat" അമർത്തുക.
      </Text>
      <Text style={styles.instruction}>
        4. ഒരു Bid സൃഷ്ടിക്കാൻ "Bid" അമർത്തുക
      </Text>
      <Text style={styles.instruction}>
        5. നിങ്ങളുടെ ഡീലുകൾ ചർച്ച ചെയ്യാൻ കാർഡുകൾ ഉപയോഗിക്കുക.
      </Text>
      <Text style={styles.instruction}>
        6. ഒരു ഡീൽ സ്വീകരിക്കുക അല്ലെങ്കിൽ നിങ്ങളുടെ കരാർ അംഗീകരിക്കപ്പെടുന്നതുവരെ കാത്തിരിക്കുക.
      </Text>
      <Text style={styles.instruction}>
        7. തീയതിയും സമയവും നൽകി Appointment സ്ഥിരീകരിക്കുന്നതിനുള്ള നടപടിക്രമങ്ങൾ സജീവ അപ്പോയിൻ്റ്മെൻ്റ് പേജിലേക്ക് റീഡയറക്‌ട് ചെയ്യും 
      </Text>
      <Text style={styles.instruction}>
        8. മുമ്പത്തെ എല്ലാ ബിഡുകളും ക്ലിയർ ചെയ്തു.
      </Text>
      <Text style={styles.instruction}>
        9. വിവരം: പഴയ Appointments പൂർത്തിയായ ശേഷം മാത്രമേ പുതിയ നിയമനങ്ങൾ സൃഷ്ടിക്കാൻ കഴിയൂ
      </Text>
      <CustomButton
          title="Next"
          onPress={pressHandler}
          textColor="white" 
        />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'left',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold', 
  },
  instruction: {
    fontSize: 16, 
    color:'#781C68',
    marginTop:5
  },
  image: {
    width: '100%',
    height: 70,
    resizeMode: 'contain', 
  },
});

export default Instructions;
