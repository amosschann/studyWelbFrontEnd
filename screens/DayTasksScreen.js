import React, { useEffect, useState, useRef  } from 'react';
import { Animated, Easing, Alert, SafeAreaView, ScrollView, Text, TouchableOpacity, View, Button, Dimensions } from 'react-native';
import styles from '../components/Style';
import { getAccessToken } from '../helpers/AccessTokenHelper';
import { AcitivityWellnessRow, AcitivityWellnessRowComplete, ActivityRowChecked, ActivityRowNotChecked, ActivityRowStatic } from '../components/ActivityRow';
import { useNavigationState } from '@react-navigation/native';
const { height, width } = Dimensions.get('screen');
import * as Haptics from 'expo-haptics';
import MoodMeter from '../components/MoodMeter';
import { CompleteToDoTaskModal, CompletedTaskModal, ToDoTaskModal, WellnessTaskModal } from '../components/PopUps';
import { calculateMood } from '../helpers/MoodHelper';

export default function DayTasksScreen({ navigation: { navigate }, route }){
    const pageIndex = useNavigationState(state => state.index);
    const [accessToken, setAccessToken] = useState('');
    const [wellnessTasks, setWellnessTasks] = useState([]);
    const [toDoTasks, setToDoTasks] = useState([]);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [moreOptionsVisibleToDo, setmoreOptionsVisibleToDo] = useState(false);
    const [moreOptionsVisibleCompleted, setMoreOptionsVisibleCompleted] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState('');
    const [selectedToDoTaskIndex, setSelectedToDoTaskIndex] = useState('default');
    const [selectedCompletedTaskIndex, setSelectedCompletedTaskIndex] = useState('default');
    const [toggleComplete, setToggleComplete] = useState(false);
    const [fetchTriggerCompletedTask, setfetchTriggerCompletedTask] = useState('')

    //for calculating needle position
    const [moodLevel, setMoodLevel] = useState(50);
    //for calculating wellness prompt
    const [currentMoodPoint, setCurrentMoodPoint] = useState(0)

    const [wellnessTaskNumber, setWellnessTaskNumber] = useState(Math.floor(Math.random() * 5))
    const fadeAnimation = useRef(new Animated.Value(0)).current;
    const [toggleWellness, setToggleWellness] = useState(false);
    const [started, setStarted] = useState(false);
    const [progressFill, setProgressFill] = useState(0);
      
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
        }
    }, [accessToken])

    useEffect(() => { 
        //reload data once back from add task / daily journal
        if (accessToken !== '') {
            if (pageIndex === 1) {
                fetchToDoTasks();
            }
        }
    }, [pageIndex])

    //fetches completed tasks right after todo task finishes fetching
    useEffect(() => {
        if (accessToken !== '') {
            fetchCompletedTasks();
        }
    }, [fetchTriggerCompletedTask])


    /* Date Formatting */
    const inputDate = new Date(route.params.selectedDate);
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = inputDate.toLocaleDateString("en-GB", options);

    //animation for wellness fade in and out
    const fadeIn = () => {
        Animated.timing(fadeAnimation, {
        toValue: 1,
        duration: 1000, 
        easing: Easing.linear,
        useNativeDriver: true,
        }).start();
    };
    
    const fadeOut = () => {
        Animated.timing(fadeAnimation, {
        toValue: 0,
        duration: 1000, 
        easing: Easing.linear,
        useNativeDriver: true,
        }).start();
    };

    //fetch todo tasks for current date 
    function fetchToDoTasks() {
        console.log('fetching todo tasks')
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
                console.log(response)
            }
        })
        .then(async (jsonResponse) => {
            if (jsonResponse !== undefined) {
                setToDoTasks(jsonResponse.result);
            }
            //trigger complete task fetch
            setfetchTriggerCompletedTask(Date.now());
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
            Alert.alert('Unknown error occurred');
            console.log(response);
            }
        })
        .then(async (jsonResponse) => {
            if (jsonResponse !== undefined) {
                setCompletedTasks(jsonResponse.result)
                //calculation for mood - if wellness task needs to be fetched
                calculateMood(jsonResponse, setMoodLevel, setCurrentMoodPoint, fetchWellnessActivities, fadeOut, setWellnessTasks)
            }
        })
        .catch((err) => {
            console.error('Fetch error:', err);
        });
    }

    //fetch wellness tasks
    function fetchWellnessActivities() {
        let url = process.env.EXPO_PUBLIC_API_URL + 'api/wellness/get-wellness'; 
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
                const wellnessTasks = jsonResponse.result.map(task => ({
                    id: task.id,
                    title: task.title,
                    description: task.description
                }));
                setWellnessTasks(wellnessTasks);     
                fadeIn();
            }
        })
        .catch((err) => {
            console.error('Fetch error:', err);
        });
    }

    //submit post request to delete task
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
                console.log(response)
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

    //submit post request to submit task completion 
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
                console.log(response)
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

    //submit post request to undo complete
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
                console.log(response)
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

    //submit wellness complete
    function submitCompleteWellnessTask() {
        let url = process.env.EXPO_PUBLIC_API_URL + 'api/tasks/complete-wellness-task';

        let postData = {
            'title': wellnessTasks[wellnessTaskNumber].title,
            'taskDescription' : wellnessTasks[wellnessTaskNumber].description,
            'date': route.params.selectedDate,
            'wellnessCheckpoint': currentMoodPoint
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
                console.log(response)
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
                toggleWellnessTask();
            }
        })
        .catch((err) => {
            console.error('Fetch error:', err);
        });
    }



    // set up pop up toggle functions
    //toggle function for todo task pop up modal
    function toggleMoreOptionsToDo () {
        setmoreOptionsVisibleToDo(!moreOptionsVisibleToDo);
    };

    //toggle function for complete task pop up modal
    function toggleMoreOptionsCompleted () {
        setMoreOptionsVisibleCompleted(!moreOptionsVisibleCompleted);
    };

    //toggle function for complete task pop up modal
    function toggleCompleteTask() {
        setToggleComplete(!toggleComplete);
    };

    //toggle function for wellness pop up modal
    function toggleWellnessTask() {
        setToggleWellness(!toggleWellness);
        //reset wellness bar 
        setStarted(false);
        setProgressFill(0);
    }
    
    //toogle function for wellness started in pop up modal
    function toggleStarted() {
        setStarted(!started);
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={[styles.mainView, styles.columnFlex]}>

                {/*Top half  */}
                <View style={[styles.flex3, styles.paddingAll15]}>
                    <View style={[styles.flex1]}>
                        <MoodMeter
                            size={height * (3/7)}
                            width={(height / 9) }
                            moodLevel={moodLevel}
                        >

                            {
                                (moodLevel) => (
                                <Text>
                                    { moodLevel }
                                </Text>
                                )
                            }
                        </MoodMeter>
                    </View>
                </View>

                {/* pop up modals */}
                <ToDoTaskModal
                    isVisible={moreOptionsVisibleToDo}
                    toggleModal={toggleMoreOptionsToDo}
                    task={toDoTasks[selectedToDoTaskIndex]}
                    onEdit={task => {
                        navigate('ManageTasksScreen', { 
                            selectedDate: route.params.selectedDate, 
                            title: task.task_title,
                            taskDescription: task.task_description,
                            startTime: task.start_time,
                            endTime: task.end_time,
                            task_id: selectedItemId
                        });
                    }}
                    onDelete={submitDeleteTask}
                />
                <CompletedTaskModal
                    isVisible={moreOptionsVisibleCompleted}
                    toggleModal={toggleMoreOptionsCompleted}
                    completedTasks={completedTasks[selectedCompletedTaskIndex]}
                    submitUndoComplete={submitUndoComplete}
                />
                <CompleteToDoTaskModal
                    isVisible={toggleComplete}
                    toggleModal={toggleCompleteTask}
                    submitCompleteTask={submitCompleteTask}
                    toDoTasks={toDoTasks[selectedToDoTaskIndex]}
                />

                <WellnessTaskModal
                    isVisible={toggleWellness}
                    toggleModal={toggleWellnessTask}
                    submitCompleteWellness={submitCompleteWellnessTask}
                    wellnessTasks={wellnessTasks[wellnessTaskNumber]}
                    toggleStarted={toggleStarted}
                    started={started}
                    progressFill={progressFill}
                    setProgressFill={setProgressFill}
                />
                
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
                                    <Text  style={[styles.text20, styles.textAlignCenter, styles.fontBold, styles.paddingTopBottom20]} >To Do</Text>
                                    {wellnessTasks.map((resp, index) => (
                                        wellnessTaskNumber == index?
                                        <Animated.View style={{ opacity: fadeAnimation }}>
                                            <AcitivityWellnessRow
                                                key={'activitywellnessrow' + index}
                                                props={{
                                                        onPress: () => {
                                                            toggleWellnessTask();
                                                        },
                                                        title: resp.title,
                                                    }}
                                                />
                                            </Animated.View> :
                                            <></>
                                    ))}
                                    {toDoTasks.map((resp, index) => (
                                        <ActivityRowNotChecked
                                            key={'activityrowDayTask' + index}
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
                                    <Text  style={[styles.text20, styles.textAlignCenter, styles.fontBold, styles.paddingTop40Bottom20]} >Completed</Text>
                                    {completedTasks.map((resp, index) => (
                                        resp.wellnessCheckpoint  == 0?
                                        <ActivityRowChecked
                                            key={'activityrowComplete' + index}
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
                                        :
                                        <AcitivityWellnessRowComplete
                                            key={'activityrowWComplete' + index}
                                            props={{
                                                activity: resp.task_title,
                                                mood: resp.mood,
                                                time:  resp.start_time.substring(0, resp.start_time.length - 3) +
                                                    " - " +
                                                    resp.end_time.substring(0, resp.start_time.length - 3)
                                            }}
                                        />
                                    ))}
                                </React.Fragment>
                            ) : (
                                <ActivityRowStatic
                                    key={'noactivityrowDayTask'}
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
