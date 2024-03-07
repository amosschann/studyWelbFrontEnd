import React, { useState, useEffect } from 'react';
import { Text, View, Dimensions, TouchableOpacity } from 'react-native';
import styles from './Style';
const { height, width } = Dimensions.get('screen');
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

// **Height for all activity rows - 1/8  of screen height ( needs to be defined for scroll view )**

/**
 * Activity Row Component - no touch function
 * 
 * @component
 * @param {object} props - Component props
 * @param {string} props.activity - The name of the activity
 * @param {string} props.time - The time of the activity
 * @param {function} props.onPress - The onPress action for the whole row
 * @param {boolean} props.isCompleted - Indicates if the activity is completed
 */
export function ActivityRowStatic ({props}) {
    if (props.isCompleted) {

    }
    return (
        <View style={[styles.flex1, styles.rowFlex, styles.marginTop5, styles.backgroundLightBlue, {height: height/ 9}]}>
            {/* Activity */}
            <View style={[styles.flex1]}/>
            <View style={[styles.flex5 ,styles.justifyHorizontalStart, styles.justifyVerticalCenter]}>
                <Text style={[styles.text15, styles.fontBold]}>{props.activity}</Text>
            </View>
            <View style={[styles.flex1]}/>
            {/* Time */}
            <View style={[styles.flex3, styles.justifyHorizontalStart, styles.justifyVerticalCenter]}>
                <Text style={[styles.text15, styles.fontBold]}>{props.time}</Text>
            </View>
        </View>
    )
};

/**
 * Activity Row Component - no touch function (Half height)
 * 
 * @component
 * @param {object} props - Component props
 * @param {string} props.activity - The name of the activity
 * @param {string} props.time - The time of the activity
 * @param {function} props.onPress - The onPress action for the whole row
 * @param {boolean} props.isCompleted - Indicates if the activity is completed
 */
export function ActivityRowStaticHalf ({props}) {
    if (props.isCompleted) {

    }
    return (
        <View style={[styles.flex1, styles.rowFlex, styles.marginTop5, styles.backgroundLightBlue, {height: height/ 18}]}>
            {/* Activity */}
            <View style={[styles.flex1]}/>
            <View style={[styles.flex5 ,styles.justifyHorizontalStart, styles.justifyVerticalCenter]}>
                <Text style={[styles.text15, styles.fontBold]}>{props.activity}</Text>
            </View>
            <View style={[styles.flex1]}/>
            {/* Time */}
            <View style={[styles.flex3, styles.justifyHorizontalStart, styles.justifyVerticalCenter]}>
                <Text style={[styles.text15, styles.fontBold]}>{props.time}</Text>
            </View>
        </View>
    )
};

/** 
 * activity row not checked - with touch functions
 * @component
 * @param {object} props - component props
 * @param {string} props.activity - activity name
 * @param {function} props.onPress - onPress action for right side row
 * @param {function} props.onPressCheck - onPress action for left side (button)
*/
export function ActivityRowNotChecked ({props}) {
    return (
            <View style={[styles.flex1, styles.rowFlex, styles.marginTop5, styles.backgroundLightBlue, {height: height/ 9}]}>
                <TouchableOpacity 
                    style={[styles.flex2, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]}
                    onPress={props.onPressCheck}
                >
                    <CheckBox/>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.flex8, styles.rowFlex]} onPress={props.onPress} >
                    {/* Activity */}
                    <View style={[styles.flex5 ,styles.justifyHorizontalStart, styles.justifyVerticalCenter]}>
                        <Text style={[styles.text15, styles.paddingLeft10, styles.fontBold]}>{props.activity}</Text>
                    </View>
                    {/* Time */}
                    <View style={[styles.flex3, styles.justifyHorizontalStart, styles.justifyVerticalCenter]}>
                        <Text style={[styles.text15, styles.paddingLeft10, styles.fontBold]}>{props.time}</Text>
                    </View>
                </TouchableOpacity>

            </View>
    )
};

/**
 * activity Row Checked Component
 * represents a checked activity row with touch functions.
 * 
 * @component
 * @param {Object} props - component props
 * @param {string} props.activity - name of the activity
 * @param {string} props.time - time of the activity
 * @param {number} props.mood - mood of the activity:
 *                               - 0: happy
 *                               - 1: neutral
 *                               - 2: unhappy
 * @param {function} props.onPress - onPress action for the right side row
 */
