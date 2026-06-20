import { useState, useEffect } from "react";
import styled from "styled-components";
import { useDesktop } from "../context/DesktopContext";

const PanelWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 38px;
  background: rgba(22, 24, 36, 0.92);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(86, 95, 137, 0.2);
  display: flex;
  align-items: center;
  padding: 0 12px;
  z-index: 9999;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  color: #c0caf5;
`;

const ArchBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border: none;
  border-radius: 6px;
  background: rgba(122, 162, 247, 0.15);
  color: #7aa2f7;
  cursor: pointer;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 600;
  transition: all 0.15s;

  &:hover {
    background: rgba(122, 162, 247, 0.25);
    color: #89b4fa;
  }
`;

const WorkspaceGroup = styled.div`
  display: flex;
  gap: 4px;
  margin-left: 16px;
`;

const Workspace = styled.button<{ $active: boolean }>`
  width: 28px;
  height: 24px;
  border: none;
  border-radius: 4px;
  background: ${(p) => (p.$active ? "rgba(122, 162, 247, 0.3)" : "rgba(86, 95, 137, 0.15)")};
  color: ${(p) => (p.$active ? "#7aa2f7" : "#565f89")};
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(122, 162, 247, 0.2);
  }
`;

const Spacer = styled.div`
  flex: 1;
`;

const TaskbarWindows = styled.div`
  display: flex;
  gap: 4px;
  margin: 0 12px;
  flex: 1;
  overflow-x: auto;
  min-width: 0;
`;

const TaskbarBtn = styled.button<{ $active: boolean }>`
  padding: 3px 10px;
  border: none;
  border-radius: 4px;
  background: ${(p) => (p.$active ? "rgba(187, 154, 247, 0.25)" : "rgba(86, 95, 137, 0.15)")};
  color: ${(p) => (p.$active ? "#bb9af7" : "#a9b1d6")};
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;

  &:hover {
    background: rgba(187, 154, 247, 0.2);
  }
`;

const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
`;

const TrayIcon = styled.span`
  font-size: 14px;
  opacity: 0.7;
  cursor: default;
`;

const Clock = styled.span`
  color: #a9b1d6;
  font-variant-numeric: tabular-nums;
  min-width: 140px;
  text-align: right;
`;

export default function Panel() {
  const { state, dispatch, openApp } = useDesktop();
  const [time, setTime] = useState(new Date());
  const [activeWorkspace, setActiveWorkspace] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (d: Date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${days[d.getDay()]} ${months[d.getMonth()]} ${d.getDate()}  ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;
  };

  const handleTaskbarClick = (winId: string) => {
    const win = state.windows.find((w) => w.id === winId);
    if (!win) return;
    if (win.minimized) {
      dispatch({ type: "FOCUS_WINDOW", id: winId });
    } else if (state.windows[state.windows.length - 1]?.id === winId) {
      dispatch({ type: "MINIMIZE_WINDOW", id: winId });
    } else {
      dispatch({ type: "FOCUS_WINDOW", id: winId });
    }
  };

  return (
    <PanelWrapper>
      <ArchBtn onClick={() => openApp("about")}>
        <span style={{ fontSize: "16px" }}>▲</span>
        <span>Arch</span>
      </ArchBtn>

      <WorkspaceGroup>
        {[1, 2, 3, 4].map((ws) => (
          <Workspace
            key={ws}
            $active={activeWorkspace === ws}
            onClick={() => setActiveWorkspace(ws)}
          >
            {ws}
          </Workspace>
        ))}
      </WorkspaceGroup>

      <TaskbarWindows>
        {state.windows.map((w) => (
          <TaskbarBtn
            key={w.id}
            $active={state.windows[state.windows.length - 1]?.id === w.id && !w.minimized}
            onClick={() => handleTaskbarClick(w.id)}
          >
            {w.icon} {w.title}
          </TaskbarBtn>
        ))}
      </TaskbarWindows>

      <Spacer />

      <RightGroup>
        <TrayIcon title="WiFi">📶</TrayIcon>
        <TrayIcon title="Volume">🔊</TrayIcon>
        <TrayIcon title="Battery">🔋</TrayIcon>
        <Clock>{formatTime(time)}</Clock>
      </RightGroup>
    </PanelWrapper>
  );
}
