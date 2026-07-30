import type { Metadata } from "next";

import { ContentPage } from "@/components/shared/content-page";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the BuyMeAGoddie team.",
};

export default function ContactPage() {
  return (
    <ContentPage title="Contact">
      <p>We read everything. Pick the channel that suits you:</p>
      <ul>
        <li>
          <strong>Support:</strong> support@buymeagoddie.com
        </li>
        <li>
          <strong>Security reports:</strong> security@buymeagoddie.com
        </li>
        <li>
          <strong>Twitter/X:</strong>{" "}
          <a
            href={siteConfig.links.twitter}
            className="text-primary underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            @buymeagoddie
          </a>
        </li>
        <li>
          <strong>GitHub:</strong>{" "}
          <a
            href={siteConfig.links.github}
            className="text-primary underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/buymeagoddie
          </a>
        </li>
      </ul>
    </ContentPage>
  );
}
