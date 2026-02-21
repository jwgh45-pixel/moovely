import { Metadata } from "next";
import ExploreClient from "./ExploreClient";

export const metadata: Metadata = {
  title: "Explore - Where Would You Be Better Off? | Moovely",
  description:
    "Pick where you live and see every UK location ranked by how much better or worse off you'd be. Find your greener pasture.",
  openGraph: {
    title: "Where Would You Be Better Off? | Moovely",
    description:
      "See every UK location ranked by real disposable income. Find out where your money goes furthest.",
  },
};

export default function ExplorePage() {
  return <ExploreClient />;
}
