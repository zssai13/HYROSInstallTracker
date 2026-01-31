-- =============================================
-- HYROS Install Tracker - Supabase Database Setup
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor)
-- =============================================

-- Step 1: Create the installs table
CREATE TABLE IF NOT EXISTS installs (
  id              INTEGER PRIMARY KEY,
  name            TEXT NOT NULL,
  version         TEXT NOT NULL DEFAULT 'v1',
  category        TEXT NOT NULL DEFAULT 'Core',
  status          BOOLEAN,                        -- null=unchecked, true=good, false=bad
  last_checked    TEXT,                            -- "M/D/YYYY" or null
  checked_by      TEXT NOT NULL DEFAULT '',
  critical        BOOLEAN NOT NULL DEFAULT false,
  file_name       TEXT,
  file_url        TEXT,
  file_upload_date TEXT,
  is_default      BOOLEAN NOT NULL DEFAULT false,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Step 2: Enable Row Level Security (required by Supabase)
ALTER TABLE installs ENABLE ROW LEVEL SECURITY;

-- Step 3: Allow all access for anonymous users (no auth in this app)
CREATE POLICY "Allow all access" ON installs
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Step 4: Enable Realtime on this table
ALTER PUBLICATION supabase_realtime ADD TABLE installs;

-- Step 5: Auto-update updated_at on every row change
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER installs_updated_at
  BEFORE UPDATE ON installs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Step 6: Seed the 104 default installs
INSERT INTO installs (id, name, version, category, is_default) VALUES
(1, 'Active Campaign', 'v1', 'Email/CRM', true),
(2, 'Acuity', 'v1', 'Scheduling', true),
(3, 'AdRoll', 'v1', 'Ads', true),
(4, 'API', 'v1', 'Core', true),
(5, 'AppointmentCore', 'v1', 'Scheduling', true),
(6, 'Authorize.net', 'v1', 'Payment', true),
(7, 'BigCommerce', 'v1', 'Ecommerce', true),
(8, 'Bing Ads', 'v1', 'Ads', true),
(9, 'Braintree', 'v1', 'Payment', true),
(10, 'Braze', 'v1', 'Email/CRM', true),
(11, 'Calendly', 'v1', 'Scheduling', true),
(12, 'CallRail', 'v1', 'Tracking', true),
(13, 'Chargebee', 'v1', 'Payment', true),
(14, 'ClickFunnels', 'v1', 'Funnel', true),
(15, 'ClickFunnels 2', 'v1', 'Funnel', true),
(16, 'Close CRM', 'v1', 'Email/CRM', true),
(17, 'CopeCart', 'v1', 'Payment', true),
(18, 'Custom Ad Source', 'v1', 'Ads', true),
(19, 'Demio', 'v1', 'Webinar', true),
(20, 'Drip', 'v1', 'Email/CRM', true),
(21, 'Easy Pay Direct', 'v1', 'Payment', true),
(22, 'EverWebinar', 'v1', 'Webinar', true),
(23, 'EverWebinar ClickFunnels', 'v1', 'Webinar', true),
(24, 'EverWebinar Default', 'v1', 'Webinar', true),
(25, 'EverWebinar Embedded', 'v1', 'Webinar', true),
(26, 'eWebinar', 'v1', 'Webinar', true),
(27, 'Facebook Ads', 'v1', 'Ads', true),
(28, 'Funnelish', 'v1', 'Funnel', true),
(29, 'GoCardless', 'v1', 'Payment', true),
(30, 'GoHighLevel', 'v1', 'Funnel', true),
(31, 'GoHighLevel Scheduler', 'v1', 'Scheduling', true),
(32, 'Google Ads', 'v1', 'Ads', true),
(33, 'GTM', 'v1', 'Tracking', true),
(34, 'Hotmart', 'v1', 'Ecommerce', true),
(35, 'HubSpot', 'v1', 'Email/CRM', true),
(36, 'HubSpot Forms', 'v1', 'Email/CRM', true),
(37, 'HubSpot Meetings', 'v1', 'Scheduling', true),
(38, 'iClosed', 'v1', 'Sales', true),
(39, 'Infusionsoft/Keap', 'v1', 'Email/CRM', true),
(40, 'Instapage', 'v1', 'Landing Page', true),
(41, 'Invoiced', 'v1', 'Payment', true),
(42, 'JotForm Integration', 'v1', 'Forms', true),
(43, 'Kajabi', 'v1', 'Course', true),
(44, 'Kartra', 'v1', 'Funnel', true),
(45, 'Klaviyo', 'v1', 'Email/CRM', true),
(46, 'Leadpages', 'v1', 'Landing Page', true),
(47, 'LinkedIn Ads', 'v1', 'Ads', true),
(48, 'Magento', 'v1', 'Ecommerce', true),
(49, 'MGID', 'v1', 'Ads', true),
(50, 'NMI', 'v1', 'Payment', true),
(51, 'Omnisend', 'v1', 'Email/CRM', true),
(52, 'OnceHub', 'v1', 'Scheduling', true),
(53, 'Ontraport', 'v1', 'Email/CRM', true),
(54, 'Pabbly', 'v1', 'Automation', true),
(55, 'PayKickstart', 'v1', 'Payment', true),
(56, 'PayPal', 'v1', 'Payment', true),
(57, 'Pinterest Ads', 'v1', 'Ads', true),
(58, 'Pipedrive', 'v1', 'Email/CRM', true),
(59, 'Recurly', 'v1', 'Payment', true),
(60, 'Reddit Ads', 'v1', 'Ads', true),
(61, 'Requirements', 'v1', 'Core', true),
(62, 'Ringba', 'v1', 'Tracking', true),
(63, 'Salesforce', 'v1', 'Email/CRM', true),
(64, 'SamCart', 'v1', 'Payment', true),
(65, 'SavvyCal', 'v1', 'Scheduling', true),
(66, 'Shopify', 'v1', 'Ecommerce', true),
(67, 'Shopify BetterCart', 'v1', 'Ecommerce', true),
(68, 'Shopify PageFly', 'v1', 'Ecommerce', true),
(69, 'Shopify ReCharge', 'v1', 'Ecommerce', true),
(70, 'Skool', 'v1', 'Course', true),
(71, 'Snapchat Ads', 'v1', 'Ads', true),
(72, 'Square', 'v1', 'Payment', true),
(73, 'Squarespace', 'v1', 'Website', true),
(74, 'Standard Script', 'v1', 'Core', true),
(75, 'Stealth Seminar', 'v1', 'Webinar', true),
(76, 'Stripe', 'v1', 'Payment', true),
(77, 'Taboola', 'v1', 'Ads', true),
(78, 'Teachable', 'v1', 'Course', true),
(79, 'ThriveCart', 'v1', 'Payment', true),
(80, 'TikTok Ads', 'v1', 'Ads', true),
(81, 'TikTok Shops', 'v1', 'Ecommerce', true),
(82, 'Twitter/X Ads', 'v1', 'Ads', true),
(83, 'Typeform', 'v1', 'Forms', true),
(84, 'Unbounce', 'v1', 'Landing Page', true),
(85, 'Uscreen', 'v1', 'Course', true),
(86, 'Wave Apps', 'v1', 'Payment', true),
(87, 'Webflow', 'v1', 'Website', true),
(88, 'WebinarFuel', 'v1', 'Webinar', true),
(89, 'WebinarGeek', 'v1', 'Webinar', true),
(90, 'WebinarJam', 'v1', 'Webinar', true),
(91, 'Wix', 'v1', 'Website', true),
(92, 'WooCommerce', 'v1', 'Ecommerce', true),
(93, 'WordPress', 'v1', 'Website', true),
(94, 'YouCanBook.me', 'v1', 'Scheduling', true),
(95, 'Zapier', 'v1', 'Automation', true),
(96, 'Zaxaa', 'v1', 'Payment', true),
(97, 'ClickFunnels', 'v2', 'Funnel', true),
(98, 'Facebook Ads', 'v2', 'Ads', true),
(99, 'Google Ads', 'v2', 'Ads', true),
(100, 'Google Ads Automatic', 'v2', 'Ads', true),
(101, 'iClosed', 'v2', 'Sales', true),
(102, 'Reddit Ads', 'v2', 'Ads', true),
(103, 'Stripe', 'v2', 'Payment', true),
(104, 'TikTok Ads', 'v2', 'Ads', true)
ON CONFLICT (id) DO NOTHING;
