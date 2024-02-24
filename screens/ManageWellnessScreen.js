import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Alert, TextInput, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Text, Keyboard,  TouchableWithoutFeedback, ScrollView,  Dimensions } from 'react-native';
import styles from '../components/Style';
import * as Haptics from 'expo-haptics';
import { SubmitButton } from '../components/Buttons';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { convertDateTimeToDBTimeFormat } from '../helpers/DateTimeHelper';
import { getAccessToken } from '../helpers/AccessTokenHelper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const { height, width } = Dimensions.get('screen');

export default function ManageWellnessScreen ({ navigation: { goBack, navigate }, route }){
    const [accessToken, setAccessToken] = useState('');
    const [title, setTitle] = useState( route.params.title);
    const [description, setDescription] = useState( route.params.description);


    //access token
    useEffect(() => {
        //initial load from login
        getAccessToken().then(accessToken => {
            setAccessToken(accessToken);
        })
    }, []);

    // updates wellness tab
    function updateWellness() {

        let url = process.env.EXPO_PUBLIC_API_URL + 'api/wellness/update-wellness'; 
        // empty check
        if (
            title === '' ||
            description === ''
        ) {
            alert('missing field');
            return;
        }

        let postData = {
            'wellness_id': route.params.id,
            'title': title,
            'description': description,
        };
        console.log(postData)
        fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization' : accessToken
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
                console.log(response)
            }
        })
        .then((jsonResponse) => {
            if (jsonResponse !== undefined) {
                alert('Update Succesful')
                Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success
                );
                goBack();
            }
        })
        .catch((err) => {
            console.error('Fetch error:', err);
        });

    }


    return (
        <SafeAreaView style={styles.container} >
            <KeyboardAvoidingView
                style={styles.container}
                behavior="position"
            >
            <TouchableWithoutFeedback 
                onPress={Keyboard.dismiss} 
                accessible={false}
                style={styles.container}
            >
            
                <View style={[styles.mainView, styles.columnFlex]}>
                    {/*Top half  */}
                    <View style={[styles.flex10, styles.backgroundBlue]}>
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
                    
                    <View style={[styles.flex1, styles.backgroundBlue]} />

                    <View style={[styles.flex5, styles.paddingLeftRight10, styles.backgroundBlue]}>
                        <ScrollView style={[styles.flex1, styles.backgroundWhite, styles.borderRadius10]}>
                            <View style={[styles.justifyVerticalCenter, styles.paddingAll10]}>
                                <Text style={[styles.text20, styles.textAlignCenter]}>Title</Text>
                            </View>
                            <View style={[styles.paddingLeftRight10,]}>
                                <TextInput
                                    style={[styles.flex1, styles.text15]}
                                    placeholder="Write 5 things you are grateful about today"
                                    defaultValue={title}
                                    placeholderTextColor="gray"
                                    maxLength={255}
                                    multiline={true}
                                    onChangeText={(title) => setTitle(title)}
                                /> 
                            </View>
                        </ScrollView>
                    </View>

                    <View style={[styles.flex1, styles.backgroundBlue]} />

                    <View style={[styles.flex10, styles.paddingLeftRight10, styles.backgroundBlue]}>
                        <ScrollView style={[styles.flex1, styles.backgroundWhite, styles.borderRadius10]}>
                            <View style={[styles.justifyVerticalCenter, styles.paddingAll10]}>
                                <Text style={[styles.text20, styles.textAlignCenter]}>Description</Text>
                            </View>
                            <View style={[styles.paddingLeftRight10]}>
                                <TextInput
                                    style={[styles.flex1, styles.text15]}
                                    placeholder="Write about your day here"
                                    defaultValue={description}
                                    placeholderTextColor="gray"
                                    maxLength={255}
                                    multiline={true}
                                    onChangeText={(description) => setDescription(description)}
                                /> 
                            </View>
                        </ScrollView>
                    </View>


                    <View style={[styles.flex1, styles.backgroundBlue]} />
                    

                    <View style={[styles.flex1, styles.backgroundBlue]} />
                    <View style={[styles.flex3, styles.backgroundBlue]}>
                        <SubmitButton props={{text: "Submit", onPress: () => updateWellness()}}/>
                    </View>
                    <View style={[styles.flex2, styles.backgroundBlue]}/>
                </View>
            </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
