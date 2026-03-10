// ============================================================
// MOCK DATA STORE — localStorage backed
// ============================================================

export type Role = "admin" | "merchant" | "demo";

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: Role;
  businessId?: string;
  locationId?: string;
  createdAt: string;
}

export interface Business {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  phone: string;
  website: string;
  address: string;
  logo: string;
  ownerId: string;
  status: "active" | "suspended";
  createdAt: string;
}

export interface Location {
  id: string;
  businessId: string;
  name: string;
  address: string;
  createdAt: string;
}

export interface Competitor {
  id: string;
  businessId: string;
  name: string;
  currentRating: number;
  totalReviews: number;
}

export interface Review {
  id: string;
  businessId: string;
  source: string; // "Google", "TripAdvisor", "Expedia", "Booking"
  customerName: string;
  customerEmail?: string;
  rating: number;
  text: string;
  reply?: string;
  repliedAt?: string;
  repliedBy?: string;
  status: "pending" | "replied" | "flagged" | "archived";
  sentiment?: "positive" | "neutral" | "negative";
  keywords?: string[];
  isUrgent?: boolean;
  assignedTo?: string; // user ID
  locationId?: string;
  createdAt: string;
}

export interface IssueTask {
  id: string;
  businessId: string;
  reviewId?: string;
  assignedToUserId?: string;
  department: "housekeeping" | "front_desk" | "maintenance" | "management";
  issueType: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  roomNumber?: string;
  dueDate?: string;
  resolutionNote?: string;
  locationId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Alert {
  id: string;
  businessId: string;
  reviewId?: string;
  alertType: string; // e.g. "1-star review", "keyword match"
  severity: "low" | "medium" | "high" | "critical";
  status: "active" | "acknowledged" | "resolved";
  message: string;
  locationId?: string;
  createdAt: string;
}

export interface ReviewRequestCampaign {
  id: string;
  businessId: string;
  name: string;
  channel: "email" | "sms" | "qr";
  templateSubject?: string;
  templateBody: string;
  sendDelayHours: number;
  isActive: boolean;
  locationId?: string;
  createdAt: string;
}

// ============================================================
// SEED DATA
// ============================================================

const SEED_BUSINESSES: Business[] = [
  {
    id: "biz-001",
    slug: "the-stellar-bistro",
    name: "The Stellar Bistro",
    category: "Restaurant",
    description: "A contemporary American bistro known for farm-to-table cuisine and an exceptional wine list.",
    phone: "(312) 555-0101",
    website: "https://stellarbistro.com",
    address: "123 N Michigan Ave, Chicago, IL 60601",
    logo: "🍽️",
    ownerId: "user-demo",
    status: "active",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "biz-002",
    slug: "city-liquor-emporium",
    name: "City Liquor Emporium",
    category: "Liquor Store",
    description: "Chicago's finest selection of wines, spirits, and craft beers.",
    phone: "(312) 555-0202",
    website: "https://cityliquor.com",
    address: "456 W Lake St, Chicago, IL 60606",
    logo: "🍷",
    ownerId: "user-merch-002",
    status: "active",
    createdAt: "2024-02-01T10:00:00Z",
  },
  {
    id: "biz-003",
    slug: "bloom-wellness-clinic",
    name: "Bloom Wellness Clinic",
    category: "Clinic",
    description: "Holistic wellness center offering chiropractic, acupuncture, and massage therapy.",
    phone: "(312) 555-0303",
    website: "https://bloomwellness.com",
    address: "789 S Wabash Ave, Chicago, IL 60605",
    logo: "🌸",
    ownerId: "user-merch-003",
    status: "active",
    createdAt: "2024-02-15T10:00:00Z",
  },
  {
    id: "biz-004",
    slug: "nova-retail-co",
    name: "Nova Retail Co.",
    category: "Retail",
    description: "Modern lifestyle retail store featuring curated home goods and fashion accessories.",
    phone: "(312) 555-0404",
    website: "https://novaretail.com",
    address: "321 N Clark St, Chicago, IL 60654",
    logo: "🛍️",
    ownerId: "user-merch-004",
    status: "suspended",
    createdAt: "2024-03-01T10:00:00Z",
  },
];

const SEED_LOCATIONS: Location[] = [
  { id: "loc-001", businessId: "biz-001", name: "Downtown Chicago", address: "123 N Michigan Ave, Chicago, IL 60601", createdAt: "2024-01-15T10:00:00Z" },
  { id: "loc-002", businessId: "biz-001", name: "O'Hare Airport", address: "10000 W O'Hare Ave, Chicago, IL 60666", createdAt: "2024-06-15T10:00:00Z" },
  { id: "loc-003", businessId: "biz-002", name: "Main Store", address: "456 W Lake St, Chicago, IL 60606", createdAt: "2024-02-01T10:00:00Z" },
  { id: "loc-004", businessId: "biz-003", name: "South Loop", address: "789 S Wabash Ave, Chicago, IL 60605", createdAt: "2024-02-15T10:00:00Z" },
  { id: "loc-005", businessId: "biz-004", name: "River North", address: "321 N Clark St, Chicago, IL 60654", createdAt: "2024-03-01T10:00:00Z" },
];

const SEED_COMPETITORS: Competitor[] = [
  { id: "comp-001", businessId: "biz-001", name: "Le Palmer House", currentRating: 4.4, totalReviews: 1205 },
  { id: "comp-002", businessId: "biz-001", name: "Magnificent Mile Suites", currentRating: 4.2, totalReviews: 890 },
  { id: "comp-003", businessId: "biz-001", name: "Downtown Lodge", currentRating: 3.8, totalReviews: 450 },
  // Just seed for biz-001 for now to demonstrate
];

const generateReviews = (): Review[] => {
  type SeedReview = Omit<Review, "id" | "source" | "isUrgent" | "assignedTo">;
  const bistroReviews: SeedReview[] = [
    { businessId: "biz-001", customerName: "Sarah M.", customerEmail: "sarah@email.com", rating: 5, text: "Absolutely incredible experience! The farm-to-table concept really shines here. Every dish was perfectly crafted and the wine pairing suggestions were spot on. The ambiance is stunning — will definitely be coming back!", reply: "Thank you so much, Sarah! We're thrilled you enjoyed the experience. Our chef puts so much love into every dish. We can't wait to welcome you back!", repliedAt: "2025-01-16T09:00:00Z", repliedBy: "Owner", status: "replied", sentiment: "positive", keywords: ["incredible", "farm-to-table", "wine", "ambiance"], createdAt: "2025-01-15T18:30:00Z" },
    { businessId: "biz-001", customerName: "James K.", rating: 5, text: "Best restaurant in Chicago, hands down. The truffle risotto is life-changing. Service was attentive but not intrusive. The entire evening felt like a 5-star hotel experience.", status: "pending", sentiment: "positive", keywords: ["best", "truffle risotto", "service", "5-star"], createdAt: "2025-01-20T20:15:00Z" },
    { businessId: "biz-001", customerName: "Emily R.", rating: 4, text: "Beautiful restaurant with excellent food. The scallops were divine. Only thing was our reservation was a bit delayed, but the staff handled it graciously with complimentary appetizers. Would return.", reply: "Thank you Emily! We sincerely apologize for the wait — your grace meant the world to us. Those scallops are a staff favorite too!", repliedAt: "2025-01-22T11:00:00Z", repliedBy: "Owner", status: "replied", sentiment: "positive", keywords: ["beautiful", "scallops", "reservation", "appetizers"], createdAt: "2025-01-22T19:00:00Z" },
    { businessId: "biz-001", customerName: "Mike T.", rating: 3, text: "Food was great but a bit overpriced for the portion sizes. The cocktails were exceptional though. Might come back for drinks and appetizers rather than a full dinner.", status: "pending", sentiment: "neutral", keywords: ["overpriced", "portions", "cocktails", "exceptional"], createdAt: "2025-01-25T21:00:00Z" },
    { businessId: "biz-001", customerName: "Lisa P.", rating: 5, text: "Celebrated our anniversary here and it was magical! The staff went above and beyond — they decorated our table and brought a complimentary dessert. Truly unforgettable.", reply: "Happy Anniversary, Lisa! We loved celebrating with you. It's moments like these that make our work so meaningful ❤️", repliedAt: "2025-02-01T10:00:00Z", repliedBy: "Owner", status: "replied", sentiment: "positive", keywords: ["anniversary", "magical", "staff", "dessert"], createdAt: "2025-01-31T19:30:00Z" },
    { businessId: "biz-001", customerName: "David L.", rating: 2, text: "Disappointed with my last visit. The pasta was overcooked and when I mentioned it, the waiter was dismissive. For these prices I expected much better service.", status: "pending", sentiment: "negative", keywords: ["disappointed", "overcooked", "dismissive", "prices"], createdAt: "2025-02-05T20:00:00Z" },
    { businessId: "biz-001", customerName: "Anna W.", rating: 5, text: "Everything about this place is perfection. From the moment you walk in, the attention to detail is evident. The sommelier's recommendations were exceptional. A true gem in Chicago's dining scene.", status: "pending", sentiment: "positive", keywords: ["perfection", "sommelier", "detail", "gem"], createdAt: "2025-02-10T18:45:00Z" },
    { businessId: "biz-001", customerName: "Tom B.", rating: 4, text: "Lovely dinner experience. The ribeye was cooked to perfection. Service was excellent and the atmosphere is romantic. Great for date nights. The noise level could be a bit lower though.", status: "pending", sentiment: "positive", keywords: ["ribeye", "service", "romantic", "atmosphere"], createdAt: "2025-02-14T20:00:00Z" },
    { businessId: "biz-001", customerName: "Rachel S.", rating: 5, text: "Came here for a business dinner and was blown away. The private dining room was perfect, food was outstanding, and the service was impeccable. Definitely using this for future client meetings.", reply: "Thank you Rachel! We love hosting business events. Please ask about our private dining packages for future meetings!", repliedAt: "2025-02-19T09:00:00Z", repliedBy: "Owner", status: "replied", sentiment: "positive", keywords: ["business", "private dining", "outstanding", "impeccable"], createdAt: "2025-02-18T19:00:00Z" },
    { businessId: "biz-001", customerName: "Carlos M.", rating: 3, text: "Food is good but parking situation is terrible. Took us 30 minutes to find parking. The restaurant should offer valet or at least provide better parking guidance.", status: "pending", sentiment: "neutral", keywords: ["parking", "terrible", "valet", "guidance"], createdAt: "2025-02-20T19:30:00Z" },
    { businessId: "biz-001", customerName: "Jennifer H.", rating: 5, text: "I visit every month and it never disappoints! The seasonal menu changes keep things exciting. This month's butternut squash ravioli was phenomenal. Staff recognizes me now — feels like family.", reply: "Jennifer, you're practically family at this point! We love your loyalty and can't wait to show you what's next on the seasonal menu!", repliedAt: "2025-02-25T10:00:00Z", repliedBy: "Owner", status: "replied", sentiment: "positive", keywords: ["seasonal", "ravioli", "loyalty", "family"], createdAt: "2025-02-24T20:00:00Z" },
    { businessId: "biz-001", customerName: "Kevin O.", rating: 4, text: "Great spot for special occasions. The lamb chops were extraordinary. Reservation process was smooth. Wished the dessert menu was a bit more adventurous, but overall a wonderful evening.", status: "pending", sentiment: "positive", keywords: ["lamb chops", "extraordinary", "reservation", "dessert"], createdAt: "2025-03-01T18:30:00Z" },
  ];

  const liquorReviews: SeedReview[] = [
    { businessId: "biz-002", customerName: "Frank D.", rating: 5, text: "The best selection of whiskey I've seen in any Chicago store. The staff is incredibly knowledgeable and helped me find the perfect bottle for my collection.", status: "pending", sentiment: "positive", keywords: ["whiskey", "selection", "knowledgeable", "collection"], createdAt: "2025-01-10T15:00:00Z" },
    { businessId: "biz-002", customerName: "Maria G.", rating: 4, text: "Great wine selection at competitive prices. The staff recommended an excellent Burgundy for our dinner party. Will be back for sure.", reply: "Thanks Maria! We're glad the Burgundy was a hit at your dinner party!", repliedAt: "2025-01-15T10:00:00Z", repliedBy: "Owner", status: "replied", sentiment: "positive", keywords: ["wine", "prices", "Burgundy", "dinner"], createdAt: "2025-01-14T14:00:00Z" },
    { businessId: "biz-002", customerName: "Steve P.", rating: 3, text: "Decent selection but the store layout makes it hard to find things. Prices on the craft beer section are higher than expected.", status: "pending", sentiment: "neutral", keywords: ["selection", "layout", "prices", "craft beer"], createdAt: "2025-02-01T16:00:00Z" },
    { businessId: "biz-002", customerName: "Nancy L.", rating: 5, text: "Phenomenal shop! They sourced a rare Japanese whisky for me that I couldn't find anywhere else. Customer service is world-class.", status: "pending", sentiment: "positive", keywords: ["rare", "Japanese whisky", "customer service", "world-class"], createdAt: "2025-02-15T13:00:00Z" },
    { businessId: "biz-002", customerName: "Pete R.", rating: 2, text: "Waited 20 minutes to get assistance. The staff seemed more interested in their phones than helping customers. Won't be going back.", status: "pending", sentiment: "negative", keywords: ["waited", "assistance", "staff", "phones"], createdAt: "2025-03-01T15:00:00Z" },
  ];

  const clinicReviews: SeedReview[] = [
    { businessId: "biz-003", customerName: "Teresa K.", rating: 5, text: "Dr. Chen is absolutely amazing! My chronic back pain has reduced by 80% after just 6 sessions. The clinic is spotless and the atmosphere is so calming.", reply: "Thank you Teresa! Your progress has been incredible to witness. We're so proud of your commitment!", repliedAt: "2025-01-20T09:00:00Z", repliedBy: "Owner", status: "replied", sentiment: "positive", keywords: ["Dr. Chen", "back pain", "spotless", "calming"], createdAt: "2025-01-18T14:00:00Z" },
    { businessId: "biz-003", customerName: "Bob S.", rating: 4, text: "Very professional staff and effective treatment. The acupuncture sessions have helped with my migraines significantly. Scheduling could be a bit easier online.", status: "pending", sentiment: "positive", keywords: ["professional", "acupuncture", "migraines", "scheduling"], createdAt: "2025-02-01T11:00:00Z" },
    { businessId: "biz-003", customerName: "Amy J.", rating: 5, text: "Bloom Wellness changed my life! After years of dealing with stress and tension, the massage therapy program has me feeling like a new person. Highly recommend!", status: "pending", sentiment: "positive", keywords: ["changed my life", "stress", "massage therapy", "recommend"], createdAt: "2025-02-20T10:00:00Z" },
    { businessId: "biz-003", customerName: "Gary M.", rating: 3, text: "Treatments are effective but the wait times are too long. Had a 45-minute wait past my appointment time twice. Need to improve scheduling.", status: "pending", sentiment: "neutral", keywords: ["wait times", "appointment", "scheduling", "effective"], createdAt: "2025-03-01T09:00:00Z" },
  ];

  const sources = ["Google", "TripAdvisor", "Expedia", "Booking.com"];
  const getRandomSource = () => sources[Math.floor(Math.random() * sources.length)];
  const all = [...bistroReviews, ...liquorReviews, ...clinicReviews];
  return all.map((r, i) => {
    // Assign location: for biz-001 randomly assign loc-001 or loc-002, else match biz to loc
    let locationId = undefined;
    if (r.businessId === "biz-001") {
      locationId = Math.random() > 0.5 ? "loc-001" : "loc-002";
    } else if (r.businessId === "biz-002") locationId = "loc-003";
    else if (r.businessId === "biz-003") locationId = "loc-004";
    else if (r.businessId === "biz-004") locationId = "loc-005";

    return {
      ...r,
      id: `rev-${String(i + 1).padStart(3, "0")}`,
      source: getRandomSource(),
      isUrgent: r.rating <= 2,
      assignedTo: undefined,
      locationId
    };
  });
};

const SEED_USERS: User[] = [
  { id: "user-admin", email: "admin@reviewhub.com", password: "admin1234", name: "Alex Rivera", role: "admin", createdAt: "2024-01-01T00:00:00Z" },
  { id: "user-demo", email: "demo@reviewhub.com", password: "demo1234", name: "Demo Merchant", role: "demo", businessId: "biz-001", createdAt: "2024-01-15T00:00:00Z" },
  { id: "user-merch-002", email: "merchant2@reviewhub.com", password: "pass1234", name: "Roberto Diaz", role: "merchant", businessId: "biz-002", createdAt: "2024-02-01T00:00:00Z" },
  { id: "user-merch-003", email: "merchant3@reviewhub.com", password: "pass1234", name: "Linda Chen", role: "merchant", businessId: "biz-003", createdAt: "2024-02-15T00:00:00Z" },
  { id: "user-merch-004", email: "merchant4@reviewhub.com", password: "pass1234", name: "Omar Hassan", role: "merchant", businessId: "biz-004", createdAt: "2024-03-01T00:00:00Z" },
];

// ============================================================
// STORAGE KEYS
// ============================================================
const KEY_USERS = "rms_users";
const KEY_BUSINESSES = "rms_businesses";
const KEY_REVIEWS = "rms_reviews";
const KEY_TASKS = "rms_tasks";
const KEY_ALERTS = "rms_alerts";
const KEY_CAMPAIGNS = "rms_campaigns";
const KEY_LOCATIONS = "rms_locations";
const KEY_COMPETITORS = "rms_competitors";
const KEY_INITIALIZED = "rms_initialized";

// ============================================================
// INIT
// ============================================================
export function initStore() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(KEY_INITIALIZED)) return;
  localStorage.setItem(KEY_USERS, JSON.stringify(SEED_USERS));
  localStorage.setItem(KEY_BUSINESSES, JSON.stringify(SEED_BUSINESSES));
  localStorage.setItem(KEY_LOCATIONS, JSON.stringify(SEED_LOCATIONS));
  localStorage.setItem(KEY_COMPETITORS, JSON.stringify(SEED_COMPETITORS));
  localStorage.setItem(KEY_REVIEWS, JSON.stringify(generateReviews()));
  localStorage.setItem(KEY_INITIALIZED, "true");
}

