import {toState} from '../base/redux'

/**
 * Returns true if the take a shot overlay is visible.
 *
 * @param stateful
 * @returns {boolean}
 */
export function isTakeShotOverlayVisible(stateful: Object | Function) {
    const state = toState(stateful);
    const { visible } = state['features/take-shot'];
    const { length: participantCount } = state['features/base/participants'];

    return visible && participantCount > 1;
}
