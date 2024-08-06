import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { addAuthDetails } from '../redux/authSlice';
import { supabase } from '../supabase'; // Ensure this is properly configured

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const reduxAuthDetails = useSelector((state) => state.authSlice);

    useEffect(() => {
        // Log the Redux auth details
        console.log('Redux auth details:', reduxAuthDetails);
    }, [reduxAuthDetails]);

    const handleLogin = async () => {
        setLoading(true);
        const { data: { session }, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        setLoading(false);

        if (error) {
            Alert.alert('Login Failed', error.message);
            return;
        }

        dispatch(addAuthDetails({
            id: session.user.id,
            email: session.user.email
        }));
        router.replace('auth');
    };

    return (
        <View className='flex-1 bg-teal-50 p-6'>
            <View className='flex-1 justify-center'>
                <Text className='text-3xl font-bold text-teal-600 mb-6 text-center'>
                    Doctor's Portal
                </Text>
                <View className='bg-white p-6 rounded-xl shadow-lg'>
                    <Text className='text-lg font-semibold text-teal-700 mb-4'>
                        Login
                    </Text>
                    <TextInput
                        placeholder='Email'
                        value={email}
                        onChangeText={setEmail}
                        className='mb-4 p-3 border border-teal-300 rounded-lg'
                        autoCapitalize='none'
                        keyboardType='email-address'
                    />
                    <TextInput
                        placeholder='Password'
                        value={password}
                        onChangeText={setPassword}
                        className='mb-4 p-3 border border-teal-300 rounded-lg'
                        secureTextEntry
                    />
                    <Button
                        title={loading ? 'Logging in...' : 'Login'}
                        onPress={handleLogin}
                        color='#00bcd4'
                        disabled={loading}
                    />
                </View>
                <TouchableOpacity onPress={() => router.push('register')}>
                    <Text className='text-center text-teal-600 mt-4'>
                        Don't have an account? Sign up
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Login;
