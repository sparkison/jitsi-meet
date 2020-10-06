// @flow

import {ReducerRegistry} from '../base/redux'

import {DISPLAY_TAKE_A_SHOT_ANIMATION, TAKE_A_SHOT_PROMPT} from './actionTypes'

/**
 * Returns initial state for toolbox's part of Redux store.
 *
 * @private
 * @returns {{
 *
 * }}
 */
function _getInitialState () {

    return {
        visible: false
    }
}

ReducerRegistry.register(
    'features/take-shot',
    (state: Object = _getInitialState(), action: Object) => {
        switch (action.type) {
            case TAKE_A_SHOT_PROMPT:
                return {
                    ...state
                }
            case DISPLAY_TAKE_A_SHOT_ANIMATION:
                return {
                    visible: !state.visible // toggle
                }
        }

        return state
    })
