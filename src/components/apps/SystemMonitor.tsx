import { useState, useEffect } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #1a1b26;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  color: #c0caf5;
  overflow: hidden;
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

const HeaderTitle = styled.span`
  color: #9ece6a;
  font-weight: bold;
`;

const HeaderInfo = styled.span`
  color: #7aa2f7;
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px;
`;

const SectionTitle = styled.div`
  color: #ff9e64;
  font-weight: bold;
  margin-bottom: 8px;
  margin-top: 12px;
  font-size: 13px;

  &:first-child {
    margin-top: 0;
  }
`;

const BarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
`;

const BarLabel = styled.span`
  width: 100px;
  color: #a9b1d6;
  flex-shrink: 0;
`;

const BarTrack = styled.div`
  flex: 1;
  height: 14px;
  background: #24283b;
  border-radius: 3px;
  overflow: hidden;
  position: relative;
`;

const BarFill = styled.div<{ $pct: number; $color: string }>`
  height: 100%;
  width: ${(p) => p.$pct}%;
  background: ${(p) => p.$color};
  border-radius: 3px;
  transition: width 0.5s ease;
`;

const BarText = styled.span`
  width: 50px;
  text-align: right;
  flex-shrink: 0;
  font-variant-numeric: tabular-nums;
`;

const ProcessTable = styled.div`
  width: 100%;
  margin-top: 12px;
`;

const ProcessRow = styled.div<{ $header?: boolean }>`
  display: grid;
  grid-template-columns: 60px 1fr 80px 80px 80px;
  padding: 4px 8px;
  gap: 8px;
  background: ${(p) => (p.$header ? "rgba(86, 95, 137, 0.15)" : "transparent")};
  color: ${(p) => (p.$header ? "#7aa2f7" : "#a9b1d6")};
  font-size: 11px;
  border-bottom: 1px solid rgba(86, 95, 137, 0.1);

  &:hover {
    background: rgba(122, 162, 247, 0.05);
  }
`;

const processes = [
  { pid: 1, name: "systemd", user: "root", cpu: 0.0, mem: 0.3 },
  { pid: 420, name: "hyprland", user: "weeb", cpu: 2.1, mem: 3.2 },
  { pid: 1337, name: "kitty", user: "weeb", cpu: 1.8, mem: 2.1 },
  { pid: 1488, name: "waybar", user: "weeb", cpu: 0.5, mem: 1.2 },
  { pid: 2048, name: "neovim", user: "weeb", cpu: 0.3, mem: 1.8 },
  { pid: 2500, name: "rofi", user: "weeb", cpu: 0.2, mem: 0.8 },
  { pid: 3000, name: "dunst", user: "weeb", cpu: 0.1, mem: 0.4 },
  { pid: 3141, name: "pulseaudio", user: "weeb", cpu: 0.4, mem: 0.6 },
  { pid: 4096, name: "NetworkManager", user: "root", cpu: 0.2, mem: 0.5 },
  { pid: 5000, name: "swww-daemon", user: "weeb", cpu: 0.1, mem: 0.3 },
  { pid: 6000, name: "polkit", user: "root", cpu: 0.0, mem: 0.2 },
  { pid: 7777, name: "dbus-daemon", user: "weeb", cpu: 0.1, mem: 0.3 },
];

export default function SystemMonitorApp() {
  const [cpuValues, setCpuValues] = useState([32, 45, 28, 55, 41, 38, 62, 35, 48, 30, 52, 40]);
  const [memUsed, setMemUsed] = useState(8192);
  const [swapUsed, setSwapUsed] = useState(1024);
  const [uptime] = useState("42d 3h 37m");

  useEffect(() => {
    const interval = setInterval(() => {
      setCpuValues((prev) =>
        prev.map((v) => Math.max(5, Math.min(95, v + (Math.random() - 0.5) * 20)))
      );
      setMemUsed((prev) => Math.max(4096, Math.min(14000, prev + (Math.random() - 0.5) * 500)));
      setSwapUsed((prev) => Math.max(512, Math.min(4096, prev + (Math.random() - 0.5) * 200)));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const memTotal = 16384;
  const swapTotal = 8192;
  const memPct = (memUsed / memTotal) * 100;
  const swapPct = (swapUsed / swapTotal) * 100;

  const getBarColor = (pct: number) => {
    if (pct < 50) return "#9ece6a";
    if (pct < 80) return "#e0af68";
    return "#f7768e";
  };

  return (
    <Wrapper>
      <Header>
        <HeaderTitle>htop</HeaderTitle>
        <HeaderInfo>Uptime: {uptime}</HeaderInfo>
      </Header>
      <Content>
        <SectionTitle>CPU  -  AMD Ryzen 9 5900X (12 cores)</SectionTitle>
        {cpuValues.map((val, i) => (
          <BarContainer key={i}>
            <BarLabel>Core {i}</BarLabel>
            <BarTrack>
              <BarFill $pct={val} $color={getBarColor(val)} />
            </BarTrack>
            <BarText>{val.toFixed(0)}%</BarText>
          </BarContainer>
        ))}

        <SectionTitle>Memory</SectionTitle>
        <BarContainer>
          <BarLabel>RAM</BarLabel>
          <BarTrack>
            <BarFill $pct={memPct} $color={getBarColor(memPct)} />
          </BarTrack>
          <BarText>{(memUsed / 1024).toFixed(1)}G</BarText>
        </BarContainer>
        <BarContainer>
          <BarLabel>Swap</BarLabel>
          <BarTrack>
            <BarFill $pct={swapPct} $color={getBarColor(swapPct)} />
          </BarTrack>
          <BarText>{(swapUsed / 1024).toFixed(1)}G</BarText>
        </BarContainer>

        <SectionTitle>Processes</SectionTitle>
        <ProcessTable>
          <ProcessRow $header>
            <span>PID</span>
            <span>NAME</span>
            <span>USER</span>
            <span>CPU%</span>
            <span>MEM%</span>
          </ProcessRow>
          {processes.map((p) => (
            <ProcessRow key={p.pid}>
              <span>{p.pid}</span>
              <span>{p.name}</span>
              <span>{p.user}</span>
              <span style={{ color: p.cpu > 5 ? "#f7768e" : "#a9b1d6" }}>{p.cpu.toFixed(1)}</span>
              <span style={{ color: p.mem > 3 ? "#e0af68" : "#a9b1d6" }}>{p.mem.toFixed(1)}</span>
            </ProcessRow>
          ))}
        </ProcessTable>
      </Content>
    </Wrapper>
  );
}
