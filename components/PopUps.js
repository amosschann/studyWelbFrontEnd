import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView,Dimensions, Button } from 'react-native';
import Modal from "react-native-modal";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../components/Style';
import { StartStopButton } from './Buttons';
const { height, width } = Dimensions.get('screen');
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { Easing } from 'react-native';


/**
 * pop up modal for todo activities 
 * 
 * @component
 * @param {object} props - component props
 * @param {boolean} props.isVisible - show modal if true
 * @param {function} props.toggleModal - function to toggle visibility useEffect
 * @param {array} props.task - main list of activities to get details from
 * @param {function} props.onEdit - navigation callback function 
 * @param {function} props.onDelete - delete callback function
 */
export const ToDoTaskModal = ({ isVisible, toggleModal, task, onEdit, onDelete }) => {
    //check for to do tasks
    if (task !== undefined) {
        // Extract task data
        const { task_title, start_time, end_time, task_description } = task;
        const popUpTime = `${start_time?.substring(0, start_time.length - 3)} - ${end_time?.substring(0, end_time.length - 3)}`;

        return (
            <Modal isVisible={isVisible}>
                <View style={[styles.flex1, styles.columnFlex]}>
                    <View style={[styles.flex1]}/>
                    
                    <View style={[styles.flex3, styles.backgroundWhite, styles.borderRadius20, styles.paddingAll20]}>
                        <View style={[styles.flex1, styles.justifyHorizontalEnd]}>
                            <TouchableOpacity style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]} onPress={toggleModal}>
                                <MaterialCommunityIcons name="close-circle-outline" size={height/25} color="black" />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold, styles.backgroundBlue, styles.colourWhite]}>Title</Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text15, styles.textAlignCenter, styles.fontBold]}>{task_title}</Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold, styles.backgroundBlue, styles.colourWhite]}>Time</Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text15, styles.textAlignCenter, styles.fontBold]}>{popUpTime}</Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold, styles.backgroundBlue, styles.colourWhite]}>Description</Text>
                        </View>
                        <View style={[styles.flex3]}>
                            <ScrollView style={[styles.flex1]}>
                                <Text style={[styles.text15, styles.textAlignLeft, styles.paddingLeftRight10, styles.fontBold]}>{task_description}</Text>
                            </ScrollView>
                        </View>
                        <View style={[styles.flex2, styles.rowFlex]}>
                            <TouchableOpacity 
                                style={[styles.flex1, styles.columnFlex, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]}
                                onPress={() => {
                                    onEdit(task);
                                    toggleModal();
                                }}
                            >
                                <View style={[styles.flex3]}>
                                    <MaterialCommunityIcons name="pencil-circle-outline" size={height/15} color="green" />
                                </View>
                                <View style={[styles.flex1]}>
                                    <Text style={[styles.text15, styles.textAlignCenter, styles.fontBold]}>Edit</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.flex1, styles.columnFlex, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]} onPress={onDelete}>
                                <View style={[styles.flex3]}>
                                    <MaterialCommunityIcons name="delete-circle-outline" size={height/15} color="red" />
                                </View>
                                <View style={[styles.flex1]}>
                                    <Text style={[styles.text15, styles.textAlignCenter, styles.fontBold]}>Delete</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.flex1]}/>
                </View>
            </Modal>
        );
    }
};

/**
 * pop up modal for completed activities 
 * 
 * @component
 * @param {object} props - component props
 * @param {boolean} props.isVisible - show modal if true
 * @param {function} props.toggleModal - function to toggle visibility useEffect
 * @param {array} props.completedTasks - main list of activities to get details from
 * @param {function} props.submitUndoComplete - undo complete callback function 
 */
