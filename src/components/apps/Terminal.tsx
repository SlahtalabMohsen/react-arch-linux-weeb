import { useState, useRef, useEffect, useCallback } from "react";
import styled from "styled-components";
import { useDesktop } from "../../context/DesktopContext";
import { useTerminal } from "../../hooks/useTerminal";

const TerminalWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(26, 27, 38, 0.98);
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
`;

const OutputArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  line-height: 1.6;
`;

const CommandLine = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0;
  white-space: pre-wrap;
  word-break: break-all;
`;

const PromptText = styled.span`
  color: #bb9af7;
  flex-shrink: 0;
`;

const InputText = styled.span`
  color: #c0caf5;
`;

const OutputText = styled.div`
  color: #a9b1d6;
  white-space: pre-wrap;
  word-break: break-all;
`;

const ErrorText = styled.div`
  color: #f7768e;
  white-space: pre-wrap;
  word-break: break-all;
`;

const SystemText = styled.div`
  color: #7aa2f7;
  white-space: pre-wrap;
  word-break: break-all;
`;

const InputLine = styled.div`
  display: flex;
  align-items: center;
  padding: 0 12px;
  border-top: 1px solid rgba(86, 95, 137, 0.15);
  min-height: 36px;
  flex-shrink: 0;
`;

const HiddenInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #c0caf5;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  caret-color: #7aa2f7;
  padding: 6px 0;
`;

export default function TerminalApp() {
  const { state } = useDesktop();
  const { lines, cwd, executeCommand, history, historyIdx, setHistoryIdx } = useTerminal(state.filesystem);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        executeCommand(input);
        setInput("");
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (history.length > 0) {
          const newIdx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
          setHistoryIdx(newIdx);
          setInput(history[newIdx]);
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIdx !== -1) {
          const newIdx = historyIdx + 1;
          if (newIdx >= history.length) {
            setHistoryIdx(-1);
            setInput("");
          } else {
            setHistoryIdx(newIdx);
            setInput(history[newIdx]);
          }
        }
      } else if (e.key === "l" && e.ctrlKey) {
        e.preventDefault();
        executeCommand("clear");
        setInput("");
      } else if (e.key === "c" && e.ctrlKey) {
        e.preventDefault();
        setInput("");
      }
    },
    [input, executeCommand, history, historyIdx, setHistoryIdx]
  );

  const cwdPath = "/" + cwd.join("/");

  const highlightPath = (path: string) => {
    const parts = path.split("/");
    return parts.map((p, i) => {
      if (i === parts.length - 1 && p) {
        return { text: p, color: "#7aa2f7" };
      }
      return { text: p ? p + "/" : "/", color: "#565f89" };
    });
  };

  return (
    <TerminalWrapper onClick={() => inputRef.current?.focus()}>
      <OutputArea ref={outputRef}>
        {lines.map((line) => {
          if (line.type === "input") {
            return (
              <CommandLine key={line.id}>
                <PromptText>weeb@archlinux</PromptText>
                <span style={{ color: "#565f89" }}>:</span>
                {highlightPath(cwdPath).map((part, i) => (
                  <span key={i} style={{ color: part.color }}>{part.text}</span>
                ))}
                <span style={{ color: "#565f89" }}>$ </span>
                <InputText>{line.text}</InputText>
              </CommandLine>
            );
          }
          if (line.type === "error") return <ErrorText key={line.id}>{line.text}</ErrorText>;
          if (line.type === "system") return <SystemText key={line.id}>{line.text}</SystemText>;
          return <OutputText key={line.id}>{line.text}</OutputText>;
        })}
      </OutputArea>
      <InputLine>
        <PromptText>weeb@archlinux</PromptText>
        <span style={{ color: "#565f89" }}>:</span>
        {highlightPath(cwdPath).map((part, i) => (
          <span key={i} style={{ color: part.color }}>{part.text}</span>
        ))}
        <span style={{ color: "#565f89" }}>$ </span>
        <HiddenInput
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
      </InputLine>
    </TerminalWrapper>
  );
}
