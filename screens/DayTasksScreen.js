import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View, Button, Dimensions } from 'react-native';
import styles from '../components/Style';
import { getAccessToken } from '../helpers/AccessTokenHelper';
import { ActivityRowChecked, ActivityRowNotChecked, ActivityRowStatic } from '../components/ActivityRow';
import { useNavigationState } from '@react-navigation/native';
import Modal from "react-native-modal";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const { height, width } = Dimensions.get('screen');
import * as Haptics from 'expo-haptics';

export default function DayTasksScreen({ navigation: { navigate }, route }){
    const pageIndex = useNavigationState(state => state.index);
    const [accessToken, setAccessToken] = useState('');
    const [toDoTasks, setToDoTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [moreOptionsVisibleToDo, setmoreOptionsVisibleToDo] = useState(false);
    const [moreOptionsVisibleCompleted, setMoreOptionsVisibleCompleted] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState('');
    const [selectedToDoTaskIndex, setSelectedToDoTaskIndex] = useState('default');
    const [selectedCompletedTaskIndex, setSelectedCompletedTaskIndex] = useState('default');
    const [toggleComplete, setToggleComplete] = useState(false);


      
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
                setToDoTasks(jsonResponse.result)
            
            }
        })
        .catch((err) => {
            console.error('Fetch error:', err);
        });
    }

    //fetch todo tasks for current date 
    function fetchCompletedTasks() {
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
                setCompletedTasks(jsonResponse.result)
            
            }
        })
        .catch((err) => {
            console.error('Fetch error:', err);
        });
    }

    //Submit Delete Task 
    function submitDeleteTask() {
        let url = process.env.EXPO_PUBLIC_API_URL + 'api/tasks/delete-task';

        let postData = {
            'task_id': selectedItemId
        };

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
            }
        })
        .then((jsonResponse) => {
            if (jsonResponse !== undefined) {
                Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success
                );
                //refetch todo tasks and close modal
                fetchToDoTasks();
                toggleMoreOptionsToDo();
            }
        })
        .catch((err) => {
            console.error('Fetch error:', err);
        });

    }

    function submitCompleteTask(mood) {
        let url = process.env.EXPO_PUBLIC_API_URL + 'api/tasks/complete-task';

        let postData = {
            'task_id': selectedItemId,
            'mood' : mood
        };

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
            }
        })
        .then((jsonResponse) => {
            if (jsonResponse !== undefined) {

                Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success
                );
                //refetch todo tasks, completed tasks and close modal
                fetchToDoTasks();
                fetchCompletedTasks();
                toggleCompleteTask();
            }
        })
        .catch((err) => {
            console.error('Fetch error:', err);
        });
    }

    function submitUndoComplete() {
        let url = process.env.EXPO_PUBLIC_API_URL + 'api/tasks/undo-complete-task';

        let postData = {
            'task_id': selectedItemId,
        };

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
            }
        })
        .then((jsonResponse) => {
            if (jsonResponse !== undefined) {
                Haptics.notificationAsync(
                    Haptics.NotificationFeedbackType.Success
                );
                //refetch todo tasks, completed tasks and close modal
                fetchToDoTasks();
                fetchCompletedTasks();
                toggleMoreOptionsCompleted();
            }
        })
        .catch((err) => {
            console.error('Fetch error:', err);
        });
    }


    //toggle function for todo task pop up modal
    function toggleMoreOptionsToDo () {
        setmoreOptionsVisibleToDo(!moreOptionsVisibleToDo);
    };
    
    //pop up modal for todo tasks 
    function MoreOptionsPopUpToDo() {
        return (
            <Modal isVisible={moreOptionsVisibleToDo}>
                <View style={[styles.flex1, styles.columnFlex]}>
                    <View style={[styles.flex2]}/>
                    <View style={[styles.flex3, styles.backgroundLightBlue, styles.borderRadius20, styles.paddingAll20]}>
                        <View style={[styles.flex1, styles.justifyHorizontalEnd]}>
                            <TouchableOpacity style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]} onPress={() => toggleMoreOptionsToDo()}>
                                <MaterialCommunityIcons name="close-circle-outline" size={height/25} color="black" />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold]} >Title</Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text15, styles.textAlignCenter]} >{toDoTasks[selectedToDoTaskIndex]?.task_title}</Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold]} >Time</Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text15, styles.textAlignCenter]} >{toDoTasks[selectedToDoTaskIndex]?.start_time + ' - ' + toDoTasks[selectedToDoTaskIndex]?.end_time}</Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold]} >Description</Text>
                        </View>
                        <View style={[styles.flex3]}>
                            <ScrollView style={[styles.flex1]}>
                                <Text style={[styles.text15, styles.textAlignLeft, styles.paddingLeftRight10]} >{toDoTasks[selectedToDoTaskIndex]?.task_description}</Text>
                            </ScrollView>
                        </View>
                        <View style={[styles.flex2, styles.rowFlex]}>
                            <TouchableOpacity 
                                style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]}
                                onPress= {() => {
                                    navigate('EditTasksScreen', { 
                                        selectedDate: route.params.selectedDate, 
                                        title: toDoTasks[selectedToDoTaskIndex]?.task_title,
                                        taskDescription: toDoTasks[selectedToDoTaskIndex]?.task_description,
                                        startTime: toDoTasks[selectedToDoTaskIndex]?.start_time,
                                        endTime: toDoTasks[selectedToDoTaskIndex]?.end_time,
                                        task_id: selectedItemId
                                    });
                                    toggleMoreOptionsToDo();
                                    }
                                }
                            >
                                <MaterialCommunityIcons name="pencil-circle-outline" size={height/15} color="green" />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]} onPress={() => submitDeleteTask()}>
                                <MaterialCommunityIcons name="delete-circle-outline" size={height/15} color="red" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.flex1]}/>
                </View>
            </Modal>
        )
    }

    //toggle function for complete task pop up modal
    function toggleMoreOptionsCompleted () {
        setMoreOptionsVisibleCompleted(!moreOptionsVisibleCompleted);
    };
    
    //pop up modal for complete task
    function MoreOptionsPopUpCompleted() {
        return (
            <Modal isVisible={moreOptionsVisibleCompleted}>
                <View style={[styles.flex1, styles.columnFlex]}>
                    <View style={[styles.flex2]}/>
                    <View style={[styles.flex3, styles.backgroundLightBlue, styles.borderRadius20, styles.paddingAll20]}>
                        <View style={[styles.flex1, styles.justifyHorizontalEnd]}>
                            <TouchableOpacity style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]} onPress={() => toggleMoreOptionsCompleted()}>
                                <MaterialCommunityIcons name="close-circle-outline" size={height/25} color="black" />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold]} >Title</Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text15, styles.textAlignCenter]} >{completedTasks[selectedCompletedTaskIndex]?.task_title}</Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold]} >Time</Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text15, styles.textAlignCenter]} >{completedTasks[selectedCompletedTaskIndex]?.start_time + ' - ' + completedTasks[selectedCompletedTaskIndex]?.end_time}</Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold]} >Description</Text>
                        </View>
                        <View style={[styles.flex3]}>
                            <ScrollView style={[styles.flex1]}>
                                <Text style={[styles.text15, styles.textAlignLeft, styles.paddingLeftRight10]} >{completedTasks[selectedCompletedTaskIndex]?.task_description}</Text>
                            </ScrollView>
                        </View>
                        <View style={[styles.flex2, styles.rowFlex]}>
                            <TouchableOpacity style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]}>
                            <Button
                                title="Undo Complete"
                                color="red"
                                onPress={() =>submitUndoComplete()}
                            />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.flex1]}/>
                </View>
            </Modal>
        )
    }

    //toggle function for complete task pop up modal
    function toggleCompleteTask() {
        setToggleComplete(!toggleComplete);
    };
    
    //pop up modal for todo tasks 
    function CompleteTaskPopUp() {
        return (
            <Modal isVisible={toggleComplete}>
                <View style={[styles.flex1, styles.columnFlex]}>
                    <View style={[styles.flex1]}/>
                    <View style={[styles.flex1, styles.backgroundLightBlue, styles.borderRadius20, styles.paddingAll20]}>
                        <View style={[styles.flex1, styles.justifyHorizontalEnd]}>
                            <TouchableOpacity style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]} onPress={() => toggleCompleteTask()}>
                                <MaterialCommunityIcons name="close-circle-outline" size={height/20} color="black" />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold]} >Title</Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text15, styles.textAlignCenter]} >{toDoTasks[selectedToDoTaskIndex]?.task_title}</Text>
                        </View>
                        
                        <View style={[styles.flex2, styles.rowFlex]}>
                            <TouchableOpacity style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]} onPress={() => submitCompleteTask(0)}>
                                <MaterialCommunityIcons name="emoticon-happy-outline" size={height/15} color="green" />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]} onPress={() => submitCompleteTask(1)}>
                                <MaterialCommunityIcons name="emoticon-neutral-outline" size={height/15} color="orange" />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]} onPress={() => submitCompleteTask(2)}>
                                <MaterialCommunityIcons name="emoticon-sad-outline" size={height/15} color="red" />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold]} >Complete with a mood</Text>
                        </View>
                    </View>
                    <View style={[styles.flex1]}/>
                </View>
            </Modal>
        )
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

                {/* pop up modals */}
                {MoreOptionsPopUpToDo()}
                {MoreOptionsPopUpCompleted()}
                {CompleteTaskPopUp()}
                
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
                                                onPress: () => {
                                                    toggleMoreOptionsToDo();
                                                    setSelectedToDoTaskIndex(index);
                                                    setSelectedItemId(resp.id)
                                                },
                                                onPressCheck: () => {
                                                    toggleCompleteTask();
                                                    setSelectedToDoTaskIndex(index);
                                                    setSelectedItemId(resp.id)
                                                },
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
                                                onPress: () => {
                                                    toggleMoreOptionsCompleted();
                                                    setSelectedCompletedTaskIndex(index);
                                                    setSelectedItemId(resp.id)
                                                },
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
