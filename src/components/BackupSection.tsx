import { exportBackup, importBackup } from "@/lib/studyStorage";

export function BackupSection() {
  const handleExport = () => {
    exportBackup();
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const ok = await importBackup(file);
      if (ok) {
        window.location.reload();
      } else {
        alert("Falha ao importar o backup");
      }
    };

    input.click();
  };

return (
  <div className="mt-4 flex justify-center gap-2">
    <button
      onClick={handleExport}
      className="
        px-3 py-1.5
        rounded-lg
        text-xs font-medium
        text-muted-foreground
        bg-secondary/40
        border border-border/50
        hover:bg-secondary/60
        hover:text-foreground
        transition
      "
    >
      Fazer backup
    </button>

    <button
      onClick={handleImport}
      className="
        px-3 py-1.5
        rounded-lg
        text-xs font-medium
        text-muted-foreground
        bg-secondary/40
        border border-border/50
        hover:bg-secondary/60
        hover:text-foreground
        transition
      "
    >
      Restaurar backup
    </button>
  </div>
);
}