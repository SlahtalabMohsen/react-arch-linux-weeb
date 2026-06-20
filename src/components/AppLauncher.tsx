import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import styled, { keyframes } from "styled-components";
import { useDesktop } from "../context/DesktopContext";
import { APPS } from "../types";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  justify-content: center;
  padding-top: 80px;
`;

const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
`;

const Launcher = styled.div`
  position: relative;
  width: 420px;
  max-height: 70vh;
  background: rgba(26, 27, 38, 0.96);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(86, 95, 137, 0.3);
  border-radius: 12px;
  overflow: hidden;
  animation: ${fadeIn} 0.15s ease-out;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 16px 20px;
  border: none;
  border-bottom: 1px solid rgba(86, 95, 137, 0.2);
  background: transparent;
  color: #c0caf5;
  font-family: 'JetBrains Mono', monospace;
  font-size: 16px;
  outline: none;

  &::placeholder {
    color: #565f89;
  }
`;

const AppList = styled.div`
  max-height: calc(70vh - 56px);
  overflow-y: auto;
  padding: 8px;
`;

const AppItem = styled.button<{ $active: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background: ${(p) => (p.$active ? "rgba(122, 162, 247, 0.15)" : "transparent")};
  color: #c0caf5;
  cursor: pointer;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  text-align: left;
  transition: background 0.1s;

  &:hover {
    background: rgba(122, 162, 247, 0.12);
  }
`;

const AppIcon = styled.span`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(122, 162, 247, 0.1);
  border-radius: 8px;
  font-size: 16px;
  flex-shrink: 0;
`;

const AppInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const AppName = styled.span`
  color: #c0caf5;
`;

const AppDesc = styled.span`
  font-size: 11px;
  color: #565f89;
`;

const Footer = styled.div`
  padding: 8px 16px;
  border-top: 1px solid rgba(86, 95, 137, 0.15);
  font-size: 11px;
  color: #565f89;
  display: flex;
  justify-content: space-between;
`;

const APP_DESCRIPTIONS: Record<string, string> = {
  terminal: "weeb-term v1.0",
  filemanager: "Browse files",
  texteditor: "Edit text files",
  systemmonitor: "System resources",
  settings: "Desktop settings",
  about: "System information",
  browser: "Web browser",
};

export default function AppLauncher() {
  const { openApp, dispatch } = useDesktop();
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() =>
    APPS.filter((a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.id.toLowerCase().includes(query.toLowerCase())
    ),
    [query]
  );

  const clampedIdx = Math.min(activeIdx, Math.max(0, filtered.length - 1));

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const launch = useCallback(
    (appId: string) => {
      openApp(appId);
      dispatch({ type: "HIDE_CONTEXT_MENU" });
    },
    [openApp, dispatch]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      dispatch({ type: "HIDE_CONTEXT_MENU" });
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter" && filtered[clampedIdx]) {
      launch(filtered[clampedIdx].id);
    }
  };

  return (
    <Overlay>
      <Backdrop onClick={() => dispatch({ type: "HIDE_CONTEXT_MENU" })} />
      <Launcher>
        <SearchInput
          ref={inputRef}
          placeholder="Search apps..."
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActiveIdx(0); }}
          onKeyDown={handleKeyDown}
        />
        <AppList>
          {filtered.map((app, i) => (
            <AppItem
              key={app.id}
              $active={i === clampedIdx}
              onClick={() => launch(app.id)}
              onMouseEnter={() => setActiveIdx(i)}
            >
              <AppIcon>{app.icon}</AppIcon>
              <AppInfo>
                <AppName>{app.title}</AppName>
                <AppDesc>{APP_DESCRIPTIONS[app.id] || app.id}</AppDesc>
              </AppInfo>
            </AppItem>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: "20px", textAlign: "center", color: "#565f89" }}>
              No apps found
            </div>
          )}
        </AppList>
        <Footer>
          <span>↑↓ Navigate  ↵ Launch  Esc Close</span>
          <span>Powered by rofi</span>
        </Footer>
      </Launcher>
    </Overlay>
  );
}
