"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import "../form/form.scss";
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
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

const Editor = dynamic(
  () => {
    return import("../editor/editor");
  },
  { ssr: false }
);

const FormAdmin = ({
  authorData,
  storyTitleData,
  songTitleData,
  linkToSongData,
  songImageData,
  originTextData,
  quoteTextData,
  quoteAuthorData,
  storyTextData,
  songTextData,
}) => {
  const [author, setAuthor] = useState(authorData);
  const [storyTitle, setStoryTitle] = useState(storyTitleData);

  const [songTitle, setSongTitle] = useState(songTitleData);
  const [searchQuery, setSearchQuery] = useState(songTitleData);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState([]);
  const [artistAlbums, setArtistAlbums] = useState([]);
  const [artistSongs, setArtistSongs] = useState([]);
  const [linkToSong, setLinkToSong] = useState(linkToSongData);

  const [songImage, setSongImage] = useState<File | null>(songImageData);
  const [originText, setOriginText] = useState(originTextData);
  const [quoteText, setQuoteText] = useState(quoteTextData);
  const [quoteAuthor, setQuoteAuthor] = useState(quoteAuthorData);
  const [storyText, setStoryText] = useState<string | undefined>(storyTextData);
  const [songText, setSongText] = useState<string | undefined>(songTextData);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setSongText(songTextData);
  }, []);

  async function getSong(res) {
    // setSongTitle(`${res.artist} - ${res.name}`);

    const lyricResult = await getLyrics(res.artist, res.name);
    setSongText(lyricResult || undefined);
  }

  const addItem = async (e) => {
    e.preventDefault();

    if (
      storyTitle === "" ||
      songTitle === "" ||
      storyText === "" ||
      songText === null ||
      isLoading
    )
      return;
    else {
      setIsSuccess(false);
      setIsLoading(true);
      try {
        const storyData = {
          author: author,
          storyTitle: storyTitle,
          songTitle: songTitle,
          quoteText: quoteText,
          quoteAuthor: quoteAuthor,
          originText: originText,
          storyText: storyText,
          songText: songText,
        };

        let imageUrl: string | null = null;

        console.log("songImage:", songImage);

        if (songImage) {
          const storageRef = ref(firebaseStorage, songImage.name);
          await uploadBytes(storageRef, songImage);
          imageUrl = await getDownloadURL(storageRef);
        }

        console.log("imageUrl:", imageUrl);

        const response = await submitStory(storyData, imageUrl);

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
        setQuoteText("");
        setQuoteAuthor("");
        setOriginText("");
        setStoryText(undefined);
        setSongText(undefined);
      } catch (e) {
        console.error("error: ", e);
      }
      setIsLoading(false);
      setIsSuccess(true);
    }
  };

  return (
    <div className="inputs__group">
      <TextInput
        type="text"
        name="story_author"
        label="Vul hier je naam in als de auteur van dit verhaal"
        placeholder="Auteur"
        onChange={(e) => setAuthor(e.target.value)}
        value={author}
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
      <div className="row">
        <SpotifySearch
          getSong={getSong}
          setSong={setSongTitle}
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
        />
        <TextInput
          type="text"
          name="link_to_song"
          label="Link naar het liedje (Spotify, Youtube oid)"
          placeholder="Link"
          onChange={(e) => setLinkToSong(e.target.value)}
          value={linkToSong}
          required
        />
      </div>
      <TextInput
        type="file"
        name="song_image"
        label="Afbeelding"
        onChange={(e) => setSongImage(e.target.files[0])}
        accept="image/png, image/jpeg"
      />
      <TextArea
        name="origin_text"
        label="Totstandkomming"
        placeholder="Totstandkomming"
        onChange={(e) => setOriginText(e.target.value)}
        value={originText}
        cols={30}
        rows={5}
      />
      <div className="row">
        <TextArea
          name="quote_text"
          label="Quote"
          placeholder="Verhaal"
          onChange={(e) => setQuoteText(e.target.value)}
          value={quoteText}
          cols={30}
          rows={5}
        />
        <TextInput
          type="text"
          name="quote_author"
          label="Quote auteur"
          placeholder="Auteur"
          onChange={(e) => setQuoteAuthor(e.target.value)}
          value={quoteAuthor}
        />
      </div>
      <Editor
        label="Verhaal tekst"
        onChange={(value) => setStoryText(value)}
        value={storyText}
        required
      />
      <Editor
        label="Songtekst"
        onChange={(value) => setSongText(value)}
        value={songText}
        required
      />
      <div className={lineStyle.line} />

      <Button
        variant={
          storyTitle === "" ||
          songTitle === "" ||
          storyText === "" ||
          songText === "" ||
          isLoading
            ? "disabled"
            : "secondary"
        }
        style={{ width: "100%" }}
        // onClick={addItem}
      >
        Aanpassingen opslaan
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
        {isLoading && (
          <Paragraph variant="sm">
            Een moment, je verhaal wordt opgestuurd
          </Paragraph>
        )}
        {isSuccess && (
          <>
            <Paragraph variant="sm">Verhaal bewerken is gelukt</Paragraph>
            <Button
              onClick={(e) => {
                e.preventDefault(), router.push("/admin/review");
              }}
              style={{ width: "100%" }}
              variant="secondary"
            >
              Terug naar ingezonden verhalen
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default FormAdmin;