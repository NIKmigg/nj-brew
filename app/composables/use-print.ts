// composables/usePrint.ts
export function usePrint() {
  const print = (targetId: string) => {
    const target = document.getElementById(targetId);
    if (!target)
      return;

    const style = document.createElement("style");
    style.id = "__print_style__";
    style.innerHTML = `
      @media print {
        @page {
          margin: 10mm;
        }

        html, body {
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
        }

        /* Alles verstecken */
        body * {
          visibility: hidden;
          background: white !important;
          background-color: white !important;
          background-image: none !important;
          box-shadow: none !important;
          border: none !important;
          outline: none !important;
        }

        /* Ziel-Element anzeigen */
        #${targetId},
        #${targetId} * {
          visibility: visible;
        }

        /* Pergament-Hintergründe explizit wiederherstellen */
        #${targetId} .parchment {
          background-color: #e8c87a !important;
          background-image: none !important;
          border: none !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        /* Stäbe wiederherstellen */
        #${targetId} .rod {
          background: linear-gradient(
            180deg,
            #d4a96a 0%, #b8864a 8%, #8b5e2e 22%, #6b4220 38%,
            #9a6535 52%, #7a4e28 65%, #5c3a1e 78%, #8b5e2e 88%,
            #6b4220 95%, #4a2c10 100%
          ) !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }

        /* Positionierung */
        #${targetId} {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          margin: 0 !important;
          padding: 0 !important;
          border: none !important;
          filter: none !important;
        }
      }
    `;

    document.head.appendChild(style);
    window.print();

    window.addEventListener("afterprint", () => {
      document.getElementById("__print_style__")?.remove();
    }, { once: true });
  };

  return { print };
}
