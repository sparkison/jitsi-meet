/* @flow */

import {DISPLAY_TAKE_A_SHOT_ANIMATION, TAKE_A_SHOT_PROMPT} from './actionTypes'

/**
 * Create an action for when prompt to take a shot is called.
 *
 * @private
 * @returns {{
 *     type: TAKE_A_SHOT_PROMPT,
 *     call: Object,
 *     participantId: string,
 *     displayName: string
 * }}
 */
export function takeShotPrompt (call: Object, participantId: string, displayName: string) {
    return {
        type: TAKE_A_SHOT_PROMPT,
        call,
        participantId,
        displayName
    }
}

/**
 * Toggle the animation display
 *
 * @param displayName
 * @param visible
 * @returns {{
 *      type: string,
 *      displayName: string,
 *      show: boolean
 * }}
 */
export function toggleTakeShotAnimation (displayName: string, visible: boolean) {
    return {
        type: DISPLAY_TAKE_A_SHOT_ANIMATION,
        displayName,
        visible
    }
}
