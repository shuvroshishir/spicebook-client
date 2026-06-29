<img width="1672" height="941" alt="spice-book" src="https://github.com/user-attachments/assets/68c7b151-c2a7-4690-914f-e95fbb4bd9d4" />


# SpiceBook — Recipe Sharing & Culinary Inspiration Platform (Client)

SpiceBook is a modern, responsive, and full-featured recipe-sharing platform where food enthusiasts can discover, create, purchase, and bookmark recipes. Built using **Next.js (App Router)** and styled with a premium dark-themed layout, SpiceBook delivers a top-tier user experience with smooth animations, responsive cards, and secure user states.

🌐 Live Demo: https://spicebook.vercel.app

---

## 🌟 Key Features

### 👤 User Features & Authentication
* **Secure Authentication**: Authentication with cookie-based session tracking and route protection.
* **Profile Management**: Customize profile details, view creation status, and upload profile pictures.
* **Recipe Limit Enforcement**: Standard accounts are limited to publishing exactly **2 recipes** to encourage premium subscriptions.
* **Dynamic User Dashboard**: Track your published recipe count, dynamic bookmark counts, and overall recipe engagement (total likes) at a glance.

### 💳 Monetization & Stripe Payments
* **Stripe Checkout Integration**: Seamless payment flows for purchasing individual premium recipes or upgrading to a **Premium Member** subscription.
* **Unlimited Uploads**: Upgrading to a premium subscription instantly lifts the 2-recipe upload restriction.

### 🍽️ Recipe Explorer & Interactivity
* **Categorized Recipe Browser**: Explore recipes filtered by categories (Breakfast, Dinner, Lunch, etc.) with custom server-side pagination.
* **Bookmarks & Favorites**: Bookmark your favorite recipes and manage them in your dedicated "My Favorites" list.
* **Purchased Recipes**: View and access all premium recipes you have unlocked.
* **Likes & Community Reports**: Like recipes to boost their engagement or report inappropriate content with a detailed report form.

### 🛠️ Admin Command Center
* **User Management**: Search, block/unblock users, or promote users to Admin roles.
* **Recipe Management**: Review pending recipe listings, approve them to publish, or delete them.
* **Report Auditing**: Inspect community reports and resolve them using custom interactive confirmation modals.
* **Stripe Transactions History**: Audit payment checkout records, transaction IDs, status, and earnings with a cleanly paginated server-side interface.

---

## 💻 Tech Stack

* **Framework**: Next.js 15+ (App Router)
* **Styling**: Tailwind CSS
* **UI Components**: HeroUI (formerly NextUI)
* **Animations**: Framer Motion
* **Icons**: React Icons (Lucide, Lu)
* **Toasts**: React Hot Toast

---

## ⚙️ Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd spicebook-client
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory and add the backend server URL:
   ```env
   NEXT_PUBLIC_SERVER_URL=http://localhost:5000
   ```

4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

5. **Build for Production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🔒 Environment Security & Rules of Hooks
All hooks and API calls are structured following the Next.js standard best practices, preventing rules-of-hooks violations and ensuring stable client-side state during user login/logout transitions.
