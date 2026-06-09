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
          margin: 0mm;
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
        }

        /* Ziel-Element anzeigen */
        #${targetId},
        #${targetId} * {
          visibility: visible;
        }

        #${targetId} .rod {
          visibility: hidden;
        }

        /* Positionierung */
        #${targetId} {
          position: fixed;
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
