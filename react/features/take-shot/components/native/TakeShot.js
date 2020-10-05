// @flow

import React, {PureComponent} from 'react'
import {View} from 'react-native'

import {ColorSchemeRegistry} from '../../../base/color-scheme'
import {Container} from '../../../base/react'
import {connect} from '../../../base/redux'
import {StyleType} from '../../../base/styles'
import styles from './styles'
import CustomActionShotButton from './CustomActionShotButton'
import {getLocalParticipant, getParticipantDisplayName} from '../../../base/participants'
import {isToolboxVisible} from '../../../toolbox/functions.native'

/**
 * The type of {@link TakeShot}'s React {@code Component} props.
 */
type Props = {

    /**
     * The color-schemed stylesheet of the feature.
     */
    _styles: StyleType,

    /**
     * The indicator which determines whether the toolbox is visible.
     */
    _visible: boolean,

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function
};

/**
 * Implements the conference toolbox on React Native.
 */
class TakeShot extends PureComponent<Props> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render () {
        return (
            <Container
                style={{
                    left: 0,
                    position: 'absolute',
                    right: 0,
                    top: 10,
                    height: "100%",
                    justifyContent: "center"
                }}
                visible={this.props._visible && this.props._participants.length > 1}>
                {this._renderToolbar()}
            </Container>
        )
    }

    /**
     * Renders the toolbar. In order to avoid a weird visual effect in which the
     * toolbar is (visually) rendered and then visibly changes its size, it is
     * rendered only after we've figured out the width available to the toolbar.
     *
     * @returns {React$Node}
     */
    _renderToolbar () {
        const { _styles } = this.props
        const { buttonStyles, buttonStylesBorderless, hangupButtonStyles, toggledButtonStyles } = _styles

        // Define what to send when calling external action
        const TAKE_SHOT_EXTERNAL = {
            action: "take_shot"
        }

        const size = 80
        const buttonOverrides = {
            height: size,
            width: size,
            borderRadius: size,
            borderColor: "#333"
        }
        const iconOverrides = {
            fontSize: size / 1.5,
            color: "#000"
        }

        const _buttonStyles = {
            iconStyle: {
                ...buttonStyles.iconStyle,
                ...iconOverrides
            },
            style: {
                ...buttonStyles.style,
                ...buttonOverrides,
                backgroundColor: "#fff",
            }
        }
        const _toggledButtonStyles = {
            iconStyle: {
                ...toggledButtonStyles.iconStyle,
                ...iconOverrides
            },
            style: {
                ...toggledButtonStyles.style,
                ...buttonOverrides,
                backgroundColor: "#3DA578"
            }
        }

        return (
            <View
                accessibilityRole='button'
                pointerEvents='box-none'
                style={styles.toolbar}>
                <CustomActionShotButton {...this.props}
                                        styles={_buttonStyles}
                                        callAction={TAKE_SHOT_EXTERNAL}
                                        participants={this.props._participants}
                                        displayName={this.props._displayName}
                                        localParticipantId={this.props._localParticipantId}
                                        toggledStyles={_toggledButtonStyles} />
            </View>
        )
    }
}

/**
 * Maps parts of the redux state to {@link TakeShot} (React {@code Component})
 * props.
 *
 * @param {Object} state - The redux state of which parts are to be mapped to
 * {@code Toolbox} props.
 * @private
 * @returns {Props}
 */
function _mapStateToProps (state: Object): Object {
    const _localParticipant = getLocalParticipant(state)
    const _localParticipantId = _localParticipant?.id
    const _displayName = _localParticipant && getParticipantDisplayName(state, _localParticipantId)
    return {
        _styles: ColorSchemeRegistry.get(state, 'Toolbox'),
        _visible: isToolboxVisible(state), // we'll defer to the toolbox
        _participants: state['features/base/participants'],
        _displayName,
        _localParticipantId,
    }
}

export default connect(_mapStateToProps)(TakeShot)
