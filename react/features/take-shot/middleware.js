// @flow

import {MiddlewareRegistry} from '../base/redux'

import {ENDPOINT_MESSAGE_RECEIVED, TAKE_A_SHOT_PROMPT} from './actionTypes'
import {sendEvent} from '../mobile/external-api'
import {EXTERNAL_ACTION_CALL} from '../base/connection'
import {toggleTakeShotAnimation} from './actions.native'
import {NOTIFICATION_TIMEOUT, showNotification} from '../notifications'

/**
 * The type of json-message which indicates that json carries a
 * transcription result.
 */
const TAKE_SHOT_PROMPT_ACTION = 'take-shot-prompt-result'

// Debounce functions/timers
let showTimer
let messageTimer

// Debounce timer
const debounceTime = 500 // time in milliseconds

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

    // Make sure we're responding to the correct action
    if (!(json && json.type === TAKE_SHOT_PROMPT_ACTION)) {
        return next(action)
    }

    // Get variables from the JSON object (see `_showPrompt` function below)
    const { type, from } = json

    // Debounce the display
    saveAlertDebounce(store, from)

    return next(action)
}


/**
 * Debounce function to show the "take a shot" alert/animation when received
 *
 * @param store
 * @param from
 */
const saveAlertDebounce = (store, from: string) => {
    const { dispatch, getState } = store

    // Clear previous timer
    if (showTimer) {
        clearTimeout(showTimer)
    }

    // Start new one
    showTimer = setTimeout(() => {
        // Show take a shot
        dispatch(toggleTakeShotAnimation(from, true))

        // Display notification
        dispatch(showNotification({
            titleArguments: {
                participantDisplayName: from
            },
            titleKey: 'notify.takeAShotTitle'
        }, NOTIFICATION_TIMEOUT))

        // Send event to external API
        sendEvent(
            store,
            EXTERNAL_ACTION_CALL,
            /* data */ {
                call: JSON.stringify({
                    action: 'prompted_to_take_shot'
                }),
                participantId: null,
                displayName: from
            })

    }, debounceTime) // delay for bounce time
}

/**
 * Prompt all participants to take a shot!
 *
 * @param store
 * @param next
 * @param action
 * @returns {*}
 * @private
 */
function _showPrompt (store, next, action) {
    saveEndpointNotifyDebounce(store, action.displayName)
    return next(action)
}

/**
 * Debounce function to send the "take a shot" message to all participants
 *
 * @param store
 * @param from
 */
const saveEndpointNotifyDebounce = ({ getState }, from: string) => {
    const state = getState()
    const { conference } = state['features/base/conference']

    // Clear previous timer
    if (messageTimer) {
        clearTimeout(messageTimer)
    }

    // Start new one
    messageTimer = setTimeout(() => {
        if (conference) {
            // Notify all participants
            conference.sendEndpointMessage('', {
                type: TAKE_SHOT_PROMPT_ACTION,
                from
            })
        }
    }, debounceTime * 2) // make this one trigger less often
}
