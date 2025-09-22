import React, { useState } from 'react';
import {
  Image,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Dimensions,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './navigationTypes';
import Header from './header';

// Define interfaces for TypeScript
type NotificationsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'NotificationsScreen'
>;

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: 'message' | 'alert' | 'update' | 'payment';
}

interface NotificationsScreenProps {
  navigation: NotificationsScreenNavigationProp;
}

// Get screen dimensions for responsiveness
const { width } = Dimensions.get('window');
const containerWidth = width * 0.9; // 90% of screen width

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ navigation }) => {
  // Initialize with empty notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map(item =>
        item.id === id ? { ...item, isRead: true } : item,
      ),
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(item => item.id !== id));
  };

  const clearAllNotifications = () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => setNotifications([]),
        },
      ],
    );
  };

  const renderNotificationItem = ({ item }: { item: NotificationItem }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        { width: containerWidth },
        !item.isRead && styles.unreadNotification,
      ]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message || 'No message'}</Text>
        <Text style={styles.notificationTime}>{item.time}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteNotification(item.id)}
      >
        <Image
          style={styles.deleteIcon}
          source={{ uri: 'https://via.placeholder.com/20' }} // Placeholder image
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      {/* Header */}
      <Header text="Notifications" />

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.comingSoonContainer}>
          <Text style={styles.comingSoonText}>Coming Soon</Text>
        </View>
        {notifications.length > 0 && (
          <FlatList
            ListHeaderComponent={
              <View style={[styles.clearButtonContainer, { width: containerWidth }]}>
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={clearAllNotifications}
                >
                  <Text style={styles.clearButtonText}>Clear All</Text>
                </TouchableOpacity>
              </View>
            }
            data={notifications}
            renderItem={renderNotificationItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.notificationList}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#e6f0fa', // Light blue background
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  comingSoonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  comingSoonText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000', // Black text
  },
  clearButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  clearButton: {
    padding: 8,
    backgroundColor: '#007bff', // Vibrant blue
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  notificationList: {
    paddingBottom: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    alignSelf: 'center',
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000', // Black text
    marginBottom: 5,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#000', // Black text
    marginBottom: 5,
  },
  notificationTime: {
    fontSize: 12,
    color: '#888',
  },
  deleteButton: {
    padding: 8,
  },
  deleteIcon: {
    width: 20,
    height: 20,
  },
});

export default NotificationsScreen;