"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import styles from "./styles.module.scss";

import { useAuth } from "../../auth-context";
import Heading from "../typography/heading";
import Button from "../button";
import LinkButton from "../link-button/link-button";
import Search from "../search/search";

import LogoSvg from "../svg/LogoSvg";

const Header = () => {
  const router = usePathname();

  const { state } = useAuth();

  const [isWhite, setIsWhite] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [eventAdded, setEventAdded] = useState(false);
  const [scrollHeight, setScrollHeight] = useState(0);

  useEffect(() => {
    if (router !== "/") {
      setIsWhite(true);
    } else if (router === "/" && scrollHeight >= 50) {
      setIsWhite(true);
    } else {
      setIsWhite(false);
    }
  }, [scrollHeight, router]);

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  function changeScrollHeight() {
    if (typeof window !== "undefined") {
      setScrollHeight(window.scrollY);
    }
  }

  function initScroll() {
    if (!eventAdded && typeof window !== "undefined") {
      window.addEventListener("scroll", changeScrollHeight);
      changeScrollHeight();
      setEventAdded(true);
    }
  }

  initScroll();

  return (
    <header>
      <nav className={styles.nav} data-open={isMenuOpen} data-white={isWhite}>
        <Link href="/" className={styles.nav__logo}>
          <Button
            variant="unstyled"
            style={{ display: "flex", alignItems: "center" }}
          >
            <LogoSvg />
            <Heading variant="lg" fontWeight={300}>
              SoundStories
            </Heading>
          </Button>
        </Link>
        {(router === "/" || router.includes("stories")) && <Search />}
        <div className={styles.nav__buttons}>
          {state.isUserAuthenticated && (
            <>
              <LinkButton href="/admin/review">Beheerder paneel</LinkButton>
              <LinkButton href="/admin/content">Content beheer</LinkButton>
            </>
          )}

          <LinkButton href="/about">Over SoundStories</LinkButton>

          <LinkButton href="/write" buttonVariant="primary">
            Schrijven
          </LinkButton>
          <input
            onInput={toggleMenu}
            type="checkbox"
            id="menu_checkbox"
            className={styles.menu_checkbox}
          />
          <label className={styles.hamburgercheck} htmlFor="menu_checkbox">
            <div />
            <div />
            <div />
          </label>
        </div>
      </nav>
      {isMenuOpen && (
        <div className={styles.nav__hamburgerMenu}>
          <div className="container">
            <a>
              <LinkButton href="/about" onClick={() => toggleMenu()}>
                Over SoundStories
              </LinkButton>
            </a>
            <a>
              <LinkButton href="/write" onClick={() => toggleMenu()}>
                Schrijven
              </LinkButton>
            </a>
            {state.isUserAuthenticated && (
              <>
                <a>
                  <LinkButton href="/admin/review" onClick={() => toggleMenu()}>
                    Beheerder paneel
                  </LinkButton>
                </a>
                <a>
                  <LinkButton
                    href="/admin/content"
                    onClick={() => toggleMenu()}
                  >
                    Content beheer
                  </LinkButton>
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
