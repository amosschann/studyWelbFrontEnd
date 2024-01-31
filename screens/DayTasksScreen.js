import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import styles from '../components/Style';
import { getAccessToken } from '../helpers/AccessTokenHelper';
import { ActivityRowChecked, ActivityRowNotChecked, ActivityRowStatic } from '../components/ActivityRow';
import { useNavigationState } from '@react-navigation/native';


export default function DayTasksScreen({ navigation: { navigate }, route }){
    const pageIndex = useNavigationState(state => state.index);
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

    useEffect(() => { 
        //reload data once back from add task / daily journal
        if (accessToken !== '') {
            if (pageIndex === 1) {
                fetchToDoTasks();
                fetchCompletedTasks();
            }
        }
    }, [pageIndex])


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
                    <View style={[styles.flex2, styles.backgroundBlue, styles.justifyVerticalCenter]}>
                        <TouchableOpacity style={[styles.positionAbsolute, { right: 10 }]}>
                            <Text style={[styles.text15, styles.fontBold, styles.colourWhite]}>Daily Journal →</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.flex5]}>

                    </View>
                </View>

                {/* bottom half */}
                <View style={[styles.flex7, styles.backgroundBlue]}>
                <View style={[styles.flex1, styles.justifyVerticalCenter, styles.rowFlex, styles.justifyHorizontalCenter]}>
                    <View style={[styles.flex1, styles.justifyHorizontalCenter]}>
                        <Text style={[styles.text20, styles.fontBold, styles.colourWhite]}>{formattedDate}</Text>
                    </View>
                    <TouchableOpacity 
                        style={[styles.positionAbsolute, { right: 10 }]} 
                        onPress= {() => navigate('AddTasksScreen', { selectedDate: route.params.selectedDate })}
                    >
                        <Text style={[styles.text15, styles.colourWhite]}>Add Task +</Text>
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
                                        <ActivityRowChecked
                                            key={'activityrow' + index}
                                            props={{
                                                onPress: () => console.log('hello'),
                                                activity: resp.task_title,
                                                mood: resp.mood,
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
