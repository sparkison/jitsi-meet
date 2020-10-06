// @flow

import {AddUser} from '../../../base/icons'
import {AbstractButton, type AbstractButtonProps} from '../../../base/toolbox/components'
import {externalActionCall} from '../../../base/connection'
import { connect } from '../../../base/redux';

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
class CustomActionCallButton extends AbstractButton<Props, any> {
    accessibilityLabel = 'addPeople.inviteMorePrompt'
    icon = AddUser
    label = 'addPeople.inviteMorePrompt'

    /**
     * Handles clicking / pressing the button.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _handleClick () {
        this.props.dispatch(externalActionCall(
            this.props.callAction,
            this.props.localParticipantId,
            this.props.displayName)
        )
    }

}

export default connect()(CustomActionCallButton);
