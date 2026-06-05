type ChatMessage = {
  role: "user" | "npc";
  text: string;
  step?: Step;
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

  const NPC_MESSAGES = {
    tanninQuestion: "Soll ich etwas Tannin hinzufügen?",
    preparing: (volume: number | null) => `Sehr gut. Ich bereite nun ${volume} Liter Met für dich vor.`,
    done: "Fertig! Dein Rezept ist bereit. Schau es dir unten an!",
  } as const;

  const send = async (input: string) => {
    switch (state.value.step) {
      case "volume":
        chat.value.push({ role: "user", text: `${input} Liter`, step: "volume" });
        break;
      case "tanninUsage":
        chat.value.push({ role: "user", text: input, step: "tanninUsage" });
        break;
      default:
        return;
    }

    isThinking.value = true;
    await delay(1000);

    switch (state.value.step) {
      case "volume":
        state.value.volume = Number(input);
        state.value.step = "tanninUsage";
        chat.value.push({ role: "npc", text: NPC_MESSAGES.tanninQuestion });
        break;
      case "tanninUsage":
        state.value.tanninUsage = input.toLowerCase().startsWith("ja");
        state.value.step = "calculate";
        chat.value.push({
          role: "npc",
          text: NPC_MESSAGES.preparing(state.value.volume),
        });

        await delay(1000);
        await onCalculate?.();

        chat.value.push({
          role: "npc",
          text: NPC_MESSAGES.done,
        });
        state.value.step = "done";
        break;
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
