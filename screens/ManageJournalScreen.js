import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Alert, TextInput, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Text, Keyboard,  TouchableWithoutFeedback, ScrollView,  Dimensions } from 'react-native';
import styles from '../components/Style';
import * as Haptics from 'expo-haptics';
import { SubmitButton } from '../components/Buttons';
import { getAccessToken } from '../helpers/AccessTokenHelper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const { height, width } = Dimensions.get('screen');

export default function ManageJournalScreen ({ navigation: { goBack, navigate }, route }){
    const [accessToken, setAccessToken] = useState('');
    const [gratitude, setGratitude] = useState( route.params.gratitude);
    const [general, setGeneral] = useState( route.params.general);
    const [moodDescription, setMoodDescription] = useState( route.params.moodDescription);
    const [mood, setMood] = useState( route.params.mood);


    //access token
    useEffect(() => {
        //initial load from login
        getAccessToken().then(accessToken => {
            setAccessToken(accessToken);
        })
    }, []);

    //for both edit and add - backend handles the checks to see if there is a need to set or insert 
    function submitJournalEntry() {

        let url = process.env.EXPO_PUBLIC_API_URL + 'api/journals/update-journal-entry'; 
        // empty check
        if (
            gratitude === '' ||
            general === '' ||
            moodDescription === '' ||
            mood === ''
        ) {
            alert('missing field');
            return;
        }

        let postData = {
            'gratitude': gratitude,
            'general': general,
            'moodDescription': moodDescription,
            'mood': mood,
            'date': route.params.selectedDate
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

    //date formating
    const inputDate = new Date(route.params.selectedDate);
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = inputDate.toLocaleDateString("en-GB", options);


    //emoji size based on chosen overallmood
    let happySize = 20;
    let neutralSize = 20;
    let sadSize = 20;
    if (mood === 0) {
        happySize = 15;
    } else if (mood === 1) {
        neutralSize = 15;
    } else if (mood === 2) {
        sadSize = 15;
    }
    return (
        <SafeAreaView style={styles.container} >
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'position' : 'height'}
            >
            <TouchableWithoutFeedback 
                onPress={Keyboard.dismiss} 
                accessible={false}
                style={styles.container}
            >
            
                <View style={[styles.mainView, styles.columnFlex]}>

                    <View style={[styles.flex4, styles.backgroundBlue, styles.justifyVerticalCenter, styles.justifyHorizontalCenter]}>
                        <Text style={[styles.text20, styles.fontBold, styles.colourWhite]}>{formattedDate}</Text>
                    </View>

                    <View style={[styles.flex7, styles.paddingLeftRight10, styles.backgroundBlue]}>
                        <View style={[styles.flex1, styles.backgroundWhite, styles.borderRadius10]}>
                            <View style={[styles.flex1, styles.justifyVerticalCenter, styles.paddingAll10]}>
                                <Text style={[styles.text20, styles.textAlignCenter]}>Overall Mood</Text>
                            </View>
                            <View style={[styles.flex3, styles.paddingLeftRight10, styles.rowFlex, styles.justifyVerticalCenter]}>
                                <TouchableOpacity style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]} onPress={() => setMood(0)} >
                                    <MaterialCommunityIcons name="emoticon-happy-outline" size={height/happySize} color="green" />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]} onPress={() => setMood(1)} >
                                    <MaterialCommunityIcons name="emoticon-neutral-outline" size={height/neutralSize} color="orange" />
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]} onPress={() => setMood(2)} >
                                    <MaterialCommunityIcons name="emoticon-sad-outline" size={height/sadSize} color="red" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    
                    <View style={[styles.flex1, styles.backgroundBlue]} />

                    <View style={[styles.flex10, styles.paddingLeftRight10, styles.backgroundBlue]}>
                        <ScrollView style={[styles.flex1, styles.backgroundWhite, styles.borderRadius10]}>
                            <View style={[styles.justifyVerticalCenter, styles.paddingAll10]}>
                                <Text style={[styles.text20, styles.textAlignCenter]}>Gratitude</Text>
                            </View>
                            <View style={[styles.paddingLeftRight10]}>
                                <TextInput
                                    style={[styles.text15]}
                                    placeholder="Write 5 things you are grateful about today"
                                    defaultValue={gratitude}
                                    placeholderTextColor="gray"
                                    maxLength={255}
                                    multiline={true}
                                    onChangeText={(gratitude) => setGratitude(gratitude)}
                                /> 
                            </View>
                        </ScrollView>
                    </View>

                    <View style={[styles.flex1, styles.backgroundBlue]} />

                    <View style={[styles.flex10, styles.paddingLeftRight10, styles.backgroundBlue]}>
                        <ScrollView style={[styles.flex1, styles.backgroundWhite, styles.borderRadius10]}>
                            <View style={[styles.justifyVerticalCenter, styles.paddingAll10]}>
                                <Text style={[styles.text20, styles.textAlignCenter]}>General</Text>
                            </View>
                            <View style={[styles.paddingLeftRight10]}>
                                <TextInput
                                    style={[styles.text15]}
                                    placeholder="Write about your day here"
                                    defaultValue={general}
                                    placeholderTextColor="gray"
                                    maxLength={255}
                                    multiline={true}
                                    onChangeText={(general) => setGeneral(general)}
                                /> 
                            </View>
                        </ScrollView>
                    </View>


                    <View style={[styles.flex1, styles.backgroundBlue]} />
                    
                    <View style={[styles.flex5, styles.paddingLeftRight10, styles.backgroundBlue]}>
                        <ScrollView style={[styles.flex1, styles.backgroundWhite, styles.borderRadius10]}>
                            <View style={[styles.justifyVerticalCenter, styles.paddingAll10]}>
                                <Text style={[styles.text20, styles.textAlignCenter]}>Mood Description</Text>
                            </View>
                            <View style={[styles.paddingLeftRight10]}>
                                <TextInput
                                    style={[styles.text15, styles.textAlignCenter]}
                                    placeholder="Up to three words to describe your mood"
                                    defaultValue={moodDescription}
                                    placeholderTextColor="gray"
                                    maxLength={50}
                                    onChangeText={(moodDescription) => setMoodDescription(moodDescription)}
                                /> 
                            </View>
                        </ScrollView>
                    </View>

                    <View style={[styles.flex1, styles.backgroundBlue]} />
                    <View style={[styles.flex3, styles.backgroundBlue]}>
                        <SubmitButton props={{text: "Submit", onPress: () => submitJournalEntry()}}/>
                    </View>
                    <View style={[styles.flex2, styles.backgroundBlue]}/>
                </View>
            </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
