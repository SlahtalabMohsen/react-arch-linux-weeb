import styled from "styled-components";
import { useDesktop } from "../../context/DesktopContext";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: rgba(26, 27, 38, 0.98);
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  overflow-y: auto;
  padding: 20px;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h2`
  color: #7aa2f7;
  font-size: 16px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(86, 95, 137, 0.2);
`;

const SettingRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid rgba(86, 95, 137, 0.1);
`;

const SettingLabel = styled.span`
  color: #c0caf5;
`;

const SettingDesc = styled.span`
  font-size: 11px;
  color: #565f89;
`;

const WallpaperGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 10px;
`;

const WallpaperItem = styled.button<{ $gradient: string; $active: boolean }>`
  height: 80px;
  border-radius: 8px;
  border: 2px solid ${(p) => (p.$active ? "#7aa2f7" : "rgba(86, 95, 137, 0.2)")};
  background: ${(p) => p.$gradient};
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: flex-end;
  padding: 6px;

  &:hover {
    border-color: rgba(122, 162, 247, 0.5);
    transform: scale(1.02);
  }
`;

const WallpaperName = styled.span`
  font-size: 10px;
  color: #c0caf5;
  background: rgba(0, 0, 0, 0.5);
  padding: 2px 6px;
  border-radius: 4px;
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

export default function SettingsApp() {
  const { state, dispatch } = useDesktop();

  return (
    <Wrapper>
      <Section>
        <SectionTitle>Wallpaper</SectionTitle>
        <WallpaperGrid>
          {wallpapers.map((wp) => (
            <WallpaperItem
              key={wp.name}
              $gradient={wp.gradient}
              $active={state.wallpaper === wp.gradient}
              onClick={() => dispatch({ type: "SET_WALLPAPER", wallpaper: wp.gradient })}
            >
              <WallpaperName>{wp.name}</WallpaperName>
            </WallpaperItem>
          ))}
        </WallpaperGrid>
      </Section>

      <Section>
        <SectionTitle>Theme</SectionTitle>
        <SettingRow>
          <div>
            <SettingLabel>Window Border</SettingLabel>
            <SettingDesc>Border style for window decorations</SettingDesc>
          </div>
          <span style={{ color: "#7aa2f7" }}>Rounded</span>
        </SettingRow>
        <SettingRow>
          <div>
            <SettingLabel>Font</SettingLabel>
            <SettingDesc>System monospace font</SettingDesc>
          </div>
          <span style={{ color: "#7aa2f7" }}>JetBrains Mono</span>
        </SettingRow>
        <SettingRow>
          <div>
            <SettingLabel>Transparency</SettingLabel>
            <SettingDesc>Window background opacity</SettingDesc>
          </div>
          <span style={{ color: "#7aa2f7" }}>96%</span>
        </SettingRow>
      </Section>

      <Section>
        <SectionTitle>System</SectionTitle>
        <SettingRow>
          <div>
            <SettingLabel>Window Manager</SettingLabel>
            <SettingDesc>Compositor and window manager</SettingDesc>
          </div>
          <span style={{ color: "#bb9af7" }}>Hyprland</span>
        </SettingRow>
        <SettingRow>
          <div>
            <SettingLabel>Bar</SettingLabel>
            <SettingDesc>Status bar application</SettingDesc>
          </div>
          <span style={{ color: "#bb9af7" }}>Waybar</span>
        </SettingRow>
        <SettingRow>
          <div>
            <SettingLabel>Launcher</SettingLabel>
            <SettingDesc>Application launcher</SettingDesc>
          </div>
          <span style={{ color: "#bb9af7" }}>Rofi</span>
        </SettingRow>
        <SettingRow>
          <div>
            <SettingLabel>Terminal</SettingLabel>
            <SettingDesc>Default terminal emulator</SettingDesc>
          </div>
          <span style={{ color: "#bb9af7" }}>Kitty</span>
        </SettingRow>
        <SettingRow>
          <div>
            <SettingLabel>Shell</SettingLabel>
            <SettingDesc>User shell</SettingDesc>
          </div>
          <span style={{ color: "#bb9af7" }}>Zsh 5.9</span>
        </SettingRow>
        <SettingRow>
          <div>
            <SettingLabel>Notification Daemon</SettingLabel>
            <SettingDesc>Desktop notifications</SettingDesc>
          </div>
          <span style={{ color: "#bb9af7" }}>Dunst</span>
        </SettingRow>
      </Section>

      <Section>
        <SectionTitle>About</SectionTitle>
        <SettingRow>
          <SettingLabel>Arch Linux for Weebs</SettingLabel>
          <span style={{ color: "#565f89" }}>v1.0.0</span>
        </SettingRow>
        <SettingRow>
          <SettingLabel>Made with React + TypeScript</SettingLabel>
          <span style={{ color: "#565f89" }}>btw</span>
        </SettingRow>
      </Section>
    </Wrapper>
  );
}
