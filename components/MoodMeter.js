import React, {useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import { Animated, Text, View } from 'react-native';
import { Svg, Path, G, Polygon } from 'react-native-svg';

//create animated components
const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G)

/** compoenent for Mood Meter 
 * torn down and repurposed from - https://github.com/bartgryszko/react-native-circular-progress/blob/master/src/AnimatedCircularProgress.js
 * removed unneccessary props / variables / components
 * new 4 parts of ellipse 
 * new needle 
 * new animation handling
 * new angle handling 
 */
export default class MoodMeter extends React.PureComponent {
    //define states for circle quad opacity levels
    constructor(props) {
        super(props);
        this.vSadNeedleOpacity = new Animated.Value(0.1);
        this.sadNeedleOpacity = new Animated.Value(0.1);
        this.happyNeedleOpacity = new Animated.Value(0.1);
        this.vHappyNeedleOpacity = new Animated.Value(0.1);
        this.animateMoodAngle = new Animated.Value(-90);
    }

    //calculate coordinates 
    polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
        return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
        };
    }

    //circle path model
    circlePath(x, y, radius, startAngle, endAngle) {
        var start = this.polarToCartesian(x, y, radius, endAngle * 0.9999999);
        var end = this.polarToCartesian(x, y, radius, startAngle);
        var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
        var d = ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y];
        return d.join(' ');
    }

    clampFill = fill => Math.min(100, Math.max(0, fill));

    //animation on mount
    componentDidMount() {
        /**
         * Handle Opacity 
        */
        let animateOpacity = null;
        let moodLevel = this.props.moodLevel
        //check which mood is side of the circle
        if (moodLevel < 25) {
            animateOpacity = this.vSadNeedleOpacity;
        } else if (moodLevel >= 25 && moodLevel < 50) {
            animateOpacity = this.sadNeedleOpacity;
        } else if (moodLevel >= 50 && moodLevel < 75) {
            animateOpacity = this.happyNeedleOpacity;
        } else {
            animateOpacity = this.vHappyNeedleOpacity;
        }

        //animate fade in
        Animated.timing(animateOpacity, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
        }).start();

        /**
         * Handle needle angle (mood level)
        */
        let needleRotation = null;
        if (moodLevel < 25) {
            needleRotation = -155.7
        } else if (moodLevel >= 25 && moodLevel < 50) {
            needleRotation = -110.7
        } else if (moodLevel >= 50 && moodLevel < 75) {
            needleRotation = -65.7;
        } else {
            needleRotation = -20.69;
        }
        //animate needle movement
        Animated.timing(this.animateMoodAngle, {
            toValue: needleRotation,
            duration: 1000,
            useNativeDriver: true,
        }).start();
    }


    componentDidUpdate(prevProps) {
        //on mood level change
        if (prevProps.moodLevel !== this.props.moodLevel) {
            /**
             * Handle Opacity 
            */
            let animateOpacity = null;
            let needlesToFadeOut = [];
            let moodLevel = this.props.moodLevel
            //check which mood is side of the circle
            if (moodLevel < 25) {
                animateOpacity = this.vSadNeedleOpacity;
            } else if (moodLevel >= 25 && moodLevel < 50) {
                animateOpacity = this.sadNeedleOpacity;
            } else if (moodLevel >= 50 && moodLevel < 75) {
                animateOpacity = this.happyNeedleOpacity;
            } else {
                animateOpacity = this.vHappyNeedleOpacity;
            }
            // determine which mood needles to fade out based on current opacity
            if (moodLevel < 25) {
                animateOpacity = this.vSadNeedleOpacity;
                needlesToFadeOut = [this.sadNeedleOpacity, this.happyNeedleOpacity, this.vHappyNeedleOpacity];
            } else if (moodLevel >= 25 && moodLevel < 50) {
                animateOpacity = this.sadNeedleOpacity;
                needlesToFadeOut = [this.vSadNeedleOpacity, this.happyNeedleOpacity, this.vHappyNeedleOpacity];
            } else if (moodLevel >= 50 && moodLevel < 75) {
                animateOpacity = this.happyNeedleOpacity;
                needlesToFadeOut = [this.vSadNeedleOpacity, this.sadNeedleOpacity, this.vHappyNeedleOpacity];
            } else {
                animateOpacity = this.vHappyNeedleOpacity;
                needlesToFadeOut = [this.vSadNeedleOpacity, this.sadNeedleOpacity, this.happyNeedleOpacity];
            }

            //animate fade in
            Animated.timing(animateOpacity, {
                toValue: 1, 
                duration: 2000,
                useNativeDriver: true,
            }).start();


            //animate fade out
            needlesToFadeOut.forEach(needle => {
                Animated.timing(needle, {
                    toValue: 0.1,
                    duration: 2000,
                    useNativeDriver: true,
                }).start();
            });

             /**
             * Handle needle angle (mood level)
            */
            let needleRotation = null;
            if (moodLevel < 25) {
                needleRotation = -155.7
            } else if (moodLevel >= 25 && moodLevel < 50) {
                needleRotation = -110.7
            } else if (moodLevel >= 50 && moodLevel < 75) {
                needleRotation = -65.7;
            } else {
                needleRotation = -20.69;
            }
            //animate needle movement
            Animated.timing(this.animateMoodAngle, {
                toValue: needleRotation,
                duration: 1000,
                useNativeDriver: true,
            }).start();
            }
    }
      

    render() {
        const {
        size,
        width,
        backgroundWidth,
        style,
        rotation,
        moodLevel,
        children,
        childrenContainerStyle,
        padding,
        } = this.props;


        //calculate essential stats
        const maxWidthCircle = backgroundWidth ? Math.max(width, backgroundWidth) : width;
        const sizeWithPadding = size / 2 + padding / 2;
        const radius = size / 2 - maxWidthCircle / 2 - padding / 2;
        const offset = size - maxWidthCircle * 2;
        

        //define angles
        angleVeryAngry = (180 * this.clampFill(25-1)) / 100
        angleAngry = (180 * this.clampFill(50)) / 100
        angleHappy = (180 * this.clampFill(75+1)) / 100
        angleVeryHappy = (180 * this.clampFill(100)) / 100

        //define circle paths for different moods
        const verySad = this.circlePath(sizeWithPadding, sizeWithPadding, radius, 0, angleVeryAngry);
        const sad = this.circlePath(sizeWithPadding, sizeWithPadding, radius, angleVeryAngry, angleAngry);
        const happy = this.circlePath(sizeWithPadding, sizeWithPadding, radius, angleAngry, angleHappy);
        const veryHappy = this.circlePath(sizeWithPadding, sizeWithPadding, radius, angleHappy, angleVeryHappy);



        const localChildrenContainerStyle = {
        ...{
            position: 'absolute',
            left: maxWidthCircle + padding / 2,
            top: maxWidthCircle + padding / 2,
            width: offset,
            height: offset,
            borderRadius: offset / 2,
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
        },
        ...childrenContainerStyle,
        }

        // calculate needle position - angle based on 1 - 100 (left to right point)
        const needleWidth = size * 0.015; 
        const needleHeight = size * 0.1;
        const needleX = size / 2 - needleWidth / 2;
        const needleY = sizeWithPadding + 15;
        const needleCenterX = needleX + needleWidth / 2;
        const needleCenterY = needleY - 15;

        return (
            <View style={style}>
                <Svg width={size + padding} height={size + padding}>
                    <G rotation={rotation} originX={(size + padding) / 2} originY={(size + padding) / 2}>

                        <AnimatedPath
                            d={verySad}
                            stroke='#A54011'
                            strokeWidth={width}
                            fill="transparent"
                            opacity={this.vSadNeedleOpacity}
                        />
                        <AnimatedPath
                            d={sad}
                            stroke='#E58A8A'
                            strokeWidth={width}
                            fill="transparent"
                            opacity={this.sadNeedleOpacity}
                        />
                        <AnimatedPath
                            d={happy}
                            stroke='#a6dbbc'
                            strokeWidth={width}
                            fill="transparent"
                            opacity={this.happyNeedleOpacity}
                        />
                        <AnimatedPath
                            d={veryHappy}
                            stroke='#20867F'
                            strokeWidth={width}
                            fill="transparent"
                            opacity={this.vHappyNeedleOpacity}
                        />
                        <AnimatedG 
                            style={{
                                transform: [
                                    { translateX: sizeWithPadding/2},
                                    { translateY: sizeWithPadding/2 },
                                    { rotate: this.animateMoodAngle.interpolate({
                                        inputRange: [-90, 90],
                                        outputRange: ['-90deg', '90deg'], 
                                    }) }
                                ],
                            }}
                        >
                            <Polygon
                                points={`${needleX},${needleY} ${needleX + needleWidth},${needleY} ${needleX + (needleWidth / 2)},${needleY + needleHeight}`}
                                fill="#000000"
                                transform={`translate(-${needleCenterX} -${needleCenterY})`}
                            />
                        </AnimatedG>

                    </G>
                </Svg>
                {children && <View style={localChildrenContainerStyle}>{children(<Text>●</Text>)}</View>}
            </View>
        );
    }

}

/**
 * prop types for MoodMeter component
 * 
 * @component
 * @param {object} props - component props
 * @param {object} props.style - style object
 * @param {number | Animated.Value} props.size - size entire mood meter (calc radius etc)
 * @param {number} props.moodLevel - mood level
 * @param {number} props.width - width of the mood meter
 * @param {number} props.backgroundWidth - width of the background
 * @param {boolean} props.tintTransparency - transparency of the tint
 * @param {number} props.rotation - rotation angle
 * @param {function} props.children - children function
 * @param {object} props.childrenContainerStyle - style object for children container
 * @param {number} props.padding - padding value
 */
MoodMeter.propTypes = {
  style: PropTypes.object,
  size: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.instanceOf(Animated.Value),
  ]).isRequired,
  moodLevel: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  backgroundWidth: PropTypes.number,
  tintTransparency: PropTypes.bool,
  rotation: PropTypes.number,
  children: PropTypes.func,
  childrenContainerStyle: PropTypes.object,
  padding: PropTypes.number,
};

//defaul values
MoodMeter.defaultProps = {
  tintColor: 'black',
  tintTransparency: true,
  rotation: -90,
  lineCap: 'butt',
  arcSweepAngle: 180,
  padding: 0,
};