export function resetStore() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY_INITIALIZED);
  initStore();
}

// ============================================================
// LOCATIONS
// ============================================================
export function getLocations(): Location[] {
  if (typeof window === "undefined") return SEED_LOCATIONS;
  return JSON.parse(localStorage.getItem(KEY_LOCATIONS) || "[]");
}

export function getLocationById(id: string): Location | undefined {
  return getLocations().find(l => l.id === id);
}

export function getLocationsByBusiness(businessId: string): Location[] {
  return getLocations().filter(l => l.businessId === businessId);
}

// ============================================================
// COMPETITORS
// ============================================================
export function getCompetitors(): Competitor[] {
  if (typeof window === "undefined") return SEED_COMPETITORS;
  return JSON.parse(localStorage.getItem(KEY_COMPETITORS) || "[]");
}

export function getCompetitorsByBusiness(businessId: string): Competitor[] {
  return getCompetitors().filter(c => c.businessId === businessId);
}

export function getCompetitorHistory(businessId: string) {
  // Generate 6 months of mock rating history for the competitors and the business
  const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
  const competitors = getCompetitorsByBusiness(businessId);
  const myStats = getBusinessAnalytics(businessId);

  return months.map((month, i) => {
    const data: any = { name: month };

    // Smooth variance logic to simulate historic improvement for the business
    let myScore = myStats.avgRating - (5 - i) * 0.1;
    data["You"] = Number(myScore.toFixed(1));

    // Competitors fluctuate randomly slightly
    competitors.forEach((comp, idx) => {
      let variance = (Math.sin(i * (idx + 1)) * 0.15) - 0.05;
      data[comp.name] = Number((comp.currentRating + variance).toFixed(1));
    });

    return data;
  });
}

