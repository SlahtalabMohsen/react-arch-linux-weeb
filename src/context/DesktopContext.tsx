import { createContext, useContext, useReducer, useCallback, type ReactNode } from "react";
import type { DesktopPhase, WindowState, ContextMenuState, FileNode } from "../types";
import { APPS } from "../types";

type State = {
  phase: DesktopPhase;
  windows: WindowState[];
  nextZIndex: number;
  contextMenu: ContextMenuState;
  wallpaper: string;
  filesystem: FileNode;
  terminalHistory: string[];
};

type Action =
  | { type: "SET_PHASE"; phase: DesktopPhase }
  | { type: "OPEN_APP"; appId: string }
  | { type: "CLOSE_WINDOW"; id: string }
  | { type: "FOCUS_WINDOW"; id: string }
  | { type: "MINIMIZE_WINDOW"; id: string }
  | { type: "MAXIMIZE_WINDOW"; id: string }
  | { type: "UPDATE_WINDOW"; id: string; updates: Partial<WindowState> }
  | { type: "SHOW_CONTEXT_MENU"; x: number; y: number }
  | { type: "HIDE_CONTEXT_MENU" }
  | { type: "SET_WALLPAPER"; wallpaper: string }
  | { type: "WRITE_FILE"; path: string; content: string }
  | { type: "TERMINAL_HISTORY"; cmd: string };

