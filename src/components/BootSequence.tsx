import { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useDesktop } from "../context/DesktopContext";

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Container = styled.div`
  position: fixed;
  inset: 0;
  background: #0d0e14;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: 'JetBrains Mono', monospace;
  color: #c0caf5;
  animation: ${fadeIn} 0.3s ease-out;
`;

const BootLog = styled.div`
  width: 90%;
  max-width: 700px;
  font-size: 13px;
  line-height: 1.8;
  color: #a9b1d6;
`;

const LogLine = styled.div<{ $color?: string }>`
  color: ${(p) => p.$color || "#a9b1d6"};
  white-space: nowrap;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  width: 90%;
  max-width: 700px;
  height: 3px;
  background: rgba(86, 95, 137, 0.3);
  border-radius: 2px;
  margin-top: 30px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $width: number }>`
  height: 100%;
  width: ${(p) => p.$width}%;
  background: linear-gradient(90deg, #7aa2f7, #bb9af7);
  border-radius: 2px;
  transition: width 0.15s linear;
`;

const LOG_ENTRIES = [
  { text: "[    0.000000] Linux version 6.9.1-arch1-1 (weeb@archbuilder) (gcc 14.1.0) #1 SMP PREEMPT_DYNAMIC", delay: 0 },
  { text: "[    0.000000] Command line: BOOT_IMAGE=/vmlinuz-linux root=UUID=a1b2c3d4 rw quiet splash", delay: 50 },
  { text: "[    0.053284] Calibrating delay loop... 6400.00 BogoMIPS (lpj=3200000)", delay: 100 },
  { text: "[    0.102341] CPU: AMD Ryzen 9 5900X 12-Core Processor", delay: 150 },
  { text: "[    0.102345] Memory: 16384MB available", delay: 200 },
  { text: "[    0.234567] ACPI: All SSDT tables successfully acquired", delay: 280 },
  { text: "[    0.345678] Loading kernel modules...", delay: 350 },
  { text: "[    0.456789] systemd[1]: Detected architecture x86-64.", delay: 420 },
  { text: "[    0.567890] systemd[1]: Hostname set to <archlinux>.", delay: 480 },
  { text: "[    0.678901] systemd[1]: Started udev Coldplug all Devices.", delay: 540 },
  { text: "[    0.723456] systemd[1]: Listening on Journal Socket.", delay: 580 },
  { text: "[    0.789012] systemd[1]: Reached target Local File Systems.", delay: 620 },
  { text: "[    0.834567] systemd[1]: Starting Network Manager...", delay: 660 },
  { text: "[    0.890123] systemd[1]: [  OK  ] Started Network Manager.", delay: 700, color: "#9ece6a" },
  { text: "[    0.912345] systemd[1]: [  OK  ] Reached target Graphical Interface.", delay: 730, color: "#9ece6a" },
  { text: "[    0.934567] systemd[1]: [  OK  ] Started TLP system startup/shutdown.", delay: 760, color: "#9ece6a" },
  { text: "[    0.956789] systemd[1]: [  OK  ] Started Getty on tty1.", delay: 790, color: "#9ece6a" },
  { text: "[    0.978901] Arch Linux 6.9.1-arch1-1 (tty1)", delay: 820 },
  { text: "", delay: 850 },
  { text: "archlinux login: weeb", delay: 900, color: "#7aa2f7" },
  { text: "Password: ********", delay: 1000, color: "#7aa2f7" },
  { text: "Last login: Fri Jun 19 2024", delay: 1050 },
  { text: 'Welcome to Arch Linux! "I use Arch btw"', delay: 1100, color: "#bb9af7" },
];

export default function BootSequence() {
  const { dispatch } = useDesktop();
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    LOG_ENTRIES.forEach((entry, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleLines(i + 1);
          setProgress(((i + 1) / LOG_ENTRIES.length) * 100);
        }, entry.delay)
      );
    });

    timers.push(
      setTimeout(() => {
        dispatch({ type: "SET_PHASE", phase: "lock" });
      }, 1800)
    );

    return () => timers.forEach(clearTimeout);
  }, [dispatch]);

  return (
    <Container>
      <BootLog>
        {LOG_ENTRIES.slice(0, visibleLines).map((entry, i) => (
          <LogLine key={i} $color={entry.color}>
            {entry.text}
          </LogLine>
        ))}
      </BootLog>
      <ProgressBar>
        <ProgressFill $width={progress} />
      </ProgressBar>
    </Container>
  );
}
