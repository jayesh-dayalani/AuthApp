import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { supabase } from '../supabase'; // Ensure this is properly configured

const Auth = () => {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const userId = useSelector((state) => state.authSlice.id);

    useEffect(() => {
        const fetchUserRole = async () => {
            const { data, error } = await supabase
                .from('master_users')
                .select('role')
                .eq('id', userId)
                .single();

            if (error) {
                console.error('Error fetching user role', error);
                // Handle the error, possibly redirect to a different page or show an error message
                return;
            }

            const userRole = data.role;
            setLoading(false);
            router.replace(userRole); // Adjust this based on your role-based routing logic
        };

        if (userId) {
            fetchUserRole();
        }
    }, [userId, router]);

    if (loading) {
        return (
            <View className='flex-1 items-center justify-center bg-teal-50'>
                <ActivityIndicator size="large" color="#00bcd4" />
                <Text className='text-teal-700 mt-4'>Loading...</Text>
            </View>
        );
    }

    return (
        <View className='flex-1 items-center justify-center bg-teal-50'>
            <Text className='text-teal-700'>Redirecting...</Text>
        </View>
    );
};

export default Auth;