const initialFilesystem: FileNode = {
  name: "/", type: "directory", children: {
    home: { name: "home", type: "directory", children: {
      weeb: { name: "weeb", type: "directory", children: {
        Desktop: { name: "Desktop", type: "directory", children: {} },
        Documents: { name: "Documents", type: "directory", children: {
          "notes.txt": { name: "notes.txt", type: "file", content: "# My Notes\n\nRemember to rice my desktop more...\nAlso need to update my neovim config.", modified: "2024-03-15", size: "128B" },
          "anime-watchlist.txt": { name: "anime-watchlist.txt", type: "file", content: "[ ] Steins;Gate\n[x] Cowboy Bebop\n[x] Evangelion\n[x] Ghost in the Shell\n[ ] Serial Experiments Lain\n[ ] Monogatari Series\n[x] Made in Abyss\n[ ] Mob Psycho 100\n[x] Attack on Titan\n[ ] Jujutsu Kaisen", modified: "2024-03-14", size: "256B" },
          "rice-guide.md": { name: "rice-guide.md", type: "file", content: "# How to Rice Arch Linux\n\n## Steps\n1. Install Hyprland\n2. Configure Waybar\n3. Set up Rofi\n4. Add transparency & blur\n5. Get anime wallpaper\n6. Share on r/unixporn\n\n## Key Packages\n- hyprland\n- waybar\n- rofi-wayland\n- kitty\n- starship\n- neovim\n- dunst\n- swww\n\n## Pro Tips\n- Use `pywal` for auto-theming\n- Keep your dotfiles in git\n- Less is more\n- Anime backgrounds are mandatory", modified: "2024-03-10", size: "512B" },
          "todo.md": { name: "todo.md", type: "file", content: "# TODO\n\n- [ ] Finish Hyprland rice\n- [ ] Configure LSP for neovim\n- [ ] Set up zsh completions\n- [x] Install Arch btw\n- [ ] Write AUR package\n- [ ] Post rice on r/unixporn", modified: "2024-03-12", size: "196B" },
        }},
        Downloads: { name: "Downloads", type: "directory", children: {
          "wallpaper.png": { name: "wallpaper.png", type: "file", size: "4.2MB", modified: "2024-03-12" },
          "anime-opening.mp3": { name: "anime-opening.mp3", type: "file", size: "8.1MB", modified: "2024-03-11" },
          "dotfiles.tar.gz": { name: "dotfiles.tar.gz", type: "file", size: "2.3MB", modified: "2024-03-09" },
        }},
        Music: { name: "Music", type: "directory", children: {} },
        Pictures: { name: "Pictures", type: "directory", children: {
          wallpapers: { name: "wallpapers", type: "directory", children: {
            "sakura.jpg": { name: "sakura.jpg", type: "file", size: "2.1MB" },
            "night-sky.jpg": { name: "night-sky.jpg", type: "file", size: "3.4MB" },
            "neon-city.jpg": { name: "neon-city.jpg", type: "file", size: "5.2MB" },
            "anime-hills.jpg": { name: "anime-hills.jpg", type: "file", size: "4.7MB" },
          }},
          screenshots: { name: "screenshots", type: "directory", children: {
            "rice-2024-03.png": { name: "rice-2024-03.png", type: "file", size: "1.2MB", modified: "2024-03-15" },
          }},
        }},
        Videos: { name: "Videos", type: "directory", children: {} },
        ".config": { name: ".config", type: "directory", children: {
          hypr: { name: "hypr", type: "directory", children: {
            "hyprland.conf": { name: "hyprland.conf", type: "file", content: "monitor = , 1920x1080@60, auto, 1\n\ninput {\n    kb_layout = us\n    follow_mouse = 1\n    sensitivity = 0\n}\n\ngeneral {\n    gaps_in = 5\n    gaps_out = 10\n    border_size = 2\n    col.active_border = rgba(bb9afeee) rgba(7aa2f7ee)\n    col.inactive_border = rgba(565f89aa)\n    layout = dwindle\n}\n\ndecoration {\n    rounding = 10\n    blur {\n        enabled = true\n        size = 6\n        passes = 3\n        new_optimizations = true\n    }\n    shadow {\n        enabled = true\n        range = 4\n        render_power = 3\n    }\n}\n\nanimations {\n    enabled = true\n    bezier = myBezier, 0.05, 0.9, 0.1, 1.05\n    animation = windows, 1, 7, myBezier\n    animation = windowsOut, 1, 7, myBezier, popin 80%\n    animation = fade, 1, 7, myBezier\n    animation = workspaces, 1, 6, myBezier\n}\n\nbind = SUPER, Return, exec, kitty\nbind = SUPER, Q, killactive\nbind = SUPER, M, exit\nbind = SUPER, V, togglefloating\nbind = SUPER, F, fullscreen\nbind = SUPER, H, movefocus, l\nbind = SUPER, L, movefocus, r\nbind = SUPER, K, movefocus, u\nbind = SUPER, J, movefocus, d\n\nworkspace = 1, monitor:, default:true", size: "1.1KB" },
          }},
          rofi: { name: "rofi", type: "directory", children: {
            "config.rasi": { name: "config.rasi", type: "file", content: "configuration {\n    show-icons: true;\n    icon-theme: \"Papirus-Dark\";\n    font: \"JetBrains Mono 12\";\n}\n\n* {\n    bg: #1a1b26ee;\n    fg: #c0caf5;\n    accent: #7aa2f7;\n    urgent: #f7768e;\n    selected: #bb9afe;\n    background-color: @bg;\n    text-color: @fg;\n}", size: "256B" },
          }},
          neovim: { name: "neovim", type: "directory", children: {
            "init.lua": { name: "init.lua", type: "file", content: "-- Neovim Configuration\nvim.opt.number = true\nvim.opt.relativenumber = true\nvim.opt.tabstop = 2\nvim.opt.shiftwidth = 2\nvim.opt.expandtab = true\nvim.opt.termguicolors = true\nvim.g.mapleader = \" \"\n\n-- Bootstrap lazy.nvim\nlocal lazypath = vim.fn.stdpath(\"data\") .. \"/lazy/lazy.nvim\"\nif not vim.loop.fs_stat(lazypath) then\n  vim.fn.system({\n    \"git\", \"clone\", \"--filter=blob:none\",\n    \"https://github.com/folke/lazy.nvim.git\",\n    lazypath,\n  })\nend\nvim.opt.rtp:prepend(lazypath)\n\nrequire(\"lazy\").setup({\n  \"folke/tokyonight.nvim\",\n  \"nvim-lualine/lualine.nvim\",\n  \"nvim-tree/nvim-tree.lua\",\n  \"nvim-treesitter/nvim-treesitter\",\n  \"neovim/nvim-lspconfig\",\n  \"hrsh7th/nvim-cmp\",\n})\n\nvim.cmd(\"colorscheme tokyonight-night\")", size: "768B" },
          }},
        }},
        ".bashrc": { name: ".bashrc", type: "file", content: "# ~/.bashrc\n\n# Aliases\nalias ll=\"ls -la\"\nalias gs=\"git status\"\nalias gp=\"git push\"\nalias update=\"sudo pacman -Syu\"\nalias install=\"sudo pacman -S\"\nalias remove=\"sudo pacman -R\"\nalias yay=\"yay\"\n\n# Prompt\nPS1=\"\\[\\e[35m\\]\\u@arch\\[\\e[0m\\]:\\[\\e[34m\\]\\w\\[\\e[0m\\]\\$ \"\n\n# Enable colors\nalias ls=\"ls --color=auto\"\nalias grep=\"grep --color=auto\"\nalias diff=\"diff --color=auto\"", size: "448B" },
        ".zshrc": { name: ".zshrc", type: "file", content: "# ~/.zshrc\n\n# Oh My Zsh\nZSH_THEME=\"agnoster\"\n\nplugins=(git archlinux sudo docker)\n\nsource $ZSH/oh-my-zsh.sh\n\n# Aliases\nalias ll=\"ls -la\"\nalias update=\"sudo pacman -Syu\"\nalias neofetch=\"neofetch --ascii_colors 6 7 8 1\"\n\n# Key bindings\nbindkey '^R' history-incremental-search-backward\nbindkey '^P' history-search-backward\nbindkey '^N' history-search-forward", size: "256B" },
        ".gitconfig": { name: ".gitconfig", type: "file", content: "[user]\n    name = weeb\n    email = weeb@archlinux\n[core]\n    editor = nvim\n    autocrlf = input\n[pull]\n    rebase = true\n[alias]\n    s = status\n    c = commit\n    p = push\n    l = log --oneline --graph", size: "192B" },
        "README.md": { name: "README.md", type: "file", content: "# Welcome to Arch Linux!\n\n> I use Arch btw\n\n## Getting Started\n\n```bash\n# Update your system\nsudo pacman -Syu\n\n# Install essentials\nsudo pacman -S neovim zsh git\n\n# Install yay (AUR helper)\nsudo pacman -S --needed git base-devel\ngit clone https://aur.archlinux.org/yay-bin.git\ncd yay-bin && makepkg -si\n```\n\n## Useful Resources\n\n- [Arch Wiki](https://wiki.archlinux.org)\n- [AUR](https://aur.archlinux.org)\n- [r/unixporn](https://reddit.com/r/unixporn)\n- [Hyprland Wiki](https://wiki.hyprland.org)\n\n## Remember\n\n- Arch is best\n- BTW\n- Anime is life\n- Rice everything", size: "512B" },
      }},
    }},
    etc: { name: "etc", type: "directory", children: {
      "hostname": { name: "hostname", type: "file", content: "archlinux", size: "10B" },
      "os-release": { name: "os-release", type: "file", content: "NAME=\"Arch Linux\"\nPRETTY_NAME=\"Arch Linux\"\nID=arch\nBUILD_ID=rolling\nANSI_COLOR=\"0;36\"\nHOME_URL=\"https://archlinux.org\"\nDOCUMENTATION_URL=\"https://wiki.archlinux.org\"\nSUPPORT_URL=\"https://bbs.archlinux.org\"\nBUG_REPORT_URL=\"https://bugs.archlinux.org/\"", size: "256B" },
    }},
    var: { name: "var", type: "directory", children: {} },
    tmp: { name: "tmp", type: "directory", children: {} },
    usr: { name: "usr", type: "directory", children: {} },
  },
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PHASE":
      return { ...state, phase: action.phase };
    case "OPEN_APP": {
      const app = APPS.find((a) => a.id === action.appId);
      if (!app) return state;
      const existing = state.windows.find((w) => w.appId === action.appId && !w.minimized);
      if (existing) {
        return {
          ...state,
          windows: state.windows.map((w) =>
            w.id === existing.id
              ? { ...w, minimized: false, zIndex: state.nextZIndex }
              : w
          ),
          nextZIndex: state.nextZIndex + 1,
        };
      }
      const minimized = state.windows.find((w) => w.appId === action.appId && w.minimized);
      if (minimized) {
        return {
          ...state,
          windows: state.windows.map((w) =>
            w.id === minimized.id
              ? { ...w, minimized: false, zIndex: state.nextZIndex }
              : w
          ),
          nextZIndex: state.nextZIndex + 1,
        };
      }
      const offsetX = (state.windows.length % 5) * 30;
      const offsetY = (state.windows.length % 5) * 30;
      const newWindow: WindowState = {
        id: crypto.randomUUID(),
        appId: app.id,
        title: app.title,
        icon: app.icon,
        x: 120 + offsetX,
        y: 60 + offsetY,
        width: app.defaultWidth,
        height: app.defaultHeight,
        minWidth: app.minWidth,
        minHeight: app.minHeight,
        zIndex: state.nextZIndex,
        minimized: false,
        maximized: false,
      };
      return {
        ...state,
        windows: [...state.windows, newWindow],
        nextZIndex: state.nextZIndex + 1,
      };
    }
    case "CLOSE_WINDOW":
      return {
        ...state,
        windows: state.windows.filter((w) => w.id !== action.id),
      };
    case "FOCUS_WINDOW":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id
            ? { ...w, zIndex: state.nextZIndex, minimized: false }
            : w
        ),
        nextZIndex: state.nextZIndex + 1,
      };
    case "MINIMIZE_WINDOW":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, minimized: true } : w
        ),
      };
    case "MAXIMIZE_WINDOW":
      return {
        ...state,
        windows: state.windows.map((w) => {
          if (w.id !== action.id) return w;
          if (w.maximized) {
            return {
              ...w,
              maximized: false,
              x: w.prevBounds?.x ?? 120,
              y: w.prevBounds?.y ?? 60,
              width: w.prevBounds?.width ?? 700,
              height: w.prevBounds?.height ?? 450,
              prevBounds: undefined,
            };
          }
          return {
            ...w,
            maximized: true,
            prevBounds: { x: w.x, y: w.y, width: w.width, height: w.height },
            x: 0,
            y: 0,
            width: window.innerWidth,
            height: window.innerHeight - 48,
          };
        }),
      };
    case "UPDATE_WINDOW":
      return {
        ...state,
        windows: state.windows.map((w) =>
          w.id === action.id ? { ...w, ...action.updates } : w
        ),
      };
    case "SHOW_CONTEXT_MENU":
      return {
        ...state,
        contextMenu: { visible: true, x: action.x, y: action.y },
      };
    case "HIDE_CONTEXT_MENU":
      return { ...state, contextMenu: { visible: false, x: 0, y: 0 } };
    case "SET_WALLPAPER":
      return { ...state, wallpaper: action.wallpaper };
    case "TERMINAL_HISTORY":
      return { ...state, terminalHistory: [...state.terminalHistory, action.cmd] };
    case "WRITE_FILE": {
      const parts = action.path.split("/").filter(Boolean);
      const newFs = JSON.parse(JSON.stringify(state.filesystem));
      let node = newFs;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!node.children?.[parts[i]]) return state;
        node = node.children[parts[i]];
      }
      const fileName = parts[parts.length - 1];
      if (node.children?.[fileName]) {
        node.children[fileName].content = action.content;
      }
      return { ...state, filesystem: newFs };
    }
    default:
      return state;
  }
};

const initialState: State = {
  phase: "boot",
  windows: [],
  nextZIndex: 100,
  contextMenu: { visible: false, x: 0, y: 0 },
  wallpaper: "linear-gradient(135deg, #1a1b26 0%, #24283b 30%, #1f2335 60%, #1a1b26 100%)",
  filesystem: initialFilesystem,
  terminalHistory: [],
};

type DesktopContextType = {
  state: State;
  dispatch: React.Dispatch<Action>;
  openApp: (appId: string) => void;
  getWindow: (appId: string) => WindowState | undefined;
};

const DesktopContext = createContext<DesktopContextType | undefined>(undefined);

export const DesktopProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const openApp = useCallback((appId: string) => {
    dispatch({ type: "OPEN_APP", appId });
  }, [dispatch]);

  const getWindow = useCallback(
    (appId: string) => state.windows.find((w) => w.appId === appId),
    [state.windows]
  );

  return (
    <DesktopContext.Provider value={{ state, dispatch, openApp, getWindow }}>
      {children}
    </DesktopContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useDesktop = () => {
  const ctx = useContext(DesktopContext);
  if (!ctx) throw new Error("useDesktop must be used within DesktopProvider");
  return ctx;
};
