import { useState, useCallback } from "react";
import type { FileNode } from "../types";

export type TerminalLine = {
  id: number;
  type: "input" | "output" | "error" | "system";
  text: string;
};

const NEOFETCH = [
  { type: "output" as const, text: "        /\\          " },
  { type: "output" as const, text: "       /  \\         weeb@archlinux" },
  { type: "output" as const, text: "      / .. \\        ----------------" },
  { type: "output" as const, text: "     / /\\  \\ \\      OS: Arch Linux x86_64" },
  { type: "output" as const, text: "    / /  \\  \\ \\     Host: ThinkPad X1 Carbon" },
  { type: "output" as const, text: "   / /    \\  \\ \\    Kernel: 6.9.1-arch1-1" },
  { type: "output" as const, text: "  / /  /\\  \\  \\ \\   Uptime: 42 days, 3 hrs" },
  { type: "output" as const, text: " / /  /  \\  \\  \\ \\  Packages: 1337 (pacman)" },
  { type: "output" as const, text: "/_/__/    \\__\\_\\_\\  Shell: zsh 5.9" },
  { type: "output" as const, text: "                    Resolution: 1920x1080" },
  { type: "output" as const, text: "                    DE: Hyprland" },
  { type: "output" as const, text: "                    WM: Hyprland" },
  { type: "output" as const, text: "                    Theme: Tokyo Night" },
  { type: "output" as const, text: "                    Icons: Papirus-Dark" },
  { type: "output" as const, text: "                    Terminal: weeb-term" },
  { type: "output" as const, text: "                    CPU: AMD Ryzen 9 5900X" },
  { type: "output" as const, text: "                    GPU: NVIDIA RTX 3080" },
  { type: "output" as const, text: "                    Memory: 8192MiB / 16384MiB" },
];

const FORTUNES = [
  "A wise person once said: I use Arch btw.",
  "The best time to install Arch was yesterday. The second best time is now.",
  "sudo make me a sandwich.",
  "There are 10 types of people: those who understand binary and those who don't.",
  "In the beginning, there was nothing. Then someone typed `sudo rm -rf /`.",
  "A true weeb uses Arch with an anime wallpaper.",
  "rm -rf /your/doubts && embrace/arch",
  "cat /etc/motd: Welcome to Arch Linux. You are now elite.",
  "The package manager is strong with this one.",
  "To rice or not to rice. That is not a question.",
];

const COWSAY = (text: string) => {
  const maxLen = Math.min(text.length, 40);
  const top = " " + "_".repeat(maxLen + 2);
  const bottom = " " + "-".repeat(maxLen + 2);
  const lines: string[] = [top];
  if (text.length <= maxLen) {
    lines.push("< " + text + " >");
  } else {
    for (let i = 0; i < text.length; i += maxLen) {
      const chunk = text.slice(i, i + maxLen);
      if (i === 0) lines.push("< " + chunk);
      else if (i + maxLen >= text.length) lines.push("  " + chunk + " >");
      else lines.push("  " + chunk);
    }
  }
  lines.push(bottom);
  lines.push("        \\   ^__^");
  lines.push("         \\  (oo)\\_______");
  lines.push("            (__)\\       )\\/\\");
  lines.push("                ||----w |");
  lines.push("                ||     ||");
  return lines;
};

function resolvePath(cwd: string[], pathArg: string): string[] {
  if (pathArg.startsWith("/")) {
    return pathArg.split("/").filter(Boolean);
  }
  const parts = [...cwd];
  const segments = pathArg.split("/").filter(Boolean);
  for (const seg of segments) {
    if (seg === "..") parts.pop();
    else if (seg !== ".") parts.push(seg);
  }
  return parts;
}

function getNode(fs: FileNode, pathParts: string[]): FileNode | undefined {
  let node = fs;
  for (const part of pathParts) {
    if (node.type !== "directory" || !node.children?.[part]) return undefined;
    node = node.children[part];
  }
  return node;
}

