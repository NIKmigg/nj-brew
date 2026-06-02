type ChatMessage = {
  role: "user" | "npc";
  text: string;
};

type Step = "volume" | "tanninUsage" | "done";

export function useBrewmasterChat() {
  const chat = ref<ChatMessage[]>([]);
  const isThinking = ref(false);

  const state = ref<{
    step: Step;
    volume: number | null;
    tanninUsage: boolean | null;
  }>({
    step: "volume",
    volume: null,
    tanninUsage: null,
  });

  const delay = (ms: number) =>
    new Promise(r => setTimeout(r, ms));

  const send = async (input: string) => {
    chat.value.push({ role: "user", text: input });

    isThinking.value = true;
    await delay(800);

    // STEP 1: VOLUME
    if (state.value.step === "volume") {
      state.value.volume = Number(input);
      state.value.step = "tanninUsage";

      chat.value.push({
        role: "npc",
        text: `Soll ich etwas Tannin hinzufügen?`,
      });
    }

    // STEP 2: TANNIN USAGE
    else if (state.value.step === "tanninUsage") {
      state.value.tanninUsage = input.toLowerCase() === "ja";
      state.value.step = "done";

      chat.value.push({
        role: "npc",
        text: `Sehr gut. Ich bereite nun ${state.value.volume} Liter Met für dich vor, Reisender.`,
      });

      // hier könntest du später API call triggern
    }
    isThinking.value = false;
  };
  const reset = () => {
    chat.value = [];
    state.value.step = "volume";
    state.value.volume = null;
    state.value.tanninUsage = null;
  };

  return {
    chat,
    isThinking,
    send,
    reset,
    state,
  };
};
