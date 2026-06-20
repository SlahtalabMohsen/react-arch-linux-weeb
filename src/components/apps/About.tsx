import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(26, 27, 38, 0.98);
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  overflow-y: auto;
  padding: 30px;
  gap: 20px;
`;

const Logo = styled.div`
  font-size: 72px;
  filter: drop-shadow(0 0 30px rgba(122, 162, 247, 0.4));
  animation: pulse 2s ease-in-out infinite;

  @keyframes pulse {
    0%, 100% { filter: drop-shadow(0 0 30px rgba(122, 162, 247, 0.4)); }
    50% { filter: drop-shadow(0 0 50px rgba(122, 162, 247, 0.6)); }
  }
`;

const Title = styled.h1`
  font-size: 28px;
  background: linear-gradient(135deg, #7aa2f7, #bb9af7, #ff9e64);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.div`
  color: #a9b1d6;
  font-size: 14px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 8px 16px;
  max-width: 400px;
  width: 100%;
`;

const InfoLabel = styled.span`
  color: #7aa2f7;
  text-align: right;
`;

const InfoValue = styled.span`
  color: #c0caf5;
`;

const Separator = styled.div`
  width: 200px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(122, 162, 247, 0.3), transparent);
  margin: 8px 0;
`;

const Quote = styled.div`
  color: #565f89;
  font-style: italic;
  font-size: 12px;
  text-align: center;
  max-width: 350px;
`;

export default function AboutApp() {
  return (
    <Wrapper>
      <Logo>▲</Logo>
      <Title>Arch Linux</Title>
      <Subtitle>For Weebs</Subtitle>
      <Separator />
      <InfoGrid>
        <InfoLabel>OS</InfoLabel>
        <InfoValue>Arch Linux x86_64</InfoValue>
        <InfoLabel>Host</InfoLabel>
        <InfoValue>ThinkPad X1 Carbon</InfoValue>
        <InfoLabel>Kernel</InfoLabel>
        <InfoValue>6.9.1-arch1-1</InfoValue>
        <InfoLabel>Uptime</InfoLabel>
        <InfoValue>42 days, 3 hours</InfoValue>
        <InfoLabel>Shell</InfoLabel>
        <InfoValue>zsh 5.9</InfoValue>
        <InfoLabel>DE</InfoLabel>
        <InfoValue>Hyprland</InfoValue>
        <InfoLabel>WM Theme</InfoLabel>
        <InfoValue>Tokyo Night</InfoValue>
        <InfoLabel>Terminal</InfoLabel>
        <InfoValue>Kitty + weeb-term</InfoValue>
        <InfoLabel>CPU</InfoLabel>
        <InfoValue>AMD Ryzen 9 5900X</InfoValue>
        <InfoLabel>GPU</InfoLabel>
        <InfoValue>NVIDIA RTX 3080</InfoValue>
        <InfoLabel>Memory</InfoLabel>
        <InfoValue>8192MiB / 16384MiB</InfoValue>
        <InfoLabel>Packages</InfoLabel>
        <InfoValue>1337 (pacman)</InfoValue>
        <InfoLabel>Resolution</InfoLabel>
        <InfoValue>1920x1080 @ 60Hz</InfoValue>
      </InfoGrid>
      <Separator />
      <Quote>"I use Arch btw, and anime is my operating system of the soul"</Quote>
    </Wrapper>
  );
}
