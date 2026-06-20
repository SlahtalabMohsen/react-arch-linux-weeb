import { useState, useCallback, useRef, useEffect, type ReactNode } from "react";
import styled, { keyframes } from "styled-components";
import { useDesktop } from "../context/DesktopContext";

const slideIn = keyframes`
  from { opacity: 0; transform: scale(0.92) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

const WindowWrapper = styled.div<{ $x: number; $y: number; $w: number; $h: number; $z: number; $focused: boolean; $maximized: boolean }>`
  position: absolute;
  left: ${(p) => (p.$maximized ? 0 : p.$x)}px;
  top: ${(p) => (p.$maximized ? 0 : p.$y)}px;
  width: ${(p) => (p.$maximized ? "100vw" : p.$w + "px")};
  height: ${(p) => (p.$maximized ? "calc(100vh - 48px)" : p.$h + "px")};
  z-index: ${(p) => p.$z};
  display: flex;
  flex-direction: column;
  border-radius: ${(p) => (p.$maximized ? 0 : "10px")};
  overflow: hidden;
  box-shadow: ${(p) =>
    p.$focused
      ? "0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(122,162,247,0.3)"
      : "0 4px 16px rgba(0,0,0,0.3), 0 0 0 1px rgba(86,95,137,0.3)"};
  animation: ${slideIn} 0.2s ease-out;
  transition: box-shadow 0.15s;
`;

const TitleBar = styled.div<{ $focused: boolean }>`
  display: flex;
  align-items: center;
  height: 38px;
  min-height: 38px;
  padding: 0 12px;
  background: ${(p) =>
    p.$focused
      ? "linear-gradient(180deg, rgba(40,44,60,0.98) 0%, rgba(30,34,48,0.98) 100%)"
      : "linear-gradient(180deg, rgba(35,38,52,0.95) 0%, rgba(25,28,40,0.95) 100%)"};
  backdrop-filter: blur(20px);
  cursor: grab;
  user-select: none;
  border-bottom: 1px solid rgba(86,95,137,0.2);
  flex-shrink: 0;

  &:active { cursor: grabbing; }
`;

const WindowIcon = styled.span`
  margin-right: 8px;
  font-size: 14px;
`;

const WindowTitle = styled.span<{ $focused: boolean }>`
  flex: 1;
  font-size: 13px;
  font-weight: 500;
  color: ${(p) => (p.$focused ? "#c0caf5" : "#565f89")};
  font-family: 'JetBrains Mono', monospace;
`;

const ControlGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-left: auto;
`;

const ControlBtn = styled.button<{ $color: string; $hoverColor: string }>`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: none;
  background: ${(p) => p.$color};
  cursor: pointer;
  padding: 0;
  transition: background 0.15s, transform 0.15s;

  &:hover {
    background: ${(p) => p.$hoverColor};
    transform: scale(1.2);
  }
`;

const WindowBody = styled.div`
  flex: 1;
  overflow: hidden;
  background: rgba(26, 27, 38, 0.96);
  backdrop-filter: blur(20px);
`;

type Props = {
  windowId: string;
  title: string;
  icon: string;
  children: ReactNode;
};

export default function Window({ windowId, title, icon, children }: Props) {
  const { state, dispatch } = useDesktop();
  const win = state.windows.find((w) => w.id === windowId);
  const dragRef = useRef<{ startX: number; startY: number; winX: number; winY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; startW: number; startH: number } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 10);
    return () => clearTimeout(t);
  }, []);

  const handleTitleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest(".window-control")) return;
      e.preventDefault();
      dispatch({ type: "FOCUS_WINDOW", id: windowId });
      if (win?.maximized) return;
      dragRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        winX: win?.x ?? 0,
        winY: win?.y ?? 0,
      };
    },
    [dispatch, windowId, win]
  );

  const handleResizeMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dispatch({ type: "FOCUS_WINDOW", id: windowId });
      resizeRef.current = {
        startX: e.clientX,
        startY: e.clientY,
        startW: win?.width ?? 700,
        startH: win?.height ?? 450,
      };
    },
    [dispatch, windowId, win]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragRef.current) {
        const dx = e.clientX - dragRef.current.startX;
        const dy = e.clientY - dragRef.current.startY;
        dispatch({
          type: "UPDATE_WINDOW",
          id: windowId,
          updates: {
            x: Math.max(0, dragRef.current.winX + dx),
            y: Math.max(0, dragRef.current.winY + dy),
          },
        });
      }
      if (resizeRef.current) {
        const dx = e.clientX - resizeRef.current.startX;
        const dy = e.clientY - resizeRef.current.startY;
        const newW = Math.max(win?.minWidth ?? 400, resizeRef.current.startW + dx);
        const newH = Math.max(win?.minHeight ?? 250, resizeRef.current.startH + dy);
        dispatch({
          type: "UPDATE_WINDOW",
          id: windowId,
          updates: { width: newW, height: newH },
        });
      }
    };
    const handleMouseUp = () => {
      dragRef.current = null;
      resizeRef.current = null;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dispatch, windowId, win]);

  if (!win || win.minimized) return null;

  return (
    <WindowWrapper
      ref={wrapperRef}
      $x={win.x}
      $y={win.y}
      $w={win.width}
      $h={win.height}
      $z={win.zIndex}
      $focused={state.windows[state.windows.length - 1]?.id === windowId}
      $maximized={win.maximized}
      onMouseDown={() => dispatch({ type: "FOCUS_WINDOW", id: windowId })}
      style={{ opacity: ready ? 1 : 0, transition: "opacity 0.15s" }}
    >
      <TitleBar
        $focused={state.windows[state.windows.length - 1]?.id === windowId}
        onMouseDown={handleTitleMouseDown}
      >
        <WindowIcon>{icon}</WindowIcon>
        <WindowTitle $focused={state.windows[state.windows.length - 1]?.id === windowId}>
          {title}
        </WindowTitle>
        <ControlGroup>
          <ControlBtn
            className="window-control"
            $color="#ff5f56"
            $hoverColor="#ff3b30"
            onClick={() => dispatch({ type: "MINIMIZE_WINDOW", id: windowId })}
            title="Minimize"
          />
          <ControlBtn
            className="window-control"
            $color="#ffbd2e"
            $hoverColor="#ffb800"
            onClick={() => dispatch({ type: "MAXIMIZE_WINDOW", id: windowId })}
            title="Maximize"
          />
          <ControlBtn
            className="window-control"
            $color="#27c93f"
            $hoverColor="#1db954"
            onClick={() => dispatch({ type: "CLOSE_WINDOW", id: windowId })}
            title="Close"
          />
        </ControlGroup>
      </TitleBar>
      <WindowBody>{children}</WindowBody>
      {!win.maximized && (
        <div
          onMouseDown={handleResizeMouseDown}
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 16,
            height: 16,
            cursor: "nwse-resize",
            zIndex: 10,
          }}
        />
      )}
    </WindowWrapper>
  );
}
