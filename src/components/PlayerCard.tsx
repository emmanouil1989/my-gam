import { Player, useAppContext, changeAppStateValue } from "../App";
import { getDiceValue } from "../utils";

type PlayerCardProps = {
  name: Player;
  isDisabled: boolean;
};
export default function PlayerCard({ name, isDisabled }: PlayerCardProps) {
  const { state, dispatch } = useAppContext();

  const { attacker, defender } = state;

  const attacking = attacker.player === name;

  const hit = () => {
    const diceValue = getDiceValue();
    if (name === attacker.player) {
      changeAppStateValue(dispatch, "playerTurn", defender.player);
      changeAppStateValue(dispatch, "attacker", {
        ...attacker,
        hitValue: diceValue,
      });
    } else {
      changeAppStateValue(dispatch, "playerTurn", attacker.player);
      changeAppStateValue(dispatch, "defender", {
        ...defender,
        hitValue: diceValue,
      });
    }
  };
  const playerHitPoint = attacking ? attacker.hitValue : defender.hitValue;
  return (
    <div className={"flex flex-col shadow-2xl p-8 "}>
      <h3 className="reverse-text">
        {" "}
        {name} Health Points: {state[name]}
      </h3>
      <div className="pb-4" />
      {playerHitPoint && (
        <span className="reverse-text">
          {attacking ? "Attacker" : "Defender"} hit points:
          {playerHitPoint}
        </span>
      )}
      <div className="pb-4" />
      <button
        onClick={hit}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isDisabled}
      >
        {attacking ? "Attack" : "Defend"}
      </button>
    </div>
  );
}
