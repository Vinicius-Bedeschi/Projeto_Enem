import React from "react";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface Props {
  achievement: Achievement | null;
  onClose: () => void;
}

export default function AchievementPopup({ achievement, onClose }: Props) {
  if (!achievement) return null;

  return (
    <div style={overlayStyle}>
      <div style={cardStyle}>
        <div style={{ fontSize: "48px" }}>{achievement.icon}</div>
        <h2>🎉 Conquista desbloqueada!</h2>
        <h3>{achievement.name}</h3>
        <p>{achievement.description}</p>
        <button onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 999,
};

const cardStyle: React.CSSProperties = {
  background: "#111827",
  padding: "24px",
  borderRadius: "16px",
  textAlign: "center",
  color: "white",
  width: "300px",
  animation: "pop 0.3s ease-out",
};