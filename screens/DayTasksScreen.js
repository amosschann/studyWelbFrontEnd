import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import styles from '../components/Style';
import { getAccessToken } from '../helpers/AccessTokenHelper';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import { Dimensions } from 'react-native';
import { ActivityRowChecked, ActivityRowNotChecked, ActivityRowStatic } from '../components/ActivityRow';
import { localiseAndFormatDBDate } from '../helpers/DateTimeHelper';
const { height } = Dimensions.get('screen');


export default function DayTasksScreen({ navigation: { navigate }, route }){
    const [accessToken, setAccessToken] = useState('');
    const [toDoTasks, setToDoTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);


      
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
            fetchToDoTasks();
            fetchCompletedTasks();
        }
    }, [accessToken])


    /* Date Formatting */
    const inputDate = new Date(route.params.selectedDate);
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = inputDate.toLocaleDateString("en-GB", options);


    //fetch todo tasks for current date 
    function fetchToDoTasks() {
        console.log(route.params.selectedDate)
        const data = {
            date: route.params.selectedDate
        }
        searchParams = new URLSearchParams(data).toString();

        let url = process.env.EXPO_PUBLIC_API_URL + 'api/tasks/get-to-do-tasks?' + searchParams; 
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
            }
        })
        .then(async (jsonResponse) => {
            if (jsonResponse !== undefined) {
                console.log(jsonResponse)
                setToDoTasks(jsonResponse.result)
            
            }
        })
        .catch((err) => {
            console.error('Fetch error:', err);
        });
    }

    //fetch todo tasks for current date 
    function fetchCompletedTasks() {
        console.log(route.params.selectedDate)
        const data = {
            date: route.params.selectedDate
        }
        searchParams = new URLSearchParams(data).toString();

        let url = process.env.EXPO_PUBLIC_API_URL + 'api/tasks/get-completed-tasks?' + searchParams; 
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
            }
        })
        .then(async (jsonResponse) => {
            if (jsonResponse !== undefined) {
                console.log(jsonResponse)
                setCompletedTasks(jsonResponse.result)
            
            }
        })
        .catch((err) => {
            console.error('Fetch error:', err);
        });
    }


    return (
        
        <SafeAreaView style={styles.container}>
            <View style={[styles.mainView, styles.columnFlex]}>

                {/*Top half  */}
                <View style={[styles.flex3]}>
                    <View style={[styles.flex2, styles.backgroundLightBlue, styles.justifyVerticalCenter]}>
                        <TouchableOpacity style={[styles.positionAbsolute, { right: 10 }]}>
                            <Text style={[styles.text15, styles.fontBold]}>Daily Journal →</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.flex5]}>

                    </View>
                </View>

                {/* bottom half */}
                <View style={[styles.flex7, styles.backgroundLightBlue]}>
                <View style={[styles.flex1, styles.justifyVerticalCenter, styles.rowFlex, styles.justifyHorizontalCenter]}>
                    <View style={[styles.flex1, styles.justifyHorizontalCenter]}>
                        <Text style={[styles.text20, styles.fontBold]}>{formattedDate}</Text>
                    </View>
                    <TouchableOpacity style={[styles.positionAbsolute, { right: 10 }]}>
                        <Text style={[styles.text15]}>Add Task +</Text>
                    </TouchableOpacity>
                </View>
                    <View style={[styles.flex6, styles.backgroundWhite]}>
                    <ScrollView style={[styles.flex1]}>
                        {
                            (toDoTasks.length > 0 || completedTasks.length > 0) ? (
                                <React.Fragment>
                                    <Text  style={[styles.text20, styles.textAlignCenter, styles.fontBold, styles.paddingTopBottom20]} > To Do </Text>
                                    {toDoTasks.map((resp, index) => (
                                        <ActivityRowNotChecked
                                            key={'activityrow' + index}
                                            props={{
                                                onPress: () => console.log('hello'),
                                                activity: resp.task_title,
                                                time: resp.start_time.substring(0, resp.start_time.length - 3) +
                                                    " - " +
                                                    resp.end_time.substring(0, resp.start_time.length - 3)
                                            }}
                                        />
                                    ))}
                                    <Text  style={[styles.text20, styles.textAlignCenter, styles.fontBold, styles.paddingTop40Bottom20]} > Completed </Text>
                                    {completedTasks.map((resp, index) => (
                                        <ActivityRowNotChecked
                                            key={'activityrow' + index}
                                            props={{
                                                onPress: () => console.log('hello'),
                                                activity: resp.task_title,
                                                time: resp.start_time.substring(0, resp.start_time.length - 3) +
                                                    " - " +
                                                    resp.end_time.substring(0, resp.start_time.length - 3)
                                            }}
                                        />
                                    ))}
                                </React.Fragment>
                            ) : (
                                <ActivityRowStatic
                                    props={{
                                        onPress: () => console.log('hello'),
                                        activity: 'no tasks for the day',
                                        time: 'add a task'
                                    }}
                                />
                            )
                        }

                    </ScrollView>
                    </View>

                </View>
            </View>
        </SafeAreaView>
    );
}
