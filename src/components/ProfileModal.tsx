import { useState } from "react";
import { cn } from "@/lib/utils";
import { useStudy } from "@/context/StudyContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function ProfileModal({ open, onClose }: Props) {
  const { data, update } = useStudy();
  const [name, setName] = useState(data.user?.name || "");
  const [avatar, setAvatar] = useState<string | undefined>(
    data.user?.avatar
  );

  if (!open) return null;

  const handleImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setAvatar(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const save = () => {
  update(prev => ({
    ...prev,
    user: {
      name: name || "Estudante",
      avatar,
    },
  }));

  onClose();
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="glass-card w-[90%] max-w-sm rounded-3xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-center">Editar perfil</h2>

        {/* Avatar */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-secondary border border-primary/30">
            {avatar ? (
              <img
                src={avatar}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl">
                🙂
              </div>
            )}
          </div>

          <label className="text-xs text-primary cursor-pointer font-semibold">
            Trocar foto
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) =>
                e.target.files && handleImage(e.target.files[0])
              }
            />
          </label>
        </div>

        {/* Nome */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">
            Como quer ser chamada?
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl bg-secondary/50 px-4 py-2 outline-none border border-border"
            placeholder="Digite o nome"
          />
        </div>

        {/* Ações */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl bg-secondary"
          >
            Cancelar
          </button>
          <button
            onClick={save}
            className="flex-1 py-2 rounded-xl gradient-primary text-primary-foreground font-bold"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}