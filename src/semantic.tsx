import * as React from 'react';
import * as MobileDetect from 'mobile-detect';
import Responsive from 'semantic-ui-react/dist/commonjs/addons/Responsive';
import {
    mobileScreen, tabletScreen,
    mobileAndTablet, desktopScreen,
    Window_SuiM_Context,
    WindowWidthContext
} from './constants';

interface PropsInit {
    isPhoneFromSSR: boolean
    isTabletFromSSR: boolean
}

interface JsxProps {
    children: string
    [x: string]: any
}

const DesktopContainer = (props: JsxProps) => {
    const context : WindowWidthContext = React.useContext(Window_SuiM_Context);
    return (
        <Responsive fireOnMount getWidth={context.getWidth}
            as={props.as}
            minWidth={Responsive.onlyComputer.minWidth}>
            {props.children}
        </Responsive>
    )
}

const TabletContainer = (props: JsxProps) => {
    const context : WindowWidthContext = React.useContext(Window_SuiM_Context);
    return (
        <Responsive fireOnMount getWidth={context.getWidth}
            as={props.as}
            minWidth={Responsive.onlyTablet.minWidth}
            maxWidth={Responsive.onlyTablet.maxWidth} >
            {props.children}
        </Responsive>
    )
}

const MobileContainer = (props: JsxProps) => {
    const context : WindowWidthContext = React.useContext(Window_SuiM_Context);
    return (
        <Responsive fireOnMount getWidth={context.getWidth}
            as={props.as}
            maxWidth={Responsive.onlyMobile.maxWidth} >
            {props.children}
        </Responsive>
    )
}

const DesktopAndTabletContainer = (props: JsxProps) => {
    const context : WindowWidthContext = React.useContext(Window_SuiM_Context);
    return (
        <Responsive fireOnMount getWidth={context.getWidth}
            as={props.as}
            minWidth={Responsive.onlyTablet.minWidth}
            maxWidth={Responsive.onlyComputer.maxWidth} >
            {props.children}
        </Responsive>
    )
}

const MobileAndTabletContainer = (props: JsxProps) => {
    const context : WindowWidthContext = React.useContext(Window_SuiM_Context);
    return (
        <Responsive fireOnMount getWidth={context.getWidth}
            as={props.as}
            maxWidth={Responsive.onlyTablet.maxWidth} >
            {props.children}
        </Responsive>
    )
}

const getWidthFactory = (props: PropsInit) => () => {
    const { isPhoneFromSSR, isTabletFromSSR } = props; 
    const ssrValue = isPhoneFromSSR ? Responsive.onlyMobile.maxWidth :
        isTabletFromSSR ? Responsive.onlyTablet.maxWidth :
            Responsive.onlyComputer.minWidth;
    return typeof window === "undefined" ? ssrValue : window.innerWidth;
};

const responsivePropsInit = (userAgent?: string): PropsInit => {    
    const md = new MobileDetect( userAgent ? userAgent : (typeof window !== 'undefined' ? window.navigator.userAgent : "Mozilla NT") );
    return {
        isPhoneFromSSR: !!md.phone(),
        isTabletFromSSR: !!md.tablet()
    };
}

export * from './constants';

export const widthFactory = (userAgent?: string) => {
    return getWidthFactory(responsivePropsInit(userAgent));
}

export const MediaQuery = (props: JsxProps) => {
    const { type, children, as = React.Fragment } = props;
    const propsToPass = { children, as };
    switch (type) {
        case mobileScreen: {
            return MobileContainer(propsToPass);
        }
        case tabletScreen: {
            return TabletContainer(propsToPass)
        }
        case mobileAndTablet: {
            return MobileAndTabletContainer(propsToPass)
        }
        case desktopScreen: {
            return DesktopContainer(propsToPass)
        }
        default: {
            return DesktopAndTabletContainer(propsToPass);
        }
    }
}
