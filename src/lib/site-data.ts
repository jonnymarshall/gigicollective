import siteJson from '../data/site.json';
import homeJson from '../data/home.json';

/**
 * The JSON files are edited through the CMS, so their contents change shape as
 * lists are filled and emptied. TypeScript infers an empty list as `never[]`,
 * which then makes any use of it an error. Declaring the types here keeps the
 * rest of the site working no matter what the files currently hold.
 */

export interface SocialLink {
  label: string;
  url: string;
}

export interface Site {
  title: string;
  tagline: string;
  description: string;
  email: string;
  showBlog: boolean;
  showWork: boolean;
  footerText: string;
  social: SocialLink[];
}

export interface HomeSection {
  heading: string;
  text?: string;
  image?: string;
  linkLabel?: string;
  linkUrl?: string;
}

export interface Home {
  heroEyebrow?: string;
  heroHeading: string;
  heroSubheading?: string;
  heroImage?: string;
  ctaLabel?: string;
  ctaUrl?: string;

  introEyebrow?: string;
  introHeading?: string;
  introText?: string;
  introImage?: string;
  introLinkLabel?: string;
  introLinkUrl?: string;

  sections: HomeSection[];

  showLatestPosts: boolean;
  latestPostsHeading: string;
  latestPostsEyebrow?: string;
  showFeaturedWork: boolean;
  featuredWorkHeading: string;
  featuredWorkEyebrow?: string;

  closingEyebrow?: string;
  closingHeading?: string;
  closingText?: string;
  closingButtonLabel?: string;
  closingButtonUrl?: string;
  closingImage?: string;
}

export const site = siteJson as Site;
export const home = homeJson as Home;
