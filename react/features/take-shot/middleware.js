// @flow

import {MiddlewareRegistry} from '../base/redux'

import {ENDPOINT_MESSAGE_RECEIVED, TAKE_A_SHOT_PROMPT} from './actionTypes'
import {sendEvent} from '../mobile/external-api'
import {EXTERNAL_ACTION_CALL} from '../base/connection'
import {toggleTakeShotAnimation} from './actions.native'

/**
 * The type of json-message which indicates that json carries a
 * transcription result.
 */
const TAKE_SHOT_PROMPT_ACTION = 'take-shot-prompt-result'


/**
 * Middleware which intercepts Toolbox actions to handle changes to the
 * visibility timeout of the Toolbox.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry.register(store => next => action => {

    switch (action.type) {
        case TAKE_A_SHOT_PROMPT: {
            const {
                call,
                participantId,
                displayName
            } = action
            // Send our custom action event (message to self)
            sendEvent(
                store,
                EXTERNAL_ACTION_CALL,
                /* data */ {
                    call: JSON.stringify(call),
                    participantId,
                    displayName
                })
            return _showPrompt(store, next, action)
        }

        case ENDPOINT_MESSAGE_RECEIVED: {
            return _endpointMessageReceived(store, next, action)
        }
    }

    return next(action)
})

/**
 * Participant has been prompted to take a shot
 *
 * @param store
 * @param next
 * @param action
 * @returns {*}
 * @private
 */
function _endpointMessageReceived (store, next, action) {
    const { json } = action
    if (!(json && json.type === TAKE_SHOT_PROMPT_ACTION)) {
        return next(action)
    }
    // Send our custom action event (message from another participant)
    const {
        participantId,
        displayName
    } = action
    store.dispatch(toggleTakeShotAnimation(participantId, displayName, true))
    sendEvent(
        store,
        EXTERNAL_ACTION_CALL,
        /* data */ {
            call: JSON.stringify({
                action: 'prompted_to_take_shot'
            }),
            participantId,
            displayName
        })
    return next(action)
}

/**
 * Prompt all participants to take a shot!
 *
 * @param getState
 * @param next
 * @param action
 * @returns {*}
 * @private
 */
function _showPrompt ({ getState }, next, action) {
    const state = getState()
    const { conference } = state['features/base/conference']
    if (conference) {
        // Notify all participants
        conference.sendEndpointMessage('', {
            type: TAKE_SHOT_PROMPT_ACTION,
            from: action.displayName
        })
    }
    return next(action)
}