// ============================================================
// USERS
// ============================================================
export function getUsers(): User[] {
  if (typeof window === "undefined") return SEED_USERS;
  return JSON.parse(localStorage.getItem(KEY_USERS) || "[]");
}

export function getUserById(id: string): User | undefined {
  return getUsers().find(u => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function authenticate(email: string, password: string): User | null {
  const user = getUserByEmail(email);
  if (user && user.password === password) return user;
  return null;
}

export function createUser(data: Omit<User, "id" | "createdAt">): User {
  const users = getUsers();
  const newUser: User = { ...data, id: `user-${Date.now()}`, createdAt: new Date().toISOString() };
  users.push(newUser);
  localStorage.setItem(KEY_USERS, JSON.stringify(users));
  return newUser;
}

export function getStaffStats(businessId: string) {
  const allUsers = getUsers().filter(u => u.businessId === businessId);
  const allTasks = getTasksByBusiness(businessId);
  const allReviews = getReviewsByBusiness(businessId);

  return allUsers.map(u => {
    const tasksResolved = allTasks.filter(t => t.assignedToUserId === u.id && t.status === "resolved").length;
    const tasksPending = allTasks.filter(t => t.assignedToUserId === u.id && t.status !== "resolved").length;

    // Simulate "5-star mentions" or positive resolutions by assigning points
    const assignedReviews = allReviews.filter(r => r.assignedTo === u.id);
    const positiveReviewsHandled = assignedReviews.filter(r => r.rating >= 4).length;
    const points = (tasksResolved * 10) + (positiveReviewsHandled * 25);

    return {
      user: u,
      tasksResolved,
      tasksPending,
      positiveReviewsHandled,
      points
    };
  }).sort((a, b) => b.points - a.points);
}

// ============================================================
// BUSINESSES
// ============================================================
export function getBusinesses(): Business[] {
  if (typeof window === "undefined") return SEED_BUSINESSES;
  return JSON.parse(localStorage.getItem(KEY_BUSINESSES) || "[]");
}

export function getBusinessById(id: string): Business | undefined {
  return getBusinesses().find(b => b.id === id);
}

export function getBusinessBySlug(slug: string): Business | undefined {
  return getBusinesses().find(b => b.slug === slug);
}

export function getBusinessByOwner(ownerId: string): Business | undefined {
  return getBusinesses().find(b => b.ownerId === ownerId);
}

export function saveBusiness(business: Business): void {
  const all = getBusinesses();
  const idx = all.findIndex(b => b.id === business.id);
  if (idx >= 0) all[idx] = business;
  else all.push(business);
  localStorage.setItem(KEY_BUSINESSES, JSON.stringify(all));
}

export function updateBusinessStatus(id: string, status: "active" | "suspended"): void {
  const all = getBusinesses();
  const idx = all.findIndex(b => b.id === id);
  if (idx >= 0) { all[idx].status = status; localStorage.setItem(KEY_BUSINESSES, JSON.stringify(all)); }
}

// ============================================================
// REVIEWS
// ============================================================
export function getReviews(): Review[] {
  if (typeof window === "undefined") return generateReviews();
  return JSON.parse(localStorage.getItem(KEY_REVIEWS) || "[]");
}

export function getReviewsByBusiness(businessId: string): Review[] {
  return getReviews().filter(r => r.businessId === businessId);
}

export function addReview(data: Omit<Review, "id" | "createdAt" | "status" | "sentiment" | "keywords">): Review {
  const reviews = getReviews();
  const sentiment = analyzeSentiment(data.rating, data.text);
  const keywords = extractKeywords(data.text);
  const newReview: Review = {
    ...data, id: `rev-${Date.now()}`, status: "pending",
    sentiment, keywords, createdAt: new Date().toISOString(),
  };
  reviews.unshift(newReview);
  localStorage.setItem(KEY_REVIEWS, JSON.stringify(reviews));
  return newReview;
}

export function replyToReview(reviewId: string, reply: string, repliedBy = "Owner"): void {
  const reviews = getReviews();
  const idx = reviews.findIndex(r => r.id === reviewId);
  if (idx >= 0) {
    reviews[idx].reply = reply;
    reviews[idx].repliedAt = new Date().toISOString();
    reviews[idx].repliedBy = repliedBy;
    reviews[idx].status = "replied";
    localStorage.setItem(KEY_REVIEWS, JSON.stringify(reviews));
  }
}

export function updateReviewStatus(reviewId: string, status: Review["status"]): void {
  const reviews = getReviews();
  const idx = reviews.findIndex(r => r.id === reviewId);
  if (idx >= 0) { reviews[idx].status = status; localStorage.setItem(KEY_REVIEWS, JSON.stringify(reviews)); }
}

export function deleteReview(reviewId: string): void {
  const reviews = getReviews().filter(r => r.id !== reviewId);
  localStorage.setItem(KEY_REVIEWS, JSON.stringify(reviews));
}

// ============================================================
// ANALYTICS
// ============================================================
export function getBusinessAnalytics(businessId: string, locationId?: string) {
  let reviews = getReviewsByBusiness(businessId);
  if (locationId) reviews = reviews.filter(r => r.locationId === locationId);

  const total = reviews.length;
  const avgRating = total ? parseFloat((reviews.reduce((s, r) => s + r.rating, 0) / total).toFixed(1)) : 0;
  const replied = reviews.filter(r => r.status === "replied").length;
  const responseRate = total ? Math.round((replied / total) * 100) : 0;
  const pending = reviews.filter(r => r.status === "pending").length;

  const ratingDist = [5, 4, 3, 2, 1].map(n => ({
    rating: n, count: reviews.filter(r => r.rating === n).length,
  }));

  const sentimentCounts = {
    positive: reviews.filter(r => r.sentiment === "positive").length,
    neutral: reviews.filter(r => r.sentiment === "neutral").length,
    negative: reviews.filter(r => r.sentiment === "negative").length,
  };

  // Weekly trend (last 8 weeks)
  const now = new Date();
  const weeklyTrend = Array.from({ length: 8 }, (_, i) => {
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - (7 - i) * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    const weekReviews = reviews.filter(r => {
      const d = new Date(r.createdAt);
      return d >= weekStart && d < weekEnd;
    });
    const label = weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const avg = weekReviews.length ? weekReviews.reduce((s, r) => s + r.rating, 0) / weekReviews.length : null;
    return { week: label, reviews: weekReviews.length, avgRating: avg ? parseFloat(avg.toFixed(1)) : 0 };
  });

  // Keywords
  const allKeywords: string[] = reviews.flatMap(r => r.keywords || []);
  const keywordCounts: Record<string, number> = {};
  allKeywords.forEach(k => { keywordCounts[k] = (keywordCounts[k] || 0) + 1; });
  const topKeywords = Object.entries(keywordCounts)
    .sort((a, b) => b[1] - a[1]).slice(0, 15)
    .map(([word, count]) => ({ word, count }));

  // New this week
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
  const newThisWeek = reviews.filter(r => new Date(r.createdAt) >= weekAgo).length;

  return { total, avgRating, responseRate, pending, replied, ratingDist, sentimentCounts, weeklyTrend, topKeywords, newThisWeek };
}

export function getPlatformAnalytics() {
  const businesses = getBusinesses();
  const reviews = getReviews();
  const users = getUsers().filter(u => u.role === "merchant" || u.role === "demo");

  const totalMerchants = businesses.length;
  const totalReviews = reviews.length;
  const avgPlatformRating = parseFloat((reviews.reduce((s, r) => s + r.rating, 0) / (reviews.length || 1)).toFixed(1));
  const replied = reviews.filter(r => r.status === "replied").length;

  return { totalMerchants, totalReviews, avgPlatformRating, replied, users: users.length };
}

// ============================================================
// SENTIMENT & KEYWORD HELPERS
// ============================================================
function analyzeSentiment(rating: number, text: string): "positive" | "neutral" | "negative" {
  const lower = text.toLowerCase();
  const negWords = ["terrible", "awful", "horrible", "worst", "bad", "disappointed", "poor", "rude", "slow", "disgusting", "dismissive", "overcooked"];
  const posWords = ["amazing", "excellent", "wonderful", "great", "fantastic", "love", "perfect", "outstanding", "incredible", "phenomenal", "outstanding", "exceptional"];
  const negCount = negWords.filter(w => lower.includes(w)).length;
  const posCount = posWords.filter(w => lower.includes(w)).length;
  if (rating >= 4 && posCount > negCount) return "positive";
  if (rating <= 2 || negCount > posCount) return "negative";
  return "neutral";
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set(["the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "was", "is", "it", "i", "we", "my", "our", "you", "your", "be", "are", "were", "has", "have", "had", "this", "that", "did", "so", "not", "they", "their", "there", "would"]);
  return text.toLowerCase()
    .replace(/[^a-z\s]/g, "").split(/\s+/)
    .filter(w => w.length > 3 && !stopWords.has(w))
    .slice(0, 6);
}

// ============================================================
// ISSUE TASKS
// ============================================================
export function getTasks(): IssueTask[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(KEY_TASKS) || "[]");
}

export function getTasksByBusiness(businessId: string): IssueTask[] {
  return getTasks().filter((t) => t.businessId === businessId);
}

export function addTask(data: Omit<IssueTask, "id" | "createdAt" | "updatedAt">): IssueTask {
  const tasks = getTasks();
  const newTask: IssueTask = {
    ...data,
    id: `task-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tasks.unshift(newTask);
  localStorage.setItem(KEY_TASKS, JSON.stringify(tasks));
  return newTask;
}

export function updateTaskStatus(taskId: string, status: IssueTask["status"], note?: string) {
  const tasks = getTasks();
  const index = tasks.findIndex((t) => t.id === taskId);
  if (index !== -1) {
    tasks[index].status = status;
    tasks[index].updatedAt = new Date().toISOString();
    if (note) tasks[index].resolutionNote = note;
    localStorage.setItem(KEY_TASKS, JSON.stringify(tasks));
  }
}

// ============================================================
// ALERTS
// ============================================================
export function getAlerts(): Alert[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(KEY_ALERTS) || "[]");
}

export function getAlertsByBusiness(businessId: string): Alert[] {
  return getAlerts().filter((a) => a.businessId === businessId);
}

export function addAlert(data: Omit<Alert, "id" | "createdAt" | "status">): Alert {
  const alerts = getAlerts();
  const newAlert: Alert = {
    ...data,
    id: `alert-${Date.now()}`,
    status: "active",
    createdAt: new Date().toISOString(),
  };
  alerts.unshift(newAlert);
  localStorage.setItem(KEY_ALERTS, JSON.stringify(alerts));
  return newAlert;
}

export function updateAlertStatus(alertId: string, status: Alert["status"]) {
  const alerts = getAlerts();
  const index = alerts.findIndex((a) => a.id === alertId);
  if (index !== -1) {
    alerts[index].status = status;
    localStorage.setItem(KEY_ALERTS, JSON.stringify(alerts));
  }
}

// ============================================================
// CAMPAIGNS
// ============================================================
export function getCampaigns(): ReviewRequestCampaign[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(KEY_CAMPAIGNS) || "[]");
}

export function getCampaignsByBusiness(businessId: string): ReviewRequestCampaign[] {
  return getCampaigns().filter((c) => c.businessId === businessId);
}

export function addCampaign(data: Omit<ReviewRequestCampaign, "id" | "createdAt">): ReviewRequestCampaign {
  const campaigns = getCampaigns();
  const newCampaign: ReviewRequestCampaign = {
    ...data,
    id: `camp-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  campaigns.unshift(newCampaign);
  localStorage.setItem(KEY_CAMPAIGNS, JSON.stringify(campaigns));
  return newCampaign;
}

export function toggleCampaignActive(campaignId: string, isActive: boolean) {
  const campaigns = getCampaigns();
  const index = campaigns.findIndex((c) => c.id === campaignId);
  if (index !== -1) {
    campaigns[index].isActive = isActive;
    localStorage.setItem(KEY_CAMPAIGNS, JSON.stringify(campaigns));
  }
}