export function useTerminal(filesystem: FileNode) {
  const [lines, setLines] = useState<TerminalLine[]>([
    { id: 0, type: "system", text: "Welcome to weeb-term v1.0.0" },
    { id: 1, type: "system", text: 'Type "help" for a list of commands.\n' },
  ]);
  const [cwd, setCwd] = useState<string[]>(["home", "weeb"]);
  const [, setLineId] = useState(2);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const addLine = useCallback((type: TerminalLine["type"], text: string) => {
    setLineId((prev) => {
      setLines((l) => [...l, { id: prev, type, text }]);
      return prev + 1;
    });
  }, []);

  const executeCommand = useCallback(
    (input: string) => {
      const trimmed = input.trim();
      if (!trimmed) return;

      setHistory((h) => [...h, trimmed]);
      setHistoryIdx(-1);
      addLine("input", trimmed);

      const parts = trimmed.split(/\s+/);
      const cmd = parts[0];
      const args = parts.slice(1);

      switch (cmd) {
        case "help": {
          const helpText = [
            "Available commands:",
            "  ls [path]          List directory contents",
            "  cd <path>          Change directory",
            "  pwd                Print working directory",
            "  cat <file>         Display file contents",
            "  echo <text>        Print text",
            "  clear              Clear terminal",
            "  mkdir <name>       Create directory",
            "  touch <name>       Create empty file",
            "  tree [path]        Display directory tree",
            "  neofetch           Display system information",
            "  whoami             Print current user",
            "  hostname           Print hostname",
            "  uname [-a]         Print system information",
            "  date               Print current date",
            "  uptime             Print system uptime",
            "  cowsay <text>      Cow says your text",
            "  fortune            Random fortune",
            "  history            Show command history",
            "  pacman -S <pkg>    Install package (simulated)",
            "  pacman -Ss <query> Search packages (simulated)",
            "  pacman -Q          List installed packages",
            "  yay -S <pkg>       Install from AUR (simulated)",
            "  htop               Open system monitor",
            "  nano <file>        Open text editor",
            "  ranger             Open file manager",
          ];
          helpText.forEach((l) => addLine("output", l));
          break;
        }
        case "ls": {
          const target = args[0] ? resolvePath(cwd, args[0]) : cwd;
          const node = getNode(filesystem, target);
          if (!node || node.type !== "directory") {
            addLine("error", `ls: cannot access '${args[0] || "."}': No such file or directory`);
            break;
          }
          const entries = Object.values(node.children || {});
          if (entries.length === 0) break;
          const colored = entries.map((e) => {
            if (e.type === "directory") return `\x1b[34m${e.name}/\x1b[0m`;
            if (e.name.endsWith(".conf") || e.name.endsWith(".lua") || e.name.endsWith(".sh") || e.name.endsWith(".zsh") || e.name.endsWith(".rasi"))
              return `\x1b[32m${e.name}\x1b[0m`;
            return e.name;
          });
          addLine("output", colored.join("  "));
          break;
        }
        case "cd": {
          if (!args[0] || args[0] === "~") {
            setCwd(["home", "weeb"]);
            break;
          }
          const target = resolvePath(cwd, args[0]);
          const node = getNode(filesystem, target);
          if (!node || node.type !== "directory") {
            addLine("error", `cd: no such file or directory: ${args[0]}`);
            break;
          }
          setCwd(target);
          break;
        }
        case "pwd":
          addLine("output", "/" + cwd.join("/"));
          break;
        case "cat": {
          if (!args[0]) {
            addLine("error", "cat: missing file operand");
            break;
          }
          const target = resolvePath(cwd, args[0]);
          const node = getNode(filesystem, target);
          if (!node) {
            addLine("error", `cat: ${args[0]}: No such file or directory`);
            break;
          }
          if (node.type === "directory") {
            addLine("error", `cat: ${args[0]}: Is a directory`);
            break;
          }
          addLine("output", node.content || "(empty file)");
          break;
        }
        case "echo":
          addLine("output", args.join(" ").replace(/^["']|["']$/g, ""));
          break;
        case "clear":
          setLines([]);
          setLineId(0);
          break;
        case "mkdir": {
          if (!args[0]) {
            addLine("error", "mkdir: missing operand");
            break;
          }
          addLine("output", `Directory '${args[0]}' created`);
          break;
        }
        case "touch": {
          if (!args[0]) {
            addLine("error", "touch: missing file operand");
            break;
          }
          addLine("output", `File '${args[0]}' created`);
          break;
        }
        case "tree": {
          const target = args[0] ? resolvePath(cwd, args[0]) : cwd;
          const node = getNode(filesystem, target);
          if (!node || node.type !== "directory") {
            addLine("error", `tree: '${args[0] || "."}': Not a directory`);
            break;
          }
          const treeLines: string[] = [node.name + "/"];
          const buildTree = (n: FileNode, prefix: string) => {
            const entries = Object.values(n.children || {});
            entries.forEach((entry, i) => {
              const isLast = i === entries.length - 1;
              const connector = isLast ? "└── " : "├── ";
              treeLines.push(prefix + connector + entry.name);
              if (entry.type === "directory" && entry.children) {
                buildTree(entry, prefix + (isLast ? "    " : "│   "));
              }
            });
          };
          buildTree(node, "");
          treeLines.forEach((l) => addLine("output", l));
          break;
        }
        case "neofetch":
          NEOFETCH.forEach((l) => addLine(l.type, l.text));
          break;
        case "whoami":
          addLine("output", "weeb");
          break;
        case "hostname":
          addLine("output", "archlinux");
          break;
        case "uname":
          if (args.includes("-a")) {
            addLine("output", "Linux archlinux 6.9.1-arch1-1 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux");
          } else {
            addLine("output", "Linux");
          }
          break;
        case "date":
          addLine("output", new Date().toString());
          break;
        case "uptime":
          addLine("output", " " + new Date().toTimeString().slice(0, 5) + " up 42 days,  3:37,  1 user,  load average: 0.42, 0.31, 0.28");
          break;
        case "cowsay":
          COWSAY(args.join(" ") || "I use Arch btw").forEach((l) => addLine("output", l));
          break;
        case "fortune":
          addLine("output", FORTUNES[Math.floor(Math.random() * FORTUNES.length)]);
          break;
        case "history":
          history.forEach((h, i) => addLine("output", `  ${i + 1}  ${h}`));
          break;
        case "pacman":
          if (args[0] === "-S" && args[1]) {
            addLine("output", `resolving dependencies...`);
            addLine("output", `looking for conflicting packages...`);
            addLine("output", `:: ${args[1]} and ${args[1]}-dev are in conflict. Remove ${args[1]}-dev? [y/N] y`);
            addLine("output", `:: There are 2 providers available for ${args[1]}-backend:`);
            addLine("output", `:: Repository core:`);
            addLine("output", `   1) ${args[1]}  2) ${args[1]}-git`);
            addLine("output", "");
            addLine("output", `:: Starting full system upgrade...`);
            addLine("output", `:: ${args[1]} is up to date -- skipping`);
            addLine("output", ` there is nothing to do`);
          } else if (args[0] === "-Ss" && args[1]) {
            addLine("output", `community/${args[1]} 1.0.0-1`);
            addLine("output", "    A weeb package for Arch Linux");
            addLine("output", `community/${args[1]}-git 1.0.0.r1.g1234abc-1`);
            addLine("output", "    Git version of " + args[1]);
          } else if (args[0] === "-Q") {
            addLine("output", "base 1-2");
            addLine("output", "linux 6.9.1.arch1-1");
            addLine("output", "neovim 0.10.0-1");
            addLine("output", "hyprland 0.40.0-1");
            addLine("output", "kitty 0.34.0-1");
            addLine("output", "zsh 5.9-2");
            addLine("output", "git 2.45.1-1");
            addLine("output", "starship 1.18.2-1");
          } else {
            addLine("output", "usage: pacman <operation> [...]");
            addLine("output", "operations:");
            addLine("output", "  -S <pkg>   Install package");
            addLine("output", "  -Ss <query> Search packages");
            addLine("output", "  -Q         List installed packages");
          }
          break;
        case "yay":
          if (args[0] === "-S" && args[1]) {
            addLine("output", `:: Searching AUR for ${args[1]}...`);
            addLine("output", `:: 1 package found.`);
            addLine("output", `:: ${args[1]}-bin 1.0.0-1 (123 votes)`);
            addLine("output", "    A weeb AUR package");
            addLine("output", "");
            addLine("output", ":: Proceed with installation? [Y/n] Y");
            addLine("output", `:: Downloading ${args[1]}-bin...`);
            addLine("output", ":: Building " + args[1] + "-bin...");
            addLine("output", ":: " + args[1] + "-bin-1.0.0-1: parsing pkgctl...");
            addLine("output", ":: " + args[1] + "-bin-1.0.0-1: running package...");
            addLine("output", ":: " + args[1] + "-bin-1.0.0-1: installing...");
          } else {
            addLine("output", "yay is the best AUR helper btw");
          }
          break;
        case "htop":
          addLine("system", "[Opening System Monitor...]");
          break;
        case "nano":
          addLine("system", args[0] ? `[Opening ${args[0]} in Nano...]` : "[Opening Nano...]");
          break;
        case "ranger":
          addLine("system", "[Opening file manager...]");
          break;
        default:
          addLine("error", `${cmd}: command not found. Type "help" for available commands.`);
      }
    },
    [cwd, filesystem, addLine, history]
  );

  return {
    lines,
    cwd,
    executeCommand,
    history,
    historyIdx,
    setHistoryIdx,
  };
}
