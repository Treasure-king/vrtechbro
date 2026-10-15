import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export type FaqGroup = {
  topic: string
  items: { q: string; a: string }[]
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-')

/** FAQ topics: topic name on the left, its questions as an accordion on the right. */
export function FaqGroups({ groups }: { groups: FaqGroup[] }) {
  return (
    <div className="divide-y divide-border-subtle border-y border-border-subtle">
      {groups.map((group) => {
        const id = `faq-${slug(group.topic)}`
        return (
          <section key={group.topic} aria-labelledby={id} className="grid gap-4 py-10 lg:grid-cols-12 lg:gap-16">
            <h2
              id={id}
              className="font-display text-xl font-semibold tracking-tight text-text-primary lg:col-span-4 lg:pt-5"
            >
              {group.topic}
            </h2>
            <Accordion type="multiple" className="lg:col-span-8">
              {group.items.map((item, i) => (
                <AccordionItem key={item.q} value={`${id}-${i}`} className="border-border-subtle">
                  <AccordionTrigger className="cursor-pointer py-5 font-display text-lg font-medium text-text-primary hover:text-accent-hover hover:no-underline focus-visible:ring-accent-primary/50 [&>svg]:text-text-muted">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="max-w-prose pb-6 text-base leading-relaxed text-text-secondary">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )
      })}
    </div>
  )
}
