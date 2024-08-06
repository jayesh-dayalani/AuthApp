import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../supabase'; // Ensure this is properly configured

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const router = useRouter();

    const validateName = (name) => {
        return name.length >= 5;
    };

    const validateEmail = async (email) => {
        // Check if email has a valid domain
        const isValidDomain = email.endsWith('@dawabag.com');
        if (!isValidDomain) return false;

        // Check if email already exists in the database
        const { data, error } = await supabase
            .from('master_users')
            .select('email')
            .eq('email', email);

        if (error) {
            console.error('Database query error:', error.message);
            return false;
        }

        return data.length === 0;
    };

    const validatePhone = (phone) => {
        // Check if phone number is exactly 10 digits
        return phone.length === 10 && /^\d{10}$/.test(phone);
    };

    const validatePassword = (password) => {
        return password.length >= 8;
    };

    const handleRegister = async () => {
        setErrors({});
        let isValid = true;

        // Check for empty fields
        if (!name) {
            setErrors((prev) => ({ ...prev, name: 'Name is required.' }));
            isValid = false;
        }
        if (!email) {
            setErrors((prev) => ({ ...prev, email: 'Email is required.' }));
            isValid = false;
        }
        if (!phone) {
            setErrors((prev) => ({ ...prev, phone: 'Phone number is required.' }));
            isValid = false;
        }
        if (!password) {
            setErrors((prev) => ({ ...prev, password: 'Password is required.' }));
            isValid = false;
        }

        // Validate fields
        if (isValid) {
            if (!validateName(name)) {
                setErrors((prev) => ({ ...prev, name: 'Name must be at least 5 characters long.' }));
                isValid = false;
            }
            if (!(await validateEmail(email))) {
                setErrors((prev) => ({ ...prev, email: 'This email is already taken or invalid. Use your_name@dawabag.com' }));
                isValid = false;
            }
            if (!validatePhone(phone)) {
                setErrors((prev) => ({ ...prev, phone: 'Phone number must be exactly 10 digits.' }));
                isValid = false;
            }
            if (!validatePassword(password)) {
                setErrors((prev) => ({ ...prev, password: 'Password must be at least 8 characters long.' }));
                isValid = false;
            }
        }

        if (!isValid) return;

        setLoading(true);
        const { data: { user }, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) {
            setLoading(false);
            Alert.alert('Registration Failed', error.message);
            return;
        }

        const { error: insertError } = await supabase
            .from('master_users')
            .insert([
                { id: user.id, name, email, phone, password }
            ]);

        setLoading(false);

        if (insertError) {
            Alert.alert('Error', insertError.message);
            return;
        }

        // Clear form fields
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');

        Alert.alert('Success', 'Account created successfully. Please log in.');
        router.replace('login');
    };

    return (
        <View className='flex-1 bg-teal-50 p-6'>
            <View className='flex-1 justify-center'>
                <Text className='text-3xl font-bold text-teal-600 mb-6 text-center'>
                    Doctor's Portal
                </Text>
                <View className='bg-white p-6 rounded-xl shadow-lg'>
                    <Text className='text-lg font-semibold text-teal-700 mb-4'>
                        Register
                    </Text>
                    <TextInput
                        placeholder='Name'
                        value={name}
                        onChangeText={setName}
                        className={`mb-4 p-3 border rounded-lg ${errors.name ? 'border-red-500' : 'border-teal-300'}`}
                        style={{ borderColor: errors.name ? 'red' : 'teal' }}
                    />
                    {errors.name && <Text className='text-red-500 mb-4'>{errors.name}</Text>}
                    
                    <TextInput
                        placeholder='Email'
                        value={email}
                        onChangeText={setEmail}
                        className={`mb-4 p-3 border rounded-lg ${errors.email ? 'border-red-500' : 'border-teal-300'}`}
                        autoCapitalize='none'
                        keyboardType='email-address'
                    />
                    {errors.email && <Text className='text-red-500 mb-4'>{errors.email}</Text>}
                    
                    <TextInput
                        placeholder='Phone'
                        value={phone}
                        onChangeText={setPhone}
                        className={`mb-4 p-3 border rounded-lg ${errors.phone ? 'border-red-500' : 'border-teal-300'}`}
                        keyboardType='phone-pad'
                    />
                    {errors.phone && <Text className='text-red-500 mb-4'>{errors.phone}</Text>}
                    
                    <TextInput
                        placeholder='Password'
                        value={password}
                        onChangeText={setPassword}
                        className={`mb-4 p-3 border rounded-lg ${errors.password ? 'border-red-500' : 'border-teal-300'}`}
                        secureTextEntry
                    />
                    {errors.password && <Text className='text-red-500 mb-4'>{errors.password}</Text>}
                    
                    <Button
                        title={loading ? 'Registering...' : 'Register'}
                        onPress={handleRegister}
                        color='#00bcd4'
                        disabled={loading}
                    />
                </View>
                <TouchableOpacity onPress={() => router.push('login')}>
                    <Text className='text-center text-teal-600 mt-4'>
                        Already have an account? Sign in
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Register;
