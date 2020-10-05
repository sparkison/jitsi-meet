// @flow

import {TakeAShot} from '../../../base/icons'
import {AbstractButton, type AbstractButtonProps} from '../../../base/toolbox/components'
import {externalActionCall} from '../../../base/connection'
import { connect } from '../../../base/redux';
import {takeShotPrompt} from '../../actions.native'

/**
 * The type of the React {@code Component} props of {@link AudioOnlyButton}.
 */
type Props = AbstractButtonProps & {

    /**
     * call action object
     */
    callAction: Object,

    /**
     * The redux {@code dispatch} function.
     */
    dispatch: Function,

    /**
     * The local participants
     */
    participants: Array<any>,

    /**
     * Display name of user who initiated action
     */
    displayName: string,

    /**
     * ID of user who initiated action
     */
    localParticipantId: string,
};

/**
 * An implementation of a button for calling a custom external action
 */
class CustomActionShotButton extends AbstractButton<Props, any> {
    accessibilityLabel = 'action.takeShotPrompt'
    icon = TakeAShot
    label = 'action.takeShotPrompt'

    /**
     * Handles clicking / pressing the button.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _handleClick () {
        this.props.dispatch(takeShotPrompt(
            this.props.callAction,
            this.props.localParticipantId,
            this.props.displayName)
        )
    }

}

export default connect()(CustomActionShotButton);
