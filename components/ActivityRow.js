import React, { useState, useEffect } from 'react';
import { Text, View, Dimensions, TouchableOpacity } from 'react-native';
import styles from './Style';
const { height } = Dimensions.get('screen');
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
        <TouchableOpacity style={[styles.flex1, styles.rowFlex, styles.borderLightGrey, {height: height/ 8}]}>
            {/* Activity */}
            <View style={[styles.flex1]}/>
            <View style={[styles.flex5 ,styles.justifyHorizontalStart, styles.justifyVerticalCenter]}>
                <Text style={[styles.text15]}>{props.activity}</Text>
            </View>
            <View style={[styles.flex1]}/>
            {/* Time */}
            <View style={[styles.flex3, styles.justifyHorizontalStart, styles.justifyVerticalCenter]}>
                <Text style={[styles.text15]}>{props.time}</Text>
            </View>
        </TouchableOpacity>
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
            <View style={[styles.flex1, styles.rowFlex, styles.borderLightGrey, {height: height/ 8}]}>
                <TouchableOpacity 
                    style={[styles.flex2, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]}
                    onPress={props.onPressCheck}
                >
                    <CheckBox/>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.flex8, styles.rowFlex]} onPress={props.onPress} >
                    {/* Activity */}
                    <View style={[styles.flex5 ,styles.justifyHorizontalStart, styles.justifyVerticalCenter]}>
                        <Text style={[styles.text15, styles.paddingLeft10]}>{props.activity}</Text>
                    </View>
                    {/* Time */}
                    <View style={[styles.flex3, styles.justifyHorizontalStart, styles.justifyVerticalCenter]}>
                        <Text style={[styles.text15, styles.paddingLeft10]}>{props.time}</Text>
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
onPress - onPress action for right side row
*/
export function ActivityRowChecked ({props}) {
    return (
        <TouchableOpacity style={[styles.flex1, {height: height/ 8}]} onPress={props.onPress}>
            <View style={[styles.flex1, styles.rowFlex, styles.borderLightGrey]}>
                <View style={[styles.flex2, styles.justifyHorizontalCenter, styles.justifyVerticalCenter]}>
                    <CheckBox/>
                </View>
                {/* Activity */}
                <View style={[styles.flex5 ,styles.justifyHorizontalStart, styles.justifyVerticalCenter]}>
                    <Text style={[styles.text15, styles.paddingLeft10]}>{props.activity}</Text>
                </View>
                {/* Time */}
                <View style={[styles.flex3, styles.justifyHorizontalStart, styles.justifyVerticalCenter]}>
                    <Text style={[styles.text15, styles.paddingLeft10]}>{props.time}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
};


//checkbox for rows
export function CheckBox() {
    return(
        <View style={[styles.flex1, styles.rowFlex]}>
            <View style={[styles.flex4]}/>
            <View style={[styles.flex5, styles.columnFlex]}>
                <View style={[styles.flex5]}/>
                <View style={[styles.flex3, styles.borderRadius10GreyThick]}/>
                <View style={[styles.flex5]}/>
            </View>
            <View style={[styles.flex4]}/>
        </View>
    )
}