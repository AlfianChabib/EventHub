import React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProfileUser, Ticket } from '@/services/client';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import axios from 'axios';

interface Props {
  sessionCookie?: string | undefined;
  profileUser?: ProfileUser | null;
  ticket?: Ticket | null;
  isEnded?: boolean;
}

interface Review {
  review: string;
  rating: string;
}

export default function TicketCard(props: Props) {
  const { sessionCookie, profileUser, ticket, isEnded } = props;

  const [review, setReview] = React.useState<Review>({
    review: '',
    rating: '',
  });

  const [reviewPosted, setReviewPosted] = React.useState<boolean>(false);
  const [reviewResponse, setReviewResponse] = React.useState<string>('');

  const postReview = async () => {
    try {
      axios.defaults.withCredentials = true;
      await axios
        .post(
          'http://localhost:8000/api/event/review',
          {
            review: review.review,
            rating: parseInt(review.rating),
            eventId: ticket?.eventId,
            ticketId: ticket?.id,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${sessionCookie}`,
            },
          },
        )
        .then((res) => {
          setReviewPosted(true);
          setReviewResponse(res.data.message);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.log(error);
    }
  };

  if (!ticket) {
    return null;
  }

  const eventDate = new Date(ticket.eventDate).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const eventTime = new Date(ticket.eventDate).toLocaleTimeString('id-ID', {
    hour: 'numeric',
    minute: 'numeric',
  });

  return (
    <div>
      <Card className="p-2">
        <CardHeader className="p-2">
          <CardTitle>{ticket.eventTitle}</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="flex flex-row items-center justify-between space-y-0 p-2">
          <p className="text-sm font-medium">{eventDate}</p>
          <p className="text-sm font-medium">{eventTime}</p>
        </CardContent>
        {isEnded && (
          <>
            <Separator />
            <CardFooter className="p-2">
              <div className="flex w-full items-center justify-between">
                <p>Event ended</p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Review</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Post Review</DialogTitle>
                      <DialogDescription>
                        Review your experience with this event
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                          Rating
                        </Label>
                        <Input
                          id="name"
                          type="number"
                          min={1}
                          max={5}
                          placeholder="Rating"
                          className="col-span-3"
                          onChange={(e) =>
                            setReview({ ...review, rating: e.target.value })
                          }
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                          Review
                        </Label>
                        <Input
                          id="username"
                          type="text"
                          placeholder="Review!"
                          className="col-span-3"
                          onChange={(e) =>
                            setReview({ ...review, review: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" onClick={postReview}>
                        Post Review
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
