import React, { useState, useEffect } from 'react';
import { Text, View, Dimensions, TouchableOpacity } from 'react-native';
import styles from './Style';
const { height, width } = Dimensions.get('screen');
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


/*
Height for all activity rows - 1/8  of screen height ( needs to be defined for scroll view )
*/

// activity row - no touch function 
/*
props:
activity - activity name
time - activity time
onPress - onPress action for whole row
*/
export function ActivityRowStatic ({props}) {
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

// activity row not checked - with touch functions
/*
props:
activity - activity name
time - activity time
onPress - onPress action for right side row
onPressCheck - onPress action for left side (button)
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

// activity row checked - with touch functions
/*
props:
activity - activity name
time - activity time
mood - 
0: happy 
1: neutral
2: unhappy
onPress - onPress action for right side row
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

// activity wellness row - with touch functions
/*
props:
title - wellness task title
onPress - onPress action for whole row
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