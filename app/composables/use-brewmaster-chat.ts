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

  const { t } = useI18n();

  const NPC_MESSAGES = computed(() => ({
    tanninQuestion: t("generator.chat.tanninQuestion"),
    preparing: (volume: number | null) => t("generator.chat.preparing", { volume }),
    done: t("generator.chat.done"),
  }));

  const send = async (input: string, useTannin?: boolean) => {
    switch (state.value.step) {
      case "volume":
        chat.value.push({ role: "user", text: `${input} ${t("generator.chat.liters")}`, step: "volume" });
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
        chat.value.push({ role: "npc", text: NPC_MESSAGES.value.tanninQuestion });
        break;
      case "tanninUsage":
        state.value.tanninUsage = useTannin ?? false;
        state.value.step = "calculate";
        chat.value.push({
          role: "npc",
          text: NPC_MESSAGES.value.preparing(state.value.volume),
        });

        await delay(1000);
        await onCalculate?.();

        chat.value.push({
          role: "npc",
          text: NPC_MESSAGES.value.done,
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
