import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Alert, TextInput, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Text, Keyboard, TouchableWithoutFeedback, ScrollView,  Dimensions } from 'react-native';
import styles from '../components/Style';
import * as Haptics from 'expo-haptics';
import { SubmitButton } from '../components/Buttons';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { convertDateTimeToDBTimeFormat } from '../helpers/DateTimeHelper';
import { getAccessToken } from '../helpers/AccessTokenHelper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigationState } from '@react-navigation/native';
const { height, width } = Dimensions.get('screen');

export default function JournalScreen ({ navigation: { goBack, navigate }, route }){
    const pageIndex = useNavigationState(state => state.index);
    const [accessToken, setAccessToken] = useState('');
    const [gratitude, setGratitude] = useState('');
    const [general, setGeneral] = useState('');
    const [moodDescription, setMoodDescription] = useState('');
    const [mood, setMood] = useState('');

    //access token
    useEffect(() => {
        //initial load from login
        getAccessToken().then(accessToken => {
            setAccessToken(accessToken);
        })
    }, []);

    //initial fetch after access token
    useEffect(() => {
        if (accessToken !== '') {
            fetchJournalEntry();
        }
    }, [accessToken])

    useEffect(() => { 
        //reload data once back from add / edit journal
        if (accessToken !== '') {
            if (pageIndex === 1) {
                fetchJournalEntry()
            }
        }
    }, [pageIndex])

    function fetchJournalEntry() {
        const data = {
            date: route.params.selectedDate
        }
        searchParams = new URLSearchParams(data).toString();

        let url = process.env.EXPO_PUBLIC_API_URL + 'api/journals/get-journal-entry?' + searchParams; 
        fetch(url, {
            method: 'GET',
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
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                Alert.alert('unkown error occurred');
                console.log(response)
            }
        })
        .then(async (jsonResponse) => {
            if (jsonResponse !== undefined) {
                if (jsonResponse.result.length > 0) {
                    setGratitude(jsonResponse.result[0].gratitude);
                    setGeneral(jsonResponse.result[0].general);
                    setMoodDescription(jsonResponse.result[0].mood);
                    setMood(jsonResponse.result[0].overallmood);
                }
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

    return (
        <SafeAreaView style={styles.container} >
            <KeyboardAvoidingView
                style={styles.container}
                behavior="position"
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
                            <View style={[styles.flex3, styles.paddingLeftRight10, styles.justifyVerticalCenter]}>
                                {
                                    mood === 0 ?
                                    <View style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]} >
                                        <MaterialCommunityIcons name="emoticon-happy-outline" size={height/15} color="green" />
                                    </View>
                                    :
                                    mood === 1 ?
                                    <View style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]} >
                                        <MaterialCommunityIcons name="emoticon-neutral-outline" size={height/15} color="orange" />
                                    </View>
                                    :
                                    mood === 2 ? 
                                    <View style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]} >
                                        <MaterialCommunityIcons name="emoticon-sad-outline" size={height/15} color="red" />
                                    </View>
                                    :
                                    <View style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]} >
                                        
                                    </View>
                                }
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
                                <Text style={[styles.text15, styles.textAlignLeft]}>{gratitude}</Text>
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
                                <Text style={[styles.text15, styles.textAlignLeft]}>{general}</Text>
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
                                <Text style={[styles.text15, styles.textAlignCenter]}>{moodDescription}</Text>
                            </View>
                        </ScrollView>
                    </View>

                    <View style={[styles.flex1, styles.backgroundBlue]} />

                    <View style={[styles.flex3, styles.backgroundBlue]}>
                        <SubmitButton 
                            props={{
                                text: gratitude === '' ? "Add" : "Edit", 
                                onPress: () => navigate('ManageJournalScreen', 
                                { 
                                    selectedDate: route.params.selectedDate,
                                    gratitude: gratitude,
                                    general: general,
                                    moodDescription: moodDescription,
                                    mood: mood
                                }) 
                            }}
                        />
                    </View>
                    <View style={[styles.flex2, styles.backgroundBlue]}/>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
