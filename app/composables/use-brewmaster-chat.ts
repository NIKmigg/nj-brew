type ChatMessage = {
  role: "user" | "npc";
  text: string;
};

type Step = "volume" | "tanninUsage" | "calculate" | "done";

type BrewmasterState = {
  step: Step;
  volume: number | null;
  tanninUsage: boolean | null;
};

export function useBrewmasterChat(onCalculate?: () => Promise<void>) {
  const chat = useState<ChatMessage[]>("brewmaster-chat", () => []);
  const isThinking = useState<boolean>("brewmaster-thinking", () => false);
  const state = useState<BrewmasterState>("brewmaster-state", () => ({
    step: "volume",
    volume: null,
    tanninUsage: null,
  }));

  const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

  const send = async (input: string) => {
    chat.value.push({ role: "user", text: input });
    isThinking.value = true;
    await delay(1000);

    if (state.value.step === "volume") {
      state.value.volume = Number(input);
      state.value.step = "tanninUsage";
      chat.value.push({ role: "npc", text: `Soll ich etwas Tannin hinzufügen?` });
    }
    else if (state.value.step === "tanninUsage") {
      state.value.tanninUsage = input.toLowerCase().startsWith("ja");
      state.value.step = "calculate";
      chat.value.push({
        role: "npc",
        text: `Sehr gut. Ich bereite nun ${state.value.volume} Liter Met für dich vor.`,
      });

      await delay(1000);
      await onCalculate?.();

      chat.value.push({
        role: "npc",
        text: `Fertig! Dein Rezept ist bereit. Schau es dir unten an!`,
      });
      state.value.step = "done";
    }

    isThinking.value = false;
  };

  const reset = () => {
    chat.value = [];
    isThinking.value = false;
    state.value = { step: "volume", volume: null, tanninUsage: null };
  };

  return { chat, isThinking, send, reset, state };
}
