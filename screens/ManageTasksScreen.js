import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Alert, TextInput, TouchableOpacity, ImageBackground, Text, Keyboard, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView} from 'react-native';
import styles from '../components/Style';
import * as Haptics from 'expo-haptics';
import { SubmitButton } from '../components/Buttons';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { convertDateTimeToDBTimeFormat, formatTime } from '../helpers/DateTimeHelper';
import { getAccessToken } from '../helpers/AccessTokenHelper';

export default function ManageTasksScreen ({ navigation: { goBack }, route }){
    const [accessToken, setAccessToken] = useState('');
    const [title, setTitle] = useState(route.params.title);
    const [taskDescription, setTaskDescription] = useState(route.params.taskDescription);
    const [startTime, setStartTime] = useState(new Date(route.params.selectedDate + 'T' + route.params.startTime));
    const [endTime, setEndTime] = useState(new Date(route.params.selectedDate + 'T' + route.params.endTime));
    const [showDTP1, setShowDTP1] = useState(false);
    const [showDTP2, setShowDTP2] = useState(false);


    //access token
    useEffect(() => {
        //initial load from login
        getAccessToken().then(accessToken => {
            setAccessToken(accessToken);
        })
    }, []);

    function submitEditTask() {
        let url = process.env.EXPO_PUBLIC_API_URL + 'api/tasks/edit-task';

        // empty check
        if (
            title === '' ||
            taskDescription === '' ||
            startTime === '' ||
            endTime === ''
        ) {
            alert('missing field');
            return;
        }

        let postData = {
            'title': title,
            'taskDescription': taskDescription,
            'startTime': convertDateTimeToDBTimeFormat(startTime),
            'endTime': convertDateTimeToDBTimeFormat(endTime),
            'task_id': route.params.task_id
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
                behavior={Platform.OS === 'ios' ? 'position' : 'height'}
            >
            <TouchableWithoutFeedback 
                onPress={Keyboard.dismiss} 
                accessible={false}
                style={styles.container}
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
                    <View style={[styles.flex5, styles.backgroundBlue]}>

                        <View style={[styles.flex1]}/>

                        <View style={[styles.flex5, styles.paddingLeftRight10, styles.backgroundBlue]}>
                            <ScrollView style={[styles.flex1, styles.backgroundWhite, styles.borderRadius10]}>
                                <View style={[styles.justifyVerticalCenter, styles.paddingAll10]}>
                                    <Text style={[styles.text20, styles.textAlignCenter]}>Title</Text>
                                </View>
                                <View style={[styles.paddingLeftRight10,]}>
                                    <TextInput
                                        style={[styles.text15]}
                                        placeholder="Title"
                                        defaultValue={title}
                                        placeholderTextColor="#000000"
                                        maxLength={50}
                                        onChangeText={(title) => setTitle(title)}
                                    /> 
                                </View>
                            </ScrollView>
                        </View>

                        <View style={[styles.flex1]}/>

                        <View style={[styles.flex10, styles.paddingLeftRight10, styles.backgroundBlue]}>
                            <ScrollView style={[styles.flex1, styles.backgroundWhite, styles.borderRadius10]}>
                                <View style={[styles.justifyVerticalCenter, styles.paddingAll10]}>
                                    <Text style={[styles.text20, styles.textAlignCenter]}>Description</Text>
                                </View>
                                <View style={[styles.paddingLeftRight10,]}>
                                    <TextInput
                                        style={[styles.text15]}
                                        placeholder="Description"
                                        defaultValue={taskDescription}
                                        placeholderTextColor="#000000"
                                        maxLength={255}
                                        multiline={true}
                                        onChangeText={(description) => setTaskDescription(description)}
                                    /> 
                                </View>
                            </ScrollView>
                        </View>

                        <View style={[styles.flex1]}/>

                        <View style={[styles.flex8, styles.columnFlex, styles.paddingLeftRight10, styles.backgroundBlue]}>
                            <View style={[styles.flex3, styles.rowFlex, styles.backgroundWhite, styles.borderRadiusTop10]}>
                                <View style={[styles.flex1, styles.columnFlex]}/>
                                    <View style={[styles.flex1, styles.justifyVerticalCenter, styles.justifyHorizontalCenter]}>
                                        <Text style={[styles.text20, styles.textAlignLeft]}>Start Time </Text>
                                    </View>
                                    <View style={[styles.flex1, styles.justifyVerticalCenter]}>
                                        {Platform.OS === "ios"? 
                                            <RNDateTimePicker mode="time" value={startTime} onChange={(event, time) => setStartTime(time)}/>
                                        :
                                            <TouchableOpacity style={[styles.flex1, styles.rowFlex]} onPress={()=> {setShowDTP1(true)}}>
                                                <View style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalCenter, styles.textAlignCenter, styles.marginBottomTop5]}>
                                                    {
                                                        showDTP1 && 
                                                        <RNDateTimePicker 
                                                            accentColor="FFFFFF"
                                                            mode="time" 
                                                            value={startTime} 
                                                            onChange={(event, time) => {
                                                            if(event.type=== 'set' ) {
                                                                setStartTime(time); 
                                                            } 
                                                            setShowDTP1(false)
                                                            }}
                                                        /> 
                                                    }
                                                    <Text style={[styles.text20]}>{formatTime(startTime)}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                <View style={[styles.flex1]}/>
                            </View>

                            <View style={[styles.flex3, styles.rowFlex, styles.backgroundWhite, styles.borderRadiusBottom10]}>
                                <View style={[styles.flex1, styles.columnFlex]}/>
                                    <View style={[styles.flex1, styles.justifyVerticalCenter, styles.justifyHorizontalCenter]}>
                                        <Text style={[styles.text20, styles.textAlignLeft]}>End Time </Text>
                                    </View>
                                    <View style={[styles.flex1, styles.justifyVerticalCenter]}>
                                        {Platform.OS === "ios"? 
                                            <RNDateTimePicker mode="time" value={endTime} onChange={(event, time) => setEndTime(time)} minimumDate={startTime}/>
                                        :
                                            <TouchableOpacity style={[styles.flex1, styles.rowFlex]} onPress={()=> {setShowDTP2(true)}}>
                                                <View style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalCenter, styles.textAlignCenter, styles.marginBottomTop5]}>
                                                    {
                                                        showDTP2 && 
                                                        <RNDateTimePicker mode="time" value={endTime} onChange={(event, time) => {
                                                            if(event.type=== 'set' ) {
                                                                setEndTime(time); 
                                                            } 
                                                            setShowDTP2(false)
                                                            }}
                                                        /> 
                                                    }
                                                    <Text style={[styles.text20]}>{formatTime(endTime)}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        }
                                    </View>
                                <View style={[styles.flex1]}/>
                            </View>
                        </View>

                        <View style={[styles.flex1]}/>

                        <View style={[styles.flex3]}>
                            <SubmitButton props={{text: "Submit", onPress: submitEditTask}}/>
                        </View>

                        <View style={[styles.flex1]}/>
                    </View>
                </View>
            </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
