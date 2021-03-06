# usePersistedReducer
A React Hook for React Native who behave exactly like **useReducer** but persist the state into async storage

# Installation

````bash
npm i @solidx/react-native-use-persisted-reducer
````

# Usage

````javascript
import { usePersistedReducer } from "@solidx/react-native-use-persisted-reducer/lib";

const [state, dispatch] = usePersistedReducer(
  {
    persistKey: 'async storage key used', // a unique key for the async storage entry key (Mandatory)
    whiteList: ['name', 'address'],       // a JS array containing fields to persist (Optional) 
  },
  reducer,
  defaultState
);
````

# Comments

* Default state is returned when cache is empty
* If whiteList is omitted then the whole state is persisted in cache
* Cache is updated each time state is updated
* additional `hydrated` field is added to the state once cache has been successfully loaded'


