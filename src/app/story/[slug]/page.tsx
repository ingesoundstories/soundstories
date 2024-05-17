// "use client";
import React from "react";

import Image from "next/image";

import styles from "../page.module.scss";

import { stories } from "../../../example-stories";

import MainLayout from "../../../components/main-layout/main-layout";
import PlayButtonSvg from "../../../components/svg/PlayButtonSvg";
import PageTitle from "../../../components/page-title/page-title";
import Paragraph from "../../../components/typography/paragraph";
import Heading from "../../../components/typography/heading";
import LinkButton from "../../../components/link-button/link-button";
import { fetchVerhalen } from "../../utils";

export default async function Story({ params }: { params: { slug: string } }) {
  // const slug = parseInt(params.slug);
  const slug = params.slug;
  const verhalen = await fetchVerhalen();
  // const story = stories.find((story) => story.id === slug);
  const story = verhalen?.find((story) => story.id === slug);
  const date = new Date(Number(story?.createdAt)).toLocaleString("en-US");
  console.log(date);

  console.log(story)

  return (
    <>
      <MainLayout>
        <PageTitle
          title={
            story?.storyTitle ? story.storyTitle : "Titel niet beschikbaar"
          }
          songTitle={story?.song ? `${story?.song.name} - ${story?.song.artist}` : story?.songTitle}
          paddingBottom={true}
          storyPage={true}
        />
        <div className={styles.story__content}>
          <div className={styles.story__story}>
            <div className={styles.story__titleMobile}>
              <Heading>{story?.storyTitle}</Heading>
            </div>
            <div
              dangerouslySetInnerHTML={{
                __html: story?.storyText
                  ? story?.storyText
                  : "Tekst niet beschikbaar",
              }}
            />
          </div>
          <div className={styles.story__information}>
            <div className={styles.story__origin}>
              {story?.originText && <Paragraph>{story?.originText}</Paragraph>}
              <div className={styles.story__author}>
                <Paragraph>Verhaal geschreven door {story?.author}</Paragraph>

                <Paragraph>Gepubliceerd op 25 maart, 2024</Paragraph>
              </div>
            </div>
            {story?.linkToSong || story?.song ? (
              <div className={styles.story__spotifyPlayer}>
                <span>
                  <Image
                    src={story?.linkToSong ? story?.linkToSong : story?.song.albumImage}
                    alt={"album cover"}
                    fill
                  />
                  <span />
                  <PlayButtonSvg />
                </span>
              </div>
            ) : ''}
          </div>
        </div>
      </MainLayout>
      <div className={styles.story__lyricsWrapper}>
        <MainLayout>
          <div>
            <Paragraph variant="md">
              Songtekst van &apos;{story?.song ? story?.song.name : story?.songTitle }&apos;
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
          <LinkButton href={`/story/${slug + 1}`} buttonVariant="secondary">
            Lees nog een verhaal
          </LinkButton>
          <Paragraph>Of</Paragraph>
          <LinkButton href="/write" buttonVariant="secondary">
            Schrijf er zelf een
          </LinkButton>
        </div>
      </MainLayout>
    </>
  );
}
