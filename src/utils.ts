import { StaticImport } from "next/dist/shared/lib/get-img-props";

export interface Verhaal {
    id: string;
    name: string;
    storyTitle: string;
    storyText: string | TrustedHTML;
    author: string;
    song: {
        album: string;
        albumImage: string | StaticImport;
        artist: string;
        id: string;
        name: string;
        type: string;
    };
    songTitle: string;
    songText: string | TrustedHTML;
    songImage?: string | StaticImport;
    songOrigin: string;
    linkToSong: string | StaticImport;
    quoteAuthor: string;
    quoteText: string;
    originText: string;
    number: number;
    underReview: boolean;
    createdAt: {
        seconds: number,
        nanoseconds: number
    };
}

export function formatDate(createdAt: {
    seconds: number;
    nanoseconds: number;
}): string {
    const date = new Date(createdAt.seconds * 1000);
    const options: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "short",
        year: "numeric",
    };
    return date.toLocaleDateString("nl-NL", options);
}

export const sortStories = (stories, underReview) => {
    return stories?.sort((a, b) => {
        const dateA = new Date(
            a.createdAt.seconds * 1000 + a.createdAt.nanoseconds / 1000000
        ).getTime();
        const dateB = new Date(
            b.createdAt.seconds * 1000 + b.createdAt.nanoseconds / 1000000
        ).getTime();
        return dateB - dateA;
    }).filter((item) => item.underReview === underReview)
}