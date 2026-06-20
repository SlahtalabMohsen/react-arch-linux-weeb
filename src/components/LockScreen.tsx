import { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useDesktop } from "../context/DesktopContext";

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(1.02); }
  to { opacity: 1; transform: scale(1); }
`;

const Container = styled.div`
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #1a1b26 0%, #24283b 40%, #1f2335 70%, #1a1b26 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'JetBrains Mono', monospace;
  animation: ${fadeIn} 0.5s ease-out;
  cursor: pointer;
`;

const Overlay = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const ArchLogo = styled.div`
  font-size: 64px;
  margin-bottom: 8px;
  filter: drop-shadow(0 0 30px rgba(122, 162, 247, 0.4));
  animation: ${fadeIn} 0.8s ease-out;
`;

const TimeDisplay = styled.div`
  font-size: 72px;
  font-weight: 700;
  color: #c0caf5;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
  letter-spacing: 2px;
`;

const DateDisplay = styled.div`
  font-size: 18px;
  color: #a9b1d6;
  margin-bottom: 24px;
`;

const UserAvatar = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7aa2f7, #bb9af7);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  margin-bottom: 8px;
  box-shadow: 0 4px 20px rgba(122, 162, 247, 0.3);
`;

const UserName = styled.div`
  font-size: 18px;
  color: #c0caf5;
  font-weight: 500;
`;

const PasswordInput = styled.input`
  width: 260px;
  padding: 10px 16px;
  border: 1px solid rgba(86, 95, 137, 0.4);
  border-radius: 8px;
  background: rgba(26, 27, 38, 0.8);
  color: #c0caf5;
  font-family: 'JetBrains Mono', monospace;
  font-size: 14px;
  text-align: center;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  margin-top: 8px;

  &:focus {
    border-color: rgba(122, 162, 247, 0.6);
    box-shadow: 0 0 0 3px rgba(122, 162, 247, 0.15);
  }

  &::placeholder {
    color: #565f89;
  }
`;

const HintText = styled.div`
  font-size: 12px;
  color: #565f89;
  margin-top: 12px;
`;

const ErrorText = styled.div`
  font-size: 13px;
  color: #f7768e;
  margin-top: 4px;
`;

export default function LockScreen() {
  const { dispatch } = useDesktop();
  const [time, setTime] = useState(new Date());
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (d: Date) =>
    d.getHours().toString().padStart(2, "0") + ":" + d.getMinutes().toString().padStart(2, "0");

  const formatDate = (d: Date) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SET_PHASE", phase: "desktop" });
  };

  return (
    <Container onClick={() => inputRef.current?.focus()}>
      <Overlay />
      <Content>
        <ArchLogo>▲</ArchLogo>
        <TimeDisplay>{formatTime(time)}</TimeDisplay>
        <DateDisplay>{formatDate(time)}</DateDisplay>
        <UserAvatar>🎮</UserAvatar>
        <UserName>weeb</UserName>
        <form onSubmit={handleSubmit}>
          <PasswordInput
            ref={inputRef}
            type="password"
            placeholder="Password..."
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
            autoFocus
          />
          {error && <ErrorText>Authentication failed</ErrorText>}
        </form>
        <HintText>Press Enter to unlock (any password works)</HintText>
      </Content>
    </Container>
  );
}
