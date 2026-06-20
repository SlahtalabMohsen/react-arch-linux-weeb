import { useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #1a1b26;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
`;

const Header = styled.div`
  padding: 8px 12px;
  background: #24283b;
  border-bottom: 1px solid rgba(86, 95, 137, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
`;

const Title = styled.span`
  color: #ff9e64;
  font-weight: bold;
`;

const SaveIndicator = styled.span<{ $saved: boolean }>`
  font-size: 11px;
  color: ${(p) => (p.$saved ? "#9ece6a" : "#f7768e")};
`;

const EditorArea = styled.textarea`
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #c0caf5;
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  line-height: 1.7;
  padding: 12px;
  resize: none;
  tab-size: 2;
  caret-color: #7aa2f7;

  &::selection {
    background: rgba(122, 162, 247, 0.3);
  }
`;

const StatusBar = styled.div`
  padding: 6px 12px;
  border-top: 1px solid rgba(86, 95, 137, 0.15);
  font-size: 11px;
  color: #565f89;
  display: flex;
  justify-content: space-between;
  flex-shrink: 0;
  background: #24283b;
`;

const HelpBar = styled.div`
  padding: 4px 12px;
  background: rgba(122, 162, 247, 0.1);
  border-bottom: 1px solid rgba(86, 95, 137, 0.15);
  font-size: 11px;
  color: #7aa2f7;
  display: flex;
  gap: 16px;
  flex-shrink: 0;
`;

const DEFAULT_CONTENT = `# Welcome to Nano (weeb edition)
# 
# A minimal text editor for the true Arch user.
# This is a simulated nano experience.
# 
# Keybindings:
#   ^O  Save    ^X  Exit    ^K  Cut
#   ^U  Paste   ^W  Search  ^G  Help
#

# ~/.config/hypr/hyprland.conf
monitor = , 1920x1080@60, auto, 1

input {
    kb_layout = us
    follow_mouse = 1
}

general {
    gaps_in = 5
    gaps_out = 10
    border_size = 2
    col.active_border = rgba(bb9afeee) rgba(7aa2f7ee)
    col.inactive_border = rgba(565f89aa)
}

decoration {
    rounding = 10
    blur {
        enabled = true
        size = 6
        passes = 3
    }
}

# Anime wallpaper is mandatory
# bg = ~/.config/hypr/wallpaper.jpg
`;

export default function TextEditorApp() {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [saved, setSaved] = useState(true);
  const [fileName] = useState("hyprland.conf");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
  };

  const lines = content.split("\n");

  return (
    <Wrapper>
      <Header>
        <Title>Nano: {fileName}</Title>
        <SaveIndicator $saved={saved}>
          {saved ? "Saved" : "Modified"}
        </SaveIndicator>
      </Header>
      <HelpBar>
        <span>^O Save</span>
        <span>^X Exit</span>
        <span>^G Help</span>
        <span>^W Search</span>
        <span onClick={handleSave} style={{ cursor: "pointer" }}>^S Quick Save</span>
      </HelpBar>
      <EditorArea
        value={content}
        onChange={handleChange}
        spellCheck={false}
        autoFocus
      />
      <StatusBar>
        <span>File: {fileName}</span>
        <span>{lines.length} lines</span>
        <span>{saved ? "No changes" : "Modified"}</span>
      </StatusBar>
    </Wrapper>
  );
}
