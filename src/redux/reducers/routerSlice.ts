import { createReduxHistoryContext } from "redux-first-history";
import { createBrowserHistory, Location } from "history";
import {UnknownAction} from "@reduxjs/toolkit";
const { routerReducer } = createReduxHistoryContext({ history: createBrowserHistory() });

type RouterState = ReturnType<typeof routerReducer> & { location: Location };

type RouterAction = {
    type: string;
    payload: { location: Location };
};

const initialState: RouterState = {
    location: null,
    action: null,
};

export const routerSlice = (
    state: RouterState = initialState,
    action: RouterAction
): RouterState => {
    if (action.type === '@@router/LOCATION_CHANGE') {
        const { location } = action.payload;
        const updatedState = routerReducer(state, action);

        let updatedPreviousLocation;
        if (updatedState.previousLocations) {
            updatedPreviousLocation = [
                { location },
                ...updatedState.previousLocations.slice(0, 1)
            ];
        } else {
            updatedPreviousLocation = [{ location }];
        }
        return {
            ...updatedState,
            location,
            previousLocations: updatedPreviousLocation,
        };
    }
    return <ReturnType<(state: (RouterState | undefined), action: UnknownAction) => RouterState> & {
        location: Location
    }>routerReducer(state, action);
}