export const CompletedTaskModal = ({ isVisible, toggleModal, completedTasks, submitUndoComplete }) => {
    // check for completed tasks
    if (completedTasks !== undefined) {
        // Extract task data
        const { task_title, start_time, end_time, task_description } = completedTasks;
        const popUpTime = start_time?.substring(0, start_time.length - 3) + ' - ' + end_time?.substring(0, end_time.length - 3);

        return (
            <Modal isVisible={isVisible}>
                <View style={[styles.flex1, styles.columnFlex]}>
                    <View style={[styles.flex2]} />
                    <View style={[styles.flex3, styles.backgroundWhite, styles.borderRadius20, styles.paddingAll20]}>
                        <View style={[styles.flex1, styles.justifyHorizontalEnd]}>
                            <TouchableOpacity style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]} onPress={toggleModal}>
                                <MaterialCommunityIcons name="close-circle-outline" size={height / 25} color="black" />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold, styles.backgroundBlue, styles.colourWhite]}>Title</Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text15, styles.textAlignCenter, styles.fontBold]}>{task_title} </Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold, styles.backgroundBlue, styles.colourWhite]}>Time</Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text15, styles.textAlignCenter, styles.fontBold]}>{popUpTime} </Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold, styles.backgroundBlue, styles.colourWhite]}>Description</Text>
                        </View>
                        <View style={[styles.flex3]}>
                            <ScrollView style={[styles.flex1]}>
                                <Text style={[styles.text15, styles.textAlignLeft, styles.paddingLeftRight10, styles.fontBold]}>{task_description} </Text>
                            </ScrollView>
                        </View>
                        <View style={[styles.flex2, styles.rowFlex]}>
                            <TouchableOpacity style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]}>
                                <Button
                                    title="Undo Complete"
                                    color="red"
                                    onPress={submitUndoComplete}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.flex1]} />
                </View>
            </Modal>
        );
    }
};

/**
 * pop up modal for complete to do activities 
 * 
 * @component
 * @param {object} props - component props
 * @param {boolean} props.isVisible - show modal if true
 * @param {function} props.toggleModal - function to toggle visibility useEffect
 * @param {function} props.submitCompleteTask - complete task callback function 
 * @param {array} props.toDoTasks - main list of activities to get details from
 */
export const CompleteToDoTaskModal = ({ isVisible, toggleModal, submitCompleteTask, toDoTasks }) => {
    //check for to do tasks
    if (toDoTasks !== undefined) {
        // Extract task data
        const {task_title} = toDoTasks

        return (
            <Modal isVisible={isVisible}>
                <View style={[styles.flex1, styles.columnFlex]}>
                    <View style={[styles.flex1]} />
                    <View style={[styles.flex1, styles.backgroundWhite, styles.borderRadius20, styles.paddingAll20]}>
                        <View style={[styles.flex1, styles.justifyHorizontalEnd]}>
                            <TouchableOpacity style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]} onPress={toggleModal}>
                                <MaterialCommunityIcons name="close-circle-outline" size={height / 25} color="black" />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold, styles.backgroundBlue, styles.colourWhite]}>Title</Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold]}>{task_title}</Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold, styles.colourWhite, styles.backgroundBlue]}>Complete with a mood</Text>
                        </View>
                        <View style={[styles.flex2, styles.rowFlex]}>
                            <TouchableOpacity style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalTop]} onPress={() => submitCompleteTask(0)}>
                                <MaterialCommunityIcons name="emoticon-happy-outline" size={height / 12} color="green" />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalTop]} onPress={() => submitCompleteTask(1)}>
                                <MaterialCommunityIcons name="emoticon-neutral-outline" size={height / 12} color="orange" />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalTop]} onPress={() => submitCompleteTask(2)}>
                                <MaterialCommunityIcons name="emoticon-sad-outline" size={height / 12} color="red" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.flex1]} />
                </View>
            </Modal>
        );
    }
};

