import { useState, useCallback } from "react";
import styled from "styled-components";
import { useDesktop } from "../../context/DesktopContext";
import type { FileNode } from "../../types";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(26, 27, 38, 0.98);
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid rgba(86, 95, 137, 0.2);
  background: rgba(30, 32, 44, 0.6);
  flex-shrink: 0;
`;

const NavBtn = styled.button`
  padding: 4px 10px;
  border: 1px solid rgba(86, 95, 137, 0.3);
  border-radius: 6px;
  background: transparent;
  color: #a9b1d6;
  cursor: pointer;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  transition: all 0.15s;

  &:hover {
    background: rgba(122, 162, 247, 0.1);
    border-color: rgba(122, 162, 247, 0.4);
    color: #7aa2f7;
  }
`;

const PathBar = styled.div`
  flex: 1;
  padding: 5px 12px;
  border-radius: 6px;
  background: rgba(26, 27, 38, 0.6);
  color: #7aa2f7;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border: 1px solid rgba(86, 95, 137, 0.15);
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 8px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
`;

const FileItem = styled.div<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.1s;
  background: ${(p) => (p.$selected ? "rgba(122, 162, 247, 0.12)" : "transparent")};
  border: 1px solid ${(p) => (p.$selected ? "rgba(122, 162, 247, 0.3)" : "transparent")};

  &:hover {
    background: rgba(122, 162, 247, 0.08);
  }
`;

const FileIcon = styled.div`
  font-size: 32px;
  line-height: 1;
`;

const FileName = styled.div`
  font-size: 11px;
  color: #c0caf5;
  text-align: center;
  word-break: break-all;
  max-width: 90px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const StatusBar = styled.div`
  padding: 6px 12px;
  border-top: 1px solid rgba(86, 95, 137, 0.15);
  font-size: 11px;
  color: #565f89;
  display: flex;
  justify-content: space-between;
  flex-shrink: 0;
  background: rgba(30, 32, 44, 0.4);
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #565f89;
  gap: 8px;
`;

function getFileIcon(node: FileNode): string {
  if (node.type === "directory") return "📁";
  const ext = node.name.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "txt": case "md": return "📄";
    case "js": case "ts": case "tsx": case "jsx": return "📜";
    case "lua": return "🌙";
    case "conf": case "rasi": return "⚙️";
    case "png": case "jpg": case "jpeg": return "🖼️";
    case "mp3": case "wav": return "🎵";
    case "mp4": case "mkv": return "🎬";
    case "tar": case "gz": case "zip": return "📦";
    case "sh": case "bash": return "🔧";
    case "gitconfig": return "📋";
    default: return "📄";
  }
}

export default function FileManagerApp() {
  const { state } = useDesktop();
  const [currentPath, setCurrentPath] = useState<string[]>(["home", "weeb"]);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [history, setHistory] = useState<string[][]>([["home", "weeb"]]);
  const [historyIdx, setHistoryIdx] = useState(0);

  const getNode = useCallback(
    (path: string[]): FileNode | undefined => {
      let node = state.filesystem;
      for (const part of path) {
        if (node.type !== "directory" || !node.children?.[part]) return undefined;
        node = node.children[part];
      }
      return node;
    },
    [state.filesystem]
  );

  const currentNode = getNode(currentPath);
  const entries = currentNode?.children ? Object.values(currentNode.children) : [];
  const sortedEntries = [...entries].sort((a, b) => {
    if (a.type !== b.type) return a.type === "directory" ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  const navigateTo = (path: string[]) => {
    setCurrentPath(path);
    setSelectedFile(null);
    setHistory((h) => [...h.slice(0, historyIdx + 1), path]);
    setHistoryIdx((i) => i + 1);
  };

  const handleItemDoubleClick = (node: FileNode) => {
    if (node.type === "directory") {
      navigateTo([...currentPath, node.name]);
    }
  };

  const goBack = () => {
    if (historyIdx > 0) {
      setHistoryIdx((i) => i - 1);
      setCurrentPath(history[historyIdx - 1]);
      setSelectedFile(null);
    }
  };

  const goForward = () => {
    if (historyIdx < history.length - 1) {
      setHistoryIdx((i) => i + 1);
      setCurrentPath(history[historyIdx + 1]);
      setSelectedFile(null);
    }
  };

  const goUp = () => {
    if (currentPath.length > 0) {
      navigateTo(currentPath.slice(0, -1));
    }
  };

  const goHome = () => {
    navigateTo(["home", "weeb"]);
  };

  const pathDisplay = "/" + currentPath.join("/");

  return (
    <Wrapper>
      <Toolbar>
        <NavBtn onClick={goBack} title="Back">◀</NavBtn>
        <NavBtn onClick={goForward} title="Forward">▶</NavBtn>
        <NavBtn onClick={goUp} title="Up">▲</NavBtn>
        <NavBtn onClick={goHome} title="Home">🏠</NavBtn>
        <PathBar>{pathDisplay}</PathBar>
      </Toolbar>
      <Content>
        {sortedEntries.length === 0 ? (
          <EmptyState>
            <span style={{ fontSize: 40 }}>📂</span>
            <span>Empty directory</span>
          </EmptyState>
        ) : (
          <Grid>
            {sortedEntries.map((node) => (
              <FileItem
                key={node.name}
                $selected={selectedFile === node.name}
                onClick={() => setSelectedFile(node.name)}
                onDoubleClick={() => handleItemDoubleClick(node)}
              >
                <FileIcon>{getFileIcon(node)}</FileIcon>
                <FileName>{node.name}</FileName>
              </FileItem>
            ))}
          </Grid>
        )}
      </Content>
      <StatusBar>
        <span>{sortedEntries.length} items</span>
        <span>{selectedFile || "No selection"}</span>
      </StatusBar>
    </Wrapper>
  );
}
