// @flow

import {translate} from '../../../base/i18n'
import {IconInviteMoreDark} from '../../../base/icons'
import {AbstractButton, type AbstractButtonProps} from '../../../base/toolbox/components'
import {externalActionCall} from '../../../base/connection'

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
    dispatch: Function
};

/**
 * An implementation of a button for calling a custom external action
 */
class CustomActionCallButton extends AbstractButton<Props, any> {
    accessibilityLabel = 'addPeople.inviteMorePrompt'
    icon = IconInviteMoreDark
    label = 'addPeople.inviteMorePrompt'

    /**
     * Handles clicking / pressing the button.
     *
     * @override
     * @protected
     * @returns {void}
     */
    _handleClick () {
        this.props.dispatch(externalActionCall(this.props.callAction))
    }

}

export default translate(CustomActionCallButton)
