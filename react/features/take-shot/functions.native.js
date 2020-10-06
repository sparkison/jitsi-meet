import {toState} from '../base/redux'
import {getFeatureFlag, TOOLBOX_ALWAYS_VISIBLE} from '../base/flags'

/**
 * Returns true if the take a shot overlay is visible.
 *
 * @param stateful
 * @returns {boolean}
 */
export function isTakeShotOverlayVisible (stateful: Object | Function) {
    const state = toState(stateful)
    const { visible } = state['features/take-shot']
    const { length: participantCount } = state['features/base/participants']

    return visible && participantCount > 1
}

/**
 * Returns true if the take a shot action button is visible (we'll defer to the toolbox visibility).
 *
 * @param stateful
 * @returns {boolean}
 */
export function isTakeShotActionButtonVisible (stateful: Object | Function) {
    const state = toState(stateful)
    const { alwaysVisible, enabled, visible } = state['features/toolbox']
    const { length: participantCount } = state['features/base/participants']
    const flag = getFeatureFlag(state, TOOLBOX_ALWAYS_VISIBLE, false)

    return enabled && participantCount > 1 && (alwaysVisible || visible || flag)
}
