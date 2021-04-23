import {
  Dispatch,
  Reducer,
  ReducerAction,
  ReducerState,
  useEffect,
  useReducer,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface IPersistOptions {
  persistKey: string;
  whiteList?: string[];
}

export interface IPersistedState {
  hydrated: boolean;
}

function getWhiteListedObject(object: any, whiteList: string[]) {
  const filteredObject: any = {};
  Object.keys(object).forEach((key) => {
    if (whiteList?.indexOf(key) !== -1) {
      filteredObject[key] = object[key];
    }
  });

  return filteredObject;
}

function reactOn(object: any, whiteList: string[]) {
  const whiteListedObject = getWhiteListedObject(object, whiteList);
  return Object.keys(whiteListedObject).length === 0
    ? [object]
    : Object.values(whiteListedObject);
}

function extendedReducer<R extends Reducer<any, any>>(reducer: R) {
  return (state: R, action: any) => {
    const nextState = reducer(state, action);
    if (action.type === 'hydrate') {
      return {
        ...nextState,
        ...action.state,
        hydrated: true,
      };
    }
    return nextState;
  };
}

export function usePersistedReducer<R extends Reducer<any, any>, I>(
  persistOptions: IPersistOptions,
  reducer: R,
  initialState: ReducerState<R>,
  initializer?: undefined
): [ReducerState<R>, Dispatch<ReducerAction<R>>] {
  const [state, dispatch] = useReducer(
    extendedReducer(reducer),
    initialState,
    initializer
  );

  useEffect(() => {
    AsyncStorage.getItem(persistOptions.persistKey, (error, result) => {
      let jsonObject;
      if (result) {
        try {
          jsonObject = JSON.parse(result);
          if (
            persistOptions.whiteList &&
            Array.isArray(persistOptions.whiteList)
          ) {
            jsonObject = getWhiteListedObject(
              jsonObject,
              persistOptions.whiteList
            );
          }
        } catch (e) {
          console.warn({ e });
        }
      }
      dispatch({ type: 'hydrate', state: jsonObject });
    });
  }, []);

  useEffect(() => {
    if (state === initialState) {
      return;
    }
    AsyncStorage.setItem(
      persistOptions.persistKey,
      JSON.stringify(
        getWhiteListedObject(state, persistOptions?.whiteList ?? [])
      )
    );
  }, reactOn(state, persistOptions?.whiteList || []));

  return [state, dispatch];
}