export function ActivityRowChecked ({props}) {
    return (
        <TouchableOpacity style={[styles.flex1, styles.marginTop5, styles.backgroundLightGrey, {height: height/ 9}]} onPress={props.onPress}>
            <View style={[styles.flex1, styles.rowFlex]}>
                <View style={[styles.flex2, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]}>
                    {CheckBoxMood(props.mood)}
                </View>
                {/* Activity */}
                <View style={[styles.flex5 ,styles.justifyHorizontalStart, styles.justifyVerticalCenter]}>
                    <Text style={[styles.text15, styles.paddingLeft10, styles.fontBold]}>{props.activity}</Text>
                </View>
                {/* Time */}
                <View style={[styles.flex3, styles.justifyHorizontalStart, styles.justifyVerticalCenter]}>
                    <Text style={[styles.text15, styles.paddingLeft10, styles.fontBold]}>{props.time}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
};

/**
 * activity wellness row - with touch functions
 * 
 * @component
 * @param {string} props.title - wellness task title
 * @param {function} props.onPress - onPress action for whole row
 */
export function AcitivityWellnessRow ({props}) {
    return (
        <TouchableOpacity style={[styles.flex1, styles.marginTop5, styles.backgroundGreen, {height: height/ 9}]} onPress={props.onPress}>
            <View style={[styles.flex4, styles.justifyVerticalCenter, styles.justifyHorizontalCenter]}>
                <Text style={[styles.text15, styles.textAlignLeft, styles.colourWhite, styles.paddingBottom10]}>Start a Wellness Activity</Text>
                <Text style={[styles.text15, styles.textAlignLeft, styles.colourWhite, styles.fontBold]}>{props.title}</Text>
            </View>
        </TouchableOpacity>
    )
};

/**
 * activity Wellness Row Completed Component - without touch functions
 * 
 * @component
 * @param {string} props.activity - activity name
 * @param {string} props.time - activity time
 * @param {number} props.mood - 
 *                              0: happy 
 *                              1: neutral
 *                              2: unhappy
 */
export function AcitivityWellnessRowComplete ({props}) {
    return (
        <View style={[styles.flex1, styles.marginTop5, styles.backgroundLightGreen, {height: height/ 9}]}>
            <View style={[styles.flex1, styles.rowFlex]}>
                <View style={[styles.flex2, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]}>
                    {CheckBoxMood(props.mood)}
                </View>
                {/* Activity */}
                <View style={[styles.flex5 ,styles.justifyHorizontalStart, styles.justifyVerticalCenter]}>
                    <Text style={[styles.text15, styles.paddingLeft10, styles.fontBold]}>{props.activity}</Text>
                </View>
                <View style={[styles.flex3, styles.justifyHorizontalStart, styles.justifyVerticalCenter]}>
                    <Text style={[styles.text15, styles.paddingLeft10, styles.fontBold]}>{props.time}</Text>
                </View>
            </View>
        </View>
    )
};


//checkbox for rows
export function CheckBox() {
    return(
        <View style={[styles.flex1, styles.rowFlex]}>
            <View style={[styles.flex5]}/>
            <View style={[styles.flex5, styles.columnFlex]}>
                <View style={[styles.flex5]}/>
                <View style={[styles.flex3, styles.borderRadius10GreyThick, styles.backgroundWhite]}/>
                <View style={[styles.flex5]}/>
            </View>
            <View style={[styles.flex5]}/>
        </View>
    )
}

//checkbox for mood 
export function CheckBoxMood(mood) {
    return(
        <View style={[styles.flex1, styles.rowFlex]}>
            <View style={[styles.flex5]}/>
            <View style={[styles.flex5, styles.columnFlex]}>
                <View style={[styles.flex5]}/>
                <View style={[styles.flex3]}>
                    {
                        mood === 0?
                        <MaterialCommunityIcons name="emoticon-happy-outline" size={height/38} color="green" />
                        :
                        mood === 1? 
                        <MaterialCommunityIcons name="emoticon-neutral-outline" size={height/38} color="orange" />
                        :
                        <MaterialCommunityIcons name="emoticon-sad-outline" size={height/38} color="red" />
                    }
                </View>
                <View style={[styles.flex5]}/>
            </View>
            <View style={[styles.flex5]}/>
        </View>
    )
}