"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star, Search, Filter, ArrowUpDown } from "lucide-react";

// Mock Data
const initialReviews = [
  {
    id: "REV-001",
    reviewer: "Alice Johnson",
    rating: 5,
    source: "Google",
    date: "2023-10-25",
    content: "Absolutely love this service! Highly recommended.",
    status: "Replied",
  },
  {
    id: "REV-002",
    reviewer: "Mark Smith",
    rating: 4,
    source: "Yelp",
    date: "2023-10-24",
    content: "Great food, but service was a bit slow.",
    status: "Pending",
  },
  {
    id: "REV-003",
    reviewer: "Sarah Williams",
    rating: 5,
    source: "Google",
    date: "2023-10-23",
    content: "Best experience I've had in a long time.",
    status: "Replied",
  },
  {
    id: "REV-004",
    reviewer: "James Brown",
    rating: 2,
    source: "Facebook",
    date: "2023-10-22",
    content: "Not what I expected. Disappointed.",
    status: "Pending",
  },
  {
    id: "REV-005",
    reviewer: "Emily Davis",
    rating: 5,
    source: "Google",
    date: "2023-10-21",
    content: "Quick and easy process.",
    status: "Replied",
  },
  {
    id: "REV-006",
    reviewer: "Michael Wilson",
    rating: 1,
    source: "Yelp",
    date: "2023-10-20",
    content: "Terrible experience. Will not return.",
    status: "Pending",
  },
  {
    id: "REV-007",
    reviewer: "Jessica Taylor",
    rating: 3,
    source: "Google",
    date: "2023-10-19",
    content: "It was okay, nothing special.",
    status: "Replied",
  },
];

export function ReviewsTable() {
  const [reviews, setReviews] = useState(initialReviews);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Reply Modal State
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<(typeof initialReviews)[0] | null>(null);
  const [replyText, setReplyText] = useState("");

  // Filter Logic
  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.reviewer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || review.status.toLowerCase() === statusFilter;
    const matchesRating = ratingFilter === "all" || review.rating.toString() === ratingFilter;

    return matchesSearch && matchesStatus && matchesRating;
  });

  // Sort Logic (Date)
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  const toggleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  const handleOpenReply = (review: (typeof initialReviews)[0]) => {
    setSelectedReview(review);
    setReplyText("");
    setIsReplyOpen(true);
  };

  const handleSendReply = () => {
    if (!selectedReview) return;

    // Mock API Call - Update local state
    const updatedReviews = reviews.map((r) =>
      r.id === selectedReview.id ? { ...r, status: "Replied" } : r,
    );

    setReviews(updatedReviews);
    setIsReplyOpen(false);
    // You would typically show a toast notification here
    alert(`Reply sent to ${selectedReview.reviewer}!`);
  };

  return (
    <div className="space-y-4">
      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 rounded-lg border">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reviews..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="replied">Replied</SelectItem>
            </SelectContent>
          </Select>

          <Select value={ratingFilter} onValueChange={setRatingFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Source</TableHead>
              <TableHead>Reviewer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Content</TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={toggleSort}>
                <div className="flex items-center">
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedReviews.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No reviews found.
                </TableCell>
              </TableRow>
            ) : (
              sortedReviews.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="font-medium">
                    <Badge variant="outline" className="bg-slate-50">
                      {review.source}
                    </Badge>
                  </TableCell>
                  <TableCell>{review.reviewer}</TableCell>
                  <TableCell>
                    <div className="flex items-center text-amber-500">
                      <span className="font-bold mr-1">{review.rating}</span>
                      <Star className="h-3 w-3 fill-current" />
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate text-muted-foreground">
                    {review.content}
                  </TableCell>
                  <TableCell>{review.date}</TableCell>
                  <TableCell>
                    <Badge
                      variant={review.status === "Replied" ? "success" : "warning"}
                      className="font-normal"
                    >
                      {review.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {review.status === "Pending" && (
                      <Button variant="ghost" size="sm" onClick={() => handleOpenReply(review)}>
                        Reply
                      </Button>
                    )}
                    {review.status === "Replied" && (
                      <Button variant="ghost" size="sm" disabled className="text-muted-foreground">
                        Replied
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Reply Modal */}
      <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Reply to Review</DialogTitle>
            <DialogDescription>
              Response to <strong>{selectedReview?.reviewer}</strong> on {selectedReview?.source}.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="p-4 bg-muted/50 rounded-md text-sm italic border">
              "{selectedReview?.content}"
            </div>
            <div className="space-y-2">
              <label htmlFor="reply" className="text-sm font-medium">
                Your Response
              </label>
              <Textarea
                id="reply"
                placeholder="Type your reply here..."
                className="min-h-[150px]"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReplyOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendReply} disabled={!replyText.trim()}>
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