/**
 * pop up modal for wellness activities 
 * 
 * @component
 * @param {object} props - component props
 * @param {boolean} props.isVisible - show modal if true
 * @param {function} props.toggleModal - function to toggle visibility useEffect
 * @param {array} props.wellnessTasks - main list of activities to get details from
 * @param {function} props.submitCompleteWellness - submit complete wellness task callback function 
 * @param {function} props.toggleStarted - toggle start / stop
 * @param {boolean} props.started - if activity has started (use state)
 * @param {number} props.progressFill - fill percentage (0 - 100)
 * @param {function} props.setProgressFill - function to set progressfill
 */
export const WellnessTaskModal = ({ isVisible, toggleModal, wellnessTasks, submitCompleteWellness, toggleStarted, started, progressFill, setProgressFill}) => {
    //check for wellnessTasks
    if (wellnessTasks !== undefined) {
        // Extract task data
        const { title, description } = wellnessTasks;
        const circularProgressRef = useRef(null);

        //start
        const startAnimation = () => {
            if (circularProgressRef.current) {
                // animate circular progress ( 0 to 100 in 20 mins) - starts from 10 sec (20mins == 1210000) - testing with 1210
                circularProgressRef.current.animate(100, 1210, Easing.quad);
                toggleStarted();
            }
        };

        //pause
        const pauseAnimation = () => {
            if (circularProgressRef.current) {
                // pause animation
                circularProgressRef.current.animate(progressFill, 0);
                toggleStarted();
            }
        };

        //update min
        const renderFillChild = fill => {
            return (
                <Text>
                    {Math.round((fill * 20) / 100)} mins
                </Text>
            );
        };

        //update fill 
        const handleFillChange = fill => {
            setProgressFill(fill);
        };

        return (
            <Modal isVisible={isVisible}>
                <View style={[styles.flex1, styles.columnFlex]}>
                    <View style={[styles.flex1]} />
                    <View style={[styles.flex4, styles.backgroundWhite, styles.borderRadius20, styles.paddingAll20]}>
                        <View style={[styles.flex1, styles.justifyHorizontalEnd]}>
                            <TouchableOpacity style={[styles.flex1, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]} onPress={toggleModal}>
                                <MaterialCommunityIcons name="close-circle-outline" size={height / 25} color="black" />
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold, styles.backgroundGreen, styles.colourWhite]}>Title</Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text15, styles.textAlignCenter, styles.fontBold]}>{title} </Text>
                        </View>
                        <View style={[styles.flex1]}>
                            <Text style={[styles.text20, styles.textAlignCenter, styles.fontBold, styles.backgroundGreen, styles.colourWhite]}>Description</Text>
                        </View>
                        <View style={[styles.flex3]}>
                            <ScrollView style={[styles.flex1]}>
                                <Text style={[styles.text15, styles.textAlignLeft, styles.paddingLeftRight10, styles.fontBold]}>{description} </Text>
                            </ScrollView>
                        </View>
                        <View style={[styles.flex1]} />
                        <View style={[styles.flex4, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]}>
                            <AnimatedCircularProgress
                                size={height / 5}
                                width={width/ 10}
                                fill={0.1}
                                tintColor="#20867F"
                                backgroundColor="#ECFFFF"
                                onFillChange={handleFillChange}
                                ref={circularProgressRef}>
                                {renderFillChild}
                            </AnimatedCircularProgress>
                        </View>
                        <View style={[styles.flex1]} />
                        <View style={[styles.flex1, styles.rowFlex]}>
                            <TouchableOpacity style={[styles.flex1]}>
                                {
                                    progressFill == 100?
                                    <StartStopButton props={{text: "Complete", onPress: submitCompleteWellness, backgroundColour: "#20867F", colour: "#FFFFFF"}}/>
                                    :
                                    started?
                                    <StartStopButton props={{text: "Stop", onPress: pauseAnimation, backgroundColour: "#A54011", colour: "#FFFFFF"}}/>
                                    :
                                    <StartStopButton props={{text: "Start", onPress: startAnimation, backgroundColour: "#A2D8FF", colour: "#000000"}}/>
                                }
                                
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={[styles.flex1]} />
                </View>
            </Modal>
        );
    }
};