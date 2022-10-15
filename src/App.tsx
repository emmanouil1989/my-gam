import React, { PropsWithChildren, useEffect, useReducer } from "react";
import "./App.css";
import PlayerCard from "./components/PlayerCard";
import { determineDefenderDamage } from "./utils";
export enum Player {
  Player1 = "Player1",
  Player2 = "Player2",
}
export enum AppAction {
  changeValue = "changeValue",
  resetApp = "resetApp",
}
const Player_Health = 20;

type AppType = {
  initialHealth?: {
    player1: number;
    player2: number;
  };
};
function App({ initialHealth }: PropsWithChildren<AppType>) {
  return (
    <AppProvider
      player1InitialValue={initialHealth?.player1}
      player2InitialValue={initialHealth?.player2}
    >
      <main className="h-screen w-screen flex items-center justify-center">
        <div className="flex flex-col  p-4 w-max h-max justify-between bg-white rounded">
          <h1 className="reverse-text">
            Each player attacks to another and the player who remains with some
            health points wins!
          </h1>
          <Winner />
          <CardContainer />
        </div>
      </main>
    </AppProvider>
  );
}

const CardContainer = () => {
  const { state, dispatch } = useAppContext();

  const { playerTurn, attacker, defender, winner, Player1, Player2 } = state;

  const onNextRound = (dispatch: React.Dispatch<ActionType>) => {
    if (!attacker.hitValue || !defender.hitValue) {
      return;
    }
    const newAttacker = { player: defender.player, hitValue: undefined };
    const newDefender = { player: attacker.player, hitValue: undefined };
    const damage = determineDefenderDamage(
      attacker.hitValue,
      defender.hitValue
    );
    const key =
      defender.player === Player.Player1 ? Player.Player1 : Player.Player2;
    changeAppStateValue(dispatch, key, state[key] - damage);
    changeAppStateValue(dispatch, "attacker", newAttacker);
    changeAppStateValue(dispatch, "defender", newDefender);
    changeAppStateValue(dispatch, "playerTurn", newAttacker.player);
  };

  const onReset = (dispatch: React.Dispatch<ActionType>) => {
    dispatch({ type: AppAction.resetApp });
  };

  useEffect(() => {
    if (Player1 <= 0) {
      changeAppStateValue(dispatch, "winner", Player.Player2);
    }
    if (Player2 <= 0) {
      changeAppStateValue(dispatch, "winner", Player.Player1);
    }
  }, [Player1, Player2, dispatch, winner]);
  const isRoundOVER =
    attacker.hitValue !== undefined && defender.hitValue !== undefined;

  return (
    <div className="flex flex-col w-full h-full justfy-between">
      <div className="flex flex-row items-center w-full h-max justify-between p-8">
        <PlayerCard
          name={Player.Player1}
          isDisabled={
            playerTurn === Player.Player2 || isRoundOVER || winner !== undefined
          }
        />
        <PlayerCard
          name={Player.Player2}
          isDisabled={
            playerTurn === Player.Player1 || isRoundOVER || winner !== undefined
          }
        />
      </div>
      <div className="flex flex-row justify-between">
        <button
          onClick={() => onNextRound(dispatch)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded disabled:cursor-not-allowed disabled:opacity-50 "
          disabled={!attacker.hitValue || !defender.hitValue}
        >
          Next Round
        </button>
        <button
          onClick={() => onReset(dispatch)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded disabled:cursor-not-allowed disabled:opacity-50 "
          disabled={winner === undefined}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

const Winner = () => {
  const { state } = useAppContext();
  return state.winner ? (
    <span className="reverse-text font-bold"> Winner is: {state.winner}</span>
  ) : null;
};

type AppState = {
  [Player.Player1]: number;
  [Player.Player2]: number;
  playerTurn: Player;
  attacker: {
    player: Player;
    hitValue?: number;
  };
  defender: {
    player: Player;
    hitValue?: number;
  };
  winner?: Player;
};
type AppContextType = {
  state: AppState;
  dispatch: React.Dispatch<ActionType>;
};
const AppContext = React.createContext<AppContextType | undefined>(undefined);

const initialState = (
  player1InitialValue?: number,
  player2InitialValue?: number
): AppState => {
  return {
    [Player.Player1]: player1InitialValue ?? Player_Health,
    [Player.Player2]: player2InitialValue ?? Player_Health,
    playerTurn: Player.Player1,
    attacker: {
      player: Player.Player1,
      hitValue: undefined,
    },
    defender: {
      player: Player.Player2,
      hitValue: undefined,
    },
    winner: undefined,
  };
};

type ActionType =
  | {
      type: AppAction;
      key: keyof AppState;
      value: AppState[keyof AppState];
    }
  | {
      type: AppAction.resetApp;
    };
const reducer = (state: AppState, action: ActionType) => {
  switch (action.type) {
    case AppAction.changeValue:
      return { ...state, [action.key]: action.value };
    case AppAction.resetApp:
      return initialState();
    default:
      return state;
  }
};
export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppContext");
  }
  return context;
};

type AppProviderType = PropsWithChildren<{
  player1InitialValue?: number;
  player2InitialValue?: number;
}>;
export const AppProvider = ({
  children,
  player1InitialValue,
  player2InitialValue,
}: AppProviderType) => {
  const [state, dispatch] = useReducer(
    reducer,
    initialState(player1InitialValue, player2InitialValue)
  );

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const changeAppStateValue = (
  dispatch: React.Dispatch<ActionType>,
  key: keyof AppState,
  value: AppState[keyof AppState]
) =>
  dispatch({
    type: AppAction.changeValue,
    key,
    value,
  });
export default App;
