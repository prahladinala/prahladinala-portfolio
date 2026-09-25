export type GameType = "tictactoe" | "rps" | "memory";

export type Message = {
  id: string;
  text: string;
  sender: "user" | "ai";
  actionLink?: { label: string; url: string };
  game?: GameType;
};
