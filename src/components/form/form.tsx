"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

import "./form.scss";
import lineStyle from "../page-title/styles.module.scss";

import TextInput from "../text-input/text-input";
import TextArea from "../text-area/text-area";
import Button from "../button";
import { submitStory } from "../../app/actions";
import { getLyrics } from "../../app/actions";
import dynamic from "next/dynamic";
import Paragraph from "../typography/paragraph";

import SpotifySearch from "../spotify-search/spotify-search.jsx";

import { storage as firebaseStorage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { isUserLoggedIn } from "../../app/actions";
import {useSiteContent} from "../site-content-provider/siteContentProvider";

export type SpotifyTrack = {
  id: string;
  type: "Track";
  name: string;
  artist: string;
  url: string;
  album: string;
  albumImage: string;
};

const Editor = dynamic(
  () => {
    return import("../editor/editor");
  },
  { ssr: false }
);

const Form = () => {
  const { content } = useSiteContent();
  const [author, setAuthor] = useState("");
  const [email, setEmail] = useState("");
  const [storyTitle, setStoryTitle] = useState("");
  const [checkboxChecked, setCheckboxChecked] = useState(false);

  const [songTitle, setSongTitle] = useState("");
  const [songImage, setSongImage] = useState<File | null>(null);
  const [song, setSong] = useState<SpotifyTrack | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState([]);
  const [artistAlbums, setArtistAlbums] = useState([]);
  const [artistSongs, setArtistSongs] = useState([]);
  const [linkToSong, setLinkToSong] = useState("");

  const [originText, setOriginText] = useState("");
  const [storyText, setStoryText] = useState<string | undefined>(undefined);
  const [storyTextFile, setStoryTextFile] = useState<File | null>(null);
  const [songText, setSongText] = useState<string | undefined>(undefined);
  3;

  const [manualSongInput, setManualSongInput] = useState(false);
  const [manualStoryTextInput, setManualStoryTextInput] = useState(false);

  const [alertText, setAlertText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const router = useRouter();

  const isStoryText =
    (storyText ? storyText?.length > 1 : false) || storyTextFile !== null;

  const isSong =
    (song?.name ? song?.name.length > 1 : false) ||
    (songTitle ? songTitle?.length > 1 : false);

  async function getSong(res) {
    setSong(res);
    setLinkToSong(res.url);


    const lyricResult = await getLyrics(res.artist, res.name);
    setSongText(lyricResult || undefined);
  }

  const addItem = async (e) => {
    e.preventDefault();
    setIsSuccess(false);

    if (email === "") {
      setAlertText("Email mist");
      return;
    }

    if (storyTitle === "") {
      setAlertText("Verhaal titel mist");
      return;
    }

    if (!isSong) {
      setAlertText("Lied mist");
      return;
    }

    if (!isStoryText) {
      setAlertText("Verhaal tekst mist");
      return;
    }

    if (!checkboxChecked) {
      setAlertText("Gelieve het vakje aan te vinken voordat je doorgaat.");
      return;
    }

    if (isLoading) return;
    else {
      setIsSuccess(false);
      setIsLoading(true);
      setAlertText("");

      try {
        let updatedAuthor = author;
        const isLoggedIn = await isUserLoggedIn();
        if (!isLoggedIn) {
          updatedAuthor.length > 0
            ? (updatedAuthor += " (gastschrijver)")
            : (updatedAuthor += "een gastschrijver");
        }

        let storyFileUrl: string | null = null;
        if (storyTextFile) {
          const storageRef = ref(
            firebaseStorage,
            `stories/${storyTextFile.name}`
          );
          await uploadBytes(storageRef, storyTextFile);
          storyFileUrl = await getDownloadURL(storageRef);
        }

        const storyData = {
          author: updatedAuthor,
          email: email,
          storyTitle: storyTitle,
          song: song,
          songTitle: songTitle,
          originText: originText,
          storyText: storyText,
          songText: songText,
          storyFileUrl: storyFileUrl,
          underReview: true,
          linkToSong: linkToSong,
        };

        let imageUrl: string | null = null;
        if (songImage) {
          const storageRef = ref(firebaseStorage, songImage.name);
          await uploadBytes(storageRef, songImage);
          imageUrl = await getDownloadURL(storageRef);
        }

        if (!isLoggedIn) {
          const formData = new FormData();
          formData.append("storyData", JSON.stringify(storyData));
          storyTextFile && formData.append("storyTextFile", storyTextFile);

          await fetch("/api/send-email", {
            method: "POST",
            body: formData,
          });
        }

        await submitStory(storyData, imageUrl);

        setAuthor("");
        setStoryTitle("");
        setSongTitle("");
        setSearchResults([]);
        setSearchQuery("");
        setSelectedResult([]);
        setArtistAlbums([]);
        setArtistSongs([]);
        setLinkToSong("");
        setSongImage(null);
        setOriginText("");
        setStoryText("");
        setStoryTextFile(null);
        setSongText(undefined);
      } catch (e) {
        console.error("error: ", e);
      }
      setIsLoading(false);
      setIsSuccess(true);
    }
  };

  const handleSongRemoved = () => {
    setLinkToSong("");
    setSongText(undefined)
  }

  return (
    <div className="inputs__group">
      <TextInput
        type="text"
        name="story_author"
        label="Auteur verhaal"
        placeholder="Auteur"
        onChange={(e) => setAuthor(e.target.value)}
        value={author}
      />
      <TextInput
        type="email"
        name="story_email"
        label="E-mail (om eventueel contact op te nemen over je verhaaltje, wordt nergens gedeeld)"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        required
      />
      <TextInput
        type="text"
        name="story_title"
        label="Titel van het verhaal"
        placeholder="Titel"
        onChange={(e) => setStoryTitle(e.target.value)}
        value={storyTitle}
        required
      />
      <div>
        <div className="row">
          {!manualSongInput && (
            <SpotifySearch
              getSong={getSong}
              setSong={setSong}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchResults={searchResults}
              setSearchResults={setSearchResults}
              selectedResult={selectedResult}
              setSelectedResult={setSelectedResult}
              artistAlbums={artistAlbums}
              setArtistAlbums={setArtistAlbums}
              artistSongs={artistSongs}
              setArtistSongs={setArtistSongs}
              onSongRemoved={handleSongRemoved}
            />
          )}
          <TextInput
            type="text"
            name="link_to_song"
            label="Link naar het liedje (Spotify, Youtube oid)"
            placeholder="Link"
            onChange={(e) => setLinkToSong(e.target.value)}
            value={linkToSong}
          />
        </div>
        {song?.name !== "" && !manualSongInput && (
          <Button
            onClick={() => {
              setManualSongInput(true);
              setSong(null);
              setSelectedResult([]);
              setSearchQuery("");
              setLinkToSong("");
            }}
            variant="underlined"
            style={{ paddingTop: 10 }}
          >
            Niet gevonden? Vul het handmatig in
          </Button>
        )}
      </div>
      <div>
        {manualSongInput && (
          <>
            <div className="row">
              <TextInput
                type="text"
                name="song_info"
                label="Artiest en titel van het liedje"
                placeholder={"Artiest en titel van het liedje"}
                onChange={(e) => setSongTitle(e.target.value)}
                value={songTitle}
                required
              />
              <TextInput
                type="file"
                name="song_image"
                label="Afbeelding voor lied"
                onChange={(e) => setSongImage(e.target.files[0])}
                accept="image/png, image/jpeg"
              />
            </div>

            <Button
              onClick={() => {
                setManualSongInput(false);
                setSongTitle("");
                setSongImage(null);
              }}
              variant="underlined"
              style={{ paddingTop: 10 }}
            >
              Terug naar de Spotify zoeker
            </Button>
          </>
        )}
      </div>
      <TextArea
        name="origin_text"
        label="Extra informatie (zichtbaar bij verhaaltje)"
        placeholder="Extra informatie"
        onChange={(e) => setOriginText(e.target.value)}
        value={originText}
        cols={30}
        rows={5}
      />
      <div>
        {manualStoryTextInput && (
          <>
            <Editor
              label="Verhaal tekst"
              onChange={(value) => setStoryText(value)}
              value={storyText}
              required
            />
            <Button
              onClick={() => {
                setManualStoryTextInput(false), setStoryText("");
              }}
              variant="underlined"
              style={{ paddingTop: 10 }}
            >
              Terug naar document uploaden
            </Button>
          </>
        )}
        {!manualStoryTextInput && (
          <>
            <TextInput
              type="file"
              name="story_text"
              label="Upload 
              document met je verhaal (.doc, .docx, .rtf, .txt en .pdf)*"
              onChange={(e) => setStoryTextFile(e.target.files[0])}
              accept=".doc, .docx, .rtf, .txt, .pdf"
            />

            <Button
              onClick={() => {
                setManualStoryTextInput(true);
                setStoryTextFile(null);
              }}
              variant="underlined"
              style={{ paddingTop: 10 }}
            >
              Of schrijf het handmatig
            </Button>
          </>
        )}
      </div>
      <Editor
        label="Songtekst"
        onChange={(value) => setSongText(value)}
        value={songText}
      />
      <div className={lineStyle.line} />
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
        <input
          type="checkbox"
          id="confirm"
          onChange={() => setCheckboxChecked(true)}
          required
        />
        <label htmlFor="confirm" style={{ marginTop: -3 }}>
          { content.writeCheckboxText || 'Aan het laden...' }
        </label>
      </div>
      <Button
        variant={
          storyTitle === "" || !isStoryText || isLoading
            ? "disabled"
            : "secondary"
        }
        style={{ width: "100%" }}
        onClick={addItem}
      >
        Verstuur verhaal
      </Button>

      <div
        style={{
          width: "100%",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: 32,
        }}
      >
        {alertText && <Paragraph color="red">{alertText}</Paragraph>}
        {isLoading && (
          <Paragraph variant="sm">
            Een moment, je verhaal wordt opgestuurd
          </Paragraph>
        )}
        {isSuccess && (
          <>
            <Paragraph variant="sm">
              Je verhaal is verstuurd en zal zo snel mogelijk worden gelezen. In
              de tussentijd kan je nog een verhaal schrijven of verhalen van
              andere schrijvers lezen.
            </Paragraph>
            <Button
              onClick={(e) => {
                e.preventDefault(), router.push("/");
              }}
              style={{ width: "100%" }}
              variant="secondary"
            >
              Lees verhalen
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Form;
