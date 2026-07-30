import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_ITEMS } from "@/features/marketing/faq-data";

export function Faq() {
  return (
    <section id="faq" className="relative scroll-mt-24 py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="FAQ"
          title={
            <>
              Questions, <span className="text-gradient">answered.</span>
            </>
          }
          description="Everything creators ask before setting up their page."
        />

        <Reveal className="mt-12" delay={0.1}>
          <Accordion type="single" collapsible className="flex flex-col gap-3">
            {FAQ_ITEMS.map((item, index) => (
              <AccordionItem key={item.question} value={`item-${index}`}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
