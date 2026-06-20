import styled from "styled-components";
import { useDesktop } from "../context/DesktopContext";
import Panel from "./Panel";
import Window from "./Window";
import ContextMenu from "./ContextMenu";
import AppLauncher from "./AppLauncher";
import TerminalApp from "./apps/Terminal";
import FileManagerApp from "./apps/FileManager";
import TextEditorApp from "./apps/TextEditor";
import SystemMonitorApp from "./apps/SystemMonitor";
import SettingsApp from "./apps/Settings";
import AboutApp from "./apps/About";
import BrowserApp from "./apps/Browser";

const DesktopWrapper = styled.div<{ $wallpaper: string }>`
  position: fixed;
  inset: 0;
  background: ${(p) => p.$wallpaper};
  overflow: hidden;
`;

const DesktopArea = styled.div`
  position: absolute;
  top: 38px;
  left: 0;
  right: 0;
  bottom: 0;
`;

const DesktopIcons = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DesktopIcon = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  transition: background 0.15s;
  width: 80px;

  &:hover {
    background: rgba(122, 162, 247, 0.1);
  }
`;

const DesktopIconImg = styled.span`
  font-size: 36px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
`;

const DesktopIconLabel = styled.span`
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px;
  color: #c0caf5;
  text-shadow: 0 1px 3px rgba(0,0,0,0.8);
`;

const APP_COMPONENTS: Record<string, React.ComponentType> = {
  terminal: TerminalApp,
  filemanager: FileManagerApp,
  texteditor: TextEditorApp,
  systemmonitor: SystemMonitorApp,
  settings: SettingsApp,
  about: AboutApp,
  browser: BrowserApp,
};

export default function Desktop() {
  const { state, dispatch, openApp } = useDesktop();

  const handleDesktopRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch({ type: "SHOW_CONTEXT_MENU", x: e.clientX, y: e.clientY });
  };

  const handleDesktopClick = () => {
    dispatch({ type: "HIDE_CONTEXT_MENU" });
  };

  return (
    <DesktopWrapper
      $wallpaper={state.wallpaper}
      onContextMenu={handleDesktopRightClick}
      onClick={handleDesktopClick}
    >
      <Panel />
      <DesktopArea>
        <DesktopIcons>
          <DesktopIcon onClick={() => openApp("terminal")}>
            <DesktopIconImg>🖥️</DesktopIconImg>
            <DesktopIconLabel>Terminal</DesktopIconLabel>
          </DesktopIcon>
          <DesktopIcon onClick={() => openApp("filemanager")}>
            <DesktopIconImg>📁</DesktopIconImg>
            <DesktopIconLabel>Files</DesktopIconLabel>
          </DesktopIcon>
          <DesktopIcon onClick={() => openApp("browser")}>
            <DesktopIconImg>🦊</DesktopIconImg>
            <DesktopIconLabel>Firefox</DesktopIconLabel>
          </DesktopIcon>
          <DesktopIcon onClick={() => openApp("about")}>
            <DesktopIconImg>▲</DesktopIconImg>
            <DesktopIconLabel>Arch</DesktopIconLabel>
          </DesktopIcon>
        </DesktopIcons>

        {state.windows.map((win) => {
          const AppComponent = APP_COMPONENTS[win.appId];
          if (!AppComponent) return null;
          return (
            <Window
              key={win.id}
              windowId={win.id}
              title={win.title}
              icon={win.icon}
            >
              <AppComponent />
            </Window>
          );
        })}
      </DesktopArea>
      <ContextMenu />
      {state.contextMenu.visible && state.contextMenu.x === 0 && state.contextMenu.y === 0 && (
        <AppLauncher />
      )}
    </DesktopWrapper>
  );
}
