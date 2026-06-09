type ChatMessage = {
  role: "user" | "npc";
  textKey: string;
  textParams?: Record<string, unknown>;
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

  const send = async (input: string, useTannin?: boolean) => {
    switch (state.value.step) {
      case "volume":
        chat.value.push({ role: "user", textKey: "generator.chat.liters", textParams: { volume: input }, step: "volume" });
        break;
      case "tanninUsage":
        chat.value.push({ role: "user", textKey: useTannin ? "generator.chat.yes" : "generator.chat.no", step: "tanninUsage" });
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
        chat.value.push({ role: "npc", textKey: "generator.chat.tanninQuestion" });
        break;
      case "tanninUsage":
        state.value.tanninUsage = useTannin ?? false;
        state.value.step = "calculate";
        chat.value.push({
          role: "npc",
          textKey: "generator.chat.preparing",
          textParams: { volume: state.value.volume },
        });

        await delay(1000);
        await onCalculate?.();

        chat.value.push({
          role: "npc",
          textKey: "generator.chat.done",
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
