// @flow

import React, {PureComponent} from 'react'
import {Animated, Easing, TouchableOpacity, View} from 'react-native'

import {ColorSchemeRegistry} from '../../../base/color-scheme'
import {Container} from '../../../base/react'
import {connect} from '../../../base/redux'
import {StyleType} from '../../../base/styles'
import styles from './styles'
import {getLocalParticipant, getParticipantDisplayName} from '../../../base/participants'
import {isToolboxVisible} from '../../../toolbox/functions.native'
import {TakeAShotClank, TakeAShotLeft, TakeAShotRight} from '../../../base/icons'
import {isTakeShotOverlayVisible} from '../../functions.native'
import {takeShotPrompt} from '../../actions.native'

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
     * The indicator which determines whether the shot overlay animation is visible.
     */
    _takeShotOverlayVisible: boolean,

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function
};

/**
 * Implements the conference toolbox on React Native.
 */
class TakeShot extends PureComponent<Props> {
    constructor (props) {
        super(props)

        // Setup state variables for the local animation
        this.state = {
            rotateLeftValue: new Animated.Value(0),
            moveLeftValue: new Animated.Value(0),
            rotateRightValue: new Animated.Value(0),
            moveRightValue: new Animated.Value(0),
            fadeValue: new Animated.Value(0),
            zoomValue: new Animated.Value(0),
            springValue: new Animated.Value(0),
        }
    }

    /**
     * Reset state values
     */
    resetState () {
        // Reset state values
        this.setState({
            rotateLeftValue: new Animated.Value(0),
            moveLeftValue: new Animated.Value(0),
            rotateRightValue: new Animated.Value(0),
            moveRightValue: new Animated.Value(0),
            fadeValue: new Animated.Value(0),
            zoomValue: new Animated.Value(0),
            springValue: new Animated.Value(0),
        })
    }

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
                visible={this.props._visible}>
                {this._renderToolbar()}
            </Container>
        )
    }

    /**
     * Run the "take a shot" animation (glasses "cheersing")
     */
    runAnimation () {
        // Build the animation sequence
        Animated.sequence([
            // Hide fades
            Animated.timing(this.state.fadeValue, { toValue: 0, duration: 0 }),
            // Run rotations
            Animated.parallel([
                Animated.timing(
                    this.state.rotateLeftValue,
                    {
                        toValue: 1,
                        duration: 800,
                        easing: Easing.linear,
                    }
                ),
                Animated.timing(
                    this.state.rotateRightValue,
                    {
                        toValue: 1,
                        duration: 800,
                        easing: Easing.linear,
                    }
                )
            ]),
            // Run movements
            Animated.parallel([
                // Springs
                Animated.spring(
                    this.state.moveLeftValue,
                    {
                        toValue: 1,
                        friction: 3,
                        easing: Easing.cubic,
                    }
                ),
                Animated.spring(
                    this.state.moveRightValue,
                    {
                        toValue: 1,
                        friction: 3,
                        easing: Easing.cubic,
                    }
                ),
                // Fade and spring "clank"
                Animated.parallel([
                    Animated.timing(
                        this.state.fadeValue,
                        {
                            toValue: 1,
                            easing: Easing.cubic,
                        }
                    ),
                    Animated.spring(
                        this.state.springValue,
                        {
                            toValue: 1,
                            friction: 2,
                            easing: Easing.cubic,
                        }
                    )
                ])
            ]),
        ]).start()
    }

    /**
     * Returns the shot glass animation
     *
     * @param containerSize
     * @param iconSize
     * @param margin
     * @returns {*}
     */
    animatedView(
        containerSize = 80,
        iconSize = 60,
        margin = 8
    ) {
        // First set up animation
        const leftAnim = this.state.rotateLeftValue.interpolate({
            inputRange: [0, 0.25, 0.5, 1],
            outputRange: ['-40deg', '0deg', '5deg', '0deg']
        })
        const moveLeft = this.state.moveLeftValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-45, margin]
        })
        const clankAnim = this.state.springValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        })
        const fadeAnim = this.state.fadeValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        })
        const zoomAnim = this.state.zoomValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
        })
        const rightAnim = this.state.rotateRightValue.interpolate({
            inputRange: [0, 0.25, 0.5, 1],
            outputRange: ['30deg', '0deg', '-5deg', '0deg']
        })
        const moveRight = this.state.moveRightValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-40, margin]
        })

        const iconStyle = {
            position: "absolute",
            top: margin,
        }
        const iconStyleLeft = {
            ...iconStyle,
            transform: [
                { rotate: leftAnim }
            ],
            left: moveLeft
        }
        const iconStyleClank = {
            ...iconStyle,
            transform: [
                { scale: clankAnim }
            ],
            opacity: fadeAnim
        }
        const iconStyleRight = {
            ...iconStyle,
            transform: [
                { rotate: rightAnim }
            ],
            right: moveRight
        }
        return (
            <View style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                <Animated.View style={iconStyleLeft}>
                    <TakeAShotLeft width={iconSize}
                                   height={iconSize} />
                </Animated.View>
                <Animated.View style={iconStyleClank}>
                    <TakeAShotClank width={iconSize}
                                    height={iconSize} />
                </Animated.View>
                <Animated.View style={iconStyleRight}>
                    <TakeAShotRight width={iconSize}
                                    height={iconSize} />
                </Animated.View>
            </View>
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
        // Define what to send when calling external action
        const TAKE_SHOT_EXTERNAL = {
            action: "take_shot"
        }

        // Some padding/margin constants to retain the image
        const margin = 8
        const containerSize = 80
        const iconSize = 60

        // Run initial animation
        this.runAnimation()

        // Debug
        __DEV__ && console.log(`${this.props._displayName} received prompt to take a shot!`)

        // Return the main component
        return (
            <View
                accessibilityRole='button'
                pointerEvents='box-none'
                style={styles.toolbar}>
                <TouchableOpacity
                    activeOpacity={1} // don't fade on press, we're animating!
                    onPress={() => {
                        this.resetState()
                        this.runAnimation()
                        this.props.dispatch(takeShotPrompt(TAKE_SHOT_EXTERNAL,
                            this.props._localParticipantId,
                            this.props._displayName
                        ))
                    }}
                    style={{
                        width: containerSize,
                        height: containerSize,
                        borderRadius: 40,
                        backgroundColor: "#fff",
                        borderColor: "#333",
                        borderWidth: 3,
                    }}>
                    {this.animatedView(containerSize, iconSize, margin)}
                </TouchableOpacity>
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
    const _localParticipantId = _localParticipant.id || null
    const _displayName = _localParticipant && getParticipantDisplayName(state, _localParticipantId)
    return {
        _styles: ColorSchemeRegistry.get(state, 'Toolbox'),
        _visible: isToolboxVisible(state), // we'll defer to the toolbox
        _takeShotOverlayVisible: isTakeShotOverlayVisible(state), // should we display the overlay?
        _displayName,
        _localParticipantId
    }
}

export default connect(_mapStateToProps)(TakeShot)
