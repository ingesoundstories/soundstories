"use client"
import React, {useEffect} from "react";

import Link from "next/link";

import styles from "./page.module.scss";

import {useState} from "react";
import { stories } from "../example-stories";
import {Verhaal} from "./utils";

import MainLayout from "../components/main-layout/main-layout";
import Pagination from "../components/pagination/pagination";
import PageTitle from "../components/page-title/page-title";
import StoryCard from "../components/story-card/story-card";
import Hero from "../components/hero/hero";

export default function Home() {
    const [stories, setStories] = useState<Verhaal[]>([]);

    useEffect(() => {
        fetch("https://verhalenwebsite.vercel.app/api", {
            method: "GET",
        }).then(res => res.json())
            .then(data => setStories(data.body))
    }, [])

  return (
    <>
      <Hero />
      <MainLayout>
        <PageTitle noTopPadding title="Recente verhalen" />
        <div className={styles.cards__container}>
          {stories?.map((story, index) => (
            <StoryCard
              key={index}
              id={story.id}
              title={story.storyTitle}
              image={story.songImage}
              text={story.storyText}
              author={story.author}
              songName={story.songTitle}
            />
          ))}
          {/*{stories.map((story, index) => (*/}
          {/*  <StoryCard*/}
          {/*    key={index}*/}
          {/*    id={story.id}*/}
          {/*    title={story.title}*/}
          {/*    image={story.image}*/}
          {/*    text={story.text}*/}
          {/*    author={story.author}*/}
          {/*    songName={story.songName}*/}
          {/*  />*/}
          {/*))}*/}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <Link href={`/stories/${2}`}>
            <Pagination disabled={true} maxIndex={3} />
          </Link>
        </div>
      </MainLayout>
    </>
  );
}
