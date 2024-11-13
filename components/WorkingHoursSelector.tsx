import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';
import { WorkingHours } from '@/constants'; 
import { Input } from './Input';

interface WorkingHoursSelectorProps {
  control: any;
  name: string;
  error?: string;
}

const WorkingHoursSelector: React.FC<WorkingHoursSelectorProps> = ({ control, name, error }) => {
  const days = [
    { label: 'Pazartesi', value: WorkingHours.monday },
    { label: 'Salı', value: WorkingHours.tuesday },
    { label: 'Çarşamba', value: WorkingHours.wednesday },
    { label: 'Perşembe', value: WorkingHours.thursday },
    { label: 'Cuma', value: WorkingHours.friday },
    { label: 'Cumartesi', value: WorkingHours.saturday },
    { label: 'Pazar', value: WorkingHours.sunday },
  ];

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange } }) => (
        <View style={styles.container}>
          {days.map((day) => (
            <View key={day.value} style={styles.dayContainer} className="w-full">
              <Text style={styles.dayText}>{day.label}</Text>  
              <Input
                value={value?.[day.value].value || ''}  
                onChangeText={(text: string) => onChange({ ...value, [day.value]: { value: text } })}  
                placeholder="09:00 - 17:00"
                style={styles.input}  
                className='w-1/2'
              />
            </View>
          ))}

          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: { 
    gap: 5,
  },
  dayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,   
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});

export default WorkingHoursSelector;
