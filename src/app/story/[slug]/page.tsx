// "use client";
import React from "react";

import Image from "next/image";

import { fetchVerhalen } from "../../../utils";
import { formatDate } from "../../../utils";

import styles from "../page.module.scss";

import MainLayout from "../../../components/main-layout/main-layout";
import PlayButtonSvg from "../../../components/svg/PlayButtonSvg";
import PageTitle from "../../../components/page-title/page-title";
import Paragraph from "../../../components/typography/paragraph";
import Heading from "../../../components/typography/heading";
import LinkButton from "../../../components/link-button/link-button";

export default async function Story({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  const verhalen = await fetchVerhalen();
  const story = verhalen?.find((story) => story.id === slug);

  const verhalenIds = verhalen?.map((story) => story.id) || [];
  const randomId = verhalenIds[Math.floor(Math.random() * verhalenIds.length)];

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

                <Paragraph>
                  Gepubliceerd op{" "}
                  {story?.createdAt
                    ? formatDate(story.createdAt)
                    : "Niet beschikbaar"}
                </Paragraph>
              </div>
            </div>
            {story?.songImage || story?.song ? (
              <div className={styles.story__spotifyPlayer}>
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
              </div>
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
        </div>
      </MainLayout>
    </>
  );
}
