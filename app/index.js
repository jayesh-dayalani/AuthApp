import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { supabase } from '../supabase'; // Ensure this is properly configured
import { addAuthDetails } from '../redux/authSlice';

export default function Index() {
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        const checkSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();

            setLoading(false);

            if (error) {
                console.error('Error fetching session', error);
                router.replace('login');
                return;
            }

            if (session) {
                dispatch(addAuthDetails({
                    id: session.user.id,
                    email: session.user.email
                }));
                router.replace('auth');
            } else {
                router.replace('login');
            }
        };

        checkSession();
    }, [dispatch, router]);

    if (loading) {
        return (
            <View className='flex-1 items-center justify-center bg-green-500'>
                <ActivityIndicator size="large" color="#ffffff" />
                <Text className='text-white mt-4'>Loading...</Text>
            </View>
        );
    }

    return (
        <View className='flex-1 items-center justify-center bg-green-500'>
            <Text>index</Text>
        </View>
    );
}
