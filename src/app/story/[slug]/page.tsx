"use client";
import React, { useEffect, useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Verhaal } from "../../../utils";
import { useAuth } from "../../../auth-context";
import { deleteStory } from "../../actions";
import { disApproveStory } from "../../actions";

import styles from "../page.module.scss";

import Button from "../../../components/button";
import MainLayout from "../../../components/main-layout/main-layout";
import PlayButtonSvg from "../../../components/svg/PlayButtonSvg";
import PageTitle from "../../../components/page-title/page-title";
import Paragraph from "../../../components/typography/paragraph";
import Heading from "../../../components/typography/heading";
import LinkButton from "../../../components/link-button/link-button";
import { useStories } from "../../../components/posts-provider/postsProvider";
import { getFileExtensionFromUrl } from "../../../utils";

export default function Story({ params }: { params: { slug: string } }) {
  const { reviewedStories } = useStories();
  const [story, setStory] = useState<Verhaal>();

  const { state } = useAuth();
  const router = useRouter();

  const monthsArray = [
    "januari",
    "februari",
    "maart",
    "april",
    "mei",
    "juni",
    "juli",
    "augustus",
    "september",
    "october",
    "november",
    "december",
  ];

  let date: string = "";

  const slug = params.slug;

  useEffect(() => {
    if (reviewedStories) {
      setStory(reviewedStories.find((item) => item.id === slug));
    }
  }, [reviewedStories]);

  const verhalenIds = reviewedStories?.map((story) => story.id) || [];
  const randomId = verhalenIds[Math.floor(Math.random() * verhalenIds.length)];

  if (story) {
    const jsUnixTS =
      (story.createdAt.seconds + story.createdAt.nanoseconds * 10 ** -9) * 1000;
    const fullDate = new Date(jsUnixTS);

    date = `${fullDate.getDate()} ${
      monthsArray[fullDate.getMonth()]
    }, ${fullDate.getFullYear()}`;
  }

  const fileUrl = story?.storyFileUrl;
  const fileExtension = getFileExtensionFromUrl(fileUrl);
  const allowedExtensions = ["pdf", "readme", "txt"];
  const isAllowedFileType = allowedExtensions.includes(fileExtension);

  const handleDeleteStory = async () => {
    await deleteStory(story);
    router.push("/");
  };

  const handleDisapproveStory = async () => {
    await disApproveStory(story);
    router.push("/");
  };

  return (
    <>
      <MainLayout>
        <PageTitle
          title={
            story?.storyTitle ? story.storyTitle : "Titel niet beschikbaar"
          }
          songTitle={
            story?.song
              ? `${story?.song.name} - ${story?.song.artist}`
              : story?.songTitle
          }
          paddingBottom={true}
          storyPage={true}
        />
        <div className={styles.story__content}>
          <div className={styles.story__story}>
            <div className={styles.story__titleMobile}>
              <Heading>{story?.storyTitle}</Heading>
            </div>
            {story?.storyText ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: story?.storyText
                    ? story?.storyText
                    : "Aan het laden...",
                }}
              />
            ) : (
              <>
                <Paragraph variant="sm">
                  De schrijver van dit verhaal heeft ervoor gekozen om het
                  verhaal in een bestand in te dienen.
                </Paragraph>
                {story?.storyFileUrl && isAllowedFileType && (
                  <iframe
                    src={`${story.storyFileUrl}#toolbar=0`}
                    style={{ width: "100%", height: "100vh", marginTop: 8 }}
                  />
                )}
                <Button
                  onClick={() => {
                    window.open(story?.storyFileUrl, "_blank");
                  }}
                  variant="underlined"
                  style={{ paddingTop: 10 }}
                >
                  Open verhaal
                </Button>
              </>
            )}
          </div>
          <div className={styles.story__information}>
            <div className={styles.story__origin}>
              {story?.originText && <Paragraph>{story?.originText}</Paragraph>}
              <div className={styles.story__author}>
                <Paragraph>Verhaal geschreven door <b>{story?.author}</b></Paragraph>

                <Paragraph>
                  Gepubliceerd op {date ? date : "Niet beschikbaar"}
                </Paragraph>
              </div>
            </div>
            {story?.songImage || story?.song ? (
              <a
                target="_blank"
                rel="noreferrer noopener"
                href={story.song.url ? story.song.url : `https://${story?.linkToSong}`}
                className={styles.story__spotifyPlayer}
              >
                <span>
                  <Image
                    src={
                      story?.songImage
                        ? story?.songImage
                        : story?.song.albumImage
                    }
                    alt={"album cover"}
                    fill
                  />
                  <span />
                  <PlayButtonSvg />
                </span>
              </a>
            ) : (
              ""
            )}
          </div>
        </div>
      </MainLayout>
      <div className={styles.story__lyricsWrapper}>
        <MainLayout>
          <div>
            <Paragraph variant="md">
              Songtekst van &apos;
              {story?.song ? story?.song.name : story?.songTitle}&apos;
            </Paragraph>
            <div
              dangerouslySetInnerHTML={{
                __html: story?.songText
                  ? story?.songText
                  : "Songtekst niet beschikbaar",
              }}
              className={styles.story__lyrics}
            />
          </div>
        </MainLayout>
      </div>
      <MainLayout>
        <div className={styles.story__buttons}>
          <LinkButton href={`/story/${randomId}`} buttonVariant="secondary">
            Lees nog een verhaal
          </LinkButton>
          <Paragraph>Of</Paragraph>
          <LinkButton href="/write" buttonVariant="secondary">
            Schrijf er zelf een
          </LinkButton>
          {state.isUserAuthenticated === true && (
            <>
              <Paragraph>Of</Paragraph>
              <Button onClick={() => handleDeleteStory()} variant="warning">
                Verhaal verwijderen
              </Button>
              <Paragraph>Of</Paragraph>
              <Button onClick={() => handleDisapproveStory()} variant="warning">
                Verhaal afkeuren
              </Button>
            </>
          )}
        </div>
      </MainLayout>
    </>
  );
}
