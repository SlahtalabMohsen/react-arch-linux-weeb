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

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #24283b;
  border-bottom: 1px solid rgba(86, 95, 137, 0.2);
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

const UrlBar = styled.input`
  flex: 1;
  padding: 6px 12px;
  border: 1px solid rgba(86, 95, 137, 0.3);
  border-radius: 6px;
  background: rgba(26, 27, 38, 0.8);
  color: #c0caf5;
  font-family: 'JetBrains Mono', monospace;
  font-size: 12px;
  outline: none;

  &:focus {
    border-color: rgba(122, 162, 247, 0.5);
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background: #1a1b26;
`;

const PageTitle = styled.h1`
  color: #7aa2f7;
  font-size: 24px;
  margin-bottom: 16px;
`;

const PageText = styled.p`
  color: #a9b1d6;
  line-height: 1.8;
  margin-bottom: 12px;
  max-width: 600px;
`;

const LinkCard = styled.div`
  background: rgba(122, 162, 247, 0.08);
  border: 1px solid rgba(122, 162, 247, 0.2);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  max-width: 600px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(122, 162, 247, 0.12);
    border-color: rgba(122, 162, 247, 0.4);
  }
`;

const LinkTitle = styled.div`
  color: #7aa2f7;
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const LinkDesc = styled.div`
  color: #565f89;
  font-size: 12px;
`;

type Page = {
  url: string;
  title: string;
  content: React.ReactNode;
};

const PAGES: Record<string, Page> = {
  "home": {
    url: "weeb://home",
    title: "New Tab",
    content: (
      <>
        <PageTitle>Welcome, Weeb</PageTitle>
        <PageText>Your browser is ready. Visit some weeb-friendly sites below.</PageText>
        <LinkCard onClick={() => {}}>
          <LinkTitle>r/unixporn</LinkTitle>
          <LinkDesc>Reddit community for rice and desktop screenshots</LinkDesc>
        </LinkCard>
        <LinkCard onClick={() => {}}>
          <LinkTitle>Arch Wiki</LinkTitle>
          <LinkDesc>The ultimate Arch Linux resource</LinkDesc>
        </LinkCard>
        <LinkCard onClick={() => {}}>
          <LinkTitle>AUR</LinkTitle>
          <LinkDesc>Arch User Repository - community packages</LinkDesc>
        </LinkCard>
      </>
    ),
  },
  "archlinux.org": {
    url: "https://archlinux.org",
    title: "Arch Linux",
    content: (
      <>
        <PageTitle>Arch Linux</PageTitle>
        <PageText>
          A simple, lightweight Linux distribution.
        </PageText>
        <PageText>
          Arch Linux is an independently developed, x86-64/general-purpose 
          GNU/Linux distribution that strives to provide the latest stable 
          versions of most software via a rolling-release package management 
          model.
        </PageText>
        <PageText>
          The Pacman package manager is powerful and easy to use, enabling 
          you to keep the system up-to-date easily with one command.
        </PageText>
        <PageText style={{ color: "#bb9af7", fontWeight: "bold" }}>
          I use Arch btw.
        </PageText>
      </>
    ),
  },
  "reddit.com/r/unixporn": {
    url: "https://reddit.com/r/unixporn",
    title: "r/unixporn",
    content: (
      <>
        <PageTitle>r/unixporn</PageTitle>
        <PageText>
          Rice is a unix term for the visual customization of your desktop. 
          Show off your sweet setups here!
        </PageText>
        <LinkCard>
          <LinkTitle>[Hyprland] Tokyo Night Rice</LinkTitle>
          <LinkDesc>1.2k upvotes - Clean setup with transparent kitty</LinkDesc>
        </LinkCard>
        <LinkCard>
          <LinkTitle>[i3] Catppuccin + Anime</LinkTitle>
          <LinkDesc>890 upvotes - Full Catppuccin theme</LinkDesc>
        </LinkCard>
        <LinkCard>
          <LinkTitle>[Sway] Minimal Weeb</LinkTitle>
          <LinkDesc>756 upvotes - Simple and clean</LinkDesc>
        </LinkCard>
        <LinkCard>
          <LinkTitle>[Hyprland] Nord + Sakura</LinkTitle>
          <LinkDesc>634 upvotes - Cherry blossom vibes</LinkDesc>
        </LinkCard>
      </>
    ),
  },
};

export default function BrowserApp() {
  const [url, setUrl] = useState("weeb://home");
  const [currentPage, setCurrentPage] = useState("home");

  const navigate = (pageUrl: string) => {
    const key = Object.keys(PAGES).find((k) => PAGES[k].url === pageUrl);
    if (key) {
      setCurrentPage(key);
      setUrl(PAGES[key].url);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(url);
  };

  const page = PAGES[currentPage] || PAGES["home"];

  return (
    <Wrapper>
      <Toolbar>
        <NavBtn onClick={() => navigate("home")}>◀</NavBtn>
        <NavBtn onClick={() => {}}>▶</NavBtn>
        <NavBtn onClick={() => navigate("home")}>↻</NavBtn>
        <form onSubmit={handleUrlSubmit} style={{ flex: 1, display: "flex" }}>
          <UrlBar
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL..."
          />
        </form>
      </Toolbar>
      <Content>
        <PageTitle>{page.title}</PageTitle>
        {page.content}
      </Content>
    </Wrapper>
  );
}
