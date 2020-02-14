import { Dimensions } from 'react-native';
import DeviceInfo from 'react-native-device-info';

/*** COLORS *****/
export const blueColor = '#fff';
export const liwiColors = {
  redColor: '#db473e',
  blackColor: '#232323',
  blackLightColor: '#3f3f3f',
  whiteColor: '#fff',
  lighterGreyColor: '#efefef',
  lightGreyColor: '#dbdbdb',
  greyColor: '#c4c4c4',
  darkGreyColor: '#a9a9a9',
  darkerGreyColor: '#757575',
  greenColor: '#4CAF50',
};
export const sessionsDuration = 30; // in minutes

export const screenWidth = Dimensions.get('window').width;
export const screenHeight = Dimensions.get('window').height;

export const marginLeftDrawer = 40;

/*** STYLES COMMON **/
export const isTablet = DeviceInfo.isTablet();
export const paddingIsTablet = () => (isTablet ? 30 : 5);
export const marginIsTablet = () => (isTablet ? 50 : 20);

export const fontSizeTextIsTablet = () => (isTablet ? 18 : 14);

export const screensScale = {
  xs: 360,
  s: 412,
  m: 480,
  l: 600,
  xl: 800,
};

export const responsiveUi = {
  textFontSize: () => {
    switch (true) {
      case screenWidth < screensScale.s:
        return 14;
      case screenWidth > screensScale.m && screenWidth < screensScale.l:
        return 18;
      case screenWidth > screensScale.l:
        return 20;
    }
  },
  padding: () => {
    switch (true) {
      case screenWidth < screensScale.s:
        return 5;
      case screenWidth > screensScale.s:
        return 20;
    }
  },
  iconSize: () => {
    switch (true) {
      case screenWidth < screensScale.s:
        return 30;
      case screenWidth > screensScale.m && screenWidth < screensScale.l:
        return 35;
      case screenWidth > screensScale.l:
        return 45;
    }
  },
};
