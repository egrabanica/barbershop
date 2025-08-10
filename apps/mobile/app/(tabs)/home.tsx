/*
 *   Copyright (c) 2025 
 *   All rights reserved.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../../src/hooks/useAuth';
import { useTheme } from '../../src/providers/ThemeProvider';
import { Colors } from '../../src/theme/Colors';

export default function HomeScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const colors = Colors[theme];

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Hello{user?.firstName ? `, ${user.firstName}` : ''}! 👋
            </Text>
            <Text style={styles.subtitle}>Find your perfect barbershop</Text>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.placeholderText} />
          <Text style={styles.searchPlaceholder}>Search barbershops...</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="calendar" size={32} color={colors.primary} />
              <Text style={styles.actionLabel}>Book Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="location" size={32} color={colors.primary} />
              <Text style={styles.actionLabel}>Near Me</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="star" size={32} color={colors.primary} />
              <Text style={styles.actionLabel}>Top Rated</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <Ionicons name="gift" size={32} color={colors.primary} />
              <Text style={styles.actionLabel}>Offers</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured Barbershops */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Barbershops</Text>
          
          {/* Sample barbershop card */}
          <TouchableOpacity style={styles.shopCard}>
            <View style={styles.shopImagePlaceholder}>
              <Ionicons name="cut" size={32} color={colors.primary} />
            </View>
            <View style={styles.shopInfo}>
              <Text style={styles.shopName}>Classic Cuts Barbershop</Text>
              <Text style={styles.shopDescription}>Traditional barbershop with modern style</Text>
              <View style={styles.shopMeta}>
                <View style={styles.rating}>
                  <Ionicons name="star" size={16} color={colors.secondary} />
                  <Text style={styles.ratingText}>4.8</Text>
                </View>
                <Text style={styles.distance}>0.5 km away</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.gray400} />
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        {user?.role === 'client' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityCard}>
              <Ionicons name="checkmark-circle" size={24} color={colors.success} />
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Appointment Completed</Text>
                <Text style={styles.activityDescription}>
                  Classic Haircut at John's Barbershop
                </Text>
                <Text style={styles.activityTime}>2 hours ago</Text>
              </View>
            </View>
          </View>
        )}

        {/* Owner Dashboard Preview */}
        {user?.role === 'owner' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Business Overview</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Today's Bookings</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>€450</Text>
                <Text style={styles.statLabel}>Today's Revenue</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.dashboardButton}>
              <Text style={styles.dashboardButtonText}>View Full Dashboard</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: typeof Colors.light) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray500,
    marginTop: 4,
  },
  notificationButton: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.inputBorder,
  },
  searchPlaceholder: {
    marginLeft: 12,
    fontSize: 16,
    color: colors.placeholderText,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    flex: 1,
    marginHorizontal: 4,
  },
  actionLabel: {
    marginTop: 8,
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
  },
  shopCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    marginBottom: 12,
  },
  shopImagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: colors.gray100,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  shopDescription: {
    fontSize: 14,
    color: colors.gray500,
    marginBottom: 8,
  },
  shopMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  distance: {
    fontSize: 14,
    color: colors.gray500,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  activityContent: {
    marginLeft: 12,
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 14,
    color: colors.gray500,
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: colors.gray400,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    flex: 1,
    marginRight: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 12,
    color: colors.gray500,
    marginTop: 4,
    textAlign: 'center',
  },
  dashboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dashboardButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});
