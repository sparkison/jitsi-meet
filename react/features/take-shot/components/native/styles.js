// @flow

import { ColorSchemeRegistry, schemeColor } from '../../../base/color-scheme';
import { BoxModel, ColorPalette } from '../../../base/styles';

const BUTTON_SIZE = 50;

// TakeShot, toolbar:

/**
 * The style of toolbar buttons.
 */
const toolbarButton = {
    backgroundColor: "transparent",
    borderRadius: BUTTON_SIZE / 2,
    borderWidth: 2,
    borderColor: "#fff",
    flex: 0,
    flexDirection: 'row',
    height: BUTTON_SIZE,
    justifyContent: 'center',

    // XXX We probably tested BoxModel.margin and discovered it to be too small
    // for our taste.
    marginHorizontal: 7,
    width: BUTTON_SIZE
};

/**
 * The icon style of the toolbar buttons.
 */
const toolbarButtonIcon = {
    alignSelf: 'center',
    color: ColorPalette.darkGrey,
    fontSize: 22
};

/**
 * The style of toolbar buttons which display white icons.
 */
const whiteToolbarButton = {
    ...toolbarButton,
    backgroundColor: schemeColor('buttonToggled')
};

/**
 * The icon style of toolbar buttons which display white icons.
 */
const whiteToolbarButtonIcon = {
    ...toolbarButtonIcon,
    color: ColorPalette.white
};

/**
 * The TakeShot and toolbar related styles.
 */
const styles = {
    /**
     * The style of the toolbar.
     */
    toolbar: {
        alignItems: 'center',
        flexDirection: 'row',
        flexGrow: 0,
        justifyContent: 'center',
        marginBottom: BoxModel.margin / 2,
        paddingHorizontal: BoxModel.margin
    },
};

export default styles;

/**
 * Color schemed styles for the @{TakeShot} component.
 */
ColorSchemeRegistry.register('TakeShot', {
    /**
     * Styles for buttons in the toolbar.
     */
    buttonStyles: {
        iconStyle: whiteToolbarButtonIcon,
        style: toolbarButton
    },

    buttonStylesBorderless: {
        iconStyle: whiteToolbarButtonIcon,
        style: {
            ...toolbarButton,
            backgroundColor: 'transparent'
        }
    },

    /**
     * Styles for toggled buttons in the toolbar.
     */
    toggledButtonStyles: {
        iconStyle: whiteToolbarButtonIcon,
        style: {
            ...whiteToolbarButton,
            borderColor: schemeColor('buttonToggledBorder'),
            borderWidth: 1
        }
    }
});