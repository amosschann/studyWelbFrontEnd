import React, { useState } from 'react';
import { SafeAreaView, View, Alert, TextInput, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Text} from 'react-native';
import styles from '../components/Style';
import * as Haptics from 'expo-haptics';
import { SubmitButton } from '../components/Buttons';

export default function SignUpScreen ({ navigation }){
    const [profileName, setProfileName] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')


    function submitSignUp() {
        let url = process.env.EXPO_PUBLIC_API_URL + 'api/users/signup';

        //empty check
        if (
            profileName === '' ||
            email === '' ||
            password === '' ||
            confirmPassword === ''
        ) {
            alert('missing field');
            return;
        }

        //password check
        if (password !== confirmPassword) {
            alert('mismatched password');
            return;
        }

        let postData = {
            'profileName': profileName,
            'email': email.toLowerCase(),
            'password': password
        };

        fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            redirect: 'follow',
            referrer: 'client',
            body: JSON.stringify(postData)
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 500) {
                return response.json().then((error) => {
                    Alert.alert( error.message);
                });
            } else {
                Alert.alert('unkown error occurred');
            }
        })
        .then((jsonResponse) => {
            if (jsonResponse !== undefined) {
                alert('Sign Up Success')
                Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success
                );
                navigation.goBack();
            }
        })
        .catch((err) => {
            console.error('Fetch error:', err);
        });

    }

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior="position"
            >
                <View style={[styles.mainView, styles.columnFlex]}>

                    {/*Top half  */}
                    <View style={[styles.flex2, styles.backgroundBlue]}>
                        <View style={[styles.flex3]}>
                            <View style={[styles.flex1]}/>
                            <ImageBackground 
                                source={require('../assets/icon-studywelb1.png')} 
                                style={[styles.flex5]} 
                                imageStyle= {[styles.objectFitCover, styles.objectFitContain]}
                            />
                        </View>
                        <View style={[styles.flex1, styles.justifyVerticalCenter, styles.justifyHorizontalCenter]}>
                            <Text style={[styles.text20, styles.fontBold, styles.colourWhite]}>STUDY WELB</Text>
                        </View>
                    </View>

                    {/* bottom half */}
                    <View style={[styles.flex5]}>

                        <View style={[styles.flex3]}/>
                        <View style={[styles.flex2, styles.rowFlex]}>
                            <View style={[styles.flex1]}/>
                            <TextInput
                                style={[styles.flex8, styles.borderRadius20Black, styles.justifyHorizontalCenter, styles.justifyVerticalCenter, styles.textAlignCenter, styles.text15]}
                                placeholder="Profile Name"
                                placeholderTextColor="#000000"
                                maxLength={16}
                                onChangeText={(profileName) => setProfileName(profileName)}
                            /> 
                            <View style={[styles.flex1]}/>
                        </View>

                        <View style={[styles.flex1]}/>
                        <View style={[styles.flex2, styles.rowFlex]}>
                            <View style={[styles.flex1]}/>
                            <TextInput
                                style={[styles.flex8, styles.borderRadius20Black, styles.justifyHorizontalCenter, styles.justifyVerticalCenter, styles.textAlignCenter, styles.text15]}
                                placeholder="Email"
                                inputMode='email'
                                placeholderTextColor="#000000"
                                onChangeText={(email) => setEmail(email)}
                            /> 
                            <View style={[styles.flex1]}/>
                        </View>

                        <View style={[styles.flex1]}/>
                        <View style={[styles.flex2, styles.rowFlex]}>
                            <View style={[styles.flex1]}/>
                            <TextInput
                                style={[styles.flex8, styles.borderRadius20Black, styles.justifyHorizontalCenter, styles.justifyVerticalCenter, styles.textAlignCenter, styles.text15]}
                                placeholder="Password"
                                placeholderTextColor="#003f5c"
                                secureTextEntry={true}
                                maxLength={16}
                                onChangeText={(password) => setPassword(password)}
                            />
                            <View style={[styles.flex1]}/>
                        </View>

                        <View style={[styles.flex1]}/>
                        <View style={[styles.flex2, styles.rowFlex]}>
                            <View style={[styles.flex1]}/>
                            <TextInput
                                style={[styles.flex8, styles.borderRadius20Black, styles.justifyHorizontalCenter, styles.justifyVerticalCenter, styles.textAlignCenter, styles.text15]}
                                placeholder="Confirm Password"
                                placeholderTextColor="#003f5c"
                                secureTextEntry={true}
                                maxLength={16}
                                onChangeText={(password) => setConfirmPassword(password)}
                            />
                            <View style={[styles.flex1]}/>
                        </View>

                        <View style={[styles.flex1]}/>
                        <View style={[styles.flex2]}>
                            <SubmitButton props={{text: "Submit", onPress: submitSignUp}}/>
                        </View>

                        <View style={[styles.flex3]}/>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
