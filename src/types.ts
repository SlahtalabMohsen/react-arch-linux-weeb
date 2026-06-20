export type DesktopPhase = "boot" | "lock" | "desktop";

export type WindowState = {
  id: string;
  appId: string;
  title: string;
  icon: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  zIndex: number;
  minimized: boolean;
  maximized: boolean;
  prevBounds?: { x: number; y: number; width: number; height: number };
};

export type ContextMenuState = {
  visible: boolean;
  x: number;
  y: number;
};

export type FileNode = {
  name: string;
  type: "file" | "directory";
  content?: string;
  children?: Record<string, FileNode>;
  modified?: string;
  size?: string;
};

export type AppDefinition = {
  id: string;
  title: string;
  icon: string;
  defaultWidth: number;
  defaultHeight: number;
  minWidth: number;
  minHeight: number;
};

export const APPS: AppDefinition[] = [
  { id: "terminal", title: "Terminal", icon: ">_", defaultWidth: 700, defaultHeight: 450, minWidth: 400, minHeight: 250 },
  { id: "filemanager", title: "Files", icon: "📁", defaultWidth: 750, defaultHeight: 500, minWidth: 450, minHeight: 300 },
  { id: "texteditor", title: "Nano", icon: "📝", defaultWidth: 650, defaultHeight: 450, minWidth: 350, minHeight: 250 },
  { id: "systemmonitor", title: "htop", icon: "📊", defaultWidth: 650, defaultHeight: 480, minWidth: 450, minHeight: 300 },
  { id: "settings", title: "Settings", icon: "⚙️", defaultWidth: 550, defaultHeight: 450, minWidth: 400, minHeight: 350 },
  { id: "about", title: "About", icon: "ℹ️", defaultWidth: 520, defaultHeight: 420, minWidth: 400, minHeight: 350 },
  { id: "browser", title: "Firefox", icon: "🦊", defaultWidth: 850, defaultHeight: 600, minWidth: 500, minHeight: 400 },
];
