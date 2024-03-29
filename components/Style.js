// styles.js
import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('screen');


const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      width: width,
    },
    mainView: {
      flex: 1,
      width: width,
    },
    //flex
    rowFlex: {
      flexDirection: 'row'
    },
    columnFlex: {
      flexDirection: 'column'
    },
    flex1: {
      flex: 1
    },
    flex2: {
      flex: 2
    },
    flex3: {
      flex: 3
    },
    flex4: {
      flex: 4
    },
    flex5: {
      flex: 5
    },
    flex6: {
      flex: 6
    },
    flex7: {
      flex: 7
    },
    flex8: {
      flex: 8
    },
    flex9: {
      flex: 9
    },
    flex10: {
      flex: 10
    },
    flex15: {
      flex: 15
    },
    //widths
    width: {
      width: width
    },
    //height
    height: {
    height: height
    },
    //padding
    paddingLeft10: {
      paddingLeft: 10
    },
    paddingLeftRight5: {
      paddingLeft: 5,
      paddingRight: 5
    },
    paddingLeftRight10: {
      paddingLeft: 10,
      paddingRight: 10
    },
    paddingLeftRight20: {
      paddingLeft: 20,
      paddingRight: 20
    },
    paddingTopBottom20: {
      paddingTop: 20,
      paddingBottom: 20
    },
    paddingTop40Bottom20: {
      paddingTop: 40,
      paddingBottom: 20
    },
    paddingBottom10: {
      paddingBottom: 10
    },
    paddingAll20: {
      padding: 20
    },
    paddingAll15: {
      padding: 15
    },
    paddingAll10: {
      padding: 10
    },
    //margin
    marginTop2: {
      marginTop: 2
    },
    marginTop5: {
      marginTop: 5
    },
    marginTop10: {
      marginTop: 10
    },
    //backgroundcolour 
    backgroundBlue: {
      backgroundColor: '#4677B0'
    },
    backgroundDarkBlue: {
      backgroundColor: '#3E4756'
    },
    backgroundLightBlue: {
      backgroundColor: '#D6E2F4'
    },
    backgroundWhite: {
      backgroundColor: '#FFFFFF'
    },
    backgroundLightGrey: {
      backgroundColor: '#e0e0e0'
    },
    backgroundVLightBlue: {
      backgroundColor: '#f3fbfb'
    },
    backgroundGreen: {
      backgroundColor: '#20867F'
    },
    backgroundLightGreen: {
      backgroundColor: '#f3fff3'
    },
    //colur
    colourWhite: {
      color: 'white'
    },
    colourBlack: {
      color: 'black'
    },
    colourGray: {
      color: 'gray'
    },
    //align content
    justifyBottom: {
      justifyContent: 'flex-end'
    },
    justifyVerticalCenter: {
      justifyContent: 'center'
    },
    justifyVerticalBottom: {
      justifyContent: 'flex-end'
    },
    justifyVerticalTop: {
      justifyContent: 'flex-start'
    },
    justifyHorizontalCenter: {
      alignItems: 'center'
    },
    justifyHorizontalStart: {
      alignItems: 'flex-start'
    },
    justifyHorizontalEnd: {
      alignItems: 'flex-end'
    },
    positionAbsolute: {
      position: 'absolute'
    },
    //text
    text20: {
      fontSize: 20
    },
    text15: {
      fontSize: 15
    },
    textAlignCenter: {
      textAlign: 'center'
    },
    textAlignRight: {
      textAlign: 'right'
    },
    textAlignLeft: {
      textAlign: 'left'
    },
    textAlignVerticleTop: {
      textAlignVertical: 'top'
    },
    fontBold: {
      fontWeight: 'bold'
    },
    //border
    borderRadius20Black: {
      overflow: 'hidden',
      borderRadius: 20,
      borderColor: "#000000",
      borderWidth: 1,
    },
    borderRadius10GreyThick: {
      overflow: 'hidden',
      borderRadius: 10,
      borderColor: "#808080",
      borderWidth: 2,
    },
    borderRadius10Blue: {
      overflow: 'hidden',
      borderRadius: 10,
      borderColor: "#4677B0",
      borderWidth: 1,
    },
    borderRadiusTop10: {
      borderTopRightRadius: 10,
      borderTopLeftRadius: 10,
      overflow: 'hidden'
    },
    borderRadiusBottom10: {
      borderBottomRightRadius: 10,
      borderBottomLeftRadius: 10,
      overflow: 'hidden',
    },
    borderRadius10: {
      overflow: 'hidden',
      borderRadius: 10,
    },
    borderRadius20: {
      overflow: 'hidden',
      borderRadius: 20,
    },
    borderRadius90: {
      overflow: 'hidden',
      borderRadius: 90,
    },
    borderBlack: {
      overflow: 'hidden',
      borderColor: "#000000",
      borderWidth: 1,
    },
    borderGrey: {
      overflow: 'hidden',
      borderColor: "#808080",
      borderWidth: 1,
    },
    borderLightGrey: {
      overflow: 'hidden',
      borderColor: "#d3d3d3",
      borderWidth: 1,
    },
    borderLightBlue: {
      overflow: 'hidden',
      borderColor: "#f3fbfb",
      borderWidth: 1,
    },
    borderGreynoBottom: {
      overflow: 'hidden',
      borderColor: "#808080",
      borderWidth: 1,
      borderBottomColor: 'transparent',
    },
    borderGreynoTop: {
      overflow: 'hidden',
      borderColor: "#808080",
      borderWidth: 1,
      borderTopColor: 'transparent'
    },
    //image object fit
    objectFitContain: {
      objectFit: 'contain'
    },
    objectFitFill: {
      objectFit: 'fill'
    },
    objectFitCover: {
      objectFit: 'cover'
    },

  
});

export default styles;