import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import App, { AppProvider, Player } from "./App";
import * as Utils from "./utils";
import PlayerCard from "./components/PlayerCard";
import userEvent from "@testing-library/user-event";

test("renders App component", () => {
  render(<App />);
  expect(
    screen.getByText(/player attacks to another and /)
  ).toBeInTheDocument();

  expect(screen.getByText(/Player1 Health Points:/)).toBeInTheDocument();
  expect(screen.getByText(/Player2 Health Points:/)).toBeInTheDocument();

  expect(screen.getByText(/Attack/)).toBeInTheDocument();

  expect(screen.getByText(/Defend/)).toBeInTheDocument();
  expect(screen.getByText(/Defend/)).toBeDisabled();

  expect(screen.getByText(/Reset/)).toBeInTheDocument();

  expect(screen.getByText(/Next Round/)).toBeInTheDocument();
  cleanup();
});

test("Card Player Component display attacker hit value", async () => {
  render(
    <AppProvider>
      <PlayerCard isDisabled={false} name={Player.Player1} />
    </AppProvider>
  );
  const spy = jest.spyOn(Utils, "getDiceValue");
  spy.mockReturnValue(5);

  await userEvent.click(screen.getByText(/Attack/));
  expect(await screen.findByText(/Attacker hit points:/)).toBeInTheDocument();
  expect(await screen.findByText(/Attacker hit points:/)).toHaveTextContent(
    "5"
  );
  cleanup();
});

test("Card Player Component display defnder hit value", async () => {
  render(<App />);
  const spy = jest.spyOn(Utils, "getDiceValue");
  spy.mockReturnValue(5);

  await userEvent.click(screen.getByText(/Attack/));
  expect(await screen.findByText(/Attacker hit points:/)).toBeInTheDocument();
  expect(await screen.findByText(/Attacker hit points:/)).toHaveTextContent(
    "5"
  );
  await userEvent.click(screen.getByText(/Defend/));

  expect(await screen.findByText(/Defender hit points:/)).toBeInTheDocument();
  expect(await screen.findByText(/Defender hit points:/)).toHaveTextContent(
    "5"
  );
  spy.mockRestore();
  cleanup();
});

test("Card Player Component display winner", async () => {
  render(<App initialHealth={{ player1: 2, player2: 1 }} />);
  const spy = jest.spyOn(Utils, "getDiceValue");
  spy.mockReturnValue(5);

  await userEvent.click(screen.getByText(/Attack/));
  expect(await screen.findByText(/Attacker hit points:/)).toBeInTheDocument();
  expect(await screen.findByText(/Attacker hit points:/)).toHaveTextContent(
    "5"
  );

  spy.mockReturnValue(2);
  await userEvent.click(screen.getByText(/Defend/));
  await userEvent.click(screen.getByText(/Next Round/));
  expect(await screen.findByText(/Winner/)).toBeInTheDocument();
  expect(await screen.findByText(/Winner/)).toHaveTextContent(Player.Player1);
  spy.mockRestore();
  cleanup();
});

test("Determine defender damage when attacker hit is greater than defender", () => {
  const damage = Utils.determineDefenderDamage(6, 5);
  expect(damage).toBe(1);
});

test("Determine defender damage when defender hit is greater than defender", () => {
  const damage = Utils.determineDefenderDamage(3, 5);
  expect(damage).toBe(0);
});
