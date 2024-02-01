import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export default function FAQ() {
  return (
    <div className="w-full p-4 border rounded-md">
      <h1 className="text-3xl font-semibold text-center flex items-center justify-center my-10">
        Frequently Asked Questions (FAQ)
      </h1>
      <div className="w-full p-4 border rounded-md">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>1. What is EventHub?</AccordionTrigger>
            <AccordionContent>
              EventHub is a comprehensive platform designed to facilitate the
              buying and selling of event tickets. Whether you&apos;re an event
              organizer looking to manage your event or an attendee searching
              for exciting gatherings, EventHub provides a user-friendly
              solution for all your event needs.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              2. How do I create an account on EventHub?
            </AccordionTrigger>
            <AccordionContent>
              Creating an account on EventHub is easy! Simply click on the Sign
              Up button on the homepage, fill in the required information, and
              you&apos;ll be ready to explore and use our platform.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              3. How can I sell tickets for my event on EventHub?
            </AccordionTrigger>
            <AccordionContent>
              Event organizers can easily create and manage events by logging
              into their accounts, navigating to the Create Event section, and
              following the step-by-step process. Set ticket prices, provide
              event details, and promote your event to reach a wider audience.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>
              4. Is it safe to buy tickets on EventHub?
            </AccordionTrigger>
            <AccordionContent>
              Absolutely! EventHub prioritizes the security of transactions and
              personal information. We use advanced security measures to ensure
              a safe and secure environment for buying and selling tickets.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-5">
            <AccordionTrigger>
              5. How can I purchase tickets for an event?
            </AccordionTrigger>
            <AccordionContent>
              To purchase tickets, simply browse through the listed events on
              EventHub, select the event you&apos;re interested in, choose the
              desired number of tickets, and proceed to checkout. Our secure
              payment gateway ensures a smooth and protected transaction
              process.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-6">
            <AccordionTrigger>
              7. What types of events are featured on EventHub?
            </AccordionTrigger>
            <AccordionContent>
              EventHub caters to a diverse range of events, including but not
              limited to music concerts, conferences, sports events, and
              community gatherings. Explore our platform to discover a variety
              of exciting events in your area.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-7">
            <AccordionTrigger>
              8. How do I contact EventHub support?
            </AccordionTrigger>
            <AccordionContent>
              If you have any questions or encounter issues while using
              EventHub, you can reach out to our support team through the
              Contact Us page on the website. We are here to assist you and
              ensure you have a positive experience on our platform.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-8">
            <AccordionTrigger>
              9. Can I transfer my purchased tickets to someone else?
            </AccordionTrigger>
            <AccordionContent>
              Ticket transferability depends on the event organizer&apos;s
              policy. Check the event details or contact the organizer directly
              for information on ticket transfer options.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-9">
            <AccordionTrigger>
              10. How can I stay updated on upcoming events?
            </AccordionTrigger>
            <AccordionContent>
              Stay informed about upcoming events by following EventHub on
              social media and subscribing to our newsletter. You&apos;ll
              receive regular updates on the latest events, promotions, and
              community news.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      {/* <br />
      <p>
        If you have any additional questions or concerns, feel free to reach out
        to our support team. We&apos;re here to make your EventHub experience
        enjoyable and hassle-free!
      </p> */}
    </div>
  );
}
