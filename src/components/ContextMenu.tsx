import styled, { keyframes } from "styled-components";
import { useDesktop } from "../context/DesktopContext";

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
`;

const Menu = styled.div<{ $x: number; $y: number }>`
  position: fixed;
  left: ${(p) => p.$x}px;
  top: ${(p) => p.$y}px;
  z-index: 99999;
  min-width: 200px;
  background: rgba(26, 27, 38, 0.96);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(86, 95, 137, 0.3);
  border-radius: 8px;
  padding: 6px;
  animation: ${fadeIn} 0.1s ease-out;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`;

const MenuItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: #c0caf5;
  cursor: pointer;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  text-align: left;
  transition: background 0.1s;

  &:hover {
    background: rgba(122, 162, 247, 0.12);
  }
`;

const Separator = styled.div`
  height: 1px;
  background: rgba(86, 95, 137, 0.2);
  margin: 4px 8px;
`;

const MenuIcon = styled.span`
  width: 20px;
  text-align: center;
  flex-shrink: 0;
`;

const wallpapers = [
  { name: "Tokyo Night", gradient: "linear-gradient(135deg, #1a1b26 0%, #24283b 30%, #1f2335 60%, #1a1b26 100%)" },
  { name: "Dracula", gradient: "linear-gradient(135deg, #282a36 0%, #44475a 30%, #282a36 100%)" },
  { name: "Nord", gradient: "linear-gradient(135deg, #2e3440 0%, #3b4252 30%, #2e3440 100%)" },
  { name: "Gruvbox", gradient: "linear-gradient(135deg, #282828 0%, #3c3836 30%, #282828 100%)" },
  { name: "Catppuccin", gradient: "linear-gradient(135deg, #1e1e2e 0%, #313244 30%, #1e1e2e 100%)" },
  { name: "Sakura", gradient: "linear-gradient(135deg, #2b1b2e 0%, #4a2040 30%, #2b1b2e 100%)" },
  { name: "Ocean", gradient: "linear-gradient(135deg, #0d1b2a 0%, #1b263b 30%, #0d1b2a 100%)" },
  { name: "Cyberpunk", gradient: "linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 30%, #0f0a1a 60%, #0a0a0f 100%)" },
];

export default function ContextMenu() {
  const { state, dispatch, openApp } = useDesktop();
  const { contextMenu } = state;

  if (!contextMenu.visible) return null;

  const handleAction = (action: string) => {
    switch (action) {
      case "terminal":
        openApp("terminal");
        break;
      case "filemanager":
        openApp("filemanager");
        break;
      case "settings":
        openApp("settings");
        break;
      case "about":
        openApp("about");
        break;
    }
    dispatch({ type: "HIDE_CONTEXT_MENU" });
  };

  return (
    <>
      <div
        style={{ position: "fixed", inset: 0, zIndex: 99998 }}
        onClick={() => dispatch({ type: "HIDE_CONTEXT_MENU" })}
      />
      <Menu $x={contextMenu.x} $y={contextMenu.y}>
        <MenuItem onClick={() => handleAction("terminal")}>
          <MenuIcon>{">_"}</MenuIcon> Open Terminal
        </MenuItem>
        <MenuItem onClick={() => handleAction("filemanager")}>
          <MenuIcon>📁</MenuIcon> File Manager
        </MenuItem>
        <MenuItem onClick={() => handleAction("settings")}>
          <MenuIcon>⚙️</MenuIcon> Settings
        </MenuItem>
        <Separator />
        <MenuItem onClick={() => handleAction("about")}>
          <MenuIcon>ℹ️</MenuIcon> About
        </MenuItem>
        <Separator />
        {wallpapers.map((wp) => (
          <MenuItem
            key={wp.name}
            onClick={() => {
              dispatch({ type: "SET_WALLPAPER", wallpaper: wp.gradient });
              dispatch({ type: "HIDE_CONTEXT_MENU" });
            }}
          >
            <MenuIcon>🎨</MenuIcon> {wp.name}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
