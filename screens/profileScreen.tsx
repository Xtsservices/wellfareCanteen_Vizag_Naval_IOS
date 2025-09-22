import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSelector } from 'react-redux';
import Header from './header';

// Define interfaces for TypeScript
interface UserData {
  firstName?: string | null;
  lastName?: string | null;
  mobile?: string | null;
  email?: string | null;
  createdAt?: string | null;
  id?: number;
  profileImage?: string | null;
}

interface AppState {
  currentUserData: UserData;
}

// Get screen dimensions for responsiveness
const { width } = Dimensions.get('window');
const formWidth = width * 0.9; // 90% of screen width
const fullInputWidth = formWidth * 0.95;

const ProfileScreen: React.FC = () => {
  const user = useSelector((state: AppState) => state.currentUserData);

  // Format createdAt date to a readable format (e.g., "June 13, 2025")
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Render N/A if data is not available
  const renderValue = (value?: string | null) => (
    <Text style={styles.naText}>{value || 'N/A'}</Text>
  );

  return (
    <View style={styles.mainContainer}>
      {/* Header */}
      <Header text="Profile" />

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Image */}
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={
              user?.profileImage
                ? { uri: user.profileImage }
                : require('./imgs/1077114.png')
            }
          />
          <Text style={styles.profileName}>
            {user?.firstName && user?.lastName
              ? `${user.firstName} ${user.lastName}`
              : 'User Profile'}
          </Text>
        </View>

        {/* Form Container */}
        <View style={[styles.formWrapper, { width: formWidth }]}>
          <View style={styles.formContainer}>
            <View style={styles.row}>
              <View style={[styles.input, { width: fullInputWidth }]}>
                <Text style={styles.label}>First Name</Text>
                {renderValue(user?.firstName)}
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.input, { width: fullInputWidth }]}>
                <Text style={styles.label}>Last Name</Text>
                {renderValue(user?.lastName)}
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.input, { width: fullInputWidth }]}>
                <Text style={styles.label}>Mobile</Text>
                {renderValue(user?.mobile)}
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.input, { width: fullInputWidth }]}>
                <Text style={styles.label}>Email</Text>
                {renderValue(user?.email)}
              </View>
            </View>
            <View style={styles.row}>
              <View style={[styles.input, { width: fullInputWidth }]}>
                <Text style={styles.label}>Joined</Text>
                {renderValue(formatDate(user?.createdAt))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#e6f0fa', // Light blue background
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    resizeMode: 'cover',
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000', // Black text
    marginTop: 8,
    textTransform: 'capitalize',
  },
  formWrapper: {
    marginTop: 15,
    alignItems: 'center',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  row: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#f8f9fa', // Subtle gray for input background
    borderRadius: 12,
    padding: 15,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  label: {
    color: '#000', // Black color mandatory
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  naText: {
    color: '#000', // Black color mandatory
    fontSize: 16,
    fontWeight: '400',
  },
});

export default ProfileScreen;