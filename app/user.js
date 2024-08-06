import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { supabase } from '../supabase'; // Ensure this is properly configured
import { removeAuthDetails } from '../redux/authSlice';

const User = () => {
    const [loading, setLoading] = useState(true);
    const [userDetails, setUserDetails] = useState({});
    const router = useRouter();
    const dispatch = useDispatch();
    const userId = useSelector((state) => state.authSlice.id);

    useEffect(() => {
        const fetchUserDetails = async () => {
            const { data, error } = await supabase
                .from('master_users')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching user details', error);
                // Handle the error, possibly redirect to a different page or show an error message
                return;
            }

            setUserDetails(data);
            setLoading(false);
        };

        if (userId) {
            fetchUserDetails();
        }
    }, [userId]);

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        
        if (error) {
            console.error('Error during sign out', error);
            return;
        }

        // Clear the Redux state
        dispatch(removeAuthDetails());
        
        // Redirect to login page
        router.replace('login');
    };

    if (loading) {
        return (
            <View className='flex-1 items-center justify-center bg-teal-50'>
                <ActivityIndicator size="large" color="#00bcd4" />
                <Text className='text-teal-700 mt-4'>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView className='flex-1 bg-teal-50 p-6'>
            <View className='bg-white p-6 rounded-xl shadow-lg w-full'>
                <Text className='text-lg font-semibold text-teal-700 mb-4'>
                    User Details
                </Text>
                {Object.entries(userDetails).map(([key, value]) => (
                    <Text key={key} className='text-base text-teal-700 mb-2'>
                        {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                    </Text>
                ))}
                <Button
                    title="Logout"
                    onPress={handleLogout}
                    color='#00bcd4'
                />
            </View>
        </ScrollView>
    );
};

export default User;
