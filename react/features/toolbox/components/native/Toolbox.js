// @flow

import React, { PureComponent } from 'react';
import { View } from 'react-native';

import { ColorSchemeRegistry } from '../../../base/color-scheme';
import { Container } from '../../../base/react';
import { connect } from '../../../base/redux';
import { StyleType } from '../../../base/styles';
import { ChatButton } from '../../../chat';
import { isToolboxVisible } from '../../functions';
import AudioMuteButton from '../AudioMuteButton';
import HangupButton from '../HangupButton';
import VideoMuteButton from '../VideoMuteButton';

import OverflowMenuButton from './OverflowMenuButton';
import styles from './styles';
import ToggleCameraButton from './ToggleCameraButton'
import CustomActionCallButton from './CustomActionCallButton'
import {getLocalParticipant, getParticipantDisplayName} from '../../../base/participants'

/**
 * The type of {@link Toolbox}'s React {@code Component} props.
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
class Toolbox extends PureComponent<Props> {
    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <Container
                style = { styles.toolbox }
                visible = { this.props._visible }>
                { this._renderToolbar() }
            </Container>
        );
    }

    /**
     * Constructs the toggled style of the chat button. This cannot be done by
     * simple style inheritance due to the size calculation done in this
     * component.
     *
     * @param {Object} baseStyle - The base style that was originally
     * calculated.
     * @returns {Object | Array}
     */
    _getChatButtonToggledStyle(baseStyle) {
        const { _styles } = this.props;

        if (Array.isArray(baseStyle.style)) {
            return {
                ...baseStyle,
                style: [
                    ...baseStyle.style,
                    _styles.chatButtonOverride.toggled
                ]
            };
        }

        return {
            ...baseStyle,
            style: [
                baseStyle.style,
                _styles.chatButtonOverride.toggled
            ]
        };
    }

    /**
     * Renders the toolbar. In order to avoid a weird visual effect in which the
     * toolbar is (visually) rendered and then visibly changes its size, it is
     * rendered only after we've figured out the width available to the toolbar.
     *
     * @returns {React$Node}
     */
    _renderToolbar() {
        const { _styles } = this.props;
        const { buttonStyles, buttonStylesBorderless, hangupButtonStyles, toggledButtonStyles } = _styles;

        // Define what to send when calling external action
        const INVITE_USER_EXTERNAL = {
            action: "invite_user"
        }

        return (
            <View
                accessibilityRole = 'toolbar'
                pointerEvents = 'box-none'
                style = { styles.toolbar }>
                {/*<ChatButton*/}
                {/*    styles = { buttonStylesBorderless }*/}
                {/*    toggledStyles = { this._getChatButtonToggledStyle(toggledButtonStyles) } />*/}
                <CustomActionCallButton {...this.props}
                    styles = { buttonStyles }
                    callAction={ INVITE_USER_EXTERNAL }
                    participants={this.props._participants}
                    displayName={this.props._displayName}
                    localParticipantId={this.props._localParticipantId}
                    toggledStyles = { toggledButtonStyles } />
                <ToggleCameraButton
                    styles = { buttonStyles }
                    toggledStyles = { toggledButtonStyles } />
                <AudioMuteButton
                    styles = { toggledButtonStyles }
                    toggledStyles = { buttonStyles } />
                {/*<VideoMuteButton*/}
                {/*    styles = { buttonStyles }*/}
                {/*    toggledStyles = { toggledButtonStyles } />*/}
                <HangupButton
                    styles = { hangupButtonStyles } />
                <OverflowMenuButton
                    styles = { buttonStylesBorderless }
                    toggledStyles = { toggledButtonStyles } />
            </View>
        );
    }
}

/**
 * Maps parts of the redux state to {@link Toolbox} (React {@code Component})
 * props.
 *
 * @param {Object} state - The redux state of which parts are to be mapped to
 * {@code Toolbox} props.
 * @private
 * @returns {Props}
 */
function _mapStateToProps(state: Object): Object {
    const _localParticipant = getLocalParticipant(state);
    const _localParticipantId = _localParticipant?.id;
    const _displayName = _localParticipant && getParticipantDisplayName(state, _localParticipantId);
    return {
        _styles: ColorSchemeRegistry.get(state, 'Toolbox'),
        _visible: isToolboxVisible(state),
        _participants: state['features/base/participants'],
        _displayName,
        _localParticipantId,
    };
}

export default connect(_mapStateToProps)(Toolbox);